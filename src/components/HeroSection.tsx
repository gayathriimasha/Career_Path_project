import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Target, Zap, ArrowRight, Compass, Lightbulb, Map, Sparkles } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="overview" className="min-h-screen px-[80px] py-[80px] relative overflow-hidden" style={{ backgroundColor: '#1a1a1a' }}>
      {/* Subtle Grid Pattern - Static */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(#ABE6C4 1px, transparent 1px), linear-gradient(90deg, #ABE6C4 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Main Hero Content */}
        <div className="grid grid-cols-2 gap-16 items-center mb-16">
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
              className="inline-block mb-3"
            >
              <span className="px-4 py-2 bg-[#ABE6C4]/10 border border-[#ABE6C4]/30 rounded-full text-[#ABE6C4] text-sm font-['Poppins'] uppercase tracking-wider">
                AI-Powered Career Discovery
              </span>
            </motion.div>

            <h1 className="text-7xl font-['Questrial'] font-bold text-white mb-4 leading-tight">
              Discover Your
              <span className="block text-transparent bg-gradient-to-r from-[#ABE6C4] to-[#7CC9A9] bg-clip-text">
                Perfect Path
              </span>
            </h1>

            <p className="text-xl text-gray-400 font-['Poppins'] mb-6 leading-relaxed">
              Navigate your career journey with intelligent assessments, personalized roadmaps, and data-driven insights tailored to your unique potential.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => navigate('/start-assessment')}
                className="group px-8 py-4 bg-gradient-to-r from-[#ABE6C4] to-[#7CC9A9] text-black font-['Poppins'] font-semibold rounded-full flex items-center gap-2 hover:shadow-xl hover:shadow-[#ABE6C4]/50 transition-all duration-300 hover:scale-105"
              >
                <span>Start Assessment</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>

              <button
                onClick={() => document.getElementById('mission')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 border-2 border-[#ABE6C4]/30 text-white font-['Poppins'] font-semibold rounded-full hover:border-[#ABE6C4] hover:bg-[#ABE6C4]/10 transition-all duration-300"
              >
                Learn More
              </button>
            </div>
          </motion.div>

          {/* Right: Career Discovery Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* HERO ILLUSTRATION */}
            <div className="relative w-full h-[400px] mb-6 flex items-center justify-center">
              <img
                src="/assets/hero-placeholder.png"
                alt="Career Discovery Illustration"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(171, 230, 196, 0.15)"
                }}
                className="group p-6 bg-[#0f0f0f] rounded-3xl border-2 border-[#ABE6C4]/30 hover:border-[#ABE6C4] transition-all duration-300 relative overflow-hidden"
              >
                {/* Card background accent */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#ABE6C4]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="w-12 h-12 bg-[#ABE6C4] rounded-2xl flex items-center justify-center mb-4 relative">
                  <Target className="text-black" size={24} />
                </div>

                <h3 className="text-lg font-['Questrial'] text-white mb-2 relative">Precision Matching</h3>
                <p className="text-sm text-gray-400 font-['Poppins'] relative group-hover:text-gray-300 transition-colors duration-300">ML algorithms analyze your profile</p>

                {/* Bottom accent bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ABE6C4] to-[#7CC9A9]"></div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(124, 201, 169, 0.15)"
                }}
                className="group p-6 bg-[#0f0f0f] rounded-3xl border-2 border-[#7CC9A9]/30 hover:border-[#7CC9A9] transition-all duration-300 relative overflow-hidden"
              >
                {/* Card background accent */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#7CC9A9]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="w-12 h-12 bg-[#7CC9A9] rounded-2xl flex items-center justify-center mb-4 relative">
                  <TrendingUp className="text-black" size={24} />
                </div>

                <h3 className="text-lg font-['Questrial'] text-white mb-2 relative">Growth Tracking</h3>
                <p className="text-sm text-gray-400 font-['Poppins'] relative group-hover:text-gray-300 transition-colors duration-300">Monitor your skill development</p>

                {/* Bottom accent bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ABE6C4] to-[#7CC9A9]"></div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-3 gap-8 p-10 bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#0f0f0f] rounded-3xl border border-[#ABE6C4]/20 backdrop-blur-sm relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#ABE6C4]/5 via-transparent to-[#7CC9A9]/5 opacity-50"></div>

          <motion.div
            className="text-center relative z-10"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="text-5xl font-bold font-['Questrial'] text-transparent bg-gradient-to-r from-[#ABE6C4] to-[#7CC9A9] bg-clip-text mb-2"
              whileHover={{ scale: 1.1 }}
            >
              12+
            </motion.div>
            <div className="text-gray-400 font-['Poppins']">Career Categories</div>
          </motion.div>

          <motion.div
            className="text-center border-l border-r border-[#ABE6C4]/20 relative z-10"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="text-5xl font-bold font-['Questrial'] text-transparent bg-gradient-to-r from-[#ABE6C4] to-[#7CC9A9] bg-clip-text mb-2"
              whileHover={{ scale: 1.1 }}
            >
              95%
            </motion.div>
            <div className="text-gray-400 font-['Poppins']">Accuracy Rate</div>
          </motion.div>

          <motion.div
            className="text-center relative z-10"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="text-5xl font-bold font-['Questrial'] text-transparent bg-gradient-to-r from-[#ABE6C4] to-[#7CC9A9] bg-clip-text mb-2"
              whileHover={{ scale: 1.1 }}
            >
              20min
            </motion.div>
            <div className="text-gray-400 font-['Poppins']">Average Completion</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};