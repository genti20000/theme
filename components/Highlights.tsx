import React from 'react';
import { useData } from '../context/DataContext';
import Section from './ui/Section';

const Highlights: React.FC = () => {
  const { highlightsData } = useData();

  return (
    <Section className="border-t border-white/10 bg-[#0A0A0A]" containerClassName="space-y-12 md:space-y-16">
      <div className="mx-auto max-w-[720px] text-center">
        <h2 className="text-2xl font-black leading-tight text-white md:text-3xl">{highlightsData.heading}</h2>
        <p className="mt-4 text-base leading-6 text-zinc-300 md:text-lg md:leading-7">{highlightsData.subtext}</p>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
        {highlightsData.mainImageUrl ? (
          <>
            <img src={highlightsData.mainImageUrl} alt="Friends singing karaoke" className="hidden h-[60vh] w-full object-cover md:block" />
            <img src={highlightsData.mobileMainImageUrl || highlightsData.mainImageUrl} alt="Friends singing karaoke" className="block h-[52vh] w-full object-cover md:hidden" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-black/10" />
          </>
        ) : (
          <div className="flex h-[52vh] items-center justify-center text-sm font-bold uppercase tracking-widest text-zinc-500 md:h-[60vh]">Add Main Image In Admin</div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-6 lg:grid-cols-12 lg:gap-10">
        <div className="md:col-span-3 lg:col-span-6">
          <h3 className="mb-6 text-2xl font-black text-white md:text-3xl">{highlightsData.featureListTitle}</h3>
          <ul className="space-y-4 text-base leading-6 text-zinc-300 md:text-lg md:leading-7">
            {highlightsData.featureList.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckIcon />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3 lg:col-span-6">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
            {highlightsData.sideImageUrl ? (
              <img src={highlightsData.sideImageUrl} alt="Karaoke detail" className="h-[340px] w-full object-cover md:h-[420px]" loading="lazy" />
            ) : (
              <div className="flex h-[340px] items-center justify-center px-6 text-center text-xs font-bold uppercase tracking-widest text-zinc-500 md:h-[420px]">Add Side Image In Admin</div>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
};

const CheckIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="mt-1 h-4 w-4 flex-shrink-0 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

export default Highlights;
