import React from 'react';
import { useData } from '../context/DataContext';
import Card from './ui/Card';
import Section from './ui/Section';

const Features: React.FC = () => {
  const { featuresData } = useData();

  if (!featuresData || !featuresData.experience || !featuresData.occasions) return null;

  const { experience, occasions, grid } = featuresData;
  const summary =
    experience.text ||
    'London Karaoke Club delivers premium private karaoke in Soho with engineered sound, private layouts, and service designed for smooth, high-energy nights. From birthdays and team socials to late-night celebrations, each booking is built for groups who want atmosphere, control, and quality in one central destination.';

  return (
    <Section className="border-t border-white/10 bg-black">
      <div className="grid items-start gap-6 md:grid-cols-6 lg:grid-cols-12 lg:gap-10">
        <div className="md:col-span-3 lg:col-span-6">
          <h2 className="mb-5 text-2xl font-black leading-tight text-white md:text-3xl">Ultimate Karaoke Experience</h2>
          <p className="max-w-xl text-base leading-6 text-zinc-300 md:text-lg md:leading-7">{summary}</p>

          <ul className="mt-6 space-y-3 text-sm text-zinc-200">
            {[
              'Private rooms for 10–50+ guests',
              '80,000+ songs, updated monthly',
              'Studio-quality sound and lighting',
              'Open until 3am in Soho',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-yellow-300" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <Card className="overflow-hidden md:col-span-3 lg:col-span-6">
          {experience?.image ? (
            <>
              <img src={experience.image} alt="Interior of London Karaoke Club" className="hidden h-[420px] w-full object-cover md:block" loading="lazy" />
              <img src={experience.mobileImage || experience.image} alt="Interior of London Karaoke Club" className="block h-[320px] w-full object-cover md:hidden" loading="lazy" />
            </>
          ) : (
            <div className="flex h-[320px] items-center justify-center bg-zinc-950 text-xs font-bold uppercase tracking-[0.08em] text-zinc-500 md:h-[420px]">
              Add Experience Image In Admin
            </div>
          )}
        </Card>
      </div>

      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {(occasions?.items || []).map((item, idx) => (
          <Card key={idx} className="p-6">
            <h3 className="mb-2 text-lg font-bold text-white">{item.title}</h3>
            <p className="text-sm leading-relaxed text-zinc-400">{item.text}</p>
          </Card>
        ))}
      </div>

      <div className="mt-14">
        <h3 className="mb-5 text-2xl font-black text-white md:text-3xl">{grid?.heading}</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {(grid?.items || []).map((item, idx) => (
            <Card key={idx} className="overflow-hidden">
              {item.image ? (
                <img src={item.image} alt={item.title} className="h-44 w-full object-cover" loading="lazy" />
              ) : (
                <div className="flex h-44 w-full items-center justify-center bg-zinc-950 text-[10px] font-bold uppercase tracking-[0.08em] text-zinc-500">Add Card Image</div>
              )}
              <div className="p-5">
                <h4 className="mb-2 font-bold text-white">{item.title}</h4>
                <p className="text-sm leading-relaxed text-zinc-400">{item.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Features;
