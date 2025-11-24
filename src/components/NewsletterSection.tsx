import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Mail, Send } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitted(true);
      console.log('✅ Newsletter subscription successful for:', email);
      alert('Successfully subscribed to newsletter!');
      toast({
        title: "Success!",
        description: "You've successfully subscribed to our newsletter.",
      });
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <section id="contact" className="px-[80px] py-24" style={{ backgroundColor: '#1a1a1a' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#0f0f0f] border border-[#ABE6C4]/20 p-16"
        >
          {/* Background Decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#ABE6C4] opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#7CC9A9] opacity-5 rounded-full blur-3xl"></div>

          <div className="relative z-10 grid grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-1 w-12 bg-[#ABE6C4] rounded-full"></div>
                <span className="text-sm text-[#ABE6C4] font-['Poppins'] uppercase tracking-wide">Get In Touch</span>
              </div>

              <h2 className="text-5xl font-['Questrial'] font-bold text-white leading-tight mb-6">
                Stay connected with personalized career insights
              </h2>

              <p className="text-gray-400 font-['Poppins'] text-lg mb-8">
                Subscribe to receive curated career guidance, industry trends, and personalized recommendations delivered to your inbox.
              </p>

              <div className="flex items-center gap-6 text-gray-400 font-['Poppins']">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#ABE6C4] rounded-full"></div>
                  <span>Weekly insights</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#ABE6C4] rounded-full"></div>
                  <span>No spam</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#ABE6C4] rounded-full"></div>
                  <span>Unsubscribe anytime</span>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full h-16 pl-14 pr-6 bg-[#0f0f0f] border-2 border-[#ABE6C4]/30 rounded-2xl text-white placeholder-gray-500 focus:bg-[#0f0f0f] focus:border-[#ABE6C4] focus:outline-none transition-all duration-300 font-['Poppins']"
                    required
                    disabled={isSubmitted}
                  />
                </div>
                <Button
                  type="submit"
                  className={`w-full h-16 rounded-2xl font-['Poppins'] font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                    isSubmitted
                      ? 'bg-[#ABE6C4] hover:bg-[#ABE6C4] text-black shadow-lg shadow-[#ABE6C4]/30'
                      : 'bg-gradient-to-r from-[#ABE6C4] to-[#7CC9A9] hover:shadow-xl hover:shadow-[#ABE6C4]/50 hover:scale-105 text-black'
                  }`}
                  disabled={isSubmitted}
                >
                  {isSubmitted ? (
                    <>
                      <span>✓</span>
                      <span>Subscribed!</span>
                    </>
                  ) : (
                    <>
                      <span>Subscribe Now</span>
                      <Send size={20} />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};