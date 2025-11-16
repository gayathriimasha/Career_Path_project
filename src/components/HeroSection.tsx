import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Target, Zap, ArrowRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="overview" className="min-h-screen px-[80px] py-[120px] relative overflow-hidden" style={{ backgroundColor: '#1a1a1a' }}>
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#ABE6C4] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#7CC9A9] rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Main Hero Content */}
        <div className="grid grid-cols-2 gap-16 items-center mb-24">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-6"
            >
              <span className="px-4 py-2 bg-[#ABE6C4]/10 border border-[#ABE6C4]/30 rounded-full text-[#ABE6C4] text-sm font-['Poppins'] uppercase tracking-wider">
                AI-Powered Career Discovery
              </span>
            </motion.div>

            <h1 className="text-7xl font-['Questrial'] font-bold text-white mb-6 leading-tight">
              Discover Your
              <span className="block text-transparent bg-gradient-to-r from-[#ABE6C4] to-[#7CC9A9] bg-clip-text">
                Perfect Path
              </span>
            </h1>

            <p className="text-xl text-gray-400 font-['Poppins'] mb-8 leading-relaxed">
              Navigate your career journey with intelligent assessments, personalized roadmaps, and data-driven insights tailored to your unique potential.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => navigate('/start-assessment')}
                className="group px-8 py-4 bg-gradient-to-r from-[#ABE6C4] to-[#7CC9A9] text-black font-['Poppins'] font-semibold rounded-full hover:shadow-2xl hover:shadow-[#ABE6C4]/40 transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                Start Assessment
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>
              <button
                onClick={() => document.getElementById('mission')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 border-2 border-gray-700 text-white font-['Poppins'] font-semibold rounded-full hover:border-[#ABE6C4] hover:bg-[#ABE6C4]/5 transition-all duration-300"
              >
                Learn More
              </button>
            </div>
          </motion.div>

          {/* Right: Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 gap-4"
          >
            <motion.div
              whileHover={{ y: -8 }}
              className="col-span-2 p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700 hover:border-[#ABE6C4]/50 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-[#ABE6C4]/10 rounded-2xl flex items-center justify-center mb-4">
                <Target className="text-[#ABE6C4]" size={28} />
              </div>
              <h3 className="text-2xl font-['Questrial'] text-white mb-2">Precision Matching</h3>
              <p className="text-gray-400 font-['Poppins']">ML algorithms analyze your skills and interests to recommend optimal career paths</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -8 }}
              className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700 hover:border-[#ABE6C4]/50 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-[#ABE6C4]/10 rounded-2xl flex items-center justify-center mb-3">
                <TrendingUp className="text-[#ABE6C4]" size={24} />
              </div>
              <h3 className="text-lg font-['Questrial'] text-white mb-2">Growth Tracking</h3>
              <p className="text-sm text-gray-400 font-['Poppins']">Monitor your progress and skill development</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -8 }}
              className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700 hover:border-[#ABE6C4]/50 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-[#ABE6C4]/10 rounded-2xl flex items-center justify-center mb-3">
                <Zap className="text-[#ABE6C4]" size={24} />
              </div>
              <h3 className="text-lg font-['Questrial'] text-white mb-2">Quick Results</h3>
              <p className="text-sm text-gray-400 font-['Poppins']">Get instant personalized recommendations</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-3 gap-8 p-10 bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-3xl border border-gray-700 backdrop-blur-sm"
        >
          <div className="text-center">
            <div className="text-5xl font-bold font-['Questrial'] text-transparent bg-gradient-to-r from-[#ABE6C4] to-[#7CC9A9] bg-clip-text mb-2">
              12+
            </div>
            <div className="text-gray-400 font-['Poppins']">Career Categories</div>
          </div>
          <div className="text-center border-l border-r border-gray-700">
            <div className="text-5xl font-bold font-['Questrial'] text-transparent bg-gradient-to-r from-[#ABE6C4] to-[#7CC9A9] bg-clip-text mb-2">
              95%
            </div>
            <div className="text-gray-400 font-['Poppins']">Accuracy Rate</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold font-['Questrial'] text-transparent bg-gradient-to-r from-[#ABE6C4] to-[#7CC9A9] bg-clip-text mb-2">
              20min
            </div>
            <div className="text-gray-400 font-['Poppins']">Average Completion</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};