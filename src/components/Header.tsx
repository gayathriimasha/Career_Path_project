import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { UserProfilePopup } from '../components/ui/UserProfilePopup';
import { User } from 'lucide-react';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const accountIconRef = useRef<HTMLDivElement>(null);

  const handleStartAssessment = () => {
    navigate('/start-assessment');
  };

  const handleCreateAccount = () => {
    navigate('/register');
  };

  const handleAccountClick = () => {
    // Check if user is authenticated
    const userToken = localStorage.getItem("userToken");
    if (!userToken) {
      // Redirect to login if not authenticated
      navigate('/login');
    } else {
      setIsProfilePopupOpen(!isProfilePopupOpen);
    }
  };

  const closeProfilePopup = () => {
    setIsProfilePopupOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 backdrop-blur-md bg-[#1a1a1a]/80 border-b border-gray-800"
      >
        <div className="flex items-center justify-between px-[80px] py-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img src="/logo.svg" alt="Guided" className="h-7" style={{ filter: 'brightness(0) invert(1)' }} />
          </motion.div>

          <nav className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="text-[#ABE6C4] hover:text-white hover:bg-gray-800/50 font-['Poppins'] text-base font-medium px-6 py-2 transition-all duration-300"
              onClick={handleStartAssessment}
            >
              Start Assessment
            </Button>
            <Button
              variant="ghost"
              className="text-white hover:text-[#ABE6C4] hover:bg-gray-800/50 font-['Poppins'] text-base font-medium px-6 py-2 transition-all duration-300"
              onClick={handleCreateAccount}
            >
              Create Account
            </Button>
            <div
              ref={accountIconRef}
              onClick={handleAccountClick}
              className="ml-2 w-10 h-10 rounded-full bg-gray-800 border border-gray-700 hover:border-[#ABE6C4] flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110"
            >
              <User className="text-gray-400 hover:text-[#ABE6C4]" size={20} />
            </div>
          </nav>
        </div>
      </motion.header>

      <UserProfilePopup
        isOpen={isProfilePopupOpen}
        onClose={closeProfilePopup}
        triggerRef={accountIconRef}
      />
    </>
  );
};