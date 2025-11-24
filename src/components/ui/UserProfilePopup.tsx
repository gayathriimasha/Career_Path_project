import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserProfilePopupProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement>;
}

const UserProfilePopup: React.FC<UserProfilePopupProps> = ({ isOpen, onClose, triggerRef }) => {
  const navigate = useNavigate();
  const [position, setPosition] = useState({ top: 0, right: 0 });
  const [userData, setUserData] = useState<{ fullName: string; email: string } | null>(null);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: triggerRect.bottom + 10,
        right: window.innerWidth - triggerRect.right,
      });

      // Load user data from localStorage
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        try {
          const user = JSON.parse(userInfo);
          setUserData(user);
        } catch (error) {
          console.error("Error parsing user info:", error);
        }
      }
    }
  }, [isOpen, triggerRef]);

  const handleLogout = () => {
    console.log('✅ Logout successful');
    alert('Logged out successfully!');
    localStorage.removeItem("userToken");
    localStorage.removeItem("userInfo");
    onClose();
    navigate("/");
  };

  if (!userData) return null;

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
            }}
          >
            <div className="w-[320px] bg-[#1f1f1f] rounded-[20px] overflow-hidden shadow-2xl border border-gray-800">
              <div className="p-6">
                {/* Profile Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-[#ABE6C4]/10 flex items-center justify-center">
                    <User size={32} className="text-[#ABE6C4]" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white text-lg font-['Poppins'] font-medium leading-tight mb-1">
                      {userData.fullName}
                    </div>
                    <div className="text-gray-400 text-sm font-['Poppins']">
                      {userData.email}
                    </div>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-[12px] flex items-center justify-center gap-2 transition-all duration-200 border border-gray-700 hover:border-gray-600"
                >
                  <LogOut size={18} className="text-gray-400" />
                  <span className="text-gray-300 text-sm font-['Poppins'] font-medium">
                    Logout
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export { UserProfilePopup };