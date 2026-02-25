import React from 'react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Section from '../components/ui/Section';
import { SUMUP_BOOKING_URL } from '../lib/nav';

const henWhatsAppUrl =
  'https://wa.me/447761383514?text=Hi%20London%20Karaoke%20Club%2C%20I%27m%20planning%20a%20hen%20do%20karaoke%20night%20in%20Soho.%20Please%20share%20availability%2C%20room%20options%2C%20and%20packages.';

const roomOptions = [
  {
    name: 'Terrace Bar',
    details: '20–40 guests · Ideal for larger hen groups',
    meta: 'Open until 3am · Minimum 2 hours',
  },
  {
    name: 'Vox Room',
    details: '10–20 guests · Intimate hen celebrations',
    meta: 'Open until 3am · Minimum 2 hours',
  },
  {
    name: 'Attic',
    details: '30–50+ guests · Big energy hen nights',
    meta: 'Open until 3am · Minimum 2 hours',
  },
];

const faqs = [
  {
    question: 'How many people can attend a hen party?',
    answer: 'Rooms accommodate 10–50+ guests.',
  },
  {
    question: 'Do you offer hen packages?',
    answer: 'Drinks packages can be pre-arranged. Message us for details.',
  },
  {
    question: 'Is fancy dress allowed?',
    answer: 'Yes — themed outfits welcome.',
  },
  {
    question: 'Do we need to book in advance?',
    answer: 'Yes. We do not accept walk-ins.',
  },
];

const HenDoKaraokeSohoPage: React.FC = () => {
  return (
    <div className="bg-[#0A0A0A] text-white">
      <Section className="border-b border-white/10" containerClassName="text-center">
        <h1 className="mx-auto mb-4 max-w-[720px] text-4xl font-black leading-[1.1] tracking-[-0.02em] md:text-5xl md:leading-[1.05]">
          Hen Do Karaoke in Soho
        </h1>
        <p className="mx-auto mb-4 max-w-[720px] text-base leading-6 text-zinc-200 md:text-lg md:leading-7">
          Private Rooms · 80,000+ Songs · Open Until 3am
        </p>
        <p className="mx-auto mb-5 max-w-[720px] text-base leading-6 text-zinc-300 md:text-lg md:leading-7">
          Planning the bride’s last big night? London Karaoke Club gives your group a fully private party space in the heart of Soho.
        </p>

        <Badge className="mb-4">★★★★★ 4.9 (128 Google Reviews)</Badge>

        <div className="mb-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href={SUMUP_BOOKING_URL} target="_blank" rel="noopener noreferrer">Book Your Hen Party Room</Button>
          <Button href={SUMUP_BOOKING_URL} target="_blank" rel="noopener noreferrer" variant="secondary">Check Availability</Button>
        </div>

        <p className="text-sm font-semibold text-yellow-200">Fridays & Saturdays sell out early.</p>
      </Section>

      <Section>
        <h2 className="mb-4 text-2xl font-black leading-tight md:text-3xl">Built for Big Hen Nights</h2>
        <p className="mb-5 text-base leading-6 text-zinc-300 md:text-lg md:leading-7">
          Forget awkward shared bars or tiny padded boxes.
        </p>
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.08em] text-zinc-200">Your group gets:</p>
        <ul className="mb-6 grid gap-3 md:grid-cols-2">
          {[
            'A fully private karaoke room',
            'Space for 10–50+ guests',
            'Studio-quality sound',
            '80,000+ songs (updated monthly)',
            'Custom key & tempo control',
            'Open until 3am',
            'Central Soho location',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-base leading-6 text-zinc-300">
              <span className="mt-2 h-2 w-2 rounded-full bg-yellow-300" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="text-base leading-6 text-zinc-200 md:text-lg md:leading-7">
          Matching outfits? Champagne entrances? Bride spotlight moment? All welcome.
        </p>
      </Section>

      <Section className="border-t border-white/10">
        <h2 className="mb-6 text-2xl font-black leading-tight md:text-3xl">Private Hen Party Rooms</h2>
        <div className="grid gap-6 md:grid-cols-6 lg:grid-cols-12 lg:gap-10">
          {roomOptions.map((room) => (
            <Card key={room.name} className="p-6 md:col-span-3 lg:col-span-4">
              <h3 className="mb-3 text-xl font-bold text-white">{room.name}</h3>
              <p className="mb-2 text-base leading-6 text-zinc-300">{room.details}</p>
              <p className="mb-4 text-sm text-zinc-400">{room.meta}</p>
              <Button href={SUMUP_BOOKING_URL} target="_blank" rel="noopener noreferrer" className="w-full">See Live Availability</Button>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <h2 className="mb-4 text-2xl font-black leading-tight md:text-3xl">Cocktails & Sharing Platters</h2>
        <p className="mb-4 text-base leading-6 text-zinc-300 md:text-lg md:leading-7">Keep the energy high with:</p>
        <ul className="mb-4 grid gap-3 md:grid-cols-2">
          {[
            'Signature cocktails',
            'Prosecco & champagne',
            'Sharing platters',
            'Pre-booked drinks packages',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-base leading-6 text-zinc-300">
              <span className="mt-2 h-2 w-2 rounded-full bg-yellow-300" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-zinc-400">No outside drinks permitted — but everything you need is on site.</p>
      </Section>

      <Section className="border-t border-white/10">
        <h2 className="mb-4 text-2xl font-black leading-tight md:text-3xl">What Other Hen Groups Say</h2>
        <Badge className="mb-6">★★★★★ 4.9 (128 Reviews)</Badge>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <p className="mb-4 text-base leading-6 text-zinc-300">“The perfect hen night. Private, loud, and so much fun.”</p>
            <p className="text-sm font-semibold text-zinc-200">— Sophie M.</p>
          </Card>
          <Card className="p-6">
            <p className="mb-4 text-base leading-6 text-zinc-300">“Bride had the best night ever. Staff were amazing.”</p>
            <p className="text-sm font-semibold text-zinc-200">— Hannah L.</p>
          </Card>
        </div>
      </Section>

      <Section>
        <h2 className="mb-4 text-2xl font-black leading-tight md:text-3xl">Hen Do Karaoke Soho – The Private Party Option</h2>
        <p className="text-base leading-6 text-zinc-300 md:text-lg md:leading-7">
          If you’re searching for a hen do karaoke Soho venue that feels exclusive, London Karaoke Club offers private room hire designed specifically for hen parties. Unlike public karaoke bars, your group has full control of the space, music, and atmosphere.
        </p>
        <p className="mt-4 text-base leading-6 text-zinc-300 md:text-lg md:leading-7">
          For groups comparing private karaoke hen party London venues, we combine central Soho access, flexible room sizes for 10–50+ guests, and a song library of 80,000+ tracks updated monthly.
        </p>
        <p className="mt-4 text-base leading-6 text-zinc-200 md:text-lg md:leading-7">
          Prebooking is essential — weekend hen nights fill quickly.
        </p>
      </Section>

      <Section className="border-t border-white/10">
        <h2 className="mb-6 text-2xl font-black leading-tight md:text-3xl">Hen Party FAQs</h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <Card key={faq.question} className="p-6">
              <h3 className="mb-2 text-lg font-bold text-white">{faq.question}</h3>
              <p className="text-base leading-6 text-zinc-300">{faq.answer}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="border-t border-white/10" containerClassName="text-center">
        <h2 className="mb-3 text-2xl font-black leading-tight md:text-3xl">Ready to Plan the Bride’s Night?</h2>
        <p className="mx-auto mb-6 max-w-[720px] text-base leading-6 text-zinc-300 md:text-lg md:leading-7">
          Secure your private hen karaoke room in Soho now.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href={SUMUP_BOOKING_URL} target="_blank" rel="noopener noreferrer">Book Your Hen Party</Button>
          <Button href={henWhatsAppUrl} target="_blank" rel="noopener noreferrer" variant="secondary">Message Us on WhatsApp</Button>
        </div>
      </Section>
    </div>
  );
};

export default HenDoKaraokeSohoPage;
