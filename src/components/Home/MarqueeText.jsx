// src/components/MarqueeText.jsx
import React from 'react';

const MarqueeText = () => {
  const words = ['Repair', 'Roadside', 'Battery', 'Tow', 'Custom', 'Polish', 'Wash', 'Engine'];

  return (
    <div className="overflow-hidden bg-white py-6">
      <div className="flex animate-marquee gap-8 min-w-[200%] text-2xl md:text-4xl lg:text-5xl font-bold text-gray-300 whitespace-nowrap">
        {words.concat(words).map((word, index, arr) => (
          <span
            key={index}
            className="flex items-center hover:text-blue-600 transition-colors duration-300"
          >
            {word}
            {index !== arr.length - 1 && (
              <span className="mx-4 text-blue-600">✦</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MarqueeText;
