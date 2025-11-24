import React, { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, TrendingUp, Award, Lightbulb, ArrowRight, Map, RefreshCw } from "lucide-react";

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

  // Function to determine which illustration to show based on career
  const getCareerIllustration = (careerName: string): string => {
    const career = careerName.toLowerCase();

    // Medical-related careers
    if (career.includes('medical') || career.includes('doctor') || career.includes('physician') ||
        career.includes('nurse') || career.includes('surgeon') || career.includes('healthcare') ||
        career.includes('hospital') || career.includes('clinical') || career.includes('pharmacist') ||
        career.includes('dentist') || career.includes('paramedic') || career.includes('therapist') ||
        career.includes('psychiatrist') || career.includes('radiologist')) {
      return '/assets/medical.png';
    }

    // IT-related careers
    if (career.includes('software') || career.includes('developer') || career.includes('programmer') ||
        career.includes('computer') || career.includes('technology') || career.includes('IT') ||
        career.includes('tech') || career.includes('web') || career.includes('app') ||
        career.includes('cyber') || career.includes('network') || career.includes('database') ||
        career.includes('systems') || career.includes('cloud') || career.includes('devops') ||
        career.includes('full stack') || career.includes('frontend') || career.includes('backend')) {
      return '/assets/IT.png';
    }

    // Social-related careers
    if (career.includes('social') || career.includes('counselor') || career.includes('psychologist') ||
        career.includes('social work') || career.includes('human resources') || career.includes('HR') ||
        career.includes('community') || career.includes('public service') || career.includes('welfare') ||
        career.includes('advocate') || career.includes('humanitarian') || career.includes('sociology') ||
        career.includes('case manager') || career.includes('youth worker')) {
      return '/assets/social.png';
    }

    // Science-related careers (pure research/science, not medical)
    if (career.includes('scientist') || career.includes('research') || career.includes('biology') ||
        career.includes('chemistry') || career.includes('physics') || career.includes('astronomy') ||
        career.includes('geologist') || career.includes('mathematician') || career.includes('statistician') ||
        career.includes('data scientist') || career.includes('analyst') || career.includes('laboratory') ||
        career.includes('biologist') || career.includes('chemist') || career.includes('physicist')) {
      return '/assets/science.png';
    }

    // Education-related careers
    if (career.includes('teacher') || career.includes('professor') || career.includes('education') ||
        career.includes('instructor') || career.includes('tutor') || career.includes('lecturer') ||
        career.includes('trainer') || career.includes('coach') || career.includes('educator') ||
        career.includes('academic') || career.includes('principal') || career.includes('dean')) {
      return '/assets/education.png';
    }

    // Agriculture-related careers
    if (career.includes('agriculture') || career.includes('farming') || career.includes('farm') ||
        career.includes('agri') || career.includes('horticulture') || career.includes('veterinary') ||
        career.includes('environmental') || career.includes('forestry') || career.includes('botanist') ||
        career.includes('agronomist') || career.includes('livestock') || career.includes('crop')) {
      return '/assets/agriculture.png';
    }

    // Business-related careers
    if (career.includes('business') || career.includes('management') || career.includes('finance') ||
        career.includes('accounting') || career.includes('entrepreneur') || career.includes('sales') ||
        career.includes('marketing') || career.includes('commerce') || career.includes('banker') ||
        career.includes('economist') || career.includes('consultant') || career.includes('analyst') ||
        career.includes('executive') || career.includes('manager') || career.includes('ceo') ||
        career.includes('cfo') || career.includes('operations') || career.includes('strategy')) {
      return '/assets/business.png';
    }

    // Architecture-related careers
    if (career.includes('architect') || career.includes('urban planning') || career.includes('civil') ||
        career.includes('construction') || career.includes('building design') || career.includes('structural') ||
        career.includes('landscape architect') || career.includes('interior design') || career.includes('planner')) {
      return '/assets/architecture.png';
    }

    // Creativity-related careers
    if (career.includes('artist') || career.includes('designer') || career.includes('creative') ||
        career.includes('writer') || career.includes('musician') || career.includes('actor') ||
        career.includes('photographer') || career.includes('graphic') ||
        career.includes('animator') || career.includes('illustrator') || career.includes('media') ||
        career.includes('advertising') || career.includes('content') ||
        career.includes('video') || career.includes('film') || career.includes('audio')) {
      return '/assets/creativity.png';
    }

    // Engineering (fallback to IT if tech-related, otherwise science)
    if (career.includes('engineer')) {
      if (career.includes('software') || career.includes('computer') || career.includes('IT')) {
        return '/assets/IT.png';
      }
      return '/assets/science.png';
    }

    // Default fallback to science
    return '/assets/science.png';
  };

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

      <div className="max-w-7xl mx-auto px-6 pt-6 pb-12">
        {/* Top Section: Important Note and Illustration */}
        <div className="flex items-start gap-6 mb-[-80px] relative z-10">
          {/* Important Note - Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 p-6 rounded-2xl bg-[#ABE6C4]/10 border border-[#ABE6C4]/20"
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

          {/* Illustration - Right, extends down to match box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-shrink-0"
          >
            <div className="w-[280px]">
              <img
                src={getCareerIllustration(topPrediction.career)}
                alt={`${topPrediction.career} Illustration`}
                className="w-full h-auto object-contain opacity-90"
              />
            </div>
          </motion.div>
        </div>

        {/* Top Career Match Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 relative"
        >
          <div className="p-12 rounded-2xl bg-gradient-to-br from-black/40 to-black/20 border border-gray-800 relative"
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
              <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-[#ABE6C4]/20 to-[#ABE6C4]/10 border border-[#ABE6C4]/30 mt-5">
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
          </div>
        </motion.div>

        {/* Specialized Career Paths */}
        {topPrediction.subcareers && topPrediction.subcareers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-[#ABE6C4]/5 to-transparent border border-[#ABE6C4]/20 mb-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#ABE6C4]/10 to-transparent rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-1 w-12 bg-gradient-to-r from-[#ABE6C4] to-[#7CC9A9] rounded-full"></div>
                <h2 className="text-2xl font-['Questrial'] text-white">Specialized Paths in {topPrediction.career}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {topPrediction.subcareers.map((subcareer, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    whileHover={{ scale: 1.05, y: -4 }}
                    className="group p-5 rounded-xl bg-gradient-to-br from-black/60 to-black/40 border-2 border-[#ABE6C4]/20 hover:border-[#ABE6C4]/60 transition-all duration-300 hover:shadow-lg hover:shadow-[#ABE6C4]/20 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#ABE6C4]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="flex items-start gap-3 relative">
                      <div className="w-2 h-2 bg-[#ABE6C4] rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-200 font-['Poppins'] group-hover:text-white transition-colors">{subcareer}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Other Strong Matches */}
        {predictions.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-[#7CC9A9]/5 to-transparent border border-[#7CC9A9]/20 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-1 w-12 bg-gradient-to-r from-[#7CC9A9] to-[#ABE6C4] rounded-full"></div>
              <h2 className="text-2xl font-['Questrial'] text-white">Other Strong Matches</h2>
            </div>
            <div className="space-y-4">
              {predictions.slice(1).map((prediction, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className="p-6 rounded-xl bg-gradient-to-r from-black/60 to-black/40 border-2 border-[#7CC9A9]/20"
                >
                  <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-['Questrial'] text-white">{prediction.career}</h3>
                        <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#7CC9A9]/20 to-[#7CC9A9]/10 border border-[#7CC9A9]/30">
                          <span className="text-sm text-[#7CC9A9] font-['Poppins'] font-semibold">
                            {(prediction.confidence * 100).toFixed(1)}% Match
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-800/50 rounded-full h-2.5 overflow-hidden mb-4">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${prediction.confidence * 100}%` }}
                          transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                          className="h-full bg-gradient-to-r from-[#7CC9A9] to-[#ABE6C4] rounded-full"
                        />
                      </div>
                      {prediction.subcareers && prediction.subcareers.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {prediction.subcareers.map((sub, sIdx) => (
                            <span
                              key={sIdx}
                              className="text-xs px-3 py-1.5 rounded-full bg-[#7CC9A9]/10 border border-[#7CC9A9]/20 text-gray-300 font-['Poppins'] hover:bg-[#7CC9A9]/20 transition-colors"
                            >
                              {sub}
                            </span>
                          ))}
                        </div>
                      )}
                  </div>
                </motion.div>
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
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <Link to={`/roadmap?career=${encodeURIComponent(topPrediction.career)}&assessmentId=${assessmentId}`}>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-10 py-5 rounded-2xl bg-gradient-to-r from-[#ABE6C4] to-[#7CC9A9] text-black font-['Poppins'] font-bold hover:shadow-2xl hover:shadow-[#ABE6C4]/40 transition-all duration-300 flex items-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Map size={22} className="relative z-10" />
              <span className="relative z-10">View Career Roadmap</span>
              <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform relative z-10" />
            </motion.button>
          </Link>
          <Link to="/start-assessment">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-10 py-5 rounded-2xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-2 border-[#ABE6C4]/30 text-white font-['Poppins'] font-bold hover:border-[#ABE6C4]/60 hover:shadow-xl hover:shadow-[#ABE6C4]/20 transition-all duration-300 flex items-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#ABE6C4]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <RefreshCw size={22} className="relative z-10 text-[#ABE6C4]" />
              <span className="relative z-10">Retake Assessment</span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
