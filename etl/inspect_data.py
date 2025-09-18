import pandas as pd
from config import PROCESSED_DATA_PATH
import logging

pd.set_option('display.max_columns', None)
pd.set_option('display.width', 1000)

def main():
    """Loads and inspects the processed Parquet file."""
    try:
        df = pd.read_parquet(PROCESSED_DATA_PATH)
        
        print("\n--- First 5 Rows ---")
        print(df.head())
        
        print(f"\n--- DataFrame Info (Total Rows: {len(df)}) ---")
        df.info(verbose=False)
        
        print("\n--- Descriptive Statistics for Numeric Columns ---")
        print(df.describe().T)

    except FileNotFoundError:
        logging.error(f"Processed data file not found at {PROCESSED_DATA_PATH}. Please run transformer.py first.")
    except Exception as e:
        logging.error(f"An error occurred while inspecting the data: {e}")

if __name__ == "__main__":
    main()