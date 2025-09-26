<div align="center">

  <img width="100" height="100" alt="logo" src="https://github.com/user-attachments/assets/ee7fcc54-a524-4424-8eb0-3fa72e39e41b"/>

  <h1>
    <font style="font-weight: bold;">BIH Real Estate Estimator</font>
  </h1>

  ML-powered platform for estimating apartment and flat prices across Bosnia and Herzegovina, featuring a comprehensive data pipeline and modern web interface.

  <p>
    <img alt="Backend" src="https://img.shields.io/badge/Backend-FastAPI-009688.svg?style=for-the-badge&logo=fastapi"/>
    <img alt="Frontend" src="https://img.shields.io/badge/Frontend-Next.js%2015-000000.svg?style=for-the-badge&logo=nextdotjs"/>
    <img alt="ML" src="https://img.shields.io/badge/ML-Scikit--Learn-F7931E.svg?style=for-the-badge&logo=scikit-learn"/>
    <img alt="Database" src="https://img.shields.io/badge/Data-4MB%20Dataset-4CAF50.svg?style=for-the-badge&logo=databricks"/>
    <img alt="Deployment" src="https://img.shields.io/badge/Deploy-Railway%20%7C%20Vercel-blueviolet.svg?style=for-the-badge&logo=railway"/>
  </p>

  **Live Demo:** [bih-real-estate-estimator.vercel.app](https://bih-real-estate-estimator.vercel.app/)  
  **API Endpoint:** [bih-real-estate-estimator-api-production.up.railway.app](https://bih-real-estate-estimator-api-production.up.railway.app/)

</div>

---

## About

**BIH Real Estate Estimator** is a sophisticated machine learning platform that provides accurate price predictions for residential properties across Bosnia and Herzegovina. The system combines advanced data science techniques with modern web technologies to deliver property valuations based on comprehensive market analysis.

### Key Features

| Component       | Technology      | Core Functionality                                                                                                                                     |
| --------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **ML Pipeline**    | Gradient Boosting | Advanced feature engineering, outlier detection, city-based price mapping, log-transformed target prediction with custom rounding algorithms.                                       |
| **ETL System** | Playwright + BeautifulSoup | Automated web scraping from OLX.ba, HTML parsing, data validation with Pydantic, and comprehensive data cleaning pipeline.                        |
| **API Backend**   | FastAPI | RESTful API with rate limiting, CORS security, health checks, model serving, and comprehensive input validation with 144+ location support. |
| **Web Frontend**        | Next.js 15 | Responsive bilingual interface (English/Bosnian), dark/light themes, real-time predictions, animated UI components, and mobile-optimized design.                                                                                          |

---

## System Architecture

The platform is built on a modern, scalable architecture designed for performance, maintainability, and ease of deployment.

### Core Components

-   **`/api`** : **FastAPI Backend** serves as the prediction engine, handling HTTP requests, input validation, ML model inference, and providing comprehensive API documentation via Swagger UI.
-   **`/frontend`** : **Next.js 15 Application** with TypeScript, featuring internationalization (i18n), responsive design, and modern UI components built with Radix UI and Tailwind CSS.
-   **`/ml`** : **Machine Learning Pipeline** containing the training script, model artifacts, and configuration for the Gradient Boosting Regressor with advanced feature engineering.
-   **`/etl`** : **Data Processing Pipeline** with web scraping capabilities, HTML parsing, data transformation, and validation using Pydantic models for data integrity.

---

## Dataset & Features

The system utilizes a comprehensive dataset of **Bosnia and Herzegovina real estate listings** with **43 distinct features** covering property characteristics, location data, and amenities.

### Dataset Statistics
- **Total Records**: 2000 property listings
- **File Size**: 4 MB CSV format
- **Coverage**: 144 cities and municipalities across BiH
- **Features**: 43 columns including numerical, categorical, and boolean attributes

### Key Feature Categories

| Category | Features | Examples |
|----------|----------|----------|
| **Property Basics** | Size, Rooms, Floor, Bathrooms | `size_m2`, `rooms`, `floor`, `bathrooms` |
| **Location Data** | City, Address, Price per m² | `location`, `address`, `city_median_price_per_m2` |
| **Property Details** | Year Built, Condition, Furnishing | `year_built`, `condition`, `furnished`, `heating_type` |
| **Amenities** | Balcony, Garage, Elevator, Parking | `has_balcony`, `has_garage`, `has_elevator`, `has_parking` |
| **Security & Utilities** | Registration, Security, Utilities | `is_registered`, `has_armored_door`, `has_ac`, `has_internet` |

> **Full Feature Documentation**: See [DATA_DICTIONARY.md](DATA_DICTIONARY.md) for complete feature descriptions and examples.

---

## Machine Learning Model

### Algorithm & Performance
- **Model Type**: Gradient Boosting Regressor (scikit-learn)
- **Target Transformation**: Log-transformation with `np.log1p()` for improved performance
- **Feature Engineering**: 17 engineered features including city price mapping and text analysis
- **Validation**: 5-fold cross-validation with R² scoring
- **R² Score**: 0.78
- **Mean Absolute Error**: ~40,000 KM

---

## API Documentation

### Core Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API welcome message |
| `/health` | GET | Health check status |
| `/predict` | POST | Property price prediction |
| `/docs` | GET | Interactive API documentation |

---

## Prerequisites

Before setting up the project, ensure you have the following installed:

| Tool | Version | Purpose |
|------|---------|---------|
| **[Python](https://python.org/)** | 3.11+ | Backend API and ML pipeline |
| **[Node.js](https://nodejs.org/)** | 18+ | Frontend development and build |
| **[Docker](https://docker.com/)** | Latest | Containerized deployment |

---

## Quick Start Guide

### 1. Clone the Repository

```bash
git clone https://github.com/TAR33k/bih-real-estate-estimator.git
cd bih-real-estate-estimator
```

### 2. Backend Setup (API + ML Model)

#### Option A: Docker Deployment (Recommended)
```bash
# Build and run the API container
docker-compose up --build

# API will be available at http://localhost:8080
# Swagger documentation at http://localhost:8080/docs
```

#### Option B: Local Python Setup
```bash
cd api

# Create virtual environment
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the API server
uvicorn app.main:app --host 0.0.0.0 --port 8080 --reload
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Edit .env.template with your API URL (local: http://localhost:8080)

# Run development server
npm run dev

# Frontend will be available at http://localhost:3000
```

### 4. ETL Data Pipeline (Optional)

```bash
cd etl

# Install ETL dependencies
pip install -r requirements.txt

# Configure scraping settings
cp .env.template .env
# Edit .env with scraping configuration

# Run the complete ETL pipeline
python extractor.py    # Scrape raw HTML data
python transformer.py  # Transform and clean data
python prepare_for_publish.py  # Final processing
```

### 5. ML Model Training (Optional)

```bash
cd ml

# Install ML dependencies
pip install -r requirements.txt

# Train the model (requires dataset)
python train.py

# Model artifacts will be saved as model.joblib and city_price_map.json
```

---

## License & Data

This project and the Bosnia Herzegovina real estate listings dataset are licensed under the **Creative Commons Attribution-ShareAlike 4.0 International License**. See [LICENSE](LICENSE) for full details.

**Data Source**: [OLX.ba](https://olx.ba/) listings
