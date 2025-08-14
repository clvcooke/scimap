
#!/usr/bin/env python3
"""
Alternative webpage screenshot script using Playwright with browser pooling
"""

import asyncio
import json
import os
import sys
from tqdm.asyncio import tqdm

from playwright.async_api import async_playwright


class BrowserPool:
    """
    A pool of browser instances that can be reused for taking screenshots.
    """
    def __init__(self, pool_size=4):
        self.pool_size = pool_size
        self.browsers = []
        self.pages = []
        self.semaphore = asyncio.Semaphore(pool_size)
        self.page_queue = asyncio.Queue()

    async def initialize(self, playwright):
        """Initialize the browser pool with the specified number of browsers."""
        print(f"Initializing browser pool with {self.pool_size} browsers...")

        for i in range(self.pool_size):
            browser = await playwright.chromium.launch(headless=True)
            context = await browser.new_context(
                viewport={'width': 1600, 'height': 950}
            )
            page = await context.new_page()

            self.browsers.append(browser)
            self.pages.append(page)
            # Add page to queue for cycling
            await self.page_queue.put(page)

        print(f"✅ Browser pool initialized with {len(self.browsers)} browsers")

    async def get_page(self):
        """Get an available page from the pool."""
        async with self.semaphore:
            page = await self.page_queue.get()
            return page

    async def return_page(self, page):
        """Return a page back to the pool."""
        await self.page_queue.put(page)
        self.semaphore.release()

    async def close_all(self):
        """Close all browsers in the pool."""
        print("Closing browser pool...")
        for browser in self.browsers:
            await browser.close()
        print("✅ Browser pool closed")


async def take_screenshot_with_pool(pool, url, output_path, wait_time=5000, full_page=True):
    """
    Take a screenshot using a page from the browser pool.

    Args:
        pool: BrowserPool instance
        url (str): URL of the webpage to screenshot
        output_path (str): Path to save the screenshot
        wait_time (int): Wait time in milliseconds
        full_page (bool): Whether to capture full page
    """
    page = await pool.get_page()

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
        return output_path

    except Exception as e:
        print(f"Error taking screenshot: {e}")
        return None

    finally:
        # Always return the page to the pool
        await pool.return_page(page)


async def process_district_with_pool(pool, district):
    """
    Process a single district using the browser pool.

    Args:
        pool: BrowserPool instance
        district: District identifier string

    Returns:
        tuple: (district, screenshot_path, expected_path)
    """
    os.makedirs("outputs/report-cards", exist_ok=True)

    try:
        # Run screenshot
        district_parts = district.split("-")
        expected_path = f"outputs/report-cards/report-card-{district}.png"
        if os.path.exists(expected_path):
            print(f"Already exists: {district}")
            return (district, expected_path, expected_path)

        url = f"https://report-card.scimap.pages.dev/report?stateCode={district_parts[0]}&districtId={district_parts[1]}"

        screenshot_path = await take_screenshot_with_pool(
            pool=pool,
            url=url,
            output_path=expected_path,
            wait_time=1000,
            full_page=False
        )

        return (district, screenshot_path, expected_path)
    except Exception as e:
        print(f"Error processing district {district}: {e}")
        return (district, None, expected_path)


def validate_screenshots(results):
    """
    Validate that all screenshots were successfully saved.

    Args:
        results: List of tuples (district, screenshot_path, expected_path)

    Returns:
        tuple: (successful_count, missing_files)
    """
    print("\n" + "="*60)
    print("VALIDATION RESULTS")
    print("="*60)

    successful = []
    missing = []

    for district, screenshot_path, expected_path in results:
        if screenshot_path and os.path.exists(screenshot_path):
            # Verify file size is reasonable (> 0 bytes)
            file_size = os.path.getsize(screenshot_path)
            if file_size > 0:
                successful.append((district, screenshot_path, file_size))
                print(f"✅ {district}: {screenshot_path} ({file_size:,} bytes)")
            else:
                missing.append((district, expected_path, "Empty file"))
                print(f"❌ {district}: {expected_path} (File exists but is empty)")
        else:
            missing.append((district, expected_path, "File not found"))
            print(f"❌ {district}: {expected_path} (File not found)")

    print("\n" + "-"*60)
    print(f"SUMMARY:")
    print(f"✅ Successfully generated: {len(successful)} screenshots")
    print(f"❌ Failed/Missing: {len(missing)} screenshots")

    if missing:
        print(f"\nMISSED DISTRICTS:")
        for district, path, reason in missing:
            print(f"  - {district}: {reason}")

    total_size = sum(size for _, _, size in successful)
    if successful:
        print(f"\nTotal size of generated screenshots: {total_size:,} bytes")
        print(f"Average file size: {total_size // len(successful):,} bytes")

    print("="*60)

    return len(successful), missing


async def main_playwright_async():
    """
    Main async function to process multiple districts concurrently using a browser pool.
    """
    report_card_district_data = "/home/colin/code/scimap/src/data/report_card_info.json"
    with open(report_card_district_data) as fp:
        report_card_data = json.load(fp)

    districts = list(report_card_data.keys())
    print(f"Starting to process {len(districts)} districts with 4 concurrent browsers...")

    async with async_playwright() as p:
        # Initialize browser pool
        pool = BrowserPool(pool_size=4)
        await pool.initialize(p)

        try:
            # Create tasks for all districts
            tasks = [process_district_with_pool(pool, district) for district in districts]

            # Run all tasks concurrently with progress bar
            results = []
            for task in tqdm.as_completed(tasks, desc="Processing districts"):
                result = await task
                results.append(result)

        finally:
            # Always close the browser pool
            await pool.close_all()

    # Validate all screenshots
    successful_count, missing_files = validate_screenshots(results)

    return results, successful_count, missing_files


def main_playwright():
    """
    Wrapper function to run the async main function.
    """
    results, successful_count, missing_files = asyncio.run(main_playwright_async())

    # Exit with error code if any screenshots are missing
    if missing_files:
        print(f"\n⚠️  Warning: {len(missing_files)} screenshots were not generated successfully!")
        sys.exit(1)
    else:
        print(f"\n🎉 All {successful_count} screenshots generated successfully!")
        sys.exit(0)


if __name__ == "__main__":
    main_playwright()


# rclone copy report-cards/ r2:scimap-data/report-cards-v1/ --transfers 32