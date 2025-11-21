import React from 'react';
import { motion } from 'framer-motion';
import { Award, GraduationCap, Target } from 'lucide-react';

export const MissionSection: React.FC = () => {
  return (
    <section id="mission" className="py-20 relative overflow-hidden" style={{ backgroundColor: '#1a1a1a' }}>
      {/* Decorative Lines - Left Corner */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-80 h-80 opacity-15">
        <svg width="320" height="320" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Main bold line */}
          <line x1="0" y1="160" x2="240" y2="160" stroke="#ABE6C4" strokeWidth="3"/>
          {/* Secondary lines */}
          <line x1="0" y1="185" x2="220" y2="185" stroke="#ABE6C4" strokeWidth="2.5" opacity="0.7"/>
          <line x1="0" y1="210" x2="200" y2="210" stroke="#7CC9A9" strokeWidth="2" opacity="0.5"/>
          <line x1="0" y1="135" x2="220" y2="135" stroke="#ABE6C4" strokeWidth="2.5" opacity="0.7"/>
          <line x1="0" y1="110" x2="200" y2="110" stroke="#7CC9A9" strokeWidth="2" opacity="0.5"/>
          {/* End circles */}
          <circle cx="240" cy="160" r="5" fill="#ABE6C4"/>
          <circle cx="220" cy="185" r="4" fill="#ABE6C4" opacity="0.7"/>
          <circle cx="200" cy="210" r="3.5" fill="#7CC9A9" opacity="0.5"/>
        </svg>
      </div>

      {/* Decorative Lines - Right Corner */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 opacity-15">
        <svg width="320" height="320" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Main bold line */}
          <line x1="320" y1="160" x2="80" y2="160" stroke="#ABE6C4" strokeWidth="3"/>
          {/* Secondary lines */}
          <line x1="320" y1="185" x2="100" y2="185" stroke="#ABE6C4" strokeWidth="2.5" opacity="0.7"/>
          <line x1="320" y1="210" x2="120" y2="210" stroke="#7CC9A9" strokeWidth="2" opacity="0.5"/>
          <line x1="320" y1="135" x2="100" y2="135" stroke="#ABE6C4" strokeWidth="2.5" opacity="0.7"/>
          <line x1="320" y1="110" x2="120" y2="110" stroke="#7CC9A9" strokeWidth="2" opacity="0.5"/>
          {/* End circles */}
          <circle cx="80" cy="160" r="5" fill="#ABE6C4"/>
          <circle cx="100" cy="185" r="4" fill="#ABE6C4" opacity="0.7"/>
          <circle cx="120" cy="210" r="3.5" fill="#7CC9A9" opacity="0.5"/>
        </svg>
      </div>

      {/* MISSION CONTENT - Horizontal Layout */}
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="grid grid-cols-2 gap-16 items-center">

          {/* Left: Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center"
          >
            <img
              src="/assets/mission-placeholder.png"
              alt="Mission and Growth Illustration"
              className="w-full h-auto object-contain scale-90"
            />
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-6"
            >
              <motion.div
                className="h-1 w-12 bg-[#ABE6C4] rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: 48 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              ></motion.div>
              <span className="text-sm text-[#ABE6C4] font-['Poppins'] uppercase tracking-wide">Our Purpose</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-white mb-6"
              style={{ fontFamily: 'Questrial', fontSize: '55px', lineHeight: '1.2' }}
            >
              Our Mission
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="relative"
            >
              {/* Glowing effect behind text */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#ABE6C4]/5 via-transparent to-[#7CC9A9]/5 blur-3xl"></div>

              <p className="text-gray-300 leading-relaxed relative" style={{ fontFamily: 'Poppins', fontWeight: 300, fontSize: '22px' }}>
                Inspiring informed career choices through{' '}
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 }}
                  className="text-[#ABE6C4]"
                >
                  smart assessments
                </motion.span>, curated skill roadmaps, and
                personalized support preparing students for{' '}
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1 }}
                  className="text-[#ABE6C4]"
                >
                  success beyond the classroom
                </motion.span>.
              </p>
            </motion.div>

            {/* Decorative elements around mission statement */}
            <div className="mt-8 flex gap-6">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: 1.2 + i * 0.15,
                    type: "spring",
                    stiffness: 200
                  }}
                  whileHover={{
                    scale: 1.2,
                    rotate: 180,
                    transition: { duration: 0.3 }
                  }}
                  className="w-2 h-2 bg-[#ABE6C4] rounded-full"
                ></motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
