import React from 'react';
import { useData } from '../context/DataContext';
import Card from './ui/Card';
import Section from './ui/Section';

const Features: React.FC = () => {
  const { featuresData } = useData();

  if (!featuresData || !featuresData.experience || !featuresData.occasions) return null;

  const { experience, occasions, grid } = featuresData;

  return (
    <Section className="bg-black border-t border-zinc-900">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-yellow-300 font-black mb-4">Ultimate Karaoke Experience</p>
          <h2 className="text-3xl md:text-5xl font-black leading-tight text-white max-w-xl mb-5">{experience.heading}</h2>
          <p className="text-zinc-300 leading-relaxed max-w-xl">{experience.text}</p>

          <ul className="mt-6 space-y-3 text-sm text-zinc-200">
            {['Private rooms for 10–50+ guests', '80,000+ songs, updated monthly', 'Studio-quality sound and lighting', 'Open until 3am in Soho'].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-yellow-300" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <Card className="overflow-hidden">
          {experience?.image ? (
            <>
              <img src={experience.image} alt="Interior of London Karaoke Club" className="hidden md:block w-full h-[420px] object-cover" loading="lazy" />
              <img src={experience.mobileImage || experience.image} alt="Interior of London Karaoke Club" className="md:hidden block w-full h-[320px] object-cover" loading="lazy" />
            </>
          ) : (
            <div className="h-[320px] md:h-[420px] bg-zinc-950 flex items-center justify-center text-zinc-500 text-xs font-bold uppercase tracking-[0.08em]">
              Add Experience Image In Admin
            </div>
          )}
        </Card>
      </div>

      <div className="mt-14 grid md:grid-cols-3 gap-4">
        {(occasions?.items || []).map((item, idx) => (
          <Card key={idx} className="p-6">
            <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{item.text}</p>
          </Card>
        ))}
      </div>

      <div className="mt-14">
        <h3 className="text-2xl md:text-3xl font-black text-white mb-5">{grid?.heading}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(grid?.items || []).map((item, idx) => (
            <Card key={idx} className="overflow-hidden">
              {item.image ? (
                <img src={item.image} alt={item.title} className="w-full h-44 object-cover" loading="lazy" />
              ) : (
                <div className="w-full h-44 bg-zinc-950 flex items-center justify-center text-zinc-500 text-[10px] font-bold uppercase tracking-[0.08em]">Add Card Image</div>
              )}
              <div className="p-5">
                <h4 className="font-bold text-white mb-2">{item.title}</h4>
                <p className="text-sm text-zinc-400 leading-relaxed">{item.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Features;
