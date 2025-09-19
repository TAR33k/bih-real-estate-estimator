import os
import re
import logging
from typing import Optional
import numpy as np
import pandas as pd

from config import PROCESSED_DATA_PATH, CSV_PATH, LOG_FILE_PATH

MIN_PRICE_KM = 20000
MIN_SIZE_M2 = 15

FLOOR_MAP = {
    'prizemlje': 0,
    'visoko prizemlje': 0,
    'suteren': -1,
    'podrum': -1,
    'potkrovlje': np.nan
}

def setup_logging():
    """Sets up a dedicated logger for the publishing script."""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(LOG_FILE_PATH, mode='a'),
            logging.StreamHandler()
        ]
    )

def clean_rooms(room_str: str) -> Optional[float]:
    """
    Extracts a numerical value from the 'rooms' string.
    Handles formats like "Trosoban (3)", "Jednoiposoban (1.5)", and "Garsonjera".
    """
    if not isinstance(room_str, str):
        return None
    
    room_str_lower = room_str.lower()
    
    match = re.search(r'\((\d+\.?\d*)\)', room_str_lower)
    if match:
        try:
            return float(match.group(1))
        except ValueError:
            pass
    
    if 'garsonjera' in room_str_lower or 'jednosoban' in room_str_lower:
        return 1.0
    if 'jednoiposoban' in room_str_lower:
        return 1.5
    if 'dvosoban' in room_str_lower:
        return 2.0
    if 'dvoiposoban' in room_str_lower:
        return 2.5
    if 'trosoban' in room_str_lower:
        return 3.0
    if 'troiposoban' in room_str_lower:
        return 3.5
    if 'četverosoban' in room_str_lower or 'cetverosoban' in room_str_lower:
        return 4.0
    if 'petosoban' in room_str_lower:
        return 5.0
        
    logging.warning(f"Could not parse room number from string: '{room_str}'")
    return None

def clean_floor(floor_str: str) -> Optional[int]:
    """
    Converts the 'floor' string to a standardized integer.
    Maps text values like "Prizemlje" to 0 and handles special cases.
    """
    if not isinstance(floor_str, str):
        return None

    floor_str_lower = floor_str.lower().strip()
    
    if floor_str_lower in FLOOR_MAP:
        return FLOOR_MAP[floor_str_lower]
    
    if 'minus' in floor_str_lower:
        floor_str_lower = floor_str_lower.replace('minus', '-')
    
    cleaned_str = re.sub(r'[^\d-]', '', floor_str_lower)

    try:
        if cleaned_str:
            return int(cleaned_str)
    except (ValueError, TypeError):
        logging.warning(f"Could not parse floor number from string: '{floor_str}'")
        return None

    logging.warning(f"Could not parse floor number from string: '{floor_str}'")
    return None

def main():
    """
    Main function to load the processed data, perform final cleaning,
    and save it in a public-friendly CSV format.
    """
    setup_logging()
    logging.info("--- Starting Publisher Preparation Service ---")
    
    try:
        df = pd.read_parquet(PROCESSED_DATA_PATH)
        logging.info(f"Successfully loaded {len(df)} records from {PROCESSED_DATA_PATH}")
    except FileNotFoundError:
        logging.error(f"Processed data file not found at {PROCESSED_DATA_PATH}. Please run transformer.py first.")
        return

    initial_rows = len(df)
    
    logging.info("Applying final cleaning and transformations...")
    df['rooms'] = df['rooms'].apply(clean_rooms)
    df['floor'] = df['floor'].apply(clean_floor)
    
    logging.info(f"Filtering outliers based on price > {MIN_PRICE_KM} KM and size > {MIN_SIZE_M2} m²...")
    
    valid_price = df['price_km'] >= MIN_PRICE_KM
    valid_size = df['size_m2'] >= MIN_SIZE_M2
    
    df = df[valid_price & valid_size].copy()
    
    rows_after_filtering = len(df)
    rows_removed = initial_rows - rows_after_filtering
    logging.info(f"Removed {rows_removed} rows due to outlier filtering. {rows_after_filtering} rows remain.")

    final_column_order = [
        'id', 'url', 'title', 'price_km', 'location', 'address', 'size_m2', 
        'rooms', 'floor', 'bathrooms', 'balcony_size_m2', 'year_built', 
        'condition', 'property_type', 'furnished', 'heating_type', 
        'floor_type', 'orientation', 'listing_type', 'has_balcony', 
        'has_garage', 'has_parking', 'has_elevator', 'has_storage', 
        'has_basement_attic', 'is_registered', 'has_armored_door', 
        'has_video_surveillance', 'has_alarm', 'has_internet', 'has_cable_tv', 
        'has_phone_line', 'has_ac', 'has_gas', 'has_water', 'has_electricity', 
        'has_sewage', 'pets_allowed', 'is_for_students', 'utility_costs_included', 
        'agent_license', 'agency_contract_num', 'description'
    ]
    
    df = df[final_column_order]
    logging.info("Finalized column order for publication.")
    
    try:
        df.to_csv(CSV_PATH, index=False, encoding='utf-8-sig')
        logging.info(f"Successfully saved clean dataset for publication to: {CSV_PATH}")
    except Exception as e:
        logging.error(f"Failed to save final CSV file: {e}")

    logging.info("--- Publisher Preparation Service Finished ---")


if __name__ == "__main__":
    main()