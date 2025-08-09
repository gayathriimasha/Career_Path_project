import React from 'react'; // Ensure React is imported if not already

interface NavigationButtonsProps {
    currentIndex: number;
    totalQuestions: number;
    canProceed: boolean;
    onPrevious: () => void;
    onNext: () => void;
    isSubmitting?: boolean;
}

export function NavigationButtons({ 
    currentIndex, 
    totalQuestions, 
    canProceed, 
    onPrevious, 
    onNext,
    isSubmitting = false
}: NavigationButtonsProps) {
    const isLastQuestion = currentIndex === totalQuestions - 1;

    return (
        <div className="flex justify-between items-center pt-6">
            <button
                onClick={onPrevious}
                disabled={currentIndex === 0 || isSubmitting}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200"
            >
                Previous
            </button>

            <button
                onClick={onNext}
                disabled={!canProceed || isSubmitting}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
                {isSubmitting ? (
                    <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Submitting...</span>
                    </>
                ) : (
                    <span>{isLastQuestion ? 'Submit Assessment' : 'Next'}</span>
                )}
            </button>
        </div>
    );
}