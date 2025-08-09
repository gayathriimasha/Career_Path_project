import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface UserProfilePopupProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement>;
}

const UserProfilePopup: React.FC<UserProfilePopupProps> = ({ isOpen, onClose, triggerRef }) => {
  const [position, setPosition] = useState({ top: 0, right: 0 });

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: triggerRect.bottom + 10, // 10px gap below the trigger
        right: window.innerWidth - triggerRect.right, // Align right edge
      });
    }
  }, [isOpen, triggerRef]);

  const handleEditProfile = () => {
    // Handle edit profile action
    console.log('Edit profile clicked');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Profile Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed z-50"
            style={{
              top: `${position.top}px`,
              right: `${position.right}px`,
              width: '580px',
              height: '280px'
            }}
          >
            <div className="w-full h-full bg-[#1A1A1A] rounded-[25px] overflow-hidden shadow-2xl">
              <div className="absolute left-[40px] top-[40px] flex items-center gap-[30px]">
                {/* Profile Image */}
                <div className="w-[140px] h-[140px] relative overflow-hidden rounded-[15px]">
                  <div className="w-[140px] h-[140px] absolute left-0 top-0 bg-[#D9D9D9] rounded-[15px]" />
                  <img 
                    className="w-[140px] h-[140px] absolute left-0 top-0 object-cover" 
                    src="../public/profilephoto.png" 
                    alt="Profile"
                  />
                </div>
                
                {/* Profile Details */}
                <div className="w-[280px] flex flex-col gap-[22px]">
                  {/* Name */}
                  <div className="text-white text-[26px] font-['Poppins'] font-medium leading-tight">
                    Damien Lucius
                  </div>
                  
                  {/* Contact Info */}
                  <div className="w-full flex flex-col gap-[12px]">
                    <div className="text-[#707172] text-[14px] font-['Poppins'] font-medium">
                      damienlucius99@gmail.com
                    </div>
                    <div className="text-[#707172] text-[14px] font-['Poppins'] font-medium">
                      +94 71 563 8247
                    </div>
                  </div>
                  
                  {/* Edit Profile Button */}
                  <button
                    onClick={handleEditProfile}
                    className="py-[6px] px-[6px] pr-[8px] bg-[#212121] rounded-[6px] flex items-center gap-[6px] hover:bg-[#2a2a2a] transition-colors duration-200 w-fit"
                  >
                    <div className="relative">
                      <svg width="15" height="15" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.0328 1.59277L17.4078 3.96777L15.5973 5.77911L13.2223 3.40411L15.0328 1.59277ZM6.33398 12.6666H8.70898L14.4779 6.89773L12.1029 4.52273L6.33398 10.2916V12.6666Z" fill="#D4D4D4"/>
                        <path d="M15.0417 15.0417H6.45842C6.43783 15.0417 6.41646 15.0496 6.39588 15.0496C6.36975 15.0496 6.34363 15.0425 6.31671 15.0417H3.95833V3.95833H9.37888L10.9622 2.375H3.95833C3.08512 2.375 2.375 3.08433 2.375 3.95833V15.0417C2.375 15.9157 3.08512 16.625 3.95833 16.625H15.0417C15.4616 16.625 15.8643 16.4582 16.1613 16.1613C16.4582 15.8643 16.625 15.4616 16.625 15.0417V8.1795L15.0417 9.76283V15.0417Z" fill="#D4D4D4"/>
                      </svg>
                    </div>
                    <div className="text-[#707172] text-[11px] font-['Poppins'] font-medium">
                      Edit Profile
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export { UserProfilePopup };