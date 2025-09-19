# Data Dictionary: Bosnia and Herzegovina Real Estate Listings

This dictionary describes the columns in the `bosnia_herzegovina_real_estate_listings_2025.csv` dataset.

| Column Name | Data Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `id` | Integer | The unique ID of the listing on OLX.ba. | `52112839` |
| `url` | String | The direct URL to the original listing. | `https://olx.ba/artikal/52112839` |
| `title` | String | The title of the listing. | `"Trosoban stan u centru grada"` |
| `price_km` | Float | The price of the property in Bosnian Convertible Marks (KM). | `215000.0` |
| `location` | String | The primary city or municipality of the listing. | `"Sarajevo - Centar"` |
| `address` | String | The street address of the property, if provided. | `"Maršala Tita 25"` |
| `size_m2` | Float | The size of the property in square meters. | `75.0` |
| `rooms` | Float | The number of rooms (e.g., 1.5 for "Jednoiposoban", 3.0 for "Trosoban"). | `3.0` |
| `floor` | Integer | The floor number. 0 for Ground Floor ("Prizemlje"), -1 for Basement, etc. | `3` |
| `bathrooms` | Integer | The number of bathrooms in the property. | `1` |
| `balcony_size_m2` | Float | The size of the balcony in square meters, if available. | `5.0` |
| `year_built` | String | The year or period of construction. | `"2010"` |
| `condition` | String | The condition of the property (e.g., "Novogradnja", "Renoviran"). | `"Dobro stanje"` |
| `property_type` | String | The type of property (e.g., "Stan", "Kuća", "Apartman"). | `"Stan"` |
| `furnished` | String | The furnishing status of the property (e.g., "Namješten", "Nenamješten"). | `"Polunamješten"` |
| `heating_type` | String | The type of heating system (e.g., "Centralno (Plin)", "Struja"). | `"Centralno (Gradsko)"` |
| `floor_type` | String | The primary type of flooring material (e.g., "Parket", "Laminat"). | `"Parket"` |
| `orientation` | String | The cardinal orientation of the property (e.g., "Jug", "Sjeveroistok"). | `"Jugozapad"` |
| `listing_type` | String | The type of listing, which is "Prodaja" (For Sale) for this dataset. | `"Prodaja"` |
| `has_balcony` | Boolean | `True` if the listing mentions a balcony, terrace, or loggia. | `True` |
| `has_garage` | Boolean | `True` if the listing mentions a garage. | `False` |
| `has_parking` | Boolean | `True` if the listing mentions a dedicated parking space. | `True` |
| `has_elevator` | Boolean | `True` if the building has an elevator. | `True` |
| `has_storage` | Boolean | `True` if the listing mentions a storage room, pantry, or "ostava". | `True` |
| `has_basement_attic` | Boolean | `True` if the listing mentions a basement ("podrum") or attic ("potkrovlje"). | `True` |
| `is_registered` | Boolean | `True` if the property's ownership is legally registered ("uknjiženo"). | `True` |
| `has_armored_door` | Boolean | `True` if the property has a reinforced security door ("blindirana vrata"). | `True` |
| `has_video_surveillance`| Boolean | `True` if video surveillance ("video nadzor") is installed. | `False` |
| `has_alarm` | Boolean | `True` if the property has an alarm system. | `True` |
| `has_internet` | Boolean | `True` if an internet connection is mentioned as available. | `True` |
| `has_cable_tv` | Boolean | `True` if cable TV is mentioned as available. | `True` |
| `has_phone_line` | Boolean | `True` if a landline phone connection is mentioned as available. | `False` |
| `has_ac` | Boolean | `True` if the property has air conditioning ("klima uređaj"). | `True` |
| `has_gas` | Boolean | `True` if the property has a gas connection. | `True` |
| `has_water` | Boolean | `True` if the property is connected to the municipal water supply. | `True` |
| `has_electricity` | Boolean | `True` if the property is connected to the electrical grid. | `True` |
| `has_sewage` | Boolean | `True` if the property is connected to the municipal sewage system. | `True` |
| `pets_allowed` | Boolean | `True` if pets are allowed in the property. | `False` |
| `is_for_students` | Boolean | `True` if the property is specifically marketed towards students. | `False` |
| `utility_costs_included`| Boolean | `True` if utility costs are included in the listing price. | `False` |
| `agent_license` | String | The license number of the real estate agent, if provided. | `"01-01.1-192/23"` |
| `agency_contract_num`| String | The internal contract or ID number from the real estate agency. | `"28/2024"` |
| `description` | String | The full HTML text description of the listing provided by the seller. | `"<p>Prodaje se prostran..."` |