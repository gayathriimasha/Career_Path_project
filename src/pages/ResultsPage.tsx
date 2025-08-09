import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom"; // Import Link and useSearchParams from react-router-dom
// Assuming these components are available from your UI library (e.g., shadcn/ui)
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button"
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

export default function ResultsPage() {
  const [searchParams] = useSearchParams();
  const userEmail = searchParams.get("email");
  const [assessment, setAssessment] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);
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
        const response = await fetch(`http://localhost:5000/api/assessments/user/${userEmail}`);
        if (!response.ok) {
          throw new Error("Failed to fetch assessment results.");
        }
        const data = await response.json();
        // Assuming the API returns an array of assessments, take the latest one
        if (data && data.length > 0) {
          setAssessment(data[0]); // Get the most recent assessment
        } else {
          setError("No assessment found for this user.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [userEmail]);

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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Assessment Results for {assessment.userName}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-blue-400">Academic Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {Object.entries(assessment.scores).map(([subject, score]) => (
                  <li key={subject} className="flex justify-between items-center">
                    <span className="capitalize">{subject}:</span>
                    <span className="font-medium text-lg">{score}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-green-400">Personality Traits</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {Object.entries(assessment.traits).map(([trait, value]) => (
                  <li key={trait} className="flex justify-between items-center">
                    <span className="capitalize">{trait.replace(/([A-Z])/g, " $1").trim()}:</span>
                    <span className="font-medium text-lg">{value}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-800 border-gray-700 text-white mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-purple-400">Raw Answers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
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
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4 mt-8">
          <Link to="/questionnaire"> {/* Use 'to' prop for React Router Link */}
            <Button className="bg-blue-600 hover:bg-blue-700">Take New Assessment</Button>
          </Link>
          {/* Add more navigation buttons as needed, e.g., to a dashboard */}
        </div>
      </div>
    </div>
  );
}