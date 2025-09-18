import asyncio
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError
import time
import os
import logging
from config import BASE_URL, USER_AGENT, REQUEST_DELAY_SECONDS, MAX_PAGES_TO_SCRAPE, OUTPUT_DIR, URL_LIST_PATH, LOG_FILE_PATH

def setup_logging():
    """Sets up a logger to output to both console and a log file."""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(LOG_FILE_PATH, mode='w'),
            logging.StreamHandler()
        ]
    )

def ensure_output_dir():
    """Ensures the directory for saving raw HTML exists."""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    logging.info(f"Output directory '{OUTPUT_DIR}' is ready.")

async def scrape_page_urls():
    """Scrapes all individual listing URLs from the search result pages using Playwright."""
    listing_urls = set()
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(user_agent=USER_AGENT)
        
        for page_num in range(1, MAX_PAGES_TO_SCRAPE + 1):
            url = f"{BASE_URL}{page_num}"
            logging.info(f"Navigating to search page: {url}")
            
            try:
                await page.goto(url, wait_until='domcontentloaded')
                
                ad_container_selector = 'div.artikli > div:nth-child(1) > div:nth-child(3)'
                await page.wait_for_selector(ad_container_selector, timeout=10000)

                links = await page.locator('a[href^="/artikal/"]').all()
                
                if not links:
                    logging.warning(f"No ad links found on page {page_num}. This might be the last page.")
                    break
                
                for link_locator in links:
                    href = await link_locator.get_attribute('href')
                    if href:
                        full_url = "https://olx.ba" + href
                        listing_urls.add(full_url)

            except PlaywrightTimeoutError:
                logging.error(f"Timeout waiting for ads to load on page {page_num}. The page might have changed.")
                break
            except Exception as e:
                logging.error(f"An error occurred on page {page_num}: {e}")

        await browser.close()

    logging.info(f"Found {len(listing_urls)} unique listing URLs.")
    
    with open(URL_LIST_PATH, 'w') as f:
        for url in listing_urls:
            f.write(f"{url}\n")
    logging.info(f"Saved listing URLs to {URL_LIST_PATH}")
    return list(listing_urls)

async def scrape_listing_details(browser, url: str):
    """Scrapes the raw HTML of a single listing page using an existing browser instance."""
    try:
        listing_id = url.split('/')[4]
        file_path = os.path.join(OUTPUT_DIR, f"{listing_id}.html")

        if os.path.exists(file_path):
            logging.info(f"HTML for listing {listing_id} already exists. Skipping.")
            return

        logging.info(f"Scraping details for listing: {listing_id}")
        page = await browser.new_page(user_agent=USER_AGENT)
        await page.goto(url, wait_until='domcontentloaded')
        
        await page.wait_for_selector('h1', timeout=10000) 
        
        html_content = await page.content()
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        logging.info(f"Successfully saved HTML for listing {listing_id}")
        await page.close()

    except Exception as e:
        logging.error(f"Failed to fetch or process listing {url}. Error: {e}")


async def main():
    """Main function to orchestrate the extraction process."""
    setup_logging()
    ensure_output_dir()
    
    logging.info("--- Starting ETL Extractor Service ---")
    
    # Stage 1: Collect all the listing URLs
    listing_urls = await scrape_page_urls()
    
    # Stage 2: Scrape and save the HTML for each listing
    if listing_urls:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            for i, url in enumerate(listing_urls):
                await scrape_listing_details(browser, url)
                await asyncio.sleep(REQUEST_DELAY_SECONDS)
                logging.info(f"Progress: {i+1}/{len(listing_urls)}")
            await browser.close()
            
    logging.info("--- ETL Extractor Service Finished ---")


if __name__ == "__main__":
    asyncio.run(main())