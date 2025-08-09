import React from 'react';
import { motion } from 'framer-motion';

interface Answer {
    questionId: number;
    value: string | string[];
}

interface VerticalProgressTrackerProps {
    currentQuestionIndex: number; // 0-based
    totalQuestions: number;
    answers: Answer[];
}

interface StepConfig {
    key: string;
    label: string;
    startQuestion: number; // 1-based
    endQuestion: number;   // 1-based
}

const steps: StepConfig[] = [
    { key: 'start', label: 'START', startQuestion: 1, endQuestion: 3 },
    { key: 'personality', label: 'PERSONALITY TRAITS', startQuestion: 4, endQuestion: 11 },
    { key: 'career', label: 'CAREER PREFERENCES', startQuestion: 12, endQuestion: 25 },
    { key: 'results', label: 'RESULTS', startQuestion: 25, endQuestion: 25 }
];

export const VerticalProgressTracker: React.FC<VerticalProgressTrackerProps> = ({
    currentQuestionIndex,
    totalQuestions,
    answers
}) => {
    const currentQuestionNumber = currentQuestionIndex + 1; // Convert to 1-based

    // Get current active step
    const getCurrentStep = (): number => {
        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            if (currentQuestionNumber >= step.startQuestion && currentQuestionNumber <= step.endQuestion) {
                return i;
            }
        }
        return 0; // Default to first step
    };

    // Check if a step is completed
    const isStepCompleted = (stepIndex: number): boolean => {
        const step = steps[stepIndex];
        const stepQuestions = [];
        
        for (let q = step.startQuestion; q <= step.endQuestion; q++) {
            stepQuestions.push(q);
        }

        return stepQuestions.every(questionId =>
            answers.some(answer => 
                answer.questionId === questionId && 
                (Array.isArray(answer.value) ? answer.value.length > 0 : answer.value !== '')
            )
        );
    };

    // Get progress percentage for current step
    const getCurrentStepProgress = (stepIndex: number): number => {
        const step = steps[stepIndex];
        const currentStep = getCurrentStep();
        
        if (stepIndex < currentStep) {
            return 100; // Previous steps are 100% complete
        } else if (stepIndex === currentStep) {
            // Calculate progress within current step
            const totalInStep = step.endQuestion - step.startQuestion + 1;
            const answeredInStep = answers.filter(answer => 
                answer.questionId >= step.startQuestion && 
                answer.questionId <= step.endQuestion &&
                (Array.isArray(answer.value) ? answer.value.length > 0 : answer.value !== '')
            ).length;
            
            return (answeredInStep / totalInStep) * 100;
        } else {
            return 0; // Future steps have 0% progress
        }
    };

    const currentStep = getCurrentStep();

    return (
        <div className="p-8 w-[100px] min-h-[100px] flex flex-col items-center justify-center">
            <div className="relative h-full w-full flex flex-col justify-between">
                {steps.map((step, stepIndex) => {
                    const isCompleted = isStepCompleted(stepIndex);
                    const isActive = stepIndex === currentStep;
                    const progress = getCurrentStepProgress(stepIndex);
                    
                    return (
                        <React.Fragment key={step.key}>
                            {/* Step Circle */}
                            <div className="relative flex flex-col items-center">
                                <motion.div
                                    initial={false}
                                    animate={{
                                        scale: isActive ? 1.2 : 1.1,
                                    }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className={`
                                        w-10 h-10 rounded-full border-2 flex items-center justify-center
                                        transition-all duration-500 relative z-10
                                        ${isCompleted ? 'bg-white border-white' : 
                                          isActive ? 'bg-white border-white' : 
                                          'bg-transparent border-gray-600'}
                                    `}
                                >
                                    {isCompleted ? (
                                        <motion.svg
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ 
                                                type: "spring",
                                                stiffness: 300,
                                                damping: 20,
                                                delay: 0.1
                                            }}
                                            className="w-7 h-7 text-black"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                                        </motion.svg>
                                    ) : isActive ? (
                                        <motion.div
                                            animate={{ 
                                                scale: [1, 1.2, 1],
                                                opacity: [0.7, 1, 0.7]
                                            }}
                                            transition={{ 
                                                repeat: Infinity, 
                                                duration: 2,
                                                ease: "easeInOut"
                                            }}
                                            className="w-5 h-5 bg-black rounded-full"
                                        />
                                    ) : null}
                                </motion.div>

                                {/* Step Label - Show for active step */}
                                {isActive && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20, scale: 0.8 }}
                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                        exit={{ opacity: 0, x: -20, scale: 0.8 }}
                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                        className="absolute left-20 top-1/2 transform -translate-y-1/2 translate-y-[-10px]
                                                 bg-white px-4 py-2 rounded-lg
                                                 text-black text-sm font-medium whitespace-nowrap
                                                 shadow-xl z-20"
                                    >
                                        {step.label}
                                        {/* Arrow pointing to circle */}
                                        <div className="absolute right-full top-1/2 transform -translate-y-1/2">
                                            <div className="border-r-8 border-r-white border-t-4 border-b-4 border-t-transparent border-b-transparent"></div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* Connecting Line (except after last step) */}
                            {stepIndex < steps.length - 1 && (
                                <div className="relative flex-1 w-0.5 bg-gray-600 mx-auto my-0 min-h-[120px]">
                                    {/* Progress Fill */}
                                    <motion.div
                                        initial={{ height: "0%" }}
                                        animate={{ 
                                            height: `${Math.min(progress, 100)}%`
                                        }}
                                        transition={{ 
                                            duration: 0.8, 
                                            ease: "easeOut",
                                            delay: 0.1
                                        }}
                                        className="absolute top-0 left-0 w-full bg-white origin-top"
                                    >
                                        
                                    </motion.div>
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>

            {/* Progress Indicator at Bottom */}
            <div className="mt-8 text-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-white text-sm font-medium"
                >
                    {currentStep + 1} / {steps.length}
                </motion.div>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep) / (steps.length - 1)) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="h-0.5 bg-white mt-3 rounded-full"
                    style={{ maxWidth: '80px' }}
                />
            </div>
        </div>
    );
};