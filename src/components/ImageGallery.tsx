import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, BarChart3, Users } from 'lucide-react';

interface ServiceCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const serviceCards: ServiceCard[] = [
  {
    icon: <BookOpen size={32} />,
    title: "Tailored Guidance",
    description: "Receive customized career recommendations based on your unique strengths, interests, and academic performance."
  },
  {
    icon: <BarChart3 size={32} />,
    title: "Skill Evaluations",
    description: "Comprehensive analysis of your competencies with detailed insights into areas of excellence and growth opportunities."
  },
  {
    icon: <Users size={32} />,
    title: "Personalized Approach",
    description: "Every recommendation is crafted specifically for you, considering your individual goals and aspirations."
  }
];

export const ImageGallery: React.FC = () => {
  return (
    <section id="services" className="px-[80px] py-24" style={{ backgroundColor: '#1a1a1a' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center gap-3 justify-center mb-6">
            <div className="h-1 w-12 bg-[#ABE6C4] rounded-full"></div>
            <span className="text-sm text-[#ABE6C4] font-['Poppins'] uppercase tracking-wide">What We Offer</span>
            <div className="h-1 w-12 bg-[#ABE6C4] rounded-full"></div>
          </div>
          <h2 className="text-5xl font-['Questrial'] font-bold text-white">Services Available</h2>
        </motion.div>

        <div className="grid grid-cols-3 gap-6">
          {serviceCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -12 }}
              className="p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700 hover:border-[#ABE6C4]/50 transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-[#ABE6C4]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#ABE6C4]/20 transition-all duration-300">
                <div className="text-[#ABE6C4]">
                  {card.icon}
                </div>
              </div>
              <h3 className="text-2xl font-['Questrial'] text-white mb-4">{card.title}</h3>
              <p className="text-gray-400 font-['Poppins'] leading-relaxed">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};