# StrokeSense Backend Testing Notes

## Backend Local URL

http://localhost:3000

## Test 1: Health Check

Command:

curl http://localhost:3000/api/health

Expected result:

The backend should return a JSON response with:

- success: true
- status: healthy
- service: StrokeSense Backend
- timestamp

Purpose:

This test confirms that the backend server is running correctly.

## Test 2: Prediction Endpoint

Command:

curl -X POST http://localhost:3000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "age": 55,
    "hypertension": 1,
    "heart_disease": 0,
    "ever_married": "Yes",
    "work_type": "Private",
    "avg_glucose_level": 180,
    "bmi": 29.5,
    "smoking_status": "formerly smoked"
  }'

Expected result:

The backend should return a JSON response with:

- success: true
- message: Prediction created successfully.
- data.id
- data.createdAt
- data.input
- data.prediction.probabilityPercent
- data.prediction.riskLevel
- data.prediction.factors
- data.prediction.recommendations
- data.prediction.disclaimer
- data.modelSource
- data.modelVersion

Purpose:

This test confirms that the backend can receive user health data, validate the input, and return a mock stroke risk prediction.

## Test 3: Prediction History

Command:

curl http://localhost:3000/api/predictions

Expected result:

The backend should return a JSON response with:

- success: true
- count
- data

Purpose:

This test confirms that the backend stores prediction history temporarily during the current server session.

## Current Backend Status

The backend currently supports:

- Express.js REST API
- Health check endpoint
- Form field options endpoint
- Prediction endpoint
- Input validation
- Mock prediction logic while waiting for the AI model
- Temporary in-memory prediction history
- API contract documentation for frontend integration

## Deployment Note

Render deployment was attempted using the Free instance type.

Deployment could not be completed because Render requested billing/card verification before creating the web service.

For development, the backend can still be used locally by running:

npm install
npm run dev

The backend source code is available on GitHub and can be cloned by other team members for local testing.