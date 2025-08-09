import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="w-full overflow-hidden">
            <div className="bg-black w-full pt-[135px] max-md:pt-[100px]">
                <img
                    src="/Footer.svg"
                    alt="Company footer illustration"
                    className="w-full h-auto object-cover"
                    style={{ display: 'block' }}
                />
            </div>
        </footer>
    );
};