
import React from 'react';
import { useData } from '../context/DataContext';

const Battery: React.FC = () => {
  const { batteryData } = useData();

  return (
    <section className="py-24 md:py-48 bg-black">
      <div className="container mx-auto px-6 text-center">
        <div className="relative inline-block">
          <svg className="w-64 h-64" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="#27272a" strokeWidth="6" />
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#ec4899"
              strokeWidth="6"
              strokeDasharray="339.292"
              strokeDashoffset="0"
              transform="rotate(-90 60 60)"
              className="transition-all duration-1000 ease-in-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col justify-center items-center">
            <p className="text-sm text-pink-400">{batteryData.statPrefix}</p>
            <p className="text-7xl font-bold">{batteryData.statNumber}</p>
            <p className="text-lg">{batteryData.statSuffix}</p>
          </div>
        </div>
        <p className="mt-4 text-xl text-gray-400">{batteryData.subText}</p>
      </div>
    </section>
  );
};

export default Battery;
