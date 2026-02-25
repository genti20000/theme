import React from 'react';

interface SectionProps {
  id?: string;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ id, className = '', containerClassName = '', children }) => {
  return (
    <section id={id} className={`py-16 md:py-24 ${className}`}>
      <div className={`container mx-auto px-6 ${containerClassName}`}>{children}</div>
    </section>
  );
};

export default Section;
