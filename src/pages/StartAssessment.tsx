import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StartAssessment() {
    const navigate = useNavigate();

    const handleStart = () => {
        navigate('/questionnaire');
    };

    return (
        <div className="min-h-screen bg-[#1a1a1a] text-white overflow-hidden px-[80px] py-[0px]">
            <div className="max-w-[1766px] mr-auto pt-[80px] flex flex-col gap-[67px] text-left">
                {/* Main Content Container */}
                <div className="relative bg-black rounded-[30px] h-[656px] overflow-hidden">
                    <div className="absolute left-[50px] top-[43px] w-[calc(100%-100px)] flex flex-col gap-[58px]">
                        {/* Header Section */}
                        <div className="flex flex-col items-start gap-[60px]">
                            {/* Main Title */}
                            <h1 className="text-left text-white text-[60px] font-normal font-['Questrial'] leading-tight">
                                Begin your Guided Journey!
                            </h1>
                            
                            {/* Description Section */}
                            <div className="flex flex-col gap-[35px]">
                                {/* Main Description */}
                                <div className="text-left">
                                    <span className="text-[#656565] text-[34px] font-['Poppins'] font-normal leading-[51.6px]">
                                        Let's start with some background. We'll ask about your personal and academic interests to tailor your career path recommendations. This process will take about{" "}
                                    </span>
                                    <span className="text-[#ABE6C4] text-[34px] font-['Poppins'] font-normal leading-[51.6px]">
                                        20 minutes
                                    </span>
                                </div>
                                
                                {/* Privacy Notice */}
                                <div className="text-left text-[#C3C3C3] text-[15px] font-['Poppins'] font-normal underline leading-[18.57px]">
                                    Your data is private and secure. You can review or delete it anytime.
                                </div>
                            </div>
                        </div>
                        
                        {/* Assessment Details */}
                        <div className="flex flex-col gap-[21px] items-start">
                            <div className="text-white text-[17px] font-['Poppins'] font-normal text-left">
                                This assessment has 15 quick questions about your favorite subjects, hobbies, and problem-solving style.
                            </div>
                            <div className="text-white text-[17px] font-['Poppins'] font-normal text-left">
                                Your answers will help us match you with careers that fit your interests and goals.
                            </div>
                            <div className="text-white text-[17px] font-['Poppins'] font-normal text-left">
                                Answer honestly! The more truthful you are, the more accurate your career suggestions will be.
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Button Section */}
                <div className="flex items-center justify-start gap-[38px] relative w-full">
                    {/* Button Background with Blur Effect */}
                    <div className="absolute left-0 w-full h-[70px] bg-gradient-to-b from-white to-[#DCDCDC] rounded-[60px] shadow-lg blur-[1.7px]" />
                    
                    {/* Button Content */}
                    <button
                        onClick={handleStart}
                        className="relative w-full h-[70px] flex items-center justify-center bg-gradient-to-b from-white to-[#DCDCDC] rounded-[60px] shadow-lg hover:from-[#f5f5f5] hover:to-[#d0d0d0] transition-all duration-200 cursor-pointer"
                    >
                        <span className="text-[#4D4D4D] text-[16px] font-['Poppins'] font-normal capitalize">
                            Continue with Assessment
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}