import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Question, Answer } from "../types/question";
import { questionsData } from "../data/questions";
import { RadioQuestion } from "../components/ui/RadioQuestion";
import { TextQuestion } from "../components/ui/TextQuestion";
import { CheckboxQuestion } from "../components/ui/CheckboxQuestion";
import { NavigationButtons } from "../components/ui/NavigationButtons";
import { VerticalProgressTracker } from "../components/ui/VerticalProgressTracker";
import { Header } from "../components/Header";

// Common styles
const commonStyles = {
    container: "min-h-screen bg-[#1a1a1a] text-white px-[50px] py-[32px]",
    questionBox: "w-full h-[60px] px-[19px] py-[22px] rounded-[15px] flex justify-start items-center gap-[10px] cursor-pointer transition-all duration-200",
    questionText: "text-[17px] font-normal font-['Questrial']",
    mainContainer: "w-full max-w-[1095px] h-[700px] px-[71px] py-[75px] bg-white rounded-[30px] flex flex-col justify-start items-start gap-[10px]",
    button: "px-[10px] py-[7px] rounded-[8px] flex items-center gap-[7px] border-none transition-all duration-200"
};

// Animation variants
const motionVariants = {
    initial: (direction: number) => ({
        opacity: 0,
        x: direction === 1 ? 300 : -300,
    }),
    animate: {
        opacity: 1,
        x: 0,
    },
    exit: (direction: number) => ({
        opacity: 0,
        x: direction === 1 ? -300 : 300,
    })
};

export default function Questionnaire() {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [direction, setDirection] = useState<number>(1);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [submitError, setSubmitError] = useState<string>("");
    const [isCompleted, setIsCompleted] = useState<boolean>(false);
    const navigate = useNavigate(); // Initialize useNavigate

    const currentQuestion = questionsData[currentIndex];

    const getAnswer = (questionId: number): string | string[] => {
        const answer = answers.find(a => a.questionId === questionId);
        return answer?.value || (currentQuestion.type === 'checkbox' ? [] : '');
    };

    const setAnswer = (questionId: number, value: string | string[]) => {
        const newAnswers = answers.filter(a => a.questionId !== questionId);
        newAnswers.push({ questionId, value });
        setAnswers(newAnswers);
        if (submitError) {
            setSubmitError("");
        }
    };

    const canProceed = (): boolean => {
        const answer = getAnswer(currentQuestion.id);
        if (currentQuestion.type === 'checkbox') {
            return Array.isArray(answer) && answer.length > 0;
        }
        return answer !== '';
    };

    const submitAssessment = async () => {
        setIsSubmitting(true);
        setSubmitError("");

        try {
            const userName = answers.find(a => a.questionId === 1)?.value as string;
            const userEmail = answers.find(a => a.questionId === 2)?.value as string;

            if (!userName || !userEmail) {
                throw new Error('Name and email are required for submission.');
            }
            
            if (answers.length < questionsData.length) {
                throw new Error('Please answer all questions before submitting.');
            }

            const response = await fetch('http://localhost:5000/api/assessments/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userEmail,
                    userEmail,
                    userName,
                    answers
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit assessment');
            }

            const result = await response.json();
            console.log('Assessment submitted successfully:', result);
            
            setIsCompleted(true);
            navigate(`/results?email=${encodeURIComponent(userEmail)}`); // Navigate using React Router
            
        } catch (error) {
            console.error('Error submitting assessment:', error);
            setSubmitError(error instanceof Error ? error.message : 'Error submitting assessment. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const nextQuestion = () => {
        if (!canProceed()) {
            setSubmitError("Please answer the current question before proceeding.");
            return;
        }
        
        setDirection(1);
        if (currentIndex < questionsData.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            submitAssessment();
        }
    };

    const prevQuestion = () => {
        setDirection(-1);
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setSubmitError("");
        }
    };

    const restartQuestionnaire = () => {
        setCurrentIndex(0);
        setAnswers([]);
        setIsCompleted(false);
        setSubmitError("");
        setIsSubmitting(false);
        setDirection(1);
    };

    interface BaseQuestionProps {
        question: string;
    }

    interface RadioQuestionProps extends BaseQuestionProps {
        options: string[];
        selectedValue: string;
        onSelect: (value: string) => void;
    }

    interface TextQuestionProps extends BaseQuestionProps {
        value: string;
        onChange: (value: string) => void;
        type: string;
        placeholder: string;
    }

    interface CheckboxQuestionProps extends BaseQuestionProps {
        options: string[];
        selectedValues: string[];
        onSelect: (values: string[]) => void;
    }

    const StyledQuestionContainer: React.FC<{ question: string; children: React.ReactNode; isLastQuestion?: boolean }> = ({ question, children, isLastQuestion }) => (
        <div className="flex flex-col justify-start items-start gap-[40px]">
            <div className="w-full text-black text-[28px] font-normal font-['Questrial'] leading-tight">
                {question}
            </div>
            <div className={isLastQuestion ? "w-full grid grid-cols-3 gap-[15px]" : "w-full flex flex-col gap-[15px]"}>
                {children}
            </div>
        </div>
    );

    const StyledRadioQuestion: React.FC<RadioQuestionProps> = ({ question, options, selectedValue, onSelect }) => {
        const isLastQuestion = currentIndex === questionsData.length - 1;
        
        return (
            <StyledQuestionContainer question={question} isLastQuestion={isLastQuestion}>
                {options.map((option: string, index: number) => (
                    <div 
                        key={index}
                        onClick={() => onSelect(option)}
                        className={`${commonStyles.questionBox} ${
                            selectedValue === option ? 'bg-[#A9DFC1]' : 'bg-[#E0E3E4]'
                        }`}
                    >
                        <div className={`${commonStyles.questionText} ${
                            selectedValue === option ? 'text-black' : 'text-black/50'
                        }`}>
                            {option}
                        </div>
                    </div>
                ))}
            </StyledQuestionContainer>
        );
    };

    const StyledTextQuestion: React.FC<TextQuestionProps> = ({ question, value, onChange, type, placeholder }) => (
        <StyledQuestionContainer question={question}>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                placeholder={placeholder}
                className={`${commonStyles.questionBox} bg-[#E0E3E4] border-none outline-none text-black box-border`}
            />
        </StyledQuestionContainer>
    );

    const StyledCheckboxQuestion: React.FC<CheckboxQuestionProps> = ({ question, options, selectedValues, onSelect }) => {
        const isLastQuestion = currentIndex === questionsData.length - 1;
        
        return (
            <StyledQuestionContainer question={question} isLastQuestion={isLastQuestion}>
                {options.map((option: string, index: number) => {
                    const isSelected = selectedValues.includes(option);
                    return (
                        <div 
                            key={index}
                            onClick={() => {
                                const newValues = isSelected 
                                    ? selectedValues.filter((v: string) => v !== option)
                                    : [...selectedValues, option];
                                onSelect(newValues);
                            }}
                            className={`${commonStyles.questionBox} ${
                                isSelected ? 'bg-[#A9DFC1]' : 'bg-[#E0E3E4]'
                            }`}
                        >
                            <div className={`${commonStyles.questionText} ${
                                isSelected ? 'text-black' : 'text-black/50'
                            }`}>
                                {option}
                            </div>
                        </div>
                    );
                })}
            </StyledQuestionContainer>
        );
    };

    const renderQuestion = () => {
        const answer = getAnswer(currentQuestion.id);
        
        switch (currentQuestion.type) {
            case 'radio':
                return (
                    <StyledRadioQuestion
                        question={currentQuestion.text}
                        options={currentQuestion.options || []}
                        selectedValue={answer as string}
                        onSelect={(value: string) => setAnswer(currentQuestion.id, value)}
                    />
                );
            case 'text':
                return (
                    <StyledTextQuestion
                        question={currentQuestion.text}
                        value={answer as string}
                        onChange={(value: string) => setAnswer(currentQuestion.id, value)}
                        type={currentQuestion.id === 2 ? 'email' : 'text'}
                        placeholder={
                            currentQuestion.id === 1 ? "Enter your full name" :
                                currentQuestion.id === 2 ? "Enter your email address" :
                                    "Type your answer here..."
                        }
                    />
                );
            case 'checkbox':
                return (
                    <StyledCheckboxQuestion
                        question={currentQuestion.text}
                        options={currentQuestion.options || []}
                        selectedValues={answer as string[]}
                        onSelect={(values: string[]) => setAnswer(currentQuestion.id, values)}
                    />
                );
            default:
                return null;
        }
    };

    if (isCompleted && !submitError) {
        return (
            <div className="min-h-screen bg-[#1a1a1a] text-white px-[50px] py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="bg-gray-800 rounded-lg p-12 shadow-xl"
                        >
                            <div className="mb-8">
                                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h1 className="text-4xl font-bold mb-4 text-green-400">Assessment Completed!</h1>
                                <p className="text-xl text-gray-300 mb-8">
                                    Redirecting to your results...
                                </p>
                            </div>
                            
                            <div className="space-y-4">
                                <button
                                    onClick={restartQuestionnaire}
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                                >
                                    Take Assessment Again
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#1a1a1a] text-white px-[50px] py-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-bold mb-4">Interactive Questionnaire</h1>
                    <p className="text-gray-400">Please answer all questions to complete the survey</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-screen">
                    {/* Left Column - Questionnaire */}
                    <div className="lg:col-span-8 flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={motionVariants.initial(direction)}
                                animate={motionVariants.animate}
                                exit={motionVariants.exit(direction)}
                                transition={{
                                    duration: 0.4,
                                    ease: "easeInOut",
                                }}
                                className={commonStyles.mainContainer}
                            >
                                <div className="w-full flex flex-col gap-6">
                                    <div className="w-full flex justify-between items-center">
                                        <span className="text-gray-400">
                                            Question {currentIndex + 1} of {questionsData.length}
                                        </span>
                                    </div>

                                    <div className="w-full">
                                        {renderQuestion()}
                                    </div>

                                    {/* Error message */}
                                    {submitError && (
                                        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
                                            <p className="text-sm">{submitError}</p>
                                        </div>
                                    )}

                                    {/* Loading state for submission */}
                                    {isSubmitting && (
                                        <div className="bg-blue-900/50 border border-blue-500 text-blue-200 px-4 py-3 rounded-lg">
                                            <div className="flex items-center space-x-2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                                                <p className="text-sm">Submitting your assessment...</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="w-full flex justify-between items-center">
                                        <div className="flex justify-center items-center gap-[1.875rem]">
                                            {currentIndex > 0 && (
                                                <button
                                                    onClick={prevQuestion}
                                                    className={`${commonStyles.button} bg-[#ECECEC] cursor-pointer`}
                                                >
                                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M2.86875 5.25L12 5.25L12 6.75L2.86875 6.75L7.06875 10.95L6 12L5.24537e-07 6L6 -5.24537e-07L7.06875 1.05L2.86875 5.25Z" fill="#5C5C5C"/>
                                                    </svg>
                                                    <span className="text-[#707172] text-[17px] font-medium font-['Poppins']">
                                                        Previous Question
                                                    </span>
                                                </button>
                                            )}
                                        </div>
                                        <button
                                            onClick={nextQuestion}
                                            disabled={!canProceed() || isSubmitting}
                                            className={`${commonStyles.button} ${
                                                canProceed() && !isSubmitting 
                                                    ? 'bg-[#212121] cursor-pointer' 
                                                    : 'bg-[#ECECEC] cursor-not-allowed'
                                            }`}
                                        >
                                            <span className={`text-[17px] font-medium font-['Poppins'] ${
                                                canProceed() && !isSubmitting ? 'text-white' : 'text-[#707172]'
                                            }`}>
                                                {currentIndex === questionsData.length - 1 ? 'Submit Assessment' : 'Next Question'}
                                            </span>
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9.13125 6.75H0V5.25H9.13125L4.93125 1.05L6 0L12 6L6 12L4.93125 10.95L9.13125 6.75Z" fill={canProceed() && !isSubmitting ? "white" : "#707172"}/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Right Column - Vertical Progress Tracker */}
                    <div className="lg:col-span-4 flex items-center justify-center">
                        <VerticalProgressTracker
                            currentQuestionIndex={currentIndex}
                            totalQuestions={questionsData.length}
                            answers={answers}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}