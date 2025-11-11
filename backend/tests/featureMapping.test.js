const { mapAssessmentToFeatures, scoreRangeToNumeric, studyHoursToNumeric } = require('../mlbridge/featureMapping');

// Simple test runner - since we don't want to add Jest as a dependency
function runTests() {
  console.log('Starting feature mapping tests...\n');

  // Test 1: Score range conversion
  console.log('Test 1: Score range conversion');
  const testScoreMapping = {
    "0 – 35": 17.5,
    "35 – 55": 45,
    "55 – 75": 65,
    "75 – 100": 87.5
  };
  
  for (const [range, expected] of Object.entries(testScoreMapping)) {
    const result = scoreRangeToNumeric(range);
    console.log(`  ${range} -> ${result} (expected: ${expected}) ${result === expected ? '✓' : '✗'}`);
  }

  // Test 2: Study hours conversion
  console.log('\nTest 2: Study hours conversion');
  const testHourMapping = {
    "0 – 3": 1.5,
    "3 – 6": 4.5,
    "6 – 10": 8,
    "10 – 15": 12.5
  };
  
  for (const [range, expected] of Object.entries(testHourMapping)) {
    const result = studyHoursToNumeric(range);
    console.log(`  ${range} -> ${result} (expected: ${expected}) ${result === expected ? '✓' : '✗'}`);
  }

  // Test 3: Full assessment mapping
  console.log('\nTest 3: Full assessment mapping');
  const mockAssessment = {
    userId: "test-user",
    userName: "Test User",
    answers: [
      { questionId: 12, value: "75 – 100" },    // Math
      { questionId: 13, value: "55 – 75" },     // Physics
      { questionId: 14, value: "35 – 55" },     // Biology
      { questionId: 15, value: "75 – 100" },    // Chemistry
      { questionId: 16, value: "55 – 75" },     // Business
      { questionId: 17, value: "35 – 55" },     // Economics
      { questionId: 18, value: "75 – 100" },    // Arts
      { questionId: 19, value: "55 – 75" },     // Psychology
      { questionId: 20, value: "3 – 6" },       // Daily study hours
      { questionId: 21, value: "6 – 10" },      // Weekly self-study
      { questionId: 22, value: "Yes" },         // Extra classes
      { questionId: 23, value: "Yes" },         // Extracurricular
      { questionId: 4, value: "Try to solve it step-by-step using logic" },
      { questionId: 5, value: "Plan how the campaign will be organized" },
      { questionId: 6, value: "Assign roles and lead meetings" }
    ]
  };

  const features = mapAssessmentToFeatures(mockAssessment);
  
  console.log('  Generated features:');
  const expectedKeys = [
    'math_score', 'physics_score', 'chemistry_score', 'biology_score',
    'english_score', 'history_score', 'geography_score',
    'weekly_self_study_hours', 'absence_days',
    'extracurricular_activities', 'part_time_job'
  ];
  
  let allKeysPresent = true;
  for (const key of expectedKeys) {
    const value = features[key];
    const isPresent = value !== undefined && value !== null;
    console.log(`    ${key}: ${value} ${isPresent ? '✓' : '✗'}`);
    if (!isPresent) allKeysPresent = false;
  }
  
  console.log(`  All required features present: ${allKeysPresent ? '✓' : '✗'}`);

  // Test 4: Feature value ranges
  console.log('\nTest 4: Feature value ranges');
  const validRanges = {
    math_score: [0, 100],
    physics_score: [0, 100],
    chemistry_score: [0, 100],
    biology_score: [0, 100],
    english_score: [0, 100],
    history_score: [0, 100],
    geography_score: [0, 100],
    weekly_self_study_hours: [0, 60],
    absence_days: [0, 30],
    extracurricular_activities: [0, 1],
    part_time_job: [0, 1]
  };
  
  let allInRange = true;
  for (const [key, [min, max]] of Object.entries(validRanges)) {
    const value = features[key];
    const inRange = value >= min && value <= max;
    if (!inRange) {
      console.log(`    ${key}: ${value} out of range [${min}, ${max}] ✗`);
      allInRange = false;
    }
  }
  
  if (allInRange) {
    console.log(`  All features in valid ranges ✓`);
  }

  // Test 5: Edge case - missing academic scores
  console.log('\nTest 5: Missing academic scores handling');
  const minimalAssessment = {
    userId: "test-user-minimal",
    answers: [
      { questionId: 21, value: "3 – 6" },  // Only weekly study hours
      { questionId: 23, value: "No" }      // No extracurricular
    ]
  };
  
  const minimalFeatures = mapAssessmentToFeatures(minimalAssessment);
  const hasDefaults = expectedKeys.every(key => 
    minimalFeatures[key] !== undefined && minimalFeatures[key] !== null
  );
  
  console.log(`  Handles missing data with defaults: ${hasDefaults ? '✓' : '✗'}`);
  console.log(`  Sample defaults - math_score: ${minimalFeatures.math_score}, extracurricular_activities: ${minimalFeatures.extracurricular_activities}`);

  console.log('\n' + '='.repeat(50));
  console.log('Feature mapping tests completed!');
  console.log('='.repeat(50));
}

// Run tests if called directly
if (require.main === module) {
  runTests();
}

module.exports = { runTests };