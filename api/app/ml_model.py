import joblib
import json
import re
import numpy as np
import pandas as pd
from .config import settings

class ModelSingleton:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelSingleton, cls).__new__(cls)
            cls._instance.model = None
            cls._instance.city_price_map = None
        return cls._instance

    def load_model(self):
        try:
            self.model = joblib.load(settings.MODEL_PATH)
            print("ML Model loaded successfully.")
        except FileNotFoundError:
            print(f"FATAL ERROR: Model not found at {settings.MODEL_PATH}")
        except Exception as e:
            print(f"An error occurred while loading the model: {e}")

    def load_city_map(self):
        try:
            with open(settings.CITY_MAP_PATH, 'r') as f:
                self.city_price_map = json.load(f)
            print("City price map loaded successfully.")
        except FileNotFoundError:
            print(f"FATAL ERROR: City map not found at {settings.CITY_MAP_PATH}")

ml_model = ModelSingleton()

def parse_year(year_str: str) -> int:
    if not isinstance(year_str, str): return np.nan
    year_str = year_str.lower().strip()
    if 'do' in year_str:
        try:
            years = [int(y.strip()) for y in year_str.split('do')]
            return int(np.mean(years))
        except: return np.nan
    if 'prije' in year_str: return 1940
    match = re.search(r'\d{4}', year_str)
    if match: return int(match.group(0))
    return np.nan

def custom_round(price: float) -> int:
    price = price * 0.8
    if price < 100000:
        return int(round(price / 1000) * 1000)
    elif price < 200000:
        return int(round(price / 5000) * 5000)
    else:
        return int(round(price / 10000) * 10000)