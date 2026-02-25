import React from 'react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Section from '../components/ui/Section';
import { SUMUP_BOOKING_URL } from '../lib/nav';

const birthdayWhatsAppUrl =
  'https://wa.me/447761383514?text=Hi%20London%20Karaoke%20Club%2C%20I%27m%20planning%20a%20birthday%20karaoke%20party%20in%20Soho.%20Please%20share%20availability%2C%20room%20options%2C%20and%20pricing.';

const rooms = [
  {
    name: 'Vox Room',
    details: '10–20 guests · Intimate birthday nights',
  },
  {
    name: 'Terrace Bar',
    details: '20–40 guests · Big birthday energy',
  },
  {
    name: 'Attic',
    details: '30–50+ guests · Milestone takeovers',
  },
];

const faqs = [
  {
    question: 'Can I bring a birthday cake?',
    answer: 'Yes — speak to us in advance.',
  },
  {
    question: 'Is decoration allowed?',
    answer: 'Yes, within reason. Message us for details.',
  },
  {
    question: 'Is there a minimum spend?',
    answer: 'Prices vary by day and group size. Minimum booking is 2 hours.',
  },
  {
    question: 'Do you allow outside drinks?',
    answer: 'No outside food or drink permitted.',
  },
];

const BirthdayKaraokeSohoPage: React.FC = () => {
  return (
    <div className="bg-[#0A0A0A] text-white">
      <Section className="border-b border-white/10" containerClassName="text-center">
        <h1 className="mx-auto mb-4 max-w-[720px] text-4xl font-black leading-[1.1] tracking-[-0.02em] md:text-5xl md:leading-[1.05]">
          Private Karaoke Birthday Parties in Soho
        </h1>
        <p className="mx-auto mb-4 max-w-[720px] text-base leading-6 text-zinc-200 md:text-lg md:leading-7">
          Your Room. Your Playlist. Your Night. Open Until 3am.
        </p>
        <p className="mx-auto mb-4 max-w-[720px] text-base leading-6 text-zinc-300 md:text-lg md:leading-7">
          Celebrate properly — in your own private karaoke space in the heart of Soho.
        </p>
        <p className="mx-auto mb-5 max-w-[720px] text-sm leading-6 text-zinc-300 md:text-base md:leading-7">
          80,000+ songs · Studio-quality sound · 10–50+ guests
        </p>

        <Badge className="mb-4">★★★★★ 4.9 (128 Google Reviews)</Badge>

        <div className="mb-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href={SUMUP_BOOKING_URL} target="_blank" rel="noopener noreferrer">Book Your Birthday Room</Button>
          <Button href={SUMUP_BOOKING_URL} target="_blank" rel="noopener noreferrer" variant="secondary">Check Availability</Button>
        </div>

        <p className="text-sm font-semibold text-yellow-200">Weekend dates sell out fast.</p>
      </Section>

      <Section>
        <h2 className="mb-4 text-2xl font-black leading-tight md:text-3xl">Built for Big Birthday Energy</h2>
        <p className="text-base leading-6 text-zinc-300 md:text-lg md:leading-7">This isn’t a shared bar corner.</p>
        <p className="mb-5 text-base leading-6 text-zinc-300 md:text-lg md:leading-7">This isn’t a tiny padded box.</p>

        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.08em] text-zinc-200">You get:</p>
        <ul className="mb-6 grid gap-3 md:grid-cols-2">
          {[
            'A fully private karaoke room',
            'Space for 10–50+ guests',
            '80,000+ songs (updated monthly)',
            'Custom key & tempo control',
            'Cocktails & sharing platters',
            'Open until 3am',
            'Central Soho location',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-base leading-6 text-zinc-300">
              <span className="mt-2 h-2 w-2 rounded-full bg-yellow-300" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <p className="text-base leading-6 text-zinc-200 md:text-lg md:leading-7">Bring the cake. Bring the outfits. Bring the chaos.</p>
        <p className="text-base leading-6 text-zinc-200 md:text-lg md:leading-7">We’ll handle the sound.</p>
      </Section>

      <Section className="border-t border-white/10">
        <h2 className="mb-4 text-2xl font-black leading-tight md:text-3xl">From 18ths to 40ths and Beyond</h2>
        <p className="mb-4 text-base leading-6 text-zinc-300 md:text-lg md:leading-7">Whether it’s:</p>
        <ul className="mb-5 space-y-2 text-base leading-6 text-zinc-300 md:text-lg md:leading-7">
          <li>18th birthday karaoke Soho</li>
          <li>21st birthday party London</li>
          <li>30th birthday venue Soho</li>
          <li>40th birthday celebration London</li>
        </ul>
        <p className="text-base leading-6 text-zinc-300 md:text-lg md:leading-7">Your group gets full control of the room and playlist.</p>
        <p className="mt-4 text-base leading-6 text-zinc-200 md:text-lg md:leading-7">No waiting your turn. No strangers watching. No awkward public mics.</p>
        <p className="mt-2 text-base leading-6 text-zinc-200 md:text-lg md:leading-7">Just your people.</p>
      </Section>

      <Section>
        <h2 className="mb-6 text-2xl font-black leading-tight md:text-3xl">Choose Your Birthday Room</h2>
        <div className="grid gap-6 md:grid-cols-6 lg:grid-cols-12 lg:gap-10">
          {rooms.map((room) => (
            <Card key={room.name} className="p-6 md:col-span-3 lg:col-span-4">
              <h3 className="mb-3 text-xl font-bold text-white">{room.name}</h3>
              <p className="mb-4 text-base leading-6 text-zinc-300">{room.details}</p>
              <Button href={SUMUP_BOOKING_URL} target="_blank" rel="noopener noreferrer" className="w-full">Check Live Availability</Button>
            </Card>
          ))}
        </div>
        <p className="mt-4 text-sm text-zinc-400">Minimum 2 hours · Open until 3am</p>
      </Section>

      <Section className="border-t border-white/10">
        <h2 className="mb-4 text-2xl font-black leading-tight md:text-3xl">Cocktails That Match the Occasion</h2>
        <p className="mb-4 text-base leading-6 text-zinc-300 md:text-lg md:leading-7">Pre-arrange:</p>
        <ul className="mb-5 grid gap-3 md:grid-cols-2">
          {[
            'Prosecco & champagne',
            'Birthday drinks packages',
            'Sharing platters',
            'Signature cocktails',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-base leading-6 text-zinc-300">
              <span className="mt-2 h-2 w-2 rounded-full bg-yellow-300" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="text-base leading-6 text-zinc-200 md:text-lg md:leading-7">Our team can help you shape the vibe — low-key drinks or full-blown party.</p>
      </Section>

      <Section>
        <h2 className="mb-4 text-2xl font-black leading-tight md:text-3xl">What Birthday Groups Say</h2>
        <Badge className="mb-6">★★★★★ 4.9 (128 Reviews)</Badge>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <p className="mb-4 text-base leading-6 text-zinc-300">“Booked for my 30th and it was unreal.”</p>
            <p className="text-sm font-semibold text-zinc-200">— James T.</p>
          </Card>
          <Card className="p-6">
            <p className="mb-4 text-base leading-6 text-zinc-300">“Best birthday I’ve had in years.”</p>
            <p className="text-sm font-semibold text-zinc-200">— Laura P.</p>
          </Card>
        </div>
      </Section>

      <Section className="border-t border-white/10">
        <h2 className="mb-4 text-2xl font-black leading-tight md:text-3xl">Birthday Karaoke Soho – Private Room Hire</h2>
        <p className="text-base leading-6 text-zinc-300 md:text-lg md:leading-7">
          If you’re searching for birthday karaoke Soho venues, London Karaoke Club offers fully private karaoke room hire designed for group celebrations.
        </p>
        <p className="mt-4 text-base leading-6 text-zinc-300 md:text-lg md:leading-7">
          Unlike public karaoke bars, your birthday party has exclusive use of the room, access to 80,000+ songs updated monthly, and late finishes until 3am.
        </p>
        <p className="mt-4 text-base leading-6 text-zinc-300 md:text-lg md:leading-7">
          For planners comparing private karaoke birthday London venues, we combine central location, flexible room sizes for 10–50+ guests, and a booking system that shows real-time availability.
        </p>
        <p className="mt-4 text-base leading-6 text-zinc-200 md:text-lg md:leading-7">Advance booking is essential for weekend dates.</p>
      </Section>

      <Section>
        <h2 className="mb-6 text-2xl font-black leading-tight md:text-3xl">Birthday Party FAQs</h2>
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
        <h2 className="mb-3 text-2xl font-black leading-tight md:text-3xl">Lock In Your Birthday Date</h2>
        <p className="mx-auto mb-4 max-w-[720px] text-base leading-6 text-zinc-300 md:text-lg md:leading-7">Fridays & Saturdays sell out quickly.</p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href={SUMUP_BOOKING_URL} target="_blank" rel="noopener noreferrer">Book Your Birthday Room</Button>
          <Button href={birthdayWhatsAppUrl} target="_blank" rel="noopener noreferrer" variant="secondary">Message Us on WhatsApp</Button>
        </div>
      </Section>
    </div>
  );
};

export default BirthdayKaraokeSohoPage;
