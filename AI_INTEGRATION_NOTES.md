# StrokeSense AI Integration Notes

## Current Status

The AI Engineer team is still preparing the final stroke prediction model/API.

Because the AI API is not ready yet, the backend currently uses mock prediction logic so frontend development can continue without being blocked.

The mock prediction is located in:

src/mockModel.js

The AI integration bridge is located in:

src/aiClient.js

## Backend Strategy

The frontend will not call the AI model directly.

The frontend will only call the Express backend:

POST http://localhost:3000/api/predict

The backend will be responsible for:

- Receiving user health data from the frontend
- Validating the input
- Sending the needed data to the AI model/API later
- Receiving the AI prediction result
- Converting the AI response into a stable frontend response format
- Returning the final result to the frontend

## Stable Response Format for Frontend

The frontend should continue using this response path:

result.data.prediction.probabilityPercent
result.data.prediction.riskLevel
result.data.prediction.factors
result.data.prediction.recommendations
result.data.prediction.disclaimer

This format should stay stable even if the AI team's API format changes later.

## Proposed AI Request Format

When the AI API is ready, the backend can send this request body:

{
  "age": 55,
  "hypertension": 1,
  "heart_disease": 0,
  "ever_married": "Yes",
  "work_type": "Private",
  "avg_glucose_level": 180,
  "bmi": 29.5,
  "smoking_status": "formerly smoked"
}

## Proposed AI Response Format

Preferred AI response:

{
  "probability": 0.55,
  "risk_level": "Medium",
  "model_version": "tensorflow-functional-api-v1"
}

Notes:

- probability should ideally be a number from 0 to 1.
- Example: 0.55 means 55%.
- risk_level can be Low, Medium, or High.
- If the AI API only returns probability, the backend can calculate the risk level.

## If the AI Team Uses a Different Format

If the AI team uses a different response format, the backend can adapt inside:

src/aiClient.js

The frontend should not need to change as long as the backend keeps returning the same response format.

## Required Information From AI Team Later

Before final integration, the backend needs:

1. Final AI endpoint URL
2. HTTP method, most likely POST
3. Required request body format
4. Response body format
5. Meaning of each response field
6. Whether probability is returned as 0-1 or 0-100
7. Model version name if available

## Current Development Flow

Current flow:

Frontend React form
↓
Express backend /api/predict
↓
Mock prediction logic
↓
Backend response
↓
Frontend displays result

Final flow:

Frontend React form
↓
Express backend /api/predict
↓
AI model/API endpoint
↓
Backend converts AI response
↓
Frontend displays result