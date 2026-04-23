#!/usr/bin/env python3
"""
Screenshot-generate the SCIMaP district Scorecard for every district in a
fiscal year, served from the repo's local Vite dev server.

Flow:
  1. Spawn `npm run dev` (from repo root) and wait for http://localhost:5173
  2. Load src/data/report_card_info_{fy}.json for the target fiscal year
  3. Screenshot /scorecard?stateCode=X&districtId=Y&fiscalYear={fy} for each
     district, using a pool of Chromium browsers
  4. Write PNGs to outputs/report-cards-{fy}/report-card-{state}-{district}.png
     (matches the filename ReportCard.tsx expects to fetch from R2)
  5. Shut the dev server down

Upload to R2 after the run, e.g.
  rclone copy outputs/report-cards-fy27/ r2:scimap-data/report-cards-fy27-v1/ --transfers 32

(The R2 path matches `reportCardImageDir` in src/components/ReportCard.tsx.)

State-level cards are not generated yet — /scorecard currently requires a
districtId. Will be added once the route supports state-only URLs.

Requires: playwright, tqdm.  After install:  `playwright install chromium`.
"""

import argparse
import asyncio
import json
import os
import signal
import socket
import subprocess
import sys
import time
from pathlib import Path

from playwright.async_api import async_playwright
from tqdm.asyncio import tqdm

ROOT = Path(__file__).resolve().parent.parent
# Use 'localhost' (not 127.0.0.1) — the tile CDN's CORS allowlist covers the
# former but not the latter, so maps come back blank under 127.0.0.1.
DEV_HOST = "localhost"
DEV_PORT = 5173
BASE_URL = f"http://{DEV_HOST}:{DEV_PORT}"
DEV_READY_TIMEOUT = 120  # seconds
PAGE_WAIT_MS = 10_000  # time for tiles/map to settle before snapping
VIEWPORT = {"width": 1600, "height": 950}
# Blank screenshots of this viewport come out ~6KB; the smallest real card
# observed is ~135KB. 50KB comfortably separates the two.
MIN_PNG_BYTES = 50_000


# ── Dev server lifecycle ──────────────────────────────────────────────

def port_is_open(host: str, port: int) -> bool:
    # Use create_connection so we resolve + try both v4 and v6 — Vite binds to
    # whichever localhost resolves to first.
    try:
        with socket.create_connection((host, port), timeout=0.5):
            return True
    except OSError:
        return False


def start_dev_server() -> subprocess.Popen:
    if port_is_open(DEV_HOST, DEV_PORT):
        print(f"⚠️  {BASE_URL} already serving — reusing existing process.")
        return None

    print(f"Starting `npm run dev` at {ROOT}…")
    # Let Vite use its default host (localhost); just pin the port.
    # start_new_session so we can clean up child processes via the group.
    proc = subprocess.Popen(
        ["npm", "run", "dev", "--", "--port", str(DEV_PORT)],
        cwd=ROOT,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.STDOUT,
        start_new_session=True,
    )

    deadline = time.monotonic() + DEV_READY_TIMEOUT
    while time.monotonic() < deadline:
        if proc.poll() is not None:
            raise RuntimeError(f"npm run dev exited early with code {proc.returncode}")
        if port_is_open(DEV_HOST, DEV_PORT):
            print(f"✅ Dev server up at {BASE_URL}")
            # Vite serves instantly once the port is open, but give it a
            # beat to finish wiring plugins on a cold start.
            time.sleep(1.5)
            return proc
        time.sleep(0.5)

    proc.terminate()
    raise TimeoutError(f"Dev server did not come up within {DEV_READY_TIMEOUT}s")


def stop_dev_server(proc: subprocess.Popen | None) -> None:
    if proc is None:
        return
    print("Stopping dev server…")
    try:
        os.killpg(os.getpgid(proc.pid), signal.SIGTERM)
        proc.wait(timeout=10)
    except (ProcessLookupError, subprocess.TimeoutExpired):
        try:
            os.killpg(os.getpgid(proc.pid), signal.SIGKILL)
        except ProcessLookupError:
            pass


# ── Browser pool ──────────────────────────────────────────────────────

class BrowserPool:
    def __init__(self, pool_size: int = 4):
        self.pool_size = pool_size
        self.browsers = []
        self.semaphore = asyncio.Semaphore(pool_size)
        self.page_queue: asyncio.Queue = asyncio.Queue()

    async def initialize(self, playwright):
        print(f"Initializing browser pool with {self.pool_size} browsers…")
        for _ in range(self.pool_size):
            browser = await playwright.chromium.launch(headless=True)
            context = await browser.new_context(viewport=VIEWPORT)
            page = await context.new_page()
            self.browsers.append(browser)
            await self.page_queue.put(page)
        print(f"✅ Browser pool ready ({len(self.browsers)} browsers)")

    async def acquire(self):
        await self.semaphore.acquire()
        return await self.page_queue.get()

    async def release(self, page):
        await self.page_queue.put(page)
        self.semaphore.release()

    async def close(self):
        for browser in self.browsers:
            await browser.close()


async def screenshot(pool: BrowserPool, url: str, output_path: Path) -> Path | None:
    page = await pool.acquire()
    try:
        await page.goto(url, wait_until="networkidle")
        await page.wait_for_timeout(PAGE_WAIT_MS)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        await page.screenshot(path=str(output_path), full_page=False)
        return output_path
    except Exception as err:
        print(f"Error screenshotting {url}: {err}")
        return None
    finally:
        await pool.release(page)


# ── District processing ───────────────────────────────────────────────

async def process_district(
    pool: BrowserPool,
    key: str,
    fiscal_year: str,
    output_dir: Path,
    overwrite: bool,
) -> tuple[str, Path | None, Path]:
    # key is "AL-01" → state_code + CD119FP
    state_code, district_id = key.split("-", 1)
    expected = output_dir / f"report-card-{state_code}-{district_id}.png"

    if expected.exists() and not overwrite:
        return key, expected, expected

    url = (
        f"{BASE_URL}/scorecard"
        f"?stateCode={state_code}&districtId={district_id}&fiscalYear={fiscal_year}"
        f"&chromeless=true"
    )
    result = await screenshot(pool, url, expected)
    return key, result, expected


async def process_state(
    pool: BrowserPool,
    state_code: str,
    fiscal_year: str,
    output_dir: Path,
    overwrite: bool,
) -> tuple[str, Path | None, Path]:
    expected = output_dir / f"report-card-{state_code}.png"
    if expected.exists() and not overwrite:
        return state_code, expected, expected

    url = (
        f"{BASE_URL}/scorecard"
        f"?stateCode={state_code}&fiscalYear={fiscal_year}&chromeless=true"
    )
    result = await screenshot(pool, url, expected)
    return state_code, result, expected


def validate(results, output_dir: Path) -> int:
    print("\n" + "=" * 60)
    print("VALIDATION")
    print("=" * 60)
    ok, missing, blank = [], [], []
    for key, actual, expected in results:
        if not (actual and actual.exists() and actual.stat().st_size > 0):
            missing.append((key, expected))
            continue
        size = actual.stat().st_size
        if size < MIN_PNG_BYTES:
            blank.append((key, actual, size))
        else:
            ok.append(key)

    print(f"✅ {len(ok)} generated")
    print(f"❌ {len(missing)} missing")
    for key, expected in missing:
        print(f"  - {key}: {expected}")
    print(f"⚠️  {len(blank)} suspiciously small (< {MIN_PNG_BYTES:,} bytes — likely blank)")
    for key, path, size in blank:
        print(f"  - {key}: {path} ({size:,} bytes) — re-run with --overwrite")
    print(f"\nOutput directory: {output_dir}")
    return len(missing) + len(blank)


# ── Main ──────────────────────────────────────────────────────────────

async def run(
    fiscal_year: str,
    pool_size: int,
    overwrite: bool,
    limit: int | None,
    mode: str,
):
    json_path = ROOT / "src" / "data" / f"report_card_info_{fiscal_year}.json"
    state_json_path = ROOT / "src" / "data" / f"state_report_card_info_{fiscal_year}.json"
    if not json_path.exists():
        raise FileNotFoundError(f"Missing data file: {json_path}")

    with open(json_path) as fp:
        district_keys = list(json.load(fp).keys())

    state_keys: list[str] = []
    if mode in ("states", "all"):
        if not state_json_path.exists():
            raise FileNotFoundError(
                f"Missing state data file: {state_json_path}. "
                f"Run scripts/generate_report_card_{fiscal_year}.py first."
            )
        with open(state_json_path) as fp:
            state_keys = list(json.load(fp).keys())

    if mode == "states":
        district_keys = []
    elif mode == "districts":
        state_keys = []

    if limit:
        district_keys = district_keys[:limit]
        state_keys = state_keys[:limit]

    output_dir = ROOT / "outputs" / f"report-cards-{fiscal_year}"
    print(
        f"Generating {len(district_keys)} district + {len(state_keys)} state cards "
        f"for {fiscal_year} → {output_dir}"
    )

    async with async_playwright() as p:
        pool = BrowserPool(pool_size=pool_size)
        await pool.initialize(p)
        try:
            tasks = [
                process_district(pool, key, fiscal_year, output_dir, overwrite)
                for key in district_keys
            ] + [
                process_state(pool, code, fiscal_year, output_dir, overwrite)
                for code in state_keys
            ]
            results = []
            for coro in tqdm.as_completed(tasks, desc="Screenshots"):
                results.append(await coro)
        finally:
            await pool.close()

    return validate(results, output_dir), output_dir


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--fiscal-year", default="fy27", choices=["fy26", "fy27"])
    parser.add_argument("--mode", default="all", choices=["districts", "states", "all"],
                        help="Which card types to generate")
    parser.add_argument("--pool-size", type=int, default=4)
    parser.add_argument("--overwrite", action="store_true", help="Re-screenshot existing files")
    parser.add_argument("--limit", type=int, help="Cap N of each kind (debugging)")
    parser.add_argument("--no-dev-server", action="store_true",
                        help="Assume dev server is already running; don't start one")
    parser.add_argument("--version", default="v1",
                        help="R2 version suffix for the upload path (e.g. v2). Must match "
                             "`reportCardImageDir` in src/components/ReportCard.tsx.")
    args = parser.parse_args()

    dev_proc = None
    try:
        if not args.no_dev_server:
            dev_proc = start_dev_server()
        elif not port_is_open(DEV_HOST, DEV_PORT):
            sys.exit(f"--no-dev-server set but nothing listening on {BASE_URL}")

        missing, output_dir = asyncio.run(
            run(args.fiscal_year, args.pool_size, args.overwrite, args.limit, args.mode)
        )
    finally:
        stop_dev_server(dev_proc)

    if missing:
        sys.exit(1)

    r2_path = f"report-cards-{args.fiscal_year}-{args.version}"
    print(f"\n🎉 Done. To upload:")
    print(f"  rclone copy {output_dir}/ r2:scimap-data/{r2_path}/ --transfers 32")


if __name__ == "__main__":
    main()
