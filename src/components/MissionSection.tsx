import React from 'react';
import { motion } from 'framer-motion';

export const MissionSection: React.FC = () => {
  return (
    <section id="mission" className="py-20 text-center" style={{ backgroundColor: '#1a1a1a' }}>
      <div className="max-w-4xl mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 justify-center mb-8">
            <div className="h-1 w-12 bg-[#ABE6C4] rounded-full"></div>
            <span className="text-sm text-[#ABE6C4] font-['Poppins'] uppercase tracking-wide">Our Purpose</span>
            <div className="h-1 w-12 bg-[#ABE6C4] rounded-full"></div>
          </div>
          <h2 className="text-white mb-8" style={{ fontFamily: 'Questrial', fontSize: '55px' }}>
            Our Mission
          </h2>
          <p className="text-gray-300 leading-relaxed max-w-2xl mx-auto" style={{ fontFamily: 'Poppins', fontWeight: 300, fontSize: '25px' }}>
            Inspiring informed career choices through <br />smart assessments, curated skill roadmaps, and
            personalized support preparing students for<br /> success beyond the classroom.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
