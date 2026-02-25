import React from 'react';

interface SectionProps {
  id?: string;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ id, className = '', containerClassName = '', children }) => {
  return (
    <section id={id} className={`py-16 md:py-20 lg:py-28 ${className}`}>
      <div className={`mx-auto w-full max-w-[1200px] px-5 md:px-8 ${containerClassName}`}>{children}</div>
    </section>
  );
};

export default Section;
