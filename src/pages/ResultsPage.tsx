import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom"; // Import Link and useSearchParams from react-router-dom
// Assuming these components are available from your UI library (e.g., shadcn/ui)
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Progress } from "../components/ui/progress"
import { questionsData } from "../data/questions"

interface Answer {
  questionId: number;
  value: string | string[];
}

interface Scores {
  mathematics: number;
  physics: number;
  biology: number;
  chemistry: number;
  business: number;
  economics: number;
  arts: number;
  psychology: number;
}

interface Traits {
  problemSolving: number;
  leadership: number;
  creativity: number;
  analytical: number;
  social: number;
}

interface AssessmentResult {
  _id: string;
  userId: string;
  userEmail: string;
  userName: string;
  answers: Answer[];
  scores: Scores;
  traits: Traits;
  completedAt: string;
  createdAt: string;
  updatedAt: string;
}

interface CareerScore {
  career: string;
  A: number;
  B: number;
  S: number;
  ci?: [number, number];
}

interface MLPrediction {
  top_career: string;
  topN: CareerScore[];
  low_confidence: boolean;
  reasons: string[];
  predictionId?: string;
  timestamp?: string;
}

export default function ResultsPage() {
  const [searchParams] = useSearchParams();
  const userEmail = searchParams.get("email");
  const assessmentId = searchParams.get("assessmentId");
  const [assessment, setAssessment] = useState<AssessmentResult | null>(null);
  const [mlPrediction, setMlPrediction] = useState<MLPrediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [mlLoading, setMlLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssessment = async () => {
      if (!userEmail) {
        setError("User email not provided in URL.");
        setLoading(false);
        return;
      }

      try {
        // Ensure your backend is running on http://localhost:5000
        let response;
        let data;
        
        if (assessmentId) {
          // Fetch specific assessment by ID
          response = await fetch(`http://localhost:5000/api/assessments/${assessmentId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch assessment results.");
          }
          data = await response.json();
          setAssessment(data);
        } else {
          // Fetch latest assessment by user email
          response = await fetch(`http://localhost:5000/api/assessments/user/${userEmail}`);
          if (!response.ok) {
            throw new Error("Failed to fetch assessment results.");
          }
          data = await response.json();
          if (data && data.length > 0) {
            setAssessment(data[0]); // Get the most recent assessment
          } else {
            setError("No assessment found for this user.");
            setLoading(false);
            return;
          }
        }
        
        // After successfully fetching assessment, get ML predictions
        await fetchMLPrediction(data._id || data[0]._id);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    const fetchMLPrediction = async (assessmentId: string) => {
      try {
        setMlLoading(true);
        const response = await fetch('http://localhost:5000/api/ml/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ assessmentId }),
        });
        
        if (!response.ok) {
          throw new Error("Failed to get career predictions.");
        }
        
        const predictionData = await response.json();
        setMlPrediction(predictionData);
        
      } catch (err) {
        console.error("ML prediction error:", err);
        // Don't fail the whole page if ML prediction fails
        setMlPrediction(null);
      } finally {
        setMlLoading(false);
      }
    };

    fetchAssessment();
  }, [userEmail, assessmentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-white flex items-center justify-center">
        <p>Loading results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-red-400 mb-4">Error</h1>
        <p className="text-lg text-gray-300 mb-6">{error}</p>
        <Link to="/"> {/* Use 'to' prop for React Router Link */}
          <Button className="bg-blue-600 hover:bg-blue-700">Go to Home</Button>
        </Link>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-yellow-400 mb-4">No Results Found</h1>
        <p className="text-lg text-gray-300 mb-6">It seems no assessment has been completed for this user.</p>
        <Link to="/questionnaire"> {/* Use 'to' prop for React Router Link */}
          <Button className="bg-blue-600 hover:bg-blue-700">Start New Assessment</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white px-[50px] py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Assessment Results for {assessment.userName}</h1>

        {/* Career Recommendations Section */}
        {mlPrediction && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-400">🎯 Career Recommendations</h2>
            
            {/* Top Career Winner Card */}
            <Card className="bg-gradient-to-r from-blue-900 to-purple-900 border-blue-500 text-white mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-yellow-300">
                    🏆 Best Match: {mlPrediction.top_career}
                  </CardTitle>
                  {mlPrediction.low_confidence && (
                    <Badge variant="outline" className="border-yellow-500 text-yellow-300">
                      Review Recommended
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-300 mb-1">Academic Match</p>
                    <div className="text-2xl font-bold text-green-400">{mlPrediction.topN[0].A.toFixed(1)}%</div>
                    <Progress value={mlPrediction.topN[0].A} className="w-full mt-2" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-300 mb-1">Behavioral Match</p>
                    <div className="text-2xl font-bold text-blue-400">{mlPrediction.topN[0].B.toFixed(1)}%</div>
                    <Progress value={mlPrediction.topN[0].B} className="w-full mt-2" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-300 mb-1">Overall Score</p>
                    <div className="text-3xl font-bold text-yellow-300">{mlPrediction.topN[0].S.toFixed(1)}%</div>
                    <Progress value={mlPrediction.topN[0].S} className="w-full mt-2" />
                  </div>
                </div>
                
                {/* Reasons */}
                <div className="mt-4">
                  <h4 className="font-semibold mb-2 text-gray-200">Why this career fits you:</h4>
                  <ul className="space-y-1">
                    {mlPrediction.reasons.map((reason, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-yellow-300 mr-2">•</span>
                        <span className="text-gray-200">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Top 5 Careers List */}
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-green-400">🎯 Top Career Matches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mlPrediction.topN.map((career, index) => (
                    <div key={career.career} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                        </div>
                        <div>
                          <h4 className="font-semibold">{career.career}</h4>
                          <div className="text-sm text-gray-300">
                            Academic: {career.A.toFixed(1)}% • Behavioral: {career.B.toFixed(1)}%
                            {career.ci && (
                              <span className="ml-2 text-xs">
                                (CI: {career.ci[0].toFixed(1)}%-{career.ci[1].toFixed(1)}%)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-blue-400">{career.S.toFixed(1)}%</div>
                        <Progress value={career.S} className="w-20 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {mlLoading && (
          <Card className="bg-gray-800 border-gray-700 text-white mb-8">
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-3"></div>
                <p className="text-gray-300">Analyzing your career fit...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Traditional Scores Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-blue-400">📚 Academic Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {Object.entries(assessment.scores).map(([subject, score]) => (
                  <li key={subject} className="flex justify-between items-center">
                    <span className="capitalize">{subject}:</span>
                    <Badge variant="outline" className="text-lg font-medium">
                      {score}/4
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-green-400">🧠 Personality Traits</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {Object.entries(assessment.traits).map(([trait, value]) => (
                  <li key={trait} className="flex justify-between items-center">
                    <span className="capitalize">{trait.replace(/([A-Z])/g, " $1").trim()}:</span>
                    <Badge variant="outline" className="text-lg font-medium">
                      {value}
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <Link to="/questionnaire">
            <Button className="bg-blue-600 hover:bg-blue-700">Take New Assessment</Button>
          </Link>
          <Button 
            variant="outline" 
            className="border-gray-600 text-white hover:bg-gray-700"
            disabled
          >
            View Skill Roadmap (Coming Soon)
          </Button>
        </div>

        {/* Raw Answers Section (Collapsible) */}
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-purple-400">📋 Assessment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <details className="group">
              <summary className="cursor-pointer text-gray-300 hover:text-white transition-colors">
                View All Answers
              </summary>
              <div className="mt-4 max-h-96 overflow-y-auto space-y-4 pr-2">
                {assessment.answers.map((answer, index) => {
                  const question = questionsData.find((q) => q.id === answer.questionId);
                  return (
                    <div key={index} className="border-b border-gray-700 pb-3 last:border-b-0">
                      <p className="font-medium text-gray-300">
                        Q{answer.questionId}: {question?.text || "Unknown Question"}
                      </p>
                      <p className="text-gray-400 ml-4">
                        A: {Array.isArray(answer.value) ? answer.value.join(", ") : String(answer.value)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </details>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}