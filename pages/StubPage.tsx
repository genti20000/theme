import React from 'react';

interface StubPageProps {
  title: string;
  description?: string;
}

const StubPage: React.FC<StubPageProps> = ({ title, description = 'Coming soon.' }) => {
  return (
    <section className="bg-black min-h-screen text-white py-20 md:py-28">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">{title}</h1>
        <p className="text-gray-400 text-lg">{description}</p>
      </div>
    </section>
  );
};

export default StubPage;
