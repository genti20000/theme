import React from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Section from '../components/ui/Section';
import { useData } from '../context/DataContext';
import { getMediaUrl } from '../lib/media';
import { SUMUP_BOOKING_URL } from '../lib/nav';

const henWhatsAppUrl =
  'https://wa.me/447761383514?text=Hi%20London%20Karaoke%20Club%2C%20I%27m%20planning%20a%20hen%20do%20karaoke%20night%20in%20Soho.%20Please%20share%20availability%2C%20room%20options%2C%20and%20packages.';

const HenDoKaraokeSohoPage: React.FC = () => {
  const { henDoPageData } = useData();

  return (
    <div className="bg-[#0A0A0A] text-white">
      <Section className="border-b border-white/10" containerClassName="text-center">
        {henDoPageData.heroImageUrl && (
          <div className="mb-6 overflow-hidden rounded-2xl border border-white/10">
            <img src={getMediaUrl(henDoPageData.heroImageUrl)} alt="Hen do karaoke in Soho" className="h-[260px] w-full object-cover md:h-[360px]" />
          </div>
        )}
        <h1 className="mx-auto mb-4 max-w-[720px] text-4xl font-black leading-[1.1] tracking-[-0.02em] md:text-5xl md:leading-[1.05]">{henDoPageData.heroTitle}</h1>
        <p className="mx-auto mb-4 max-w-[720px] text-base leading-6 text-zinc-200 md:text-lg md:leading-7">{henDoPageData.heroSubtitle}</p>
        <p className="mx-auto mb-5 max-w-[720px] text-base leading-6 text-zinc-300 md:text-lg md:leading-7">{henDoPageData.heroDescription}</p>

        <div className="mb-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href={SUMUP_BOOKING_URL} target="_blank" rel="noopener noreferrer">Book Your Hen Party Room</Button>
          <Button href={SUMUP_BOOKING_URL} target="_blank" rel="noopener noreferrer" variant="secondary">Check Availability</Button>
        </div>

        <p className="text-sm font-semibold text-yellow-200">{henDoPageData.urgencyText}</p>
      </Section>

      <Section>
        <h2 className="mb-4 text-2xl font-black leading-tight md:text-3xl">{henDoPageData.whyTitle}</h2>
        <p className="mb-5 text-base leading-6 text-zinc-300 md:text-lg md:leading-7">{henDoPageData.whyIntro}</p>
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.08em] text-zinc-200">Your group gets:</p>
        <ul className="mb-6 grid gap-3 md:grid-cols-2">
          {(henDoPageData.whyBullets || []).map((item) => (
            <li key={item} className="flex items-start gap-3 text-base leading-6 text-zinc-300">
              <span className="mt-2 h-2 w-2 rounded-full bg-yellow-300" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="text-base leading-6 text-zinc-200 md:text-lg md:leading-7">{henDoPageData.whyOutro}</p>
      </Section>

      <Section>
        <h2 className="mb-4 text-2xl font-black leading-tight md:text-3xl">{henDoPageData.drinksTitle}</h2>
        <p className="mb-4 text-base leading-6 text-zinc-300 md:text-lg md:leading-7">{henDoPageData.drinksIntro}</p>
        <ul className="mb-4 grid gap-3 md:grid-cols-2">
          {(henDoPageData.drinksBullets || []).map((item) => (
            <li key={item} className="flex items-start gap-3 text-base leading-6 text-zinc-300">
              <span className="mt-2 h-2 w-2 rounded-full bg-yellow-300" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-zinc-400">{henDoPageData.drinksNote}</p>
      </Section>

      <Section className="border-t border-white/10">
        <h2 className="mb-4 text-2xl font-black leading-tight md:text-3xl">{henDoPageData.socialTitle}</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {(henDoPageData.testimonials || []).map((item, idx) => (
            <Card key={`${item.name}-${idx}`} className="p-6">
              <p className="mb-4 text-base leading-6 text-zinc-300">“{item.quote}”</p>
              <p className="text-sm font-semibold text-zinc-200">— {item.name}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <h2 className="mb-4 text-2xl font-black leading-tight md:text-3xl">{henDoPageData.seoTitle}</h2>
        {(henDoPageData.seoParagraphs || []).map((paragraph, idx) => (
          <p key={idx} className={`${idx === 0 ? '' : 'mt-4'} text-base leading-6 text-zinc-300 md:text-lg md:leading-7`}>
            {paragraph}
          </p>
        ))}
      </Section>

      <Section className="border-t border-white/10">
        <h2 className="mb-6 text-2xl font-black leading-tight md:text-3xl">{henDoPageData.faqTitle}</h2>
        <div className="space-y-4">
          {(henDoPageData.faqs || []).map((faq, idx) => (
            <Card key={`${faq.question}-${idx}`} className="p-6">
              <h3 className="mb-2 text-lg font-bold text-white">{faq.question}</h3>
              <p className="text-base leading-6 text-zinc-300">{faq.answer}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="border-t border-white/10" containerClassName="text-center">
        <h2 className="mb-3 text-2xl font-black leading-tight md:text-3xl">{henDoPageData.finalTitle}</h2>
        <p className="mx-auto mb-6 max-w-[720px] text-base leading-6 text-zinc-300 md:text-lg md:leading-7">{henDoPageData.finalSubtitle}</p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href={SUMUP_BOOKING_URL} target="_blank" rel="noopener noreferrer">Book Your Hen Party</Button>
          <Button href={henWhatsAppUrl} target="_blank" rel="noopener noreferrer" variant="secondary">Message Us on WhatsApp</Button>
        </div>
      </Section>
    </div>
  );
};

export default HenDoKaraokeSohoPage;
