import React from 'react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <section className="flex-grow flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-600 text-white px-6">
        <div className="max-w-3xl text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to my project RMS</h1>
          <p className="text-lg leading-relaxed">
            This project is created by Naveen Kumar with the help of ReactJS, NodeJS, ExpressJS, MongoDB, and various frameworks.
            Here Naveen takes lots of reference from online documentation and AI tool - ChatGPT.
          </p>
        </div>
      </section>
    </div>
  );
}
