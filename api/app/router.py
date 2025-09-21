import pandas as pd
import numpy as np
from fastapi import APIRouter, HTTPException, Depends, Request

from .schemas import ApartmentPredictionRequest
from .ml_model import ml_model, parse_year, custom_round
from .main import limiter
from .config import settings

router = APIRouter()

def get_model():
    if ml_model.model is None or ml_model.city_price_map is None:
        raise HTTPException(status_code=503, detail="Model or essential resources are not loaded.")
    return ml_model

@router.post("/predict", tags=["Prediction"])
@limiter.limit(f"{settings.RATE_LIMIT_REQUESTS}/{settings.RATE_LIMIT_MINUTES}minute")
async def predict_price(
    request: Request,
    prediction_request: ApartmentPredictionRequest, 
    model_resources = Depends(get_model)
):
    """
    Accepts user-friendly apartment features and returns a rounded, estimated price.
    This endpoint is rate-limited to prevent abuse.
    """
    try:
        features = {}
        
        direct_map_keys = [
            'size_m2', 'rooms', 'floor', 'bathrooms', 'condition', 'furnished',
            'heating_type', 'has_elevator', 'has_parking', 'has_balcony',
            'is_registered', 'has_armored_door'
        ]
        for key in direct_map_keys:
            features[key] = getattr(prediction_request, key)
            
        features['city'] = prediction_request.location.split('-')[0].strip()
        features['property_age'] = 2025 - parse_year(prediction_request.year_built)
        features['m2_per_room'] = prediction_request.size_m2 / prediction_request.rooms if prediction_request.rooms > 0 else np.nan
        features['city_median_price_per_m2'] = model_resources.city_price_map.get(features['city'])
        
        features['desc_len'] = 150
        features['has_renoviran'] = 1 if prediction_request.condition in ["Renoviran", "Novogradnja"] else 0
        features['has_pogled'] = 0
        features['has_novogradnja_desc'] = 1 if prediction_request.condition == "Novogradnja" else 0
        features['has_garaza_desc'] = 1 if prediction_request.has_garage else 0

        input_df = pd.DataFrame([features])
        prediction_log = model_resources.model.predict(input_df)
        prediction_price = np.expm1(prediction_log)[0]

        rounded_price = custom_round(prediction_price)

        return {"estimated_price_km": rounded_price}
        
    except Exception as e:
        print(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail="An internal error occurred during prediction.")