import React, { useState } from 'react';

interface NavigationItem {
  id: string;
  title: string;
}

const navigationItems: NavigationItem[] = [
  { id: "overview", title: "Overview" },
  { id: "contact", title: "Get In Touch" },
  { id: "services", title: "Services Available" },
  { id: "mission", title: "Our Mission and Vision" }
];

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

export const HeroSection: React.FC = () => {
  const [activeNav, setActiveNav] = useState("overview");

  return (
    <section id="overview" className="flex px-[80px] pt-[100px] pb-[90px]" style={{ backgroundColor: '#1a1a1a' }}>
      <div className="flex w-full justify-between">
        {/* Left Navigation */}
        <nav className="flex flex-col justify-end" style={{ width: '35%', gap: '5px', height: '450px' }}>
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveNav(item.id);
                scrollToSection(item.id);
              }}
              className={`text-left transition-colors ${activeNav === item.id ? 'text-white' : 'text-gray-400'
                } hover:text-white`}
              style={{ fontFamily: 'Poppins', fontWeight: 200, fontSize: '42px' }}
            >
              {item.title}
            </button>
          ))}
        </nav>

        {/* Right Cards */}
        <div className="flex gap-4 items-center" style={{ width: '63%', justifyContent: 'flex-end', transform: 'translateY(-15px)' }}>
          <div className="bg-gray-100 rounded-[20px] overflow-hidden cursor-pointer" style={{ width: '30%', height: '460px' }}>
            <img
              src="https://api.builder.io/api/v1/image/assets/9ac5b116d2de4a019ba47842cc0d1e27/11293ceed2b2436e3d0e98f443d47e7c28d5a363?placeholderIfAbsent=true"
              alt="Career Assessment"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="bg-gray-100 rounded-[20px] overflow-hidden cursor-pointer shadow-lg" style={{ width: '35%', height: '480px' }}>
            <img
              src="https://api.builder.io/api/v1/image/assets/9ac5b116d2de4a019ba47842cc0d1e27/8c9a2756a6f28c1390e62220577cd8a42063a079?placeholderIfAbsent=true"
              alt="Skills Development"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="bg-gray-100 rounded-[20px] overflow-hidden cursor-pointer" style={{ width: '30%', height: '460px' }}>
            <img
              src="https://api.builder.io/api/v1/image/assets/9ac5b116d2de4a019ba47842cc0d1e27/e37c9435b428f9ce24d26b2efe09087627e4f3d2?placeholderIfAbsent=true"
              alt="Career Guidance"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};