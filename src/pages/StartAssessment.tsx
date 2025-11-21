import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Clock, Lock, TrendingUp } from "lucide-react";

export default function StartAssessment() {
    const navigate = useNavigate();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        // Check if user is authenticated
        const userToken = localStorage.getItem("userToken");
        if (!userToken) {
            // Redirect to register page if not authenticated
            navigate('/register');
        } else {
            setIsCheckingAuth(false);
        }
    }, [navigate]);

    const handleStart = () => {
        navigate('/questionnaire');
    };

    if (isCheckingAuth) {
        return (
            <div className="min-h-screen bg-[#1a1a1a] text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ABE6C4] mx-auto mb-4"></div>
                    <p className="text-lg text-gray-400 font-['Poppins']">Checking authentication...</p>
                </div>
            </div>
        );
    }

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
                        whileHover={{
                            y: -8,
                            scale: 1.02,
                            boxShadow: "0 20px 40px rgba(171, 230, 196, 0.15)"
                        }}
                        className="group p-6 rounded-2xl bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#0f0f0f] border border-[#ABE6C4]/20 hover:border-[#ABE6C4]/60 transition-all duration-300 relative overflow-hidden cursor-pointer"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#ABE6C4]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <motion.div
                            className="w-12 h-12 rounded-full bg-[#ABE6C4]/10 flex items-center justify-center mb-4 group-hover:bg-[#ABE6C4]/20 transition-all duration-300 relative"
                            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Clock size={24} className="text-[#ABE6C4]" />
                        </motion.div>
                        <h3 className="text-lg font-['Questrial'] mb-2 relative group-hover:text-[#ABE6C4] transition-colors duration-300">Quick & Easy</h3>
                        <p className="text-sm text-gray-400 font-['Poppins'] relative group-hover:text-gray-300 transition-colors duration-300">
                            Complete the assessment in approximately <strong className="text-[#ABE6C4]">20 minutes</strong>. Take your time and answer honestly for the best results.
                        </p>
                        <motion.div
                            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#ABE6C4] to-[#7CC9A9] rounded-full"
                            initial={{ width: "0%" }}
                            whileHover={{ width: "100%" }}
                            transition={{ duration: 0.4 }}
                        ></motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        whileHover={{
                            y: -8,
                            scale: 1.02,
                            boxShadow: "0 20px 40px rgba(124, 201, 169, 0.15)"
                        }}
                        className="group p-6 rounded-2xl bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#0f0f0f] border border-[#7CC9A9]/20 hover:border-[#7CC9A9]/60 transition-all duration-300 relative overflow-hidden cursor-pointer"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#7CC9A9]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <motion.div
                            className="w-12 h-12 rounded-full bg-[#7CC9A9]/10 flex items-center justify-center mb-4 group-hover:bg-[#7CC9A9]/20 transition-all duration-300 relative"
                            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Lock size={24} className="text-[#7CC9A9]" />
                        </motion.div>
                        <h3 className="text-lg font-['Questrial'] mb-2 relative group-hover:text-[#7CC9A9] transition-colors duration-300">Private & Secure</h3>
                        <p className="text-sm text-gray-400 font-['Poppins'] relative group-hover:text-gray-300 transition-colors duration-300">
                            Your data is <strong className="text-white">completely private</strong>. We never share your information, and you can delete it anytime.
                        </p>
                        <motion.div
                            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#7CC9A9] to-[#ABE6C4] rounded-full"
                            initial={{ width: "0%" }}
                            whileHover={{ width: "100%" }}
                            transition={{ duration: 0.4 }}
                        ></motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        whileHover={{
                            y: -8,
                            scale: 1.02,
                            boxShadow: "0 20px 40px rgba(171, 230, 196, 0.15)"
                        }}
                        className="group p-6 rounded-2xl bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#0f0f0f] border border-[#ABE6C4]/20 hover:border-[#ABE6C4]/60 transition-all duration-300 relative overflow-hidden cursor-pointer"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#ABE6C4]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <motion.div
                            className="w-12 h-12 rounded-full bg-[#ABE6C4]/10 flex items-center justify-center mb-4 group-hover:bg-[#ABE6C4]/20 transition-all duration-300 relative"
                            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <TrendingUp size={24} className="text-[#ABE6C4]" />
                        </motion.div>
                        <h3 className="text-lg font-['Questrial'] mb-2 relative group-hover:text-[#ABE6C4] transition-colors duration-300">AI-Powered Insights</h3>
                        <p className="text-sm text-gray-400 font-['Poppins'] relative group-hover:text-gray-300 transition-colors duration-300">
                            Advanced machine learning analyzes your responses to match you with careers that align with your <strong className="text-white">unique profile</strong>.
                        </p>
                        <motion.div
                            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#ABE6C4] to-[#7CC9A9] rounded-full"
                            initial={{ width: "0%" }}
                            whileHover={{ width: "100%" }}
                            transition={{ duration: 0.4 }}
                        ></motion.div>
                    </motion.div>
                </div>

                {/* What to Expect */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="p-8 rounded-2xl bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#0f0f0f] border border-[#ABE6C4]/20 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#ABE6C4]/5 via-transparent to-[#7CC9A9]/5 opacity-50"></div>
                    <h2 className="text-2xl font-['Questrial'] mb-6 text-center relative z-10">What to Expect</h2>
                    <div className="grid md:grid-cols-3 gap-6 text-center relative z-10">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.div
                                className="text-3xl font-bold text-transparent bg-gradient-to-r from-[#ABE6C4] to-[#7CC9A9] bg-clip-text font-['Questrial'] mb-2"
                                whileHover={{ scale: 1.1 }}
                            >
                                30
                            </motion.div>
                            <p className="text-sm text-gray-400 font-['Poppins']">Thoughtful questions about your interests and preferences</p>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.div
                                className="text-3xl font-bold text-transparent bg-gradient-to-r from-[#ABE6C4] to-[#7CC9A9] bg-clip-text font-['Questrial'] mb-2"
                                whileHover={{ scale: 1.1 }}
                            >
                                12+
                            </motion.div>
                            <p className="text-sm text-gray-400 font-['Poppins']">Career categories analyzed by our ML model</p>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.div
                                className="text-3xl font-bold text-transparent bg-gradient-to-r from-[#ABE6C4] to-[#7CC9A9] bg-clip-text font-['Questrial'] mb-2"
                                whileHover={{ scale: 1.1 }}
                            >
                                100%
                            </motion.div>
                            <p className="text-sm text-gray-400 font-['Poppins']">Personalized roadmap tailored to your results</p>
                        </motion.div>
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
                        className="group px-12 py-4 rounded-2xl bg-gradient-to-r from-[#ABE6C4] to-[#7CC9A9] text-black font-['Poppins'] font-semibold text-lg flex items-center gap-3 hover:shadow-xl hover:shadow-[#ABE6C4]/50 transition-all duration-300 hover:scale-105"
                    >
                        <span>Continue with Assessment</span>
                        <svg
                            className="group-hover:translate-x-1 transition-transform duration-300"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
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