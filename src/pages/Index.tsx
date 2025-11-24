import React from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { ImageGallery } from '@/components/ServicesSection';
import { MissionSection } from '@/components/MissionSection';
import { NewsletterSection } from '@/components/NewsletterSection';
import { Toaster } from '@/components/ui/toaster';
import { Footer } from '@/components/Footer';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <Header />
      <HeroSection />
      <ImageGallery />
      <MissionSection />
      <NewsletterSection />
      <Footer />
      <Toaster />
    </div>
  );
};

export default Index;
