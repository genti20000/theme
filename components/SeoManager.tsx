import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { getMediaUrl } from '../lib/media';

const SITE_URL = 'https://www.londonkaraoke.club';
const DAY_OF_WEEK = [
  'https://schema.org/Monday',
  'https://schema.org/Tuesday',
  'https://schema.org/Wednesday',
  'https://schema.org/Thursday',
  'https://schema.org/Friday',
  'https://schema.org/Saturday',
  'https://schema.org/Sunday',
];
const VALID_PUBLIC_PATHS = new Set([
  '/',
  '/about',
  '/birthday-karaoke-soho',
  '/guides',
  '/careers',
  '/contact',
  '/drinks',
  '/events',
  '/faqs',
  '/food',
  '/gallery',
  '/hen-do-karaoke-soho',
  '/instagram',
  '/songs',
]);

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
          dayOfWeek: DAY_OF_WEEK,
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
  const { blogData, headerData, heroData } = useData();

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
      '/guides': {
        title: 'Karaoke Planning Guides Soho | London Karaoke Club',
        description:
          'Read London Karaoke Club guides for birthday karaoke Soho, hen party ideas, private karaoke planning, and group night tips in Central London.',
        canonical: `${SITE_URL}/guides`,
        keywords: 'karaoke planning guides Soho, birthday karaoke Soho guide, hen do karaoke Soho guide',
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
      '/about': {
        title: 'About London Karaoke Club | Soho Private Karaoke',
        description: 'Learn more about London Karaoke Club, our private karaoke setup in Soho, and what makes our venue different for group nights out.',
        canonical: `${SITE_URL}/about`,
        keywords: 'about London Karaoke Club, Soho karaoke venue',
        image: heroImage,
      },
      '/contact': {
        title: 'Contact London Karaoke Club | Soho Location',
        description: 'Find London Karaoke Club in Soho and get booking support for private karaoke nights, birthdays, hen dos, and group events.',
        canonical: `${SITE_URL}/contact`,
        keywords: 'contact London Karaoke Club, Soho karaoke location',
        image: heroImage,
      },
      '/careers': {
        title: 'Careers | London Karaoke Club',
        description: 'Explore career opportunities at London Karaoke Club in Soho and check for future hospitality, venue, and events roles.',
        canonical: `${SITE_URL}/careers`,
        keywords: 'London Karaoke Club careers, Soho hospitality jobs',
        image: heroImage,
      },
      '/privacy': {
        title: 'Privacy Policy | London Karaoke Club',
        description: 'Read the London Karaoke Club privacy policy and how personal data is handled for bookings and customer enquiries.',
        canonical: `${SITE_URL}/privacy`,
        keywords: 'London Karaoke Club privacy policy',
        image: heroImage,
      },
      '/booking-policy': {
        title: 'Booking Policy | London Karaoke Club',
        description: 'Review the London Karaoke Club booking policy for deposits, cancellations, amendments, and venue rules.',
        canonical: `${SITE_URL}/booking-policy`,
        keywords: 'London Karaoke Club booking policy',
        image: heroImage,
      },
      '/faqs': {
        title: 'FAQs | London Karaoke Club Soho',
        description: 'Read London Karaoke Club FAQs covering booking, opening hours, age policy, song library, food, drinks, and private karaoke nights in Soho.',
        canonical: `${SITE_URL}/faqs`,
        keywords: 'London Karaoke Club FAQs, private karaoke Soho FAQ',
        image: heroImage,
      },
    };

    const blogPost = location.pathname.startsWith('/guides/')
      ? blogData.posts.find((post) => {
          const slug = post.slug || post.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
          return `/guides/${slug}` === location.pathname;
        })
      : null;

    const isAdmin = location.pathname === '/admin';
    const isKnownPublicPath = VALID_PUBLIC_PATHS.has(location.pathname);
    const current = isAdmin
      ? {
          title: 'Admin | London Karaoke Club',
          description: 'Private admin area.',
          canonical: `${SITE_URL}/admin`,
          image: heroImage,
        }
      : blogPost
      ? {
          title: blogPost.metaTitle || blogPost.title,
          description: blogPost.metaDescription || blogPost.excerpt,
          canonical: blogPost.canonical || `${SITE_URL}/guides/${blogPost.slug}`,
          keywords: 'karaoke guide London, private karaoke Soho, London Karaoke Club guides',
          image: blogPost.ogImage || blogPost.imageUrl || heroImage,
          schema: {
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'BlogPosting',
                '@id': `${blogPost.canonical || `${SITE_URL}/guides/${blogPost.slug}`}#blogposting`,
                headline: blogPost.title,
                description: blogPost.metaDescription || blogPost.excerpt,
                image: [toAbsoluteUrl(blogPost.ogImage || blogPost.imageUrl || heroImage)],
                url: blogPost.canonical || `${SITE_URL}/guides/${blogPost.slug}`,
                mainEntityOfPage: blogPost.canonical || `${SITE_URL}/guides/${blogPost.slug}`,
                publisher: {
                  '@type': 'Organization',
                  name: 'London Karaoke Club',
                  url: `${SITE_URL}/`,
                },
              },
              pageSchema(
                blogPost.canonical || `${SITE_URL}/guides/${blogPost.slug}`,
                blogPost.metaTitle || blogPost.title,
                blogPost.metaDescription || blogPost.excerpt,
              )['@graph'][0],
            ],
          },
        }
      : configs[location.pathname] || {
          title: 'Page Not Found | London Karaoke Club',
          description: 'The requested page could not be found.',
          canonical: `${SITE_URL}${location.pathname === '/' ? '/' : location.pathname}`,
          image: heroImage,
          schema: pageSchema(`${SITE_URL}${location.pathname === '/' ? '/' : location.pathname}`, 'Page Not Found | London Karaoke Club', 'The requested page could not be found.'),
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

    ensureMeta('meta[name="robots"]', () => {
      const tag = document.createElement('meta');
      tag.setAttribute('name', 'robots');
      return tag;
    }).setAttribute(
      'content',
      isAdmin || location.pathname === '/privacy' || location.pathname === '/terms' || location.pathname === '/booking-policy' || (!isKnownPublicPath && !blogPost)
        ? 'noindex, nofollow, noarchive'
        : 'index, follow',
    );

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
  }, [blogData.posts, headerData, heroData, location.pathname]);

  return null;
};

export default SeoManager;
