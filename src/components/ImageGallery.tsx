import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, BarChart3, Users, Sparkles } from 'lucide-react';

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
    <section id="services" className="px-[80px] py-24 relative overflow-hidden" style={{ backgroundColor: '#1a1a1a' }}>

      {/* SERVICES ILLUSTRATION - Absolute Positioned */}
      <div className="absolute top-[-10px] right-[20px] w-[450px] z-0">
        <img
          src="/assets/services-placeholder.png"
          alt="Services and Team Illustration"
          className="w-full h-auto object-contain opacity-80"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 justify-center mb-6"
          >
            <motion.div
              className="h-1 w-12 bg-[#ABE6C4] rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            ></motion.div>
            <span className="text-sm text-[#ABE6C4] font-['Poppins'] uppercase tracking-wide">What We Offer</span>
            <motion.div
              className="h-1 w-12 bg-[#ABE6C4] rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            ></motion.div>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-5xl font-['Questrial'] font-bold text-white"
          >
            Services Available
          </motion.h2>
        </motion.div>

        <div className="grid grid-cols-3 gap-6">
          {serviceCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                type: "spring",
                stiffness: 100
              }}
              className="p-8 bg-[#0f0f0f] rounded-3xl border-2 border-[#ABE6C4]/30 hover:border-[#ABE6C4] transition-all duration-300 group relative overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-[#ABE6C4]/20 hover:-translate-y-2"
            >
              {/* Card background accent */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#ABE6C4]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="w-16 h-16 bg-[#ABE6C4] rounded-2xl flex items-center justify-center mb-6 relative">
                <div className="text-black">
                  {card.icon}
                </div>
              </div>

              <h3 className="text-2xl font-['Questrial'] text-white mb-4 relative">{card.title}</h3>
              <p className="text-gray-400 font-['Poppins'] leading-relaxed relative group-hover:text-gray-300 transition-colors duration-300">{card.description}</p>

              {/* Bottom accent bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ABE6C4] to-[#7CC9A9]"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};