import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-4 px-6 flex justify-between items-center">
      <div>© 2025 Naveen Kumar</div>
      <div className="flex space-x-6 text-2xl">
        <a
          href="https://github.com/Ojhanaveen"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="hover:text-white transition-colors duration-200"
        >
          <FaGithub />
        </a>
        <a
          href="https://www.linkedin.com/in/naveenkr1/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="hover:text-white transition-colors duration-200"
        >
          <FaLinkedin />
        </a>
      </div>
    </footer>
  );
}
