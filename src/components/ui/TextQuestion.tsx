import React from 'react';

interface TextQuestionProps {
    question: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: 'text' | 'email';
}

export const TextQuestion: React.FC<TextQuestionProps> = ({
    question,
    value,
    onChange,
    placeholder = "Type your answer here...",
    type = 'text'
}) => {
    // For short questions like name/email, use input field
    const isShortAnswer = question.toLowerCase().includes('name') ||
        question.toLowerCase().includes('email') ||
        type === 'email';

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-6 text-white">
                {question}
            </h2>
            {isShortAnswer ? (
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full p-4 bg-white border border-gray-300 rounded-lg text-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white"
                />
            ) : (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    rows={4}
                    className="w-full p-4 bg-white border border-gray-300 rounded-lg text-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none focus:bg-white"
                />
            )}
        </div>
    );
};
