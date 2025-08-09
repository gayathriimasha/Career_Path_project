import React from 'react';
import { motion } from 'framer-motion';

interface Category {
    name: string;
    startQuestion: number;
    endQuestion: number;
    displayName: string;
}

interface InlineProgressTrackerProps {
    currentQuestionIndex: number;
    totalQuestions: number;
    answers: any[];
}

const categories: Category[] = [
    { name: 'start', startQuestion: 1, endQuestion: 3, displayName: 'START' },
    { name: 'personal-traits', startQuestion: 4, endQuestion: 11, displayName: 'PERSONAL TRAITS' },
    { name: 'career-matches', startQuestion: 12, endQuestion: 25, displayName: 'YOUR CAREER MATCHES' }
];

export const InlineProgressTracker: React.FC<InlineProgressTrackerProps> = ({
    currentQuestionIndex,
    totalQuestions,
    answers
}) => {
    const currentQuestionNumber = currentQuestionIndex + 1;

    const getCurrentCategory = (): Category => {
        return categories.find(cat =>
            currentQuestionNumber >= cat.startQuestion && currentQuestionNumber <= cat.endQuestion
        ) || categories[0];
    };

    const isCategoryCompleted = (category: Category): boolean => {
        const categoryQuestions = [];
        for (let i = category.startQuestion; i <= category.endQuestion; i++) {
            categoryQuestions.push(i);
        }

        return categoryQuestions.every(questionId =>
            answers.some(answer => answer.questionId === questionId && answer.value !== '')
        );
    };

    const getCurrentCategoryProgress = (): number => {
        const currentCategory = getCurrentCategory();
        const questionsInCategory = currentCategory.endQuestion - currentCategory.startQuestion + 1;
        const currentPositionInCategory = currentQuestionNumber - currentCategory.startQuestion + 1;
        return (currentPositionInCategory / questionsInCategory) * 100;
    };

    const currentCategory = getCurrentCategory();

    return (
        <div className="bg-gray-800 rounded-lg p-6 w-full">
            <div className="flex items-center justify-between">

                {/* Start Category */}
                <div className="flex flex-col items-center">
                    {isCategoryCompleted(categories[0]) ? (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mb-2"
                        >
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </motion.div>
                    ) : (
                        <div className={`w-10 h-10 rounded-full border-2 mb-2 ${currentCategory.name === 'start' ? 'border-blue-500 bg-blue-500' : 'border-gray-500 bg-gray-700'
                            }`}></div>
                    )}
                    <span className="text-sm font-medium text-gray-300">START</span>
                </div>

                {/* Line 1 with Progress */}
                <div className="flex-1 mx-4 relative">
                    <div className="h-1 bg-gray-600 rounded-full">
                        {currentCategory.name === 'start' && (
                            <motion.div
                                className="h-full bg-blue-500 rounded-full"
                                initial={{ width: '0%' }}
                                animate={{ width: `${getCurrentCategoryProgress()}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        )}
                        {isCategoryCompleted(categories[0]) && (
                            <div className="h-full bg-green-500 rounded-full w-full" />
                        )}
                    </div>
                </div>

                {/* Personal Traits Category */}
                <div className="flex flex-col items-center">
                    {isCategoryCompleted(categories[1]) ? (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mb-2"
                        >
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </motion.div>
                    ) : (
                        <div className={`w-10 h-10 rounded-full border-2 mb-2 ${currentCategory.name === 'personal-traits' ? 'border-blue-500 bg-blue-500' : 'border-gray-500 bg-gray-700'
                            }`}></div>
                    )}
                    <span className="text-sm font-medium text-gray-300 text-center">PERSONAL<br />TRAITS</span>
                </div>

                {/* Line 2 with Progress */}
                <div className="flex-1 mx-4 relative">
                    <div className="h-1 bg-gray-600 rounded-full">
                        {currentCategory.name === 'personal-traits' && (
                            <motion.div
                                className="h-full bg-blue-500 rounded-full"
                                initial={{ width: '0%' }}
                                animate={{ width: `${getCurrentCategoryProgress()}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        )}
                        {isCategoryCompleted(categories[1]) && (
                            <div className="h-full bg-green-500 rounded-full w-full" />
                        )}
                    </div>
                </div>

                {/* Career Matches Category */}
                <div className="flex flex-col items-center">
                    {isCategoryCompleted(categories[2]) ? (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mb-2"
                        >
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </motion.div>
                    ) : (
                        <div className={`w-10 h-10 rounded-full border-2 mb-2 ${currentCategory.name === 'career-matches' ? 'border-blue-500 bg-blue-500' : 'border-gray-500 bg-gray-700'
                            }`}></div>
                    )}
                    <span className="text-sm font-medium text-gray-300 text-center">YOUR CAREER<br />MATCHES</span>
                </div>
            </div>

            {/* Current Category Display */}
            <div className="mt-4 text-center">
                <motion.div
                    key={currentCategory.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-lg font-semibold text-blue-400"
                >
                    Current: {currentCategory.displayName}
                </motion.div>
            </div>
        </div>
    );
};
