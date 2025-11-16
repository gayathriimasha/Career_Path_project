import React, { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, TrendingUp, Award, Lightbulb } from "lucide-react";

interface CareerScore {
  career: string;
  A: number;
  B: number;
  S: number;
  S_final: number;
  ci?: number[];
}

interface CounterfactualSuggestion {
  career: string;
  current_score: number;
  suggestions: string[];
}

interface PredictionData {
  topCareer: {
    main: string;
    sub: string;
  };
  topN: CareerScore[];
  reasons: string[];
  lowConfidence: boolean;
  counterfactuals?: CounterfactualSuggestion[];
}

export default function ResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const assessmentId = searchParams.get("assessmentId");
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrediction = async () => {
      if (!assessmentId) {
        setError("Assessment ID not provided in URL.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/ml/predict", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ assessmentId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch prediction.");
        }

        const result = await response.json();
        if (result.success && result.data) {
          setPrediction(result.data);
        } else {
          setError("Invalid response from prediction service.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
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

  if (!prediction) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-2xl bg-black/30 border border-gray-800">
          <h2 className="text-2xl font-['Questrial'] mb-4">No Results</h2>
          <p className="text-gray-400 font-['Poppins'] mb-6">No prediction data available.</p>
          <Link to="/questionnaire">
            <button className="w-full px-6 py-3 rounded-xl bg-white text-black font-['Poppins'] hover:bg-gray-200 transition-all duration-200">
              Start New Assessment
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const { topCareer, topN, reasons, lowConfidence, counterfactuals } = prediction;

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
            <Lightbulb size={24} className="text-[#ABE6C4] flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-['Questrial'] text-lg mb-2">Important: This is Guidance, Not Destiny</h3>
              <p className="text-sm text-gray-300 font-['Poppins'] leading-relaxed">
                These results are <strong className="text-white">one perspective</strong> based on your current responses, not a definitive answer about your future.
                Career success depends on <strong className="text-white">passion, effort, and continuous learning</strong> — not just initial scores.
                Many people thrive in careers they weren't "predicted" for. <strong className="text-white">Explore freely</strong> and don't let these results limit your ambitions.
                Consider consulting with career counselors and professionals for personalized advice.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Winner Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
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
                <h1 className="text-4xl font-['Questrial'] mb-2">
                  {topCareer.main}
                </h1>
                <p className="text-xl text-gray-400 font-['Poppins']">
                  {topCareer.sub}
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700">
                <TrendingUp size={16} className={lowConfidence ? "text-gray-400" : "text-[#ABE6C4]"} />
                <span className="text-sm font-['Poppins']">
                  {lowConfidence ? "Moderate" : "High"} Confidence
                </span>
              </div>
            </div>

            {/* A/B/S Scores */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-[#ABE6C4]/30 transition-colors duration-200">
                <div className="text-3xl font-bold text-[#ABE6C4] font-['Questrial']">
                  {topN[0]?.A.toFixed(0)}
                </div>
                <div className="text-xs text-gray-400 font-['Poppins'] mt-2">Academic Match</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-[#ABE6C4]/30 transition-colors duration-200">
                <div className="text-3xl font-bold text-[#ABE6C4] font-['Questrial']">
                  {topN[0]?.B.toFixed(0)}
                </div>
                <div className="text-xs text-gray-400 font-['Poppins'] mt-2">Behavioral Match</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-[#ABE6C4]/20 to-transparent border border-[#ABE6C4]/40 shadow-lg shadow-[#ABE6C4]/10">
                <div className="text-3xl font-bold text-white font-['Questrial']">
                  {topN[0]?.S_final.toFixed(0)}
                </div>
                <div className="text-xs text-gray-300 font-['Poppins'] mt-2">Overall Score</div>
              </div>
            </div>

            {topN[0]?.ci && (
              <div className="text-xs text-gray-500 font-['Poppins'] text-center">
                95% Confidence interval: {topN[0].ci[0].toFixed(0)}–{topN[0].ci[1].toFixed(0)}
              </div>
            )}
          </div>
        </motion.div>

        {/* Why Paragraph */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-6 rounded-2xl bg-black/30 border border-gray-800 mb-8"
        >
          <h2 className="text-2xl font-['Questrial'] mb-4">Why This Match?</h2>
          <p className="text-gray-300 font-['Poppins'] leading-relaxed">
            {reasons.length > 0
              ? reasons.join(". ") + "."
              : "Your profile aligns well with this career path based on your responses."}
          </p>
        </motion.div>

        {/* Counterfactual Explanations - How to improve alignment with other careers */}
        {counterfactuals && counterfactuals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-6 rounded-2xl bg-black/30 border border-gray-800 mb-8"
          >
            <h2 className="text-2xl font-['Questrial'] mb-2">Interested in Other Careers?</h2>
            <p className="text-sm text-gray-400 font-['Poppins'] mb-6">
              Here's what you could focus on to strengthen your profile for alternative career paths:
            </p>
            <div className="space-y-4">
              {counterfactuals.map((cf, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-['Questrial'] text-lg">{cf.career}</h4>
                    <span className="text-sm text-gray-500 font-['Poppins']">
                      Current: {cf.current_score}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {cf.suggestions.map((suggestion, sIdx) => (
                      <li key={sIdx} className="text-sm text-gray-300 font-['Poppins'] flex items-start gap-3">
                        <span className="text-[#ABE6C4] mt-0.5 flex-shrink-0">→</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Top-N Careers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="p-6 rounded-2xl bg-black/30 border border-gray-800 mb-8"
        >
          <h2 className="text-2xl font-['Questrial'] mb-6">Top Career Matches</h2>
          <div className="space-y-4">
            {topN.slice(0, 5).map((career, idx) => {
              const isTop = idx === 0;
              const barWidth = (career.S_final / topN[0].S_final) * 100;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  className={`p-4 rounded-xl border transition-all duration-200 ${
                    isTop
                      ? "bg-[#ABE6C4]/10 border-[#ABE6C4]/30"
                      : "bg-gray-900/50 border-gray-800 hover:border-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-['Poppins'] font-medium ${isTop ? "text-[#ABE6C4]" : "text-gray-500"}`}>
                        #{idx + 1}
                      </span>
                      <span className="font-['Questrial'] text-lg">{career.career}</span>
                    </div>
                    <span className={`text-sm font-bold font-['Poppins'] ${isTop ? "text-[#ABE6C4]" : "text-gray-400"}`}>
                      {career.S_final.toFixed(1)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden mb-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                      className={`h-full rounded-full ${isTop ? "bg-[#ABE6C4]" : "bg-gray-600"}`}
                    ></motion.div>
                  </div>
                  <div className="flex gap-4 text-xs text-gray-500 font-['Poppins']">
                    <span>Academic: {career.A.toFixed(0)}</span>
                    <span>Behavioral: {career.B.toFixed(0)}</span>
                    <span>Combined: {career.S.toFixed(0)}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Low Confidence Notice */}
        {lowConfidence && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 rounded-2xl bg-gray-900/30 border border-gray-700 mb-8"
          >
            <div className="flex items-start gap-3">
              <div className="text-gray-400">ℹ️</div>
              <div>
                <h3 className="font-['Questrial'] text-lg mb-1">Multiple Strong Matches</h3>
                <p className="text-sm text-gray-400 font-['Poppins']">
                  Your profile shows alignment with several career paths. Consider exploring
                  the top alternatives listed above to find the best fit for your goals and
                  interests.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Growth Mindset & Exploration Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="p-6 rounded-2xl bg-black/30 border border-gray-800 mb-8"
        >
          <h2 className="text-2xl font-['Questrial'] mb-4">Remember: Skills Are Learnable 🌱</h2>
          <div className="space-y-4 text-sm text-gray-300 font-['Poppins']">
            <p className="leading-relaxed">
              <strong className="text-white">Don't see your dream career ranked highly?</strong> That's okay! Research shows that:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Most career-relevant skills can be learned with dedicated practice</li>
              <li>Passion and persistence often matter more than initial aptitude</li>
              <li>Many successful professionals started with lower scores in their field</li>
              <li>Career paths are rarely linear — people change careers 5-7 times on average</li>
            </ul>
            <p className="leading-relaxed pt-2">
              <strong className="text-white">Next Steps:</strong> Research the career that excites you most, talk to professionals in that field,
              take online courses, and gain practical experience. Your future is shaped by your choices and effort,
              not by today's assessment scores.
            </p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="flex flex-wrap gap-4 justify-center mt-12"
        >
          <button
            onClick={() => navigate('/questionnaire')}
            className="px-6 py-3 rounded-xl bg-gray-800 text-white font-['Poppins'] hover:bg-gray-700 transition-all duration-200 border border-gray-700 min-w-[180px]"
          >
            Retake Assessment
          </button>
          <button
            onClick={() => navigate(`/roadmap?career=${encodeURIComponent(topCareer.main)}&sub=${encodeURIComponent(topCareer.sub)}&assessmentId=${assessmentId}`)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#ABE6C4] to-[#7CC9A9] text-black font-['Poppins'] font-medium hover:shadow-lg hover:shadow-[#ABE6C4]/20 transition-all duration-200 min-w-[180px]"
          >
            View Skill Roadmap
          </button>
          <a
            href="https://www.mynextmove.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="px-6 py-3 rounded-xl bg-gray-800 text-white font-['Poppins'] hover:bg-gray-700 transition-all duration-200 border border-gray-700 min-w-[180px]">
              Explore All Careers
            </button>
          </a>
        </motion.div>

        {/* Data Privacy & Ethics Notice */}
        <div className="mt-12 text-center text-xs text-gray-500 font-['Poppins']">
          <p>
            Your responses are used only to generate recommendations. We do not share or sell your data.
            Model accuracy: ~82% for main careers. Results may contain biases from training data.
          </p>
        </div>
      </div>
    </div>
  );
}
