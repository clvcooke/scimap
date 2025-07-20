#!/usr/bin/env python3
"""
Alternative webpage screenshot script using Playwright
"""

import asyncio
import os
import sys
from datetime import datetime
import argparse

try:
    from playwright.async_api import async_playwright
except ImportError:
    print("Playwright not installed. Install with: pip install playwright")
    print("Then run: playwright install")
    sys.exit(1)


async def take_screenshot_playwright(url, output_path=None, wait_time=5000, full_page=True, viewport_size=(1920, 1080)):
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

            # Generate filename if not provided
            if not output_path:
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                domain = url.split("//")[-1].split("/")[0].replace(".", "_")
                output_path = f"screenshot_{domain}_{timestamp}.png"

            # Ensure output directory exists
            output_dir = os.path.dirname(output_path) if os.path.dirname(output_path) else "."
            os.makedirs(output_dir, exist_ok=True)

            # Take screenshot
            print("Taking screenshot...")
            await page.screenshot(path=output_path, full_page=full_page)

            print(f"Screenshot saved to: {output_path}")
            return output_path

        except Exception as e:
            print(f"Error taking screenshot: {e}")
            return None

        finally:
            await browser.close()


def main_playwright():
    """Main function for Playwright version."""
    # parser = argparse.ArgumentParser(description="Take a screenshot using Playwright")
    # parser.add_argument("url", help="URL of the webpage to screenshot")
    # parser.add_argument("-o", "--output", help="Output path for the screenshot")
    # parser.add_argument("-w", "--wait", type=int, default=5000, help="Wait time in milliseconds")
    # parser.add_argument("--viewport-only", action="store_true", help="Screenshot viewport only")
    # parser.add_argument("--width", type=int, default=1920, help="Viewport width")
    # parser.add_argument("--height", type=int, default=1080, help="Viewport height")

    # args = parser.parse_args()

    url = "http://localhost:5173/report"

    # Validate URL
    # if not args.url.startswith(("http://", "https://")):
    #     args.url = "https://" + args.url

    # Run screenshot
    screenshot_path = asyncio.run(
        take_screenshot_playwright(
            url=url,
            output_path="test.png",
            wait_time=1000,
            full_page=False,
            viewport_size=(1920, 1080)
        )
    )

    if screenshot_path:
        print(f"✅ Screenshot completed successfully!")
        print(f"📸 Saved as: {screenshot_path}")
    else:
        print("❌ Screenshot failed!")
        sys.exit(1)


if __name__ == "__main__":
    main_playwright()