import os
from dotenv import load_dotenv

load_dotenv(dotenv_path="../.env")

class Settings:
    MODEL_PATH: str = os.getenv("MODEL_PATH", "../ml/model.joblib")
    CITY_MAP_PATH: str = os.getenv("CITY_MAP_PATH", "../ml/city_price_map.json")
    
    RATE_LIMIT_REQUESTS: int = int(os.getenv("RATE_LIMIT_REQUESTS", 20))
    RATE_LIMIT_MINUTES: int = int(os.getenv("RATE_LIMIT_MINUTES", 1))

settings = Settings()