import React from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { NewsletterSection } from '@/components/NewsletterSection';
import { MissionSection } from '@/components/MissionSection';
import { ImageGallery } from '@/components/ImageGallery';
import { Toaster } from '@/components/ui/toaster';
import { Footer } from '@/components/Footer';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <HeroSection />
      <NewsletterSection />
      <MissionSection />
      <ImageGallery />
      <Toaster />

      <Footer />

    </div>
  );
};

export default Index;
