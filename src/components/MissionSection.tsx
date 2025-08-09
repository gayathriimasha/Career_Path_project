import React from 'react';

export const MissionSection: React.FC = () => {
  return (
    <section id="mission" className="py-20 text-center" style={{ backgroundColor: '#1a1a1a' }}>
      <div className="max-w-4xl mx-auto px-8">
        <h2 className="text-white mb-8" style={{ fontFamily: 'Poppins', fontSize: '55px' }}>
          Our Mission
        </h2>
        <p className="text-gray-300 leading-relaxed max-w-2xl mx-auto" style={{ fontFamily: 'Poppins', fontWeight: 300, fontSize: '25px' }}>
          Inspiring informed career choices through <br />smart assessments, curated skill roadmaps, and
          personalized support preparing students for<br /> success beyond the classroom.
        </p>
      </div>
    </section>
  );
};
