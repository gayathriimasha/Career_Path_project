import React from 'react';

interface CheckboxQuestionProps {
    question: string;
    options: string[];
    selectedValues: string[];
    onSelect: (values: string[]) => void;
}

export const CheckboxQuestion: React.FC<CheckboxQuestionProps> = ({
    question,
    options,
    selectedValues,
    onSelect
}) => {
    const handleToggle = (option: string) => {
        const newValues = selectedValues.includes(option)
            ? selectedValues.filter(v => v !== option)
            : [...selectedValues, option];
        onSelect(newValues);
    };

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-6 text-white">
                {question}
            </h2>
            <p className="text-sm text-gray-400 mb-4">
                Select all that apply (you can choose multiple options)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {options.map((option, index) => (
                    <label
                        key={index}
                        className="flex items-center space-x-3 p-3 rounded-lg border border-gray-600 hover:bg-gray-700 cursor-pointer transition-colors bg-gray-800"
                    >
                        <input
                            type="checkbox"
                            checked={selectedValues.includes(option)}
                            onChange={() => handleToggle(option)}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                        />
                        <span className="text-lg text-gray-200 capitalize">{option}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};
