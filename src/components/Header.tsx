import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { UserProfilePopup } from '../components/ui/userprofilepopup'; // Import the popup component

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const accountIconRef = useRef<HTMLImageElement>(null);

  const handleStartAssessment = () => {
    navigate('/start-assessment');
  };

  const handleCreateAccount = () => {
    navigate('/register');
  };

  const handleAccountClick = () => {
    // Toggle the profile popup instead of navigating to login
    setIsProfilePopupOpen(!isProfilePopupOpen);
  };

  const closeProfilePopup = () => {
    setIsProfilePopupOpen(false);
  };

  return (
    <>
      <header className="flex items-center justify-between px-[80px] py-10" style={{ backgroundColor: '#1a1a1a' }}>
        <img src="/logo.svg" alt="Guided" className="h-6" style={{ filter: 'brightness(0) invert(1)' }} />
        <nav className="flex items-center">
          <div className="flex items-center gap-0">
            <Button
              variant="ghost"
              className="hover:text-white hover:bg-transparent"
              style={{
                fontFamily: 'Poppins',
                fontSize: '23px',
                fontWeight: 500,
                background: 'linear-gradient(180deg, #abe6c4, #a9ddc0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
              onClick={handleStartAssessment}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'transparent';
                (e.currentTarget.style as any).webkitBackgroundClip = 'initial';
                e.currentTarget.style.backgroundClip = 'initial';
                (e.currentTarget.style as any).webkitTextFillColor = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(180deg, #abe6c4, #a9ddc0)';
                (e.currentTarget.style as any).webkitBackgroundClip = 'text';
                e.currentTarget.style.backgroundClip = 'text';
                (e.currentTarget.style as any).webkitTextFillColor = 'transparent';
              }}
            >
              Start Assessment
            </Button>
            <Button
              variant="ghost"
              className="text-white hover:text-[#A9DFC1] hover:bg-transparent"
              style={{ fontFamily: 'Poppins', fontSize: '23px', fontWeight: 500 }}
              onClick={handleCreateAccount}
            >
              Create Account
            </Button>
          </div>
          <img
            ref={accountIconRef}
            src="/account_circle.svg"
            alt="Account"
            className="w-[30px] h-[30px] cursor-pointer transition-all duration-300 ml-4"
            onClick={handleAccountClick}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = 'brightness(0) saturate(100%) invert(74%) sepia(25%) saturate(426%) hue-rotate(85deg) brightness(96%) contrast(90%)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = 'brightness(0) invert(1)';
            }}
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </nav>
      </header>

      {/* Profile Popup */}
      <UserProfilePopup 
        isOpen={isProfilePopupOpen}
        onClose={closeProfilePopup}
        triggerRef={accountIconRef}
      />
    </>
  );
};