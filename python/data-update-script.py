#!/usr/bin/env python3
"""
Alternative webpage screenshot script using Playwright
"""

import asyncio
import json
import os
import sys
from tqdm.asyncio import tqdm

from playwright.async_api import async_playwright
from PIL import Image  # added


def trim_image_whitespace(image_path: str, tolerance: int = 10) -> tuple[bool, tuple[int, int, int, int] | None]:
    """
    Trim uniform whitespace (or transparency) from the borders of an image.

    Args:
        image_path: Path to the image file to trim.
        tolerance: How much near-white to consider as whitespace (0-255).
                   Larger values trim lighter backgrounds more aggressively.

    Returns:
        (trimmed, bbox)
        - trimmed: True if a crop was performed.
        - bbox: The bounding box used for cropping, or None if not trimmed.
    """
    try:
        with Image.open(image_path) as im:
            im.load()

            # 1) Prefer alpha if present (handles transparent backgrounds precisely)
            if im.mode in ("RGBA", "LA"):
                alpha = im.split()[-1]
                bbox = alpha.getbbox()

            else:
                # 2) Fallback: treat near-white as whitespace using a tolerance threshold
                # Convert to RGB and create a mask where any channel is sufficiently non-white.
                rgb = im.convert("RGB")
                r, g, b = rgb.split()
                threshold = 255 - max(0, min(255, tolerance))

                def channel_mask(ch):
                    # Mark pixels that are darker than the white-threshold as content
                    return ch.point(lambda p: 255 if p < threshold else 0)

                mask = Image.merge("RGB", (channel_mask(r), channel_mask(g), channel_mask(b))).convert("L")
                bbox = mask.getbbox()

            if bbox:
                # Crop to content and overwrite atomically
                cropped = im.crop(bbox)
                tmp_path = image_path + ".tmp"
                cropped.save(tmp_path)
                os.replace(tmp_path, image_path)
                return True, bbox

            return False, None

    except Exception as e:
        print(f"Warning: failed to trim whitespace for {image_path}: {e}")
        return False, None


async def take_screenshot_playwright(url, output_path, wait_time=5000, full_page=True, viewport_size=(1500, 1000)):
    """
    Take a screenshot using Playwright.

    Args:
        url (str): URL of the webpage to screenshot
        output_path (str): Path to save the screenshot
        wait_time (int): Wait time in milliseconds
        full_page (bool): Whether to capture full page
        viewport_size (tuple): Viewport size as (width, height)
    """
    async with async_playwright() as p:
        # Launch browser
        browser = await p.chromium.launch(headless=True)

        # Create context with viewport size
        context = await browser.new_context(
            viewport={'width': viewport_size[0], 'height': viewport_size[1]}
        )

        # Create page
        page = await context.new_page()

        try:
            # Navigate to URL
            print(f"Loading webpage: {url}")
            await page.goto(url, wait_until='networkidle')

            # Wait for specified time
            await page.wait_for_timeout(wait_time)

            # Ensure output directory exists
            output_dir = os.path.dirname(output_path) if os.path.dirname(output_path) else "."
            os.makedirs(output_dir, exist_ok=True)

            # Take screenshot
            await page.screenshot(path=output_path, full_page=full_page)

            # Trim whitespace immediately after capture
            trimmed, bbox = trim_image_whitespace(output_path, tolerance=8)
            if trimmed:
                print(f"Trimmed whitespace: {bbox}")

            return output_path

        except Exception as e:
            print(f"Error taking screenshot: {e}")
            return None

        finally:
            await browser.close()


async def process_district(semaphore, district):
    """
    Process a single district with semaphore to limit concurrent operations.

    Args:
        semaphore: Asyncio semaphore to limit concurrency
        district: District identifier string

    Returns:
        tuple: (district, screenshot_path, expected_path)
    """
    os.makedirs("outputs/report-cards", exist_ok=True)
    async with semaphore:
        try:
            # Run screenshot
            district_parts = district.split("-")
            expected_path = f"outputs/report-cards/report-card-{district}.png"
            if os.path.exists(expected_path):
                print("Already exists")
                return (district, expected_path, expected_path)
            url = f"https://report-card.scimap.pages.dev/report?stateCode={district_parts[0]}&districtId={district_parts[1]}"

            screenshot_path = await take_screenshot_playwright(
                url=url,
                output_path=expected_path,
                wait_time=1000,
                full_page=False,
                viewport_size=(1920, 1080)
            )

            return (district, screenshot_path, expected_path)
        except Exception as e:
            print(f"Error processing district {district}: {e}")
            return (district, None, expected_path)