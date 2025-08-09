import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitted(true);
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
    <section id="contact" className="flex py-16 justify-between items-end" style={{ paddingLeft: '20px', paddingRight: '80px', minHeight: '700px' }}>

      <div className="flex items-end justify-end h-full" style={{ width: '610px', minHeight: '700px' }}>
        <img
          src="https://api.builder.io/api/v1/image/assets/9ac5b116d2de4a019ba47842cc0d1e27/71d9af65f9e389bd14327500a57f321fb1b14730?placeholderIfAbsent=true"
          alt="Career Insights Illustration"
          className="rounded-[30px] object-cover"
          style={{
            width: '90%',
            height: '90%'
          }}
        />
      </div>

      <div className="max-w-[600px] text-right flex flex-col justify-end h-full">
        <div>
          <h2 className="text-white leading-tight mb-8" style={{ fontFamily: 'Questrial', fontSize: '62px', fontWeight: 400, textAlign: 'right' }}>
            Stay connected with<br />personalized career<br />insights
          </h2>

          <form onSubmit={handleSubmit} className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email to connect with us"
                className="w-full h-14 px-6 bg-white border border-gray-600 rounded-full text-black placeholder-gray-500 focus:bg-transparent focus:text-white focus:placeholder-gray-400 focus:border-white focus:outline-none transition-all duration-300"
                required
                disabled={isSubmitted}
              />
            </div>
            <Button
              type="submit"
              className={`w-14 h-14 rounded-full p-0 transition-all duration-300 ${isSubmitted
                ? 'bg-green-500 hover:bg-green-500'
                : 'bg-white hover:bg-gray-100'
                }`}
              disabled={isSubmitted}
            >
              {isSubmitted ? (
                <span className="text-white text-2xl">✓</span>
              ) : (
                <ArrowForwardIcon
                  className="text-black"
                  fontSize="large"
                />
              )}
            </Button>
          </form>
        </div>
      </div>


    </section>
  );
};