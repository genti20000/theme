import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { getMediaUrl } from '../lib/media';

const SITE_URL = 'https://www.londonkaraoke.club';

type SeoConfig = {
  title: string;
  description: string;
  canonical: string;
  keywords?: string;
  image?: string;
  schema?: Record<string, unknown> | Record<string, unknown>[];
};

const ensureMeta = (selector: string, create: () => HTMLMetaElement) => {
  let tag = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!tag) {
    tag = create();
    document.head.appendChild(tag);
  }
  return tag;
};

const ensureLink = (selector: string, create: () => HTMLLinkElement) => {
  let tag = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (!tag) {
    tag = create();
    document.head.appendChild(tag);
  }
  return tag;
};

const toAbsoluteUrl = (value?: string) => {
  if (!value) return `${SITE_URL}/favicon.svg`;
  const resolved = getMediaUrl(value);
  if (/^https?:\/\//i.test(resolved)) return resolved;
  return `${SITE_URL}${resolved.startsWith('/') ? resolved : `/${resolved}`}`;
};

const pageSchema = (url: string, title: string, description: string) => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: title,
      description,
      isPartOf: {
        '@id': `${SITE_URL}/#website`,
      },
      about: {
        '@id': `${SITE_URL}/#localbusiness`,
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: 'London Karaoke Club',
      inLanguage: 'en-GB',
    },
  ],
});

const homeSchema = (description: string) => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'London Karaoke Club',
      url: `${SITE_URL}/`,
      telephone: '+44 7761 383514',
    },
    {
      '@type': 'LocalBusiness',
      '@id': `${SITE_URL}/#localbusiness`,
      name: 'London Karaoke Club',
      url: `${SITE_URL}/`,
      telephone: '+44 7761 383514',
      description,
      priceRange: '££',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Soho, London',
        addressCountry: 'GB',
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
          opens: '14:00',
          closes: '03:00',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How many songs do you have?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'London Karaoke Club offers 80,000+ songs, updated monthly.',
          },
        },
        {
          '@type': 'Question',
          name: 'What are your opening hours?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We are open until 3am, with advance booking recommended.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you allow walk-ins?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. Advance prebooking is required.',
          },
        },
      ],
    },
  ],
});

const SeoManager: React.FC = () => {
  const location = useLocation();
  const { headerData, heroData } = useData();

  useEffect(() => {
    const heroImage = heroData.mobileSlides?.[0] || heroData.slides?.[0] || heroData.backgroundImageUrl || headerData.logoUrl;
    const fallbackDescription =
      headerData.siteDescription ||
      'Private karaoke in Soho with 80,000+ songs, updated monthly, central London access, cocktails, and private spaces for birthdays, hen dos, and events.';

    const configs: Record<string, SeoConfig> = {
      '/': {
        title: 'Private Karaoke in Soho | London Karaoke Club',
        description:
          'Private karaoke in Soho with 80,000+ songs, updated monthly, cocktails, and private spaces for 10 to 50+ guests. Book birthdays, hen dos, and group nights at London Karaoke Club.',
        canonical: `${SITE_URL}/`,
        keywords:
          'private karaoke Soho, karaoke room hire Soho, karaoke birthday London, corporate karaoke London, hen do karaoke Soho',
        image: heroImage,
        schema: homeSchema(fallbackDescription),
      },
      '/gallery': {
        title: 'Karaoke Gallery Soho | London Karaoke Club',
        description:
          'Browse the London Karaoke Club gallery to preview our private karaoke spaces, party atmosphere, cocktails, and Soho nightlife setting before you book.',
        canonical: `${SITE_URL}/gallery`,
        keywords: 'karaoke gallery Soho, private karaoke venue photos London',
        image: heroImage,
      },
      '/blog': {
        title: 'Karaoke Planning Blog Soho | London Karaoke Club',
        description:
          'Read London Karaoke Club guides for birthday karaoke Soho, hen party ideas, private karaoke planning, and group night tips in Central London.',
        canonical: `${SITE_URL}/blog`,
        keywords: 'birthday karaoke Soho blog, hen do karaoke Soho blog, private karaoke London tips',
        image: heroImage,
      },
      '/events': {
        title: 'Corporate and Group Karaoke Events Soho | London Karaoke Club',
        description:
          'Plan private karaoke events in Soho for work socials, wrap parties, cast nights, and group celebrations with central access and premium private spaces.',
        canonical: `${SITE_URL}/events`,
        keywords: 'corporate karaoke London, private event venue Soho, group karaoke Soho',
        image: heroImage,
      },
      '/songs': {
        title: '80,000+ Karaoke Songs | London Karaoke Club Soho',
        description:
          'Explore the London Karaoke Club song library with 80,000+ karaoke tracks, updated monthly, for birthdays, hen dos, and private group nights in Soho.',
        canonical: `${SITE_URL}/songs`,
        keywords: 'karaoke song library London, 80000 karaoke songs Soho',
        image: heroImage,
      },
      '/food': {
        title: 'Food Menu | London Karaoke Club Soho',
        description:
          'See the London Karaoke Club food menu for Soho group nights, including sharing options and party-friendly food for private karaoke bookings.',
        canonical: `${SITE_URL}/food`,
        keywords: 'karaoke food menu Soho, party food Soho karaoke',
        image: heroImage,
      },
      '/drinks': {
        title: 'Drinks Menu | London Karaoke Club Soho',
        description:
          'View cocktails, bottle service, and drinks packages for private karaoke nights in Soho at London Karaoke Club.',
        canonical: `${SITE_URL}/drinks`,
        keywords: 'karaoke drinks menu Soho, cocktails Soho private karaoke',
        image: heroImage,
      },
      '/instagram': {
        title: 'Instagram Highlights | London Karaoke Club',
        description:
          'See recent London Karaoke Club Instagram highlights, party moments, and nightlife content from our private karaoke venue in Soho.',
        canonical: `${SITE_URL}/instagram`,
        keywords: 'London Karaoke Club Instagram, Soho karaoke photos',
        image: heroImage,
      },
      '/hen-do-karaoke-soho': {
        title: 'Hen Do Karaoke Soho | London Karaoke Club',
        description:
          'Book a hen do karaoke Soho night with private rooms, 80,000+ songs, updated monthly, cocktails, and late finishes in Central London.',
        canonical: `${SITE_URL}/hen-do-karaoke-soho`,
        keywords: 'hen do karaoke Soho, private karaoke hen party London, hen party venue Soho',
        image: heroImage,
      },
      '/birthday-karaoke-soho': {
        title: 'Birthday Karaoke Soho | London Karaoke Club',
        description:
          'Book private birthday karaoke Soho nights with 80,000+ songs, updated monthly, cocktails, and private group spaces for 10 to 50+ guests.',
        canonical: `${SITE_URL}/birthday-karaoke-soho`,
        keywords: 'birthday karaoke Soho, private karaoke birthday London, birthday party venue Soho',
        image: heroImage,
      },
      '/terms': {
        title: 'Terms and Conditions | London Karaoke Club',
        description: 'Read the London Karaoke Club terms and conditions for bookings, licensed hours, conduct, and venue policies.',
        canonical: `${SITE_URL}/terms`,
        keywords: 'London Karaoke Club terms, booking terms Soho',
        image: heroImage,
      },
      '/sitemap': {
        title: 'Sitemap | London Karaoke Club',
        description: 'Browse the London Karaoke Club sitemap to access key pages, booking information, menus, gallery, and event pages.',
        canonical: `${SITE_URL}/sitemap`,
        keywords: 'London Karaoke Club sitemap',
        image: heroImage,
      },
    };

    const current = configs[location.pathname] || {
      title: headerData.siteTitle || 'London Karaoke Club',
      description: fallbackDescription,
      canonical: `${SITE_URL}${location.pathname === '/' ? '/' : location.pathname}`,
      image: heroImage,
      schema: pageSchema(`${SITE_URL}${location.pathname === '/' ? '/' : location.pathname}`, headerData.siteTitle || 'London Karaoke Club', fallbackDescription),
    };

    document.title = current.title;

    ensureMeta('meta[name="description"]', () => {
      const tag = document.createElement('meta');
      tag.setAttribute('name', 'description');
      return tag;
    }).setAttribute('content', current.description);

    ensureMeta('meta[name="keywords"]', () => {
      const tag = document.createElement('meta');
      tag.setAttribute('name', 'keywords');
      return tag;
    }).setAttribute('content', current.keywords || '');

    ensureMeta('meta[property="og:title"]', () => {
      const tag = document.createElement('meta');
      tag.setAttribute('property', 'og:title');
      return tag;
    }).setAttribute('content', current.title);

    ensureMeta('meta[property="og:description"]', () => {
      const tag = document.createElement('meta');
      tag.setAttribute('property', 'og:description');
      return tag;
    }).setAttribute('content', current.description);

    ensureMeta('meta[property="og:url"]', () => {
      const tag = document.createElement('meta');
      tag.setAttribute('property', 'og:url');
      return tag;
    }).setAttribute('content', current.canonical);

    ensureMeta('meta[property="og:image"]', () => {
      const tag = document.createElement('meta');
      tag.setAttribute('property', 'og:image');
      return tag;
    }).setAttribute('content', toAbsoluteUrl(current.image));

    ensureMeta('meta[name="twitter:card"]', () => {
      const tag = document.createElement('meta');
      tag.setAttribute('name', 'twitter:card');
      return tag;
    }).setAttribute('content', 'summary_large_image');

    ensureMeta('meta[name="twitter:title"]', () => {
      const tag = document.createElement('meta');
      tag.setAttribute('name', 'twitter:title');
      return tag;
    }).setAttribute('content', current.title);

    ensureMeta('meta[name="twitter:description"]', () => {
      const tag = document.createElement('meta');
      tag.setAttribute('name', 'twitter:description');
      return tag;
    }).setAttribute('content', current.description);

    ensureMeta('meta[name="twitter:image"]', () => {
      const tag = document.createElement('meta');
      tag.setAttribute('name', 'twitter:image');
      return tag;
    }).setAttribute('content', toAbsoluteUrl(current.image));

    ensureLink('link[rel="canonical"]', () => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      return link;
    }).setAttribute('href', current.canonical);

    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon && headerData.faviconUrl) favicon.setAttribute('href', getMediaUrl(headerData.faviconUrl));

    const schemaTagId = 'lkc-dynamic-schema';
    let schemaTag = document.getElementById(schemaTagId) as HTMLScriptElement | null;
    if (!schemaTag) {
      schemaTag = document.createElement('script');
      schemaTag.id = schemaTagId;
      schemaTag.type = 'application/ld+json';
      document.head.appendChild(schemaTag);
    }
    const schema = current.schema || pageSchema(current.canonical, current.title, current.description);
    schemaTag.textContent = JSON.stringify(schema);
  }, [headerData, heroData, location.pathname]);

  return null;
};

export default SeoManager;
