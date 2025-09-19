import os
from dotenv import load_dotenv

load_dotenv()

USER_AGENT = os.getenv("USER_AGENT")
BASE_URL = os.getenv("BASE_URL")

# --- Scraper Settings ---
REQUEST_DELAY_SECONDS = 2.5
MAX_PAGES_TO_SCRAPE = 100

# --- File Paths ---
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), 'data', 'raw', 'html')
URL_LIST_PATH = os.path.join(os.path.dirname(__file__), 'data', 'raw', 'listing_urls.txt')
LOG_FILE_PATH = os.path.join(os.path.dirname(__file__), 'etl.log')
PROCESSED_DATA_PATH = os.path.join(os.path.dirname(__file__), 'data', 'processed', 'listings.parquet')
CSV_PATH = os.path.join(os.path.dirname(__file__), '..', 'bosnia_herzegovina_real_estate_listings_2025.csv')