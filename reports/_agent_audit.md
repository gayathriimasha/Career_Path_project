# Career Path Predictor Project Audit

## Folder Structure

### Backend (Node.js/Express)
- `/backend/`
  - `server.js` - Main Express server with MongoDB connection
  - `models/` - Mongoose schemas
    - `Assessment.js` - Assessment model with answers, scores, traits
    - `Question.js` - Question model 
    - `User.js` - User model
  - `routes/` - API endpoints
    - `assessments.js` - CRUD for assessments, score calculation
    - `auth.js` - Authentication routes
    - `questions.js` - Question management
  - `scripts/` - Utilities
    - `seedQuestions.js` - Database seeding

### Frontend (React/TypeScript)
- `/src/`
  - `pages/` - Route components
    - `ResultsPage.tsx` - Displays basic assessment results
    - `StartAssessment.tsx`, `Login.tsx`, etc.
  - `components/` - UI components
    - `Questionnaire.tsx` - Main assessment form
    - `ui/` - shadcn/ui component library (complete set)
  - `data/`
    - `questions.ts` - 25 questions data (behavioral Q4-11, academic Q12-19, study habits Q20-23, text/checkbox Q1-3,24-25)
  - `types/`
    - `question.ts` - TypeScript interfaces

## Existing API Endpoints
- `GET /api/questions` - Fetch questions
- `POST /api/assessments/submit` - Submit assessment with score calculation
- `GET /api/assessments/user/:userId` - Get user assessments
- `GET /api/assessments/:id` - Get specific assessment
- `GET /api/assessments/` - Get all assessments (paginated)
- `/api/auth/*` - Authentication routes

## Data Models

### Assessment Model
- Basic user info (userId, userEmail, userName)
- 25 question answers array
- Calculated scores: mathematics, physics, biology, chemistry, business, economics, arts, psychology
- Personality traits: problemSolving, leadership, creativity, analytical, social
- Timestamps

### Current Score Calculation
- Academic scores (Q12-19): Maps score ranges "0-35", "35-55", "55-75", "75-100" to values 1-4
- Traits (Q4-11): Simple keyword matching in answers for 5 trait categories
- No ML pipeline or career recommendations exist currently

## Questions Analysis
- Q1-3: Basic info (name, email, gender)
- Q4-11: Behavioral questions (8 multiple choice scenarios)
- Q12-19: Academic scores (8 subjects with 4-point scale)
- Q20-23: Study habits (hours/day, hours/week, tutoring, extracurriculars)
- Q24: Open text career aspiration
- Q25: Skills checklist (12 options)

## Technology Stack
- Frontend: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- Backend: Node.js + Express + MongoDB + Mongoose
- No existing ML/AI components

## Gaps/Assumptions for ML Pipeline
1. Need to map existing 25 questions to ML features
2. Missing study dataset - will use provided student-scores.csv
3. Need to create behavioral feature extraction from Q4-11, Q20-23, Q25
4. Academic features can map from Q12-19 scores
5. Career categorization needed (Q24 contains free text)
6. No current confidence scoring or ranking system
7. Results page shows only basic scores, needs career predictions integration

## Integration Points
- Assessment submission already calculates basic scores in `/backend/routes/assessments.js`
- Results page exists but only shows current basic scoring
- Can extend without breaking existing structure by adding new ML route
- Feature mapping can reuse existing `calculateScores` and `calculateTraits` functions