import React from 'react';

interface RadioQuestionProps {
    question: string;
    options: string[];
    selectedValue: string;
    onSelect: (value: string) => void;
}

export const RadioQuestion: React.FC<RadioQuestionProps> = ({
    question,
    options,
    selectedValue,
    onSelect
}) => {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-6 text-white">
                {question}
            </h2>
            <div className="space-y-3">
                {options.map((option, index) => (
                    <label
                        key={index}
                        className="flex items-center space-x-3 p-3 rounded-lg border border-gray-600 hover:bg-gray-700 cursor-pointer transition-colors bg-gray-800"
                    >
                        <input
                            type="radio"
                            name="question"
                            value={option}
                            checked={selectedValue === option}
                            onChange={() => onSelect(option)}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-lg text-gray-200">{option}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};
