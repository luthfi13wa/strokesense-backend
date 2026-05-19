# StrokeSense Backend API Contract

Backend owner: Luthfi Wiradhika Ananta
Frontend owner: Vincentius Aaron

This backend provides REST API endpoints for the StrokeSense web application.

## Local Base URL

http://localhost:3000

## Main Endpoint for Frontend

POST /api/predict

Full URL:

http://localhost:3000/api/predict

## Request Body Example

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

## Successful Response

The backend will return:

- success
- message
- data
- prediction probability percentage
- risk level
- risk factors
- recommendations
- medical disclaimer

## Frontend Fetch Example

const response = await fetch("http://localhost:3000/api/predict", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    age: 55,
    hypertension: 1,
    heart_disease: 0,
    ever_married: "Yes",
    work_type: "Private",
    avg_glucose_level: 180,
    bmi: 29.5,
    smoking_status: "formerly smoked"
  })
});

const result = await response.json();
console.log(result);

## Available Endpoints

GET    /api/health
GET    /api/fields
POST   /api/predict
GET    /api/predictions
GET    /api/predictions/:id
DELETE /api/predictions/:id

## Notes

The current prediction result is still mock data because the AI Engineer team is not ready yet.

When the AI endpoint is ready, the backend only needs to update the AI_API_URL value in the .env file.

The frontend should call the backend, not the AI model directly.