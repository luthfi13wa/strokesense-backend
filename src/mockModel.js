function getRiskLevel(percentage) {
  if (percentage >= 70) return "High";
  if (percentage >= 35) return "Medium";
  return "Low";
}

function roundToTwoDecimals(number) {
  return Math.round(number * 100) / 100;
}

export function calculateMockStrokeRisk(input) {
  let score = 0;
  const factors = [];

  const age = Number(input.age);
  const glucose = Number(input.avg_glucose_level);
  const bmi = Number(input.bmi);
  const hypertension = Number(input.hypertension);
  const heartDisease = Number(input.heart_disease);

  if (age >= 65) {
    score += 28;
    factors.push("Age is 65 or above.");
  } else if (age >= 45) {
    score += 16;
    factors.push("Age is 45 or above.");
  } else {
    score += 5;
  }

  if (hypertension === 1) {
    score += 18;
    factors.push("Hypertension is recorded.");
  }

  if (heartDisease === 1) {
    score += 18;
    factors.push("Heart disease history is recorded.");
  }

  if (glucose >= 200) {
    score += 18;
    factors.push("Average glucose level is very high.");
  } else if (glucose >= 140) {
    score += 10;
    factors.push("Average glucose level is elevated.");
  } else {
    score += 3;
  }

  if (bmi >= 35) {
    score += 10;
    factors.push("BMI is in a high range.");
  } else if (bmi >= 25) {
    score += 6;
    factors.push("BMI is above normal range.");
  } else {
    score += 2;
  }

  if (input.smoking_status === "smokes") {
    score += 8;
    factors.push("Current smoking status is recorded.");
  } else if (input.smoking_status === "formerly smoked") {
    score += 5;
    factors.push("Former smoking status is recorded.");
  }

  if (input.work_type === "Self-employed") {
    score += 2;
  }

  const percentage = roundToTwoDecimals(Math.min(Math.max(score, 3), 95));
  const riskLevel = getRiskLevel(percentage);

  const recommendations = [
    "This result is only an early screening estimate, not a medical diagnosis.",
    "Users should consult a doctor or healthcare professional for proper medical evaluation.",
    "Maintain a healthy lifestyle, monitor blood pressure, and check glucose levels regularly."
  ];

  if (riskLevel === "High") {
    recommendations.unshift("The user should be encouraged to seek professional medical advice soon.");
  }

  if (riskLevel === "Medium") {
    recommendations.unshift("The user should monitor risk factors and consider a health checkup.");
  }

  if (riskLevel === "Low") {
    recommendations.unshift("The user appears to have lower risk based on the submitted data, but regular health checks are still recommended.");
  }

  return {
    probabilityPercent: percentage,
    riskLevel,
    factors,
    recommendations,
    disclaimer: "This is a mock backend prediction while waiting for the real AI model. It must not be used as a medical diagnosis."
  };
}