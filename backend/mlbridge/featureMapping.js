/**
 * Feature mapping module: Convert Assessment document to ML service payload
 */

const BIN_MAPPING = {
  "0 – 35": "0–35",
  "35 – 55": "35–55",
  "55 – 75": "55–75",
  "75 – 100": "75–100"
};

const STUDY_HOURS_MAPPING = {
  "0-3 hours": "0–3",
  "3-6 hours": "3–6",
  "6-10 hours": "6–10",
  "10-15 hours": "10–15",
  "0-3": "0–3",
  "3-6": "3–6",
  "6-10": "6–10",
  "10-15": "10–15"
};

/**
 * Normalize bin strings to match ML service format
 */
function normalizeBin(binString) {
  if (!binString) return "35–55"; // Default neutral
  return BIN_MAPPING[binString] || binString;
}

/**
 * Normalize study hours to ML format
 */
function normalizeStudyHours(hoursString) {
  if (!hoursString) return "0–3";

  // Try direct mapping first
  if (STUDY_HOURS_MAPPING[hoursString]) {
    return STUDY_HOURS_MAPPING[hoursString];
  }

  // Extract numbers if format is different
  const match = hoursString.match(/(\d+)\s*[-–]\s*(\d+)/);
  if (match) {
    const low = parseInt(match[1]);
    const high = parseInt(match[2]);
    if (low === 0 && high <= 3) return "0–3";
    if (low === 3 && high <= 6) return "3–6";
    if (low === 6 && high <= 10) return "6–10";
    if (low === 10 && high <= 15) return "10–15";
  }

  return "0–3";
}

/**
 * Extract answer value by question ID
 */
function getAnswerValue(answers, questionId) {
  const answer = answers.find(a => a.questionId === questionId);
  return answer ? answer.value : null;
}

/**
 * Parse skills from Q25 (multi-select)
 */
function parseSkills(skillsAnswer) {
  const skillMapping = {
    'problem solving': 'skill_problem_solving',
    'problem-solving': 'skill_problem_solving',
    'teamwork': 'skill_teamwork',
    'growth mindset': 'skill_growth_mindset',
    'multitasking': 'skill_multitasking',
    'communication': 'skill_communication',
    'time management': 'skill_time_management',
    'digital literacy': 'skill_digital_literacy',
    'leadership': 'skill_leadership',
    'critical thinking': 'skill_critical_thinking',
    'adaptability': 'skill_adaptability',
    'creativity': 'skill_creativity',
    'decision making': 'skill_decision_making'
  };

  const skills = {
    skill_problem_solving: 0,
    skill_teamwork: 0,
    skill_growth_mindset: 0,
    skill_multitasking: 0,
    skill_communication: 0,
    skill_time_management: 0,
    skill_digital_literacy: 0,
    skill_leadership: 0,
    skill_critical_thinking: 0,
    skill_adaptability: 0,
    skill_creativity: 0,
    skill_decision_making: 0
  };

  if (!skillsAnswer) return skills;

  // Handle array of skills
  const selectedSkills = Array.isArray(skillsAnswer) ? skillsAnswer : [skillsAnswer];

  selectedSkills.forEach(skill => {
    const normalized = skill.toLowerCase().trim();
    const mappedSkill = skillMapping[normalized];
    if (mappedSkill && skills.hasOwnProperty(mappedSkill)) {
      skills[mappedSkill] = 1;
    }
  });

  return skills;
}

/**
 * Derive computing score from digital literacy + study patterns
 * (Proxy when computing is not explicitly asked)
 */
function deriveComputingScore(skills, studyHoursBin, hasSelfStudy) {
  const hasDigitalLiteracy = skills.skill_digital_literacy === 1;
  const highStudy = ["6–10", "10–15"].includes(studyHoursBin);

  if (hasDigitalLiteracy && (highStudy || hasSelfStudy)) {
    return "55–75";
  } else if (hasDigitalLiteracy) {
    return "35–55";
  }

  return "35–55"; // Neutral default
}

/**
 * Main mapping function: Assessment -> ML Payload
 */
function mapAssessmentToFeatures(assessment) {
  const { answers } = assessment;

  if (!answers || !Array.isArray(answers)) {
    throw new Error("Invalid assessment: answers array missing");
  }

  // Extract answers by question ID
  const q4 = getAnswerValue(answers, 4) || "";
  const q5 = getAnswerValue(answers, 5) || "";
  const q6 = getAnswerValue(answers, 6) || "";
  const q7 = getAnswerValue(answers, 7) || "";
  const q8 = getAnswerValue(answers, 8) || "";
  const q9 = getAnswerValue(answers, 9) || "";
  const q10 = getAnswerValue(answers, 10) || "";
  const q11 = getAnswerValue(answers, 11) || "";

  // Academic scores (Q12-Q19)
  const mathBin = normalizeBin(getAnswerValue(answers, 12));
  const physicsBin = normalizeBin(getAnswerValue(answers, 13));
  const biologyBin = normalizeBin(getAnswerValue(answers, 14));
  const chemistryBin = normalizeBin(getAnswerValue(answers, 15));
  const businessBin = normalizeBin(getAnswerValue(answers, 16));
  const economicsBin = normalizeBin(getAnswerValue(answers, 17));
  const artsBin = normalizeBin(getAnswerValue(answers, 18));
  const psychologyBin = normalizeBin(getAnswerValue(answers, 19));

  // Study habits (Q20-Q23)
  const studyHoursPerDay = normalizeStudyHours(getAnswerValue(answers, 20));
  const selfStudyHoursPerWeek = normalizeStudyHours(getAnswerValue(answers, 21));
  const extraClasses = getAnswerValue(answers, 22) || "No";
  const extracurriculars = getAnswerValue(answers, 23) || "No";

  // Career intent (Q24)
  const careerIntentText = getAnswerValue(answers, 24) || "";

  // Skills (Q25)
  const skillsAnswer = getAnswerValue(answers, 25);
  const skills = parseSkills(skillsAnswer);

  // Derive computing score (proxy if not directly asked)
  const computingBin = deriveComputingScore(
    skills,
    studyHoursPerDay,
    selfStudyHoursPerWeek !== "0–3"
  );

  // Build ML payload
  const payload = {
    // Academic bins
    math_score_bin: mathBin,
    physics_score_bin: physicsBin,
    biology_score_bin: biologyBin,
    chemistry_score_bin: chemistryBin,
    business_score_bin: businessBin,
    economics_score_bin: economicsBin,
    arts_score_bin: artsBin,
    psychology_score_bin: psychologyBin,
    computing_score_bin: computingBin,

    // Study habits
    study_hours_per_day_bin: studyHoursPerDay,
    self_study_hours_per_week_bin: selfStudyHoursPerWeek,
    extra_classes: extraClasses,
    extracurriculars: extracurriculars,

    // Behavioral Q4-Q11
    q4_choice: q4,
    q5_choice: q5,
    q6_choice: q6,
    q7_choice: q7,
    q8_choice: q8,
    q9_choice: q9,
    q10_choice: q10,
    q11_choice: q11,

    // Skills (multi-hot)
    ...skills,

    // Optional text
    career_intent_text: careerIntentText
  };

  return payload;
}

/**
 * Helper: Convert bin string to numeric midpoint
 */
function binMidpoint(binString) {
  const midpoints = {
    "0–35": 17.5,
    "35–55": 45.0,
    "55–75": 65.0,
    "75–100": 87.5
  };
  return midpoints[binString] || 45.0;
}

module.exports = {
  mapAssessmentToFeatures,
  binMidpoint,
  normalizeBin,
  normalizeStudyHours
};
