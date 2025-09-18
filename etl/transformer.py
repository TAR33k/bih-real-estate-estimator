import os
import json
import re
import logging
from typing import List, Optional, Dict, Any

from bs4 import BeautifulSoup
import pandas as pd
from pydantic import BaseModel, ValidationError

from config import OUTPUT_DIR, LOG_FILE_PATH, PROCESSED_DATA_PATH

class ListingModel(BaseModel):
    id: int
    url: str
    title: str
    description: str
    price_km: Optional[float] = None
    condition: Optional[str] = None
    listing_type: Optional[str] = None
    property_type: Optional[str] = None
    rooms: Optional[str] = None
    size_m2: Optional[float] = None
    furnished: Optional[str] = None
    floor: Optional[str] = None
    heating_type: Optional[str] = None
    location: str
    address: Optional[str] = None
    balcony_size_m2: Optional[float] = None
    bathrooms: Optional[str] = None
    orientation: Optional[str] = None
    floor_type: Optional[str] = None
    year_built: Optional[str] = None
    agent_license: Optional[str] = None
    agency_contract_num: Optional[str] = None
    has_garage: bool = False
    has_internet: bool = False
    has_cable_tv: bool = False
    has_sewage: bool = False
    has_ac: bool = False
    has_elevator: bool = False
    has_storage: bool = False
    has_parking: bool = False
    has_gas: bool = False
    has_basement_attic: bool = False
    has_electricity: bool = False
    has_phone_line: bool = False
    utility_costs_included: bool = False
    is_registered: bool = False
    has_video_surveillance: bool = False
    has_armored_door: bool = False
    has_water: bool = False
    is_for_students: bool = False
    has_alarm: bool = False
    has_balcony: bool = False
    pets_allowed: bool = False

def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(LOG_FILE_PATH, mode='w'),
            logging.StreamHandler()
        ]
    )

def parse_details_from_soup(soup: BeautifulSoup) -> Dict[str, str]:
    """Parses the human-readable detail tables for most attributes."""
    details = {}
    attribute_containers = soup.select('div.required-attributes, div.w-full > div.tbody')

    for container in attribute_containers:
        rows = container.find_all('div', recursive=False, class_=['required-wrap', 'grid'])
        for row in rows:
            key_tag = row.find('h4')
            if not key_tag: continue
            key = key_tag.get_text(strip=True)
            value_container = key_tag.find_next_sibling()
            
            if value_container:
                value = 'true' if value_container.find('svg') else value_container.get_text(strip=True)
                details[key] = value
    return details

def parse_location_from_soup(soup: BeautifulSoup) -> Optional[str]:
    """Specifically finds and parses the location from the 'city pill' element."""
    location_tag = soup.select_one('div.btn-pill.city')
    if location_tag:
        return location_tag.get_text(strip=True)
    return None

def parse_html_file(file_path: str) -> Optional[Dict[str, Any]]:
    """Parses a single HTML file using a multi-source strategy."""
    try:
        if os.path.getsize(file_path) == 0:
            logging.warning(f"File is empty, skipping: {file_path}")
            return None

        with open(file_path, 'r', encoding='utf-8') as f:
            html_content = f.read()

        soup = BeautifulSoup(html_content, 'html.parser')
        
        ld_json_tag = soup.find('script', {'type': 'application/ld+json'})
        if not ld_json_tag:
            logging.warning(f"Could not find JSON-LD data in {file_path}")
            return None
        
        ld_json_data = json.loads(ld_json_tag.string)
        details_map = parse_details_from_soup(soup)

        location = parse_location_from_soup(soup)
        if location:
            details_map['Lokacija'] = location

        return {"ld_json": ld_json_data, "details_map": details_map}

    except Exception as e:
        logging.error(f"An unexpected error occurred processing file {file_path}: {e}", exc_info=True)
        return None

def transform_to_schema(parsed_data: Dict[str, Any]) -> Optional[ListingModel]:
    """Transforms the combined parsed data into our validated Pydantic model."""
    if not parsed_data or not parsed_data.get('ld_json') or not parsed_data.get('details_map'):
        return None
    
    ld_json = parsed_data['ld_json']
    details = parsed_data['details_map']
    
    url = ld_json.get('offers', {}).get('url')
    if not url: return None
    listing_id = int(url.split('/')[-1])
    
    def get_float(key: str) -> Optional[float]:
        val = details.get(key)
        if val:
            try: return float(str(val).replace(',', '.'))
            except (ValueError, AttributeError): return None
        return None

    try:
        listing_dict = {
            'id': listing_id,
            'url': url,
            'title': ld_json.get('name'),
            'price_km': ld_json.get('offers', {}).get('price'),
            'description': BeautifulSoup(ld_json.get('description', ''), 'html.parser').get_text(),
            'location': details.get('Lokacija', ''),
            'address': details.get('Adresa'),
            'condition': details.get('Stanje'),
            'listing_type': details.get('Vrsta oglasa'),
            'property_type': details.get('Tip nekretnine'),
            'rooms': details.get('Broj soba'),
            'size_m2': get_float('Kvadrata'),
            'furnished': details.get('Opremljenost'),
            'floor': details.get('Sprat'),
            'heating_type': details.get('Vrsta grijanja'),
            'balcony_size_m2': get_float('Kvadratura balkona'),
            'bathrooms': details.get('Broj kupatila'),
            'orientation': details.get('Primarna orjentacija'),
            'floor_type': details.get('Vrsta poda'),
            'year_built': details.get('Godina izgradnje'),
            'agent_license': details.get('Ime i broj licence agenta'),
            'agency_contract_num': details.get('Broj posredničkog ugovora'),
            'pets_allowed': 'Kućni ljubimci' in details,
            'has_garage': 'Garaža' in details,
            'has_internet': 'Internet' in details,
            'has_cable_tv': 'Kablovska TV' in details,
            'has_sewage': 'Kanalizacija' in details,
            'has_ac': 'Klima' in details,
            'has_elevator': 'Lift' in details,
            'has_storage': 'Ostava/špajz' in details,
            'has_parking': 'Parking' in details,
            'has_gas': 'Plin' in details,
            'has_basement_attic': 'Podrum/Tavan' in details,
            'has_electricity': 'Struja' in details,
            'has_phone_line': 'Telefonski priključak' in details,
            'utility_costs_included': 'Uključen trošak režija' in details,
            'is_registered': 'Uknjiženo / ZK' in details,
            'has_video_surveillance': 'Video nadzor' in details,
            'has_armored_door': 'Blindirana vrata' in details,
            'has_water': 'Voda' in details,
            'is_for_students': 'Za studente' in details,
            'has_alarm': 'Alarm' in details,
            'has_balcony': 'Balkon' in details,
        }
        return ListingModel(**listing_dict)
    except ValidationError as e:
        logging.warning(f"Validation failed for listing {listing_id}: {e}")
        return None
    except Exception as e:
        logging.error(f"A generic error occurred transforming listing {listing_id}: {e}")
        return None

def main():
    """Main function to run the transformation pipeline."""
    setup_logging()
    logging.info("--- Starting ETL Transformer Service ---")
    
    html_files = [f for f in os.listdir(OUTPUT_DIR) if f.endswith('.html')]
    if not html_files:
        logging.warning("No HTML files found. Run extractor.py first.")
        return

    all_clean_listings = []
    
    for i, filename in enumerate(html_files):
        file_path = os.path.join(OUTPUT_DIR, filename)
        if (i + 1) % 200 == 0 or i == 0:
             logging.info(f"Processing file {i+1}/{len(html_files)}: {filename}")
        
        parsed_data = parse_html_file(file_path)
        
        if parsed_data:
            clean_listing = transform_to_schema(parsed_data)
            if clean_listing:
                all_clean_listings.append(clean_listing.model_dump())

    if not all_clean_listings:
        logging.error("No listings could be successfully transformed. Check selectors and HTML structure.")
        return

    df = pd.DataFrame(all_clean_listings)
    
    os.makedirs(os.path.dirname(PROCESSED_DATA_PATH), exist_ok=True)
    df.to_parquet(PROCESSED_DATA_PATH, index=False)
    
    logging.info(f"Successfully transformed {len(df)} listings out of {len(html_files)} files.")
    logging.info(f"Clean dataset saved to: {PROCESSED_DATA_PATH}")
    logging.info("--- ETL Transformer Service Finished ---")

if __name__ == "__main__":
    main()