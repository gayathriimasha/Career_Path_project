import React from 'react';

interface ServiceCard {
  src: string;
  alt: string;
  title: string;
}

const serviceCards: ServiceCard[] = [
  {
    src: "/image 4.png",
    alt: "Tailored Guidance",
    title: "Tailored\nGuidance"
  },
  {
    src: "/image 5.png",
    alt: "Skill Evaluations",
    title: "Skill\nEvaluations"
  },
  {
    src: "/image 6.png",
    alt: "Personalized Approach",
    title: "Personalized\nApproach"
  }
];

export const ImageGallery: React.FC = () => {
  return (
    <section id="services" className="px-[50px] py-16" style={{ backgroundColor: '#1a1a1a' }}>
      <div className="flex gap-8 justify-center items-center">
        {serviceCards.map((card, index) => (
          <div
            key={index}
            className="relative rounded-[30px] overflow-hidden cursor-pointer hover:scale-105 transition-transform group"
            style={{ 
              width: '448px',  // 80% of 560px
              height: '552px'  // 80% of 690px
            }}
          >
            <img
              src={card.src}
              alt={card.alt}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-6">
              <h3 className="text-white whitespace-pre-line" style={{ fontFamily: 'Poppins', fontSize: '40px', fontWeight: 300, lineHeight: '105%' }}>
                {card.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};