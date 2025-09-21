import os

# --- File Paths ---
PROJECT_ROOT = os.path.dirname(os.path.dirname(__file__))
DATA_PATH = os.path.join(PROJECT_ROOT, 'bosnia_herzegovina_real_estate_listings_2025.csv')
LOG_FILE_PATH = os.path.join(os.path.dirname(__file__), 'ml.log')
MODEL_OUTPUT_PATH = os.path.join(os.path.dirname(__file__), 'model.joblib')