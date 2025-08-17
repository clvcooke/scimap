import re
from playwright.sync_api import Playwright, sync_playwright, expect
import time

def run(playwright: Playwright) -> None:
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={"width": 1280, "height": 1024})
    page = context.new_page()
    page.goto("http://localhost:5173/?skip_welcome=true")

    try:
        print("Waiting for 'FY26 Budget' tab...")
        page.get_by_role("tab", name="FY26 Budget").click()
        print("Clicked 'FY26 Budget' tab.")

        # Change region type to State
        print("Changing region type to State...")
        page.get_by_role("textbox", name="Select Region Type").click()
        page.get_by_text("State", exact=True).click()

        # Click on a state to pin it
        print("Clicking on a state...")
        page.wait_for_timeout(2000) # wait for tiles to load
        page.mouse.click(600, 400)

        # Wait for the pinned info card to appear
        print("Waiting for pinned info card...")
        pinned_card = page.locator('.mantine-Card-root')
        expect(pinned_card).to_be_visible(timeout=10000)

        # Verify the "Open Fact Sheet" button is visible
        print("Verifying 'Open Fact Sheet' button...")
        fact_sheet_button = pinned_card.get_by_role("button", name="Open Fact Sheet")
        expect(fact_sheet_button).to_be_visible()
        print("'Open Fact Sheet' button is visible.")

        # Take a screenshot
        screenshot_path = "jules-scratch/verification/screenshot.png"
        page.screenshot(path=screenshot_path)
        print(f"Screenshot saved to {screenshot_path}")

    except Exception as e:
        print(f"An error occurred: {e}")
        print(page.content())
        page.screenshot(path="jules-scratch/verification/error.png")
        raise e

    finally:
        # ---------------------
        context.close()
        browser.close()


with sync_playwright() as playwright:
    run(playwright)
