import React from 'react';
import { BookOpen, Github } from 'lucide-react';
import { Button } from './ui/button';

export const Navbar = () => {
  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand Name */}
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-learning-600" />
            <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-learning-600 to-learning-800 text-transparent bg-clip-text">
              LearnStreamly
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="#features"
              className="text-learning-600 hover:text-learning-800 px-3 py-2 rounded-md text-sm font-medium"
            >
              Features
            </a>
            <a
              href="#about"
              className="text-learning-600 hover:text-learning-800 px-3 py-2 rounded-md text-sm font-medium"
            >
              About
            </a>
            <Button
              variant="outline"
              size="sm"
              className="ml-4"
              onClick={() => window.open('https://github.com/Avinash1286/youtube-course-maker', '_blank')}
            >
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
