import React from 'react';

interface ServiceCard {
  src: string;
  alt: string;
  title: string;
}

const serviceCards: ServiceCard[] = [
  {
    src: "https://api.builder.io/api/v1/image/assets/9ac5b116d2de4a019ba47842cc0d1e27/ed2866e0a307d962d0be9c32dd7dc91750e7333d?placeholderIfAbsent=true",
    alt: "Tailored Guidance",
    title: "Tailored\nGuidance"
  },
  {
    src: "https://api.builder.io/api/v1/image/assets/9ac5b116d2de4a019ba47842cc0d1e27/5e930e3f2a04780627193cc59898914359db6d9f?placeholderIfAbsent=true",
    alt: "Skill Evaluations",
    title: "Skill\nEvaluations"
  },
  {
    src: "https://api.builder.io/api/v1/image/assets/9ac5b116d2de4a019ba47842cc0d1e27/001803fe318e044843f122adcd09dd9100f8f23f?placeholderIfAbsent=true",
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