/**
 * Maps assessment answers to ML model features
 * This bridges the 25-question assessment format to the ML pipeline features
 */

// Helper function to convert score range strings to numeric values
function scoreRangeToNumeric(scoreRange) {
  const scoreMapping = {
    "0 – 35": 17.5,    // Use midpoint of range
    "35 – 55": 45,
    "55 – 75": 65, 
    "75 – 100": 87.5
  };
  return scoreMapping[scoreRange] || 0;
}

// Helper function to convert study hours to numeric
function studyHoursToNumeric(hoursRange) {
  const hourMapping = {
    "0 – 3": 1.5,
    "3 – 6": 4.5,
    "6 – 10": 8,
    "10 – 15": 12.5
  };
  return hourMapping[hoursRange] || 0;
}

// Helper function to extract behavioral features from questions 4-11
function extractBehavioralFeatures(answers) {
  let studyHours = 0;
  let extracurricular = 0;
  let leadership = 0;
  
  answers.forEach(answer => {
    if (answer.questionId >= 4 && answer.questionId <= 11) {
      const value = answer.value.toLowerCase();
      
      // Questions about problem-solving, organization suggest higher study commitment
      if (value.includes('step-by-step') || value.includes('organize') || value.includes('plan')) {
        studyHours += 2; // Boost study hours for methodical approaches
      }
      
      // Leadership indicators
      if (value.includes('lead') || value.includes('assign roles') || value.includes('manage')) {
        leadership += 1;
      }
      
      // Creative/social activities suggest extracurricular involvement
      if (value.includes('design') || value.includes('perform') || value.includes('create') || 
          value.includes('help') || value.includes('motivate')) {
        extracurricular = 1;
      }
    }
  });
  
  return { studyHours, extracurricular, leadership };
}

/**
 * Main feature mapping function
 * @param {Object} assessment - Assessment document from MongoDB
 * @returns {Object} Feature object for ML model
 */
function mapAssessmentToFeatures(assessment) {
  const features = {};
  const answers = assessment.answers;
  
  // Map academic scores (Q12-19)
  answers.forEach(answer => {
    switch (answer.questionId) {
      case 12: // Mathematics
        features.math_score = scoreRangeToNumeric(answer.value);
        break;
      case 13: // Physics  
        features.physics_score = scoreRangeToNumeric(answer.value);
        break;
      case 14: // Biology
        features.biology_score = scoreRangeToNumeric(answer.value);
        break;
      case 15: // Chemistry
        features.chemistry_score = scoreRangeToNumeric(answer.value);
        break;
      case 16: // Business - map to economics
        features.economics_score = scoreRangeToNumeric(answer.value);
        break;
      case 17: // Economics
        features.economics_score = (features.economics_score || 0 + scoreRangeToNumeric(answer.value)) / 2;
        break;
      case 18: // Arts
        features.english_score = scoreRangeToNumeric(answer.value); // Creative subjects
        break;
      case 19: // Psychology - map to biology/social sciences
        features.history_score = scoreRangeToNumeric(answer.value);
        break;
      case 20: // Daily study hours
        features.daily_study_hours = studyHoursToNumeric(answer.value);
        break;
      case 21: // Weekly self-study hours
        features.weekly_self_study_hours = studyHoursToNumeric(answer.value);
        break;
      case 22: // Extra classes/tutoring
        features.extra_classes = answer.value === "Yes" ? 1 : 0;
        break;
      case 23: // Extracurricular activities
        features.extracurricular_activities = answer.value === "Yes" ? 1 : 0;
        break;
    }
  });
  
  // Fill missing academic scores with reasonable defaults
  features.math_score = features.math_score || 50;
  features.physics_score = features.physics_score || 50;
  features.chemistry_score = features.chemistry_score || 50;
  features.biology_score = features.biology_score || 50;
  features.english_score = features.english_score || 50;
  features.history_score = features.history_score || 50;
  features.geography_score = features.history_score || 50; // Use history as proxy
  features.economics_score = features.economics_score || 50;
  
  // Extract behavioral insights from Q4-11
  const behavioral = extractBehavioralFeatures(answers);
  
  // Derive missing behavioral features
  features.weekly_self_study_hours = features.weekly_self_study_hours || (behavioral.studyHours + 10);
  features.extracurricular_activities = features.extracurricular_activities !== undefined ? 
    features.extracurricular_activities : behavioral.extracurricular;
  
  // Calculate absence days (inverse correlation with study commitment)
  const studyCommitment = (features.weekly_self_study_hours + (features.extra_classes * 5)) / 20;
  features.absence_days = Math.max(0, 15 - Math.round(studyCommitment * 10));
  
  // Part-time job (assume lower for high academic achievers)
  const academicAvg = (features.math_score + features.physics_score + features.chemistry_score + 
                      features.biology_score) / 4;
  features.part_time_job = academicAvg > 75 ? 0 : 1;
  
  // Ensure all required features are present with reasonable defaults
  const requiredFeatures = [
    'math_score', 'physics_score', 'chemistry_score', 'biology_score',
    'english_score', 'history_score', 'geography_score',
    'weekly_self_study_hours', 'absence_days', 
    'extracurricular_activities', 'part_time_job'
  ];
  
  requiredFeatures.forEach(feature => {
    if (features[feature] === undefined || features[feature] === null) {
      if (feature.includes('score')) {
        features[feature] = 50; // Neutral academic score
      } else if (feature === 'weekly_self_study_hours') {
        features[feature] = 15; // Moderate study hours
      } else if (feature === 'absence_days') {
        features[feature] = 5; // Moderate absences
      } else {
        features[feature] = 0; // Binary features default to 0
      }
    }
  });
  
  return features;
}

module.exports = {
  mapAssessmentToFeatures,
  scoreRangeToNumeric,
  studyHoursToNumeric
};