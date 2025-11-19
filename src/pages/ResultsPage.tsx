import React, { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, TrendingUp, Award, Lightbulb, ArrowRight } from "lucide-react";

interface CareerPrediction {
  career: string;
  confidence: number;
  subcareers: string[];
}

interface Assessment {
  _id: string;
  userId: string;
  userEmail: string;
  userName: string;
  answers: any[];
  scores: any;
  predictions: CareerPrediction[];
  mlMetadata: any;
  createdAt: string;
}

export default function ResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const assessmentId = searchParams.get("assessmentId");
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssessment = async () => {
      if (!assessmentId) {
        setError("Assessment ID not provided in URL.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/assessments/${assessmentId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch assessment results.");
        }

        const result = await response.json();
        setAssessment(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [assessmentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ABE6C4] mx-auto mb-4"></div>
          <p className="text-lg text-gray-400 font-['Poppins']">Analyzing your assessment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-2xl bg-black/30 border border-gray-800">
          <h2 className="text-2xl font-['Questrial'] mb-4 text-red-400">Error</h2>
          <p className="text-gray-400 font-['Poppins'] mb-6">{error}</p>
          <Link to="/">
            <button className="w-full px-6 py-3 rounded-xl bg-white text-black font-['Poppins'] hover:bg-gray-200 transition-all duration-200">
              Go to Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (!assessment || !assessment.predictions || assessment.predictions.length === 0) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-2xl bg-black/30 border border-gray-800">
          <h2 className="text-2xl font-['Questrial'] mb-4">No Results</h2>
          <p className="text-gray-400 font-['Poppins'] mb-6">No prediction data available.</p>
          <Link to="/start-assessment">
            <button className="w-full px-6 py-3 rounded-xl bg-white text-black font-['Poppins'] hover:bg-gray-200 transition-all duration-200">
              Start New Assessment
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const predictions = assessment.predictions;
  const topPrediction = predictions[0];

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Header with back button */}
      <div className="sticky top-0 z-50 bg-[#1a1a1a]/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-200 border border-gray-700"
          >
            <Home size={20} />
            <span className="text-sm font-['Poppins']">Back to Home</span>
          </button>
          <div className="flex items-center gap-2">
            <Award size={20} className="text-[#ABE6C4]" />
            <span className="text-sm text-gray-400 font-['Poppins']">Your Career Match</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Ethical Disclaimer Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 rounded-2xl bg-[#ABE6C4]/10 border border-[#ABE6C4]/20 mb-8"
        >
          <div className="flex items-start gap-3">
            <Lightbulb className="text-[#ABE6C4] flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-['Questrial'] text-lg mb-2">Important Note</h3>
              <p className="text-sm text-gray-300 font-['Poppins'] leading-relaxed">
                These results are AI-generated suggestions based on your responses. They should be used as guidance, not definitive career decisions. Your potential is not limited to these recommendations. Always consider your personal circumstances, goals, and consult with career counselors for personalized advice.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Top Career Match */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-8 rounded-2xl bg-gradient-to-br from-black/40 to-black/20 border border-gray-800 mb-8"
        >
          <div className="space-y-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-1 w-12 bg-[#ABE6C4] rounded-full"></div>
                  <span className="text-sm text-[#ABE6C4] font-['Poppins'] uppercase tracking-wide">Your Best Match</span>
                </div>
                <h1 className="text-5xl font-['Questrial'] mb-3">
                  {topPrediction.career}
                </h1>
                <p className="text-lg text-gray-400 font-['Poppins']">
                  {assessment.mlMetadata?.model_accuracy &&
                    `Predicted by our ${(assessment.mlMetadata.model_accuracy * 100).toFixed(1)}% accurate AI model`}
                </p>
              </div>
              <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-[#ABE6C4]/20 to-[#ABE6C4]/10 border border-[#ABE6C4]/30">
                <TrendingUp size={20} className="text-[#ABE6C4]" />
                <span className="text-lg font-['Poppins'] font-semibold text-white">
                  {(topPrediction.confidence * 100).toFixed(1)}% Match
                </span>
              </div>
            </div>

            {/* Confidence Bar */}
            <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${topPrediction.confidence * 100}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-[#ABE6C4] to-[#7CC9A9] rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Specialized Career Paths */}
        {topPrediction.subcareers && topPrediction.subcareers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-6 rounded-2xl bg-black/30 border border-gray-800 mb-8"
          >
            <h2 className="text-2xl font-['Questrial'] mb-4">Specialized Paths in {topPrediction.career}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topPrediction.subcareers.map((subcareer, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-[#ABE6C4]/30 transition-all duration-200 hover:scale-105"
                >
                  <p className="text-gray-300 font-['Poppins']">{subcareer}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Other Strong Matches */}
        {predictions.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-6 rounded-2xl bg-black/30 border border-gray-800 mb-8"
          >
            <h2 className="text-2xl font-['Questrial'] mb-6">Other Strong Matches</h2>
            <div className="space-y-4">
              {predictions.slice(1).map((prediction, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-['Questrial']">{prediction.career}</h3>
                    <span className="text-sm text-[#ABE6C4] font-['Poppins'] font-semibold">
                      {(prediction.confidence * 100).toFixed(1)}% Match
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden mb-4">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${prediction.confidence * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                      className="h-full bg-gradient-to-r from-gray-600 to-gray-500 rounded-full"
                    />
                  </div>
                  {prediction.subcareers && prediction.subcareers.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {prediction.subcareers.map((sub, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-xs px-3 py-1 rounded-full bg-gray-800 text-gray-400 font-['Poppins']"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="p-6 rounded-2xl bg-black/30 border border-gray-800 mb-8"
        >
          <h2 className="text-2xl font-['Questrial'] mb-4">Next Steps</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-[#ABE6C4] mt-1">→</span>
              <p className="text-gray-300 font-['Poppins']">
                Explore detailed career roadmaps to understand the skills, education, and experience needed for your top matches.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#ABE6C4] mt-1">→</span>
              <p className="text-gray-300 font-['Poppins']">
                Research job markets and opportunities in your recommended career fields.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#ABE6C4] mt-1">→</span>
              <p className="text-gray-300 font-['Poppins']">
                Connect with professionals in these fields to gain real-world insights and mentorship.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to={`/roadmap?career=${encodeURIComponent(topPrediction.career)}&assessmentId=${assessmentId}`}>
            <button className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-[#ABE6C4] to-[#7CC9A9] text-black font-['Poppins'] font-semibold hover:shadow-2xl hover:shadow-[#ABE6C4]/30 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
              <span>View Career Roadmap</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <Link to="/start-assessment">
            <button className="px-8 py-4 rounded-2xl bg-gray-800/50 border border-gray-700 text-white font-['Poppins'] font-semibold hover:bg-gray-700/50 transition-all duration-300">
              Retake Assessment
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
