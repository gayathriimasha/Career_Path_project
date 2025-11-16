import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
    return (
        <footer className="w-full bg-black border-t border-gray-800 py-16">
            <div className="max-w-7xl mx-auto px-[80px]">
                <div className="grid grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="col-span-1">
                        <img src="/logo.svg" alt="Guided" className="h-8 mb-4" style={{ filter: 'brightness(0) invert(1)' }} />
                        <p className="text-gray-400 font-['Poppins'] text-sm leading-relaxed">
                            AI-powered career guidance for the next generation.
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h3 className="text-white font-['Questrial'] text-lg mb-4">Product</h3>
                        <ul className="space-y-2">
                            <li><a href="#overview" className="text-gray-400 hover:text-[#ABE6C4] font-['Poppins'] text-sm transition-colors">Features</a></li>
                            <li><a href="#services" className="text-gray-400 hover:text-[#ABE6C4] font-['Poppins'] text-sm transition-colors">Services</a></li>
                            <li><a href="/start-assessment" className="text-gray-400 hover:text-[#ABE6C4] font-['Poppins'] text-sm transition-colors">Assessment</a></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-white font-['Questrial'] text-lg mb-4">Company</h3>
                        <ul className="space-y-2">
                            <li><a href="#mission" className="text-gray-400 hover:text-[#ABE6C4] font-['Poppins'] text-sm transition-colors">Mission</a></li>
                            <li><a href="#contact" className="text-gray-400 hover:text-[#ABE6C4] font-['Poppins'] text-sm transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="text-white font-['Questrial'] text-lg mb-4">Connect</h3>
                        <div className="flex gap-3">
                            <motion.a
                                whileHover={{ scale: 1.1, y: -2 }}
                                href="#"
                                className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 hover:border-[#ABE6C4] flex items-center justify-center transition-colors"
                            >
                                <Twitter className="text-gray-400 hover:text-[#ABE6C4]" size={18} />
                            </motion.a>
                            <motion.a
                                whileHover={{ scale: 1.1, y: -2 }}
                                href="#"
                                className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 hover:border-[#ABE6C4] flex items-center justify-center transition-colors"
                            >
                                <Linkedin className="text-gray-400 hover:text-[#ABE6C4]" size={18} />
                            </motion.a>
                            <motion.a
                                whileHover={{ scale: 1.1, y: -2 }}
                                href="#"
                                className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 hover:border-[#ABE6C4] flex items-center justify-center transition-colors"
                            >
                                <Github className="text-gray-400 hover:text-[#ABE6C4]" size={18} />
                            </motion.a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-800 flex justify-between items-center">
                    <p className="text-gray-500 font-['Poppins'] text-sm">
                        © 2024 Guided. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-gray-500 hover:text-[#ABE6C4] font-['Poppins'] text-sm transition-colors">Privacy Policy</a>
                        <a href="#" className="text-gray-500 hover:text-[#ABE6C4] font-['Poppins'] text-sm transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};