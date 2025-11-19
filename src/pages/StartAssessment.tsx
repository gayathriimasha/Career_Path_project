import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Clock, Lock, TrendingUp } from "lucide-react";

export default function StartAssessment() {
    const navigate = useNavigate();

    const handleStart = () => {
        navigate('/questionnaire');
    };

    return (
        <div className="min-h-screen bg-[#1a1a1a] text-white overflow-hidden">
            {/* Header */}
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
                        <TrendingUp size={20} className="text-[#ABE6C4]" />
                        <span className="text-sm text-gray-400 font-['Poppins']">Begin Your Journey</span>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col gap-12">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center space-y-6"
                >
                    <div className="flex items-center gap-3 justify-center mb-4">
                        <div className="h-1 w-12 bg-[#ABE6C4] rounded-full"></div>
                        <span className="text-sm text-[#ABE6C4] font-['Poppins'] uppercase tracking-wide">Career Discovery</span>
                        <div className="h-1 w-12 bg-[#ABE6C4] rounded-full"></div>
                    </div>
                    <h1 className="text-6xl font-['Questrial'] leading-tight">
                        Begin Your Guided Journey
                    </h1>
                    <p className="text-xl text-gray-400 font-['Poppins'] max-w-3xl mx-auto leading-relaxed">
                        Let's discover your ideal career path through a personalized assessment. We'll analyze your academic interests, behavioral patterns, and skills to recommend careers that truly match <span className="text-[#ABE6C4]">who you are</span>.
                    </p>
                </motion.div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="p-6 rounded-2xl bg-black/30 border border-gray-800 hover:border-[#ABE6C4]/30 transition-all duration-300"
                    >
                        <div className="w-12 h-12 rounded-full bg-[#ABE6C4]/10 flex items-center justify-center mb-4">
                            <Clock size={24} className="text-[#ABE6C4]" />
                        </div>
                        <h3 className="text-lg font-['Questrial'] mb-2">Quick & Easy</h3>
                        <p className="text-sm text-gray-400 font-['Poppins']">
                            Complete the assessment in approximately <strong className="text-[#ABE6C4]">20 minutes</strong>. Take your time and answer honestly for the best results.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="p-6 rounded-2xl bg-black/30 border border-gray-800 hover:border-[#ABE6C4]/30 transition-all duration-300"
                    >
                        <div className="w-12 h-12 rounded-full bg-[#ABE6C4]/10 flex items-center justify-center mb-4">
                            <Lock size={24} className="text-[#ABE6C4]" />
                        </div>
                        <h3 className="text-lg font-['Questrial'] mb-2">Private & Secure</h3>
                        <p className="text-sm text-gray-400 font-['Poppins']">
                            Your data is <strong className="text-white">completely private</strong>. We never share your information, and you can delete it anytime.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="p-6 rounded-2xl bg-black/30 border border-gray-800 hover:border-[#ABE6C4]/30 transition-all duration-300"
                    >
                        <div className="w-12 h-12 rounded-full bg-[#ABE6C4]/10 flex items-center justify-center mb-4">
                            <TrendingUp size={24} className="text-[#ABE6C4]" />
                        </div>
                        <h3 className="text-lg font-['Questrial'] mb-2">AI-Powered Insights</h3>
                        <p className="text-sm text-gray-400 font-['Poppins']">
                            Advanced machine learning analyzes your responses to match you with careers that align with your <strong className="text-white">unique profile</strong>.
                        </p>
                    </motion.div>
                </div>

                {/* What to Expect */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="p-8 rounded-2xl bg-gradient-to-br from-black/40 to-black/20 border border-gray-800"
                >
                    <h2 className="text-2xl font-['Questrial'] mb-6 text-center">What to Expect</h2>
                    <div className="grid md:grid-cols-3 gap-6 text-center">
                        <div>
                            <div className="text-3xl font-bold text-[#ABE6C4] font-['Questrial'] mb-2">30</div>
                            <p className="text-sm text-gray-400 font-['Poppins']">Thoughtful questions about your interests and preferences</p>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-[#ABE6C4] font-['Questrial'] mb-2">12+</div>
                            <p className="text-sm text-gray-400 font-['Poppins']">Career categories analyzed by our ML model</p>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-[#ABE6C4] font-['Questrial'] mb-2">100%</div>
                            <p className="text-sm text-gray-400 font-['Poppins']">Personalized roadmap tailored to your results</p>
                        </div>
                    </div>
                </motion.div>

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="flex justify-center"
                >
                    <button
                        onClick={handleStart}
                        className="group relative px-12 py-4 rounded-2xl bg-gradient-to-r from-[#ABE6C4] to-[#7CC9A9] text-black font-['Poppins'] font-semibold text-lg hover:shadow-2xl hover:shadow-[#ABE6C4]/30 transition-all duration-300 transform hover:scale-105"
                    >
                        <span className="relative z-10">Continue with Assessment</span>
                        <div className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    </button>
                </motion.div>

                {/* Tips */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="p-6 rounded-2xl bg-[#ABE6C4]/5 border border-[#ABE6C4]/20"
                >
                    <h3 className="text-lg font-['Questrial'] mb-3 flex items-center gap-2">
                        <span className="text-[#ABE6C4]">💡</span> Tips for Best Results
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-300 font-['Poppins']">
                        <li className="flex items-start gap-2">
                            <span className="text-[#ABE6C4] mt-1">→</span>
                            <span>Answer honestly based on your genuine interests, not what you think sounds impressive</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#ABE6C4] mt-1">→</span>
                            <span>Take your time with each question - there's no rush</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#ABE6C4] mt-1">→</span>
                            <span>Don't overthink - go with your first instinct</span>
                        </li>
                    </ul>
                </motion.div>
            </div>
        </div>
    );
}