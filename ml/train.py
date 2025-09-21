import logging
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
import joblib
import re

from config import DATA_PATH, LOG_FILE_PATH, MODEL_OUTPUT_PATH

def setup_logging():
    """Sets up a logger for the ML training pipeline."""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(LOG_FILE_PATH, mode='w'),
            logging.StreamHandler()
        ]
    )

def parse_year(year_str: str) -> int:
    """
    Parses various string formats for the construction year into a single integer.
    Handles ranges, text descriptions, and extracts 4-digit years.
    """
    if not isinstance(year_str, str):
        return np.nan
    
    year_str = year_str.lower().strip()
    
    if 'do' in year_str:
        try:
            years = [int(y.strip()) for y in year_str.split('do')]
            return int(np.mean(years))
        except ValueError:
            return np.nan
            
    if 'prije' in year_str:
        return 1940
        
    match = re.search(r'\d{4}', year_str)
    if match:
        return int(match.group(0))
        
    return np.nan

def feature_engineering_pipeline(df: pd.DataFrame) -> pd.DataFrame:
    """
    Applies a comprehensive feature engineering and cleaning pipeline to the raw data.
    This function is the core of transforming raw listings into a model-ready dataset.
    """
    logging.info("Starting advanced feature engineering...")
    
    df = df.copy()

    df['city'] = df['location'].apply(lambda x: x.split('-')[0].strip() if isinstance(x, str) else 'Unknown')
    city_counts = df['city'].value_counts()
    rare_cities = city_counts[city_counts < 5].index
    df['city'] = df['city'].replace(rare_cities, 'Other')
    logging.info(f"Created 'city' feature with {df['city'].nunique()} categories.")

    current_year = 2025
    df['parsed_year'] = df['year_built'].apply(parse_year)
    df['property_age'] = current_year - df['parsed_year']
    logging.info("Created 'property_age' feature.")

    df['m2_per_room'] = df['size_m2'] / df['rooms']
    df['m2_per_room'] = df['m2_per_room'].replace([np.inf, -np.inf], np.nan)
    logging.info("Created 'm2_per_room' interaction feature.")

    df['description'] = df['description'].str.lower().fillna('')
    df['desc_len'] = df['description'].apply(len)
    df['has_renoviran'] = df['description'].str.contains('renoviran|adaptiran', regex=True).astype(int)
    df['has_pogled'] = df['description'].str.contains('pogled', regex=False).astype(int)
    df['has_novogradnja_desc'] = df['description'].str.contains('novogradnja', regex=False).astype(int)
    df['has_garaza_desc'] = df['description'].str.contains('garaž', regex=False).astype(int)
    logging.info("Created text-based features from description (length, keywords, etc.).")

    df['price_per_m2'] = df['price_km'] / df['size_m2']
    
    Q1 = df['price_per_m2'].quantile(0.05)
    Q3 = df['price_per_m2'].quantile(0.95)
    IQR = Q3 - Q1
    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR
    
    initial_rows = len(df)
    df_filtered = df[(df['price_per_m2'] >= lower_bound) & (df['price_per_m2'] <= upper_bound)]
    rows_removed = initial_rows - len(df_filtered)
    logging.info(f"Removed {rows_removed} rows identified as outliers based on price_per_m2 IQR.")

    city_price_map = df_filtered.groupby('city')['price_per_m2'].median()
    df_filtered['city_median_price_per_m2'] = df_filtered['city'].map(city_price_map)
    logging.info("Created 'city_median_price_per_m2' feature to encode location value.")
    
    return df_filtered

def main():
    """Main function to orchestrate the ML training and evaluation pipeline."""
    setup_logging()
    logging.info("--- Starting ML Model Training Service ---")

    try:
        df = pd.read_csv(DATA_PATH)
        logging.info(f"Successfully loaded data. Initial shape: {df.shape}")
    except FileNotFoundError:
        logging.error(f"Data file not found at {DATA_PATH}. Aborting.")
        return

    df = feature_engineering_pipeline(df)
    df['bathrooms'] = pd.to_numeric(df['bathrooms'], errors='coerce')
    
    TARGET = 'price_km'
    df.dropna(subset=[TARGET], inplace=True)
    
    numeric_features = [
        'size_m2', 'rooms', 'floor', 'bathrooms', 'property_age', 
        'm2_per_room', 'desc_len', 'city_median_price_per_m2',
        'has_elevator', 'has_parking', 'has_balcony', 'is_registered', 
        'has_armored_door', 'has_renoviran', 'has_pogled', 
        'has_novogradnja_desc', 'has_garaza_desc'
    ]
    
    categorical_features = ['city', 'condition', 'furnished', 'heating_type']

    features = numeric_features + categorical_features
    logging.info(f"Selected features for modeling: {features}")

    X = df[features]
    y = df[TARGET]

    y_log = np.log1p(y)
    logging.info("Applied log-transformation to the target variable 'price_km'.")

    X_train, X_test, y_train, y_test = train_test_split(X, y_log, test_size=0.2, random_state=42)
    logging.info(f"Data split into training ({X_train.shape[0]} rows) and testing ({X_test.shape[0]} rows) sets.")

    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])

    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('onehot', OneHotEncoder(handle_unknown='ignore', drop='first'))
    ])
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_features),
            ('cat', categorical_transformer, categorical_features)
        ],
        remainder='passthrough'
    )

    pipeline = Pipeline(steps=[('preprocessor', preprocessor),
                               ('regressor', GradientBoostingRegressor(random_state=42))])
    
    param_grid = {
        'regressor__learning_rate': [0.03], 
        'regressor__max_depth': [5], 
        'regressor__n_estimators': [400], 
        'regressor__subsample': [0.7]
    }

    logging.info("--- Starting Model Training ---")
    grid_search = GridSearchCV(pipeline, param_grid, cv=5, scoring='r2', n_jobs=-1)
    grid_search.fit(X_train, y_train)

    logging.info("--- Model Training Finished ---")
    logging.info(f"Best cross-validation R² score: {grid_search.best_score_:.4f}")

    best_model = grid_search.best_estimator_
    
    y_pred_log = best_model.predict(X_test)
    y_pred = np.expm1(y_pred_log)
    y_test_actual = np.expm1(y_test)

    r2 = r2_score(y_test_actual, y_pred)
    mae = mean_absolute_error(y_test_actual, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test_actual, y_pred))

    logging.info("--- Model Performance on Test Set ---")
    logging.info(f"R-squared (R²): {r2:.4f}")
    logging.info(f"Mean Absolute Error (MAE): {mae:,.2f} KM")
    logging.info(f"Root Mean Squared Error (RMSE): {rmse:,.2f} KM")

    joblib.dump(best_model, MODEL_OUTPUT_PATH)
    logging.info(f"Successfully saved the pipeline to {MODEL_OUTPUT_PATH}")
    logging.info("--- ML Model Training Service Finished ---")

if __name__ == "__main__":
    main()