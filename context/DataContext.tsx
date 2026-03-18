
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { MediaRecord, getMediaUrl, isInvalidMediaRef, normalizeMediaRecord } from '../lib/media';

// --- Types ---
export interface MenuItem { name: string; description: string; price: string; note?: string; }
export interface MenuCategory { category: string; description?: string; items: MenuItem[]; }
export interface DrinkItem { name: string; price: any; description?: string; note?: string; single?: string; double?: string; }
export interface DrinkCategory { category: string; items: DrinkItem[]; note?: string; }
export interface DrinksData {
    headerImageUrl: string;
    packagesData: { title: string; subtitle: string; items: any[]; notes: string[]; };
    bottleServiceData: DrinkCategory[];
    byTheGlassData: DrinkCategory[];
    shotsData: { title: string; items: any[]; shooters: { title: string; prices: string; items: any[]; }; };
    cocktailsData: DrinkCategory[];
    winesData: DrinkCategory[];
}
export interface HeaderData { logoUrl: string; siteTitle: string; siteDescription: string; faviconUrl: string; navOrder: string[]; customScripts?: { header?: string; footer?: string; } }
export interface HeroData { backgroundImageUrl: string; slides: string[]; mobileSlides?: string[]; badgeText: string; headingText: string; subText: string; buttonText: string; showBadge?: boolean; showButtons?: boolean; }
export interface HighlightsData { enabled?: boolean; heading: string; subtext: string; mainImageUrl: string; mobileMainImageUrl?: string; featureListTitle: string; featureList: string[]; sideImageUrl: string; }

export interface FeaturesData {
    enabled?: boolean;
    experience: { label: string; heading: string; text: string; image: string; mobileImage?: string; };
    occasions: { heading: string; text: string; items: { title: string; text: string; }[]; };
    grid: { heading: string; items: { title: string; description: string; image: string; }[]; };
}

export interface VibeData {
    enabled?: boolean;
    label: string;
    heading: string;
    text: string;
    image1: string;
    image2: string;
    videoUrl?: string;
    mobileVideoUrl?: string;
    bigImage: string;
    mobileBigImage?: string;
    bottomHeading: string;
    bottomText: string;
}

export interface BatteryData { enabled?: boolean; statPrefix: string; statNumber: string; statSuffix: string; subText: string; }
export interface FooterData { ctaHeading: string; ctaText: string; ctaButtonText: string; }

export interface GalleryImage { id: string; url: string; caption: string; }
export type GalleryViewMode = 'carousel' | 'grid';
export interface GalleryCollection { id: string; name: string; subtext?: string; images: GalleryImage[]; defaultViewMode?: GalleryViewMode; }
export interface GalleryData {
    heading: string;
    subtext: string;
    images: GalleryImage[];
    videos?: any[];
    showOnHome?: boolean;
    homeFeatureEnabled?: boolean;
    collections?: GalleryCollection[];
    activeCollectionId?: string;
}
export type PageGalleryKey = 'home' | 'drinks' | 'food' | 'blog' | 'events' | 'songs' | 'instagram';
export interface PageGalleryConfig { enabled: boolean; collectionId?: string; viewMode?: GalleryViewMode; }
export type PageGallerySettings = Record<PageGalleryKey, PageGalleryConfig>;
export interface HomeSectionRepeats {
    hero: number;
    instagramHighlights: number;
    highlights: number;
    features: number;
    vibe: number;
    battery: number;
    testimonials: number;
    info: number;
    faq: number;
    drinks: number;
    gallery: number;
}
export type HomeSectionType = 'hero' | 'instagramHighlights' | 'highlights' | 'features' | 'vibe' | 'battery' | 'testimonials' | 'info' | 'faq' | 'drinks' | 'gallery';
export interface HomeSectionItem { id: string; type: HomeSectionType; title: string; enabled: boolean; }

export interface BlogPost {
    id: string;
    title: string;
    slug?: string;
    status?: 'draft' | 'published';
    publishAt?: string;
    date: string;
    excerpt: string;
    content: string;
    imageUrl: string;
    metaTitle?: string;
    metaDescription?: string;
    canonical?: string;
    ogImage?: string;
    faqSchemaEnabled?: boolean;
    faqSchema?: { question: string; answer: string }[];
}
export interface BlogData { heading: string; subtext: string; posts: BlogPost[]; }
export interface Song { id: string; title: string; artist: string; genre?: string; fileUrl?: string; }
export interface TestimonialItem {
    quote: string;
    name: string;
    avatar: string;
    rating?: number;
    date?: string;
    source?: string;
    sourceUrl?: string;
    featured?: boolean;
}
export interface TestimonialsData { enabled?: boolean; heading: string; subtext: string; items: TestimonialItem[]; }

export interface InfoSectionData {
    enabled?: boolean;
    heading: string;
    sections: { title: string; content: string; color?: string; }[];
    footerTitle: string;
    footerText: string;
    footerHighlight: string;
}

export interface FAQItem { question: string; answer: string; }
export interface FAQData { enabled?: boolean; heading: string; subtext: string; items: FAQItem[]; }

export interface EventSection { id: string; title: string; subtitle: string; description: string; imageUrl: string; features: string[]; }
export interface EventsData { hero: { title: string; subtitle: string; image: string; }; sections: EventSection[]; }

export interface InstagramHighlight { id: string; title: string; imageUrl: string; link: string; }
export interface InstagramPost { id: string; imageUrl: string; likes: string; comments: string; caption?: string; }
export interface InstagramHighlightsData { 
    enabled?: boolean; 
    heading: string; 
    username: string; 
    highlights: InstagramHighlight[];
    posts: InstagramPost[];
}

export interface TermItem { title: string; content: string; }
export interface LandingTestimonial { quote: string; name: string; }
export interface LandingFaq { question: string; answer: string; }
export interface HenDoPageData {
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;
    heroImageUrl?: string;
    extraImages?: string[];
    urgencyText: string;
    whyTitle: string;
    whyIntro: string;
    whyBullets: string[];
    whyOutro: string;
    drinksTitle: string;
    drinksIntro: string;
    drinksBullets: string[];
    drinksNote: string;
    socialTitle: string;
    testimonials: LandingTestimonial[];
    seoTitle: string;
    seoParagraphs: string[];
    faqTitle: string;
    faqs: LandingFaq[];
    finalTitle: string;
    finalSubtitle: string;
}
export interface BirthdayPageData {
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;
    heroHighlights: string;
    heroImageUrl?: string;
    extraImages?: string[];
    urgencyText: string;
    whyTitle: string;
    whyIntroA: string;
    whyIntroB: string;
    whyBullets: string[];
    whyOutroA: string;
    whyOutroB: string;
    milestonesTitle: string;
    milestonesIntro: string;
    milestonesBullets: string[];
    milestonesOutroA: string;
    milestonesOutroB: string;
    milestonesOutroC: string;
    drinksTitle: string;
    drinksIntro: string;
    drinksBullets: string[];
    drinksNote: string;
    socialTitle: string;
    testimonials: LandingTestimonial[];
    seoTitle: string;
    seoParagraphs: string[];
    faqTitle: string;
    faqs: LandingFaq[];
    finalTitle: string;
    finalSubtitle: string;
}

export interface FirebaseConfig { databaseURL: string; apiKey: string; }
export interface MediaRepairReport {
    totalScanned: number;
    fixedUrls: number;
    thumbnailsGenerated: number;
    brokenMarked: number;
    skipped: number;
}
export interface MediaRepairResult {
    ok: boolean;
    report?: MediaRepairReport;
    error?: string;
    statusCode?: number;
}

const MEDIA_KEY_EXACT = new Set([
    'backgroundImageUrl', 'mainImageUrl', 'mobileMainImageUrl', 'sideImageUrl', 'headerImageUrl',
    'videoUrl', 'mobileVideoUrl', 'bigImage', 'mobileBigImage', 'image1', 'image2',
    'logoUrl', 'faviconUrl', 'avatar', 'ogImage', 'thumbnail', 'thumbnailUrl', 'fileUrl'
]);

const isMediaFieldKey = (key: string): boolean => {
    if (MEDIA_KEY_EXACT.has(key)) return true;
    return /(image|video|logo|favicon|avatar|thumbnail|slide)s?(url)?$/i.test(key);
};

const sanitizeMediaString = (value: string): string => {
    const raw = (value || '').trim();
    if (!raw || isInvalidMediaRef(raw)) return '';
    return getMediaUrl(raw);
};

const sanitizeMediaPayload = (input: any, parentKey = ''): any => {
    if (Array.isArray(input)) {
        const next = input
            .map((item) => sanitizeMediaPayload(item, parentKey))
            .filter((item) => {
                if (item == null) return false;
                if (typeof item === 'string') return item.trim().length > 0;
                if (parentKey === 'images' && typeof item === 'object') {
                    const url = (item as any).url || '';
                    return typeof url === 'string' && url.trim().length > 0;
                }
                return true;
            });
        return next;
    }
    if (typeof input === 'string') return input;
    if (!input || typeof input !== 'object') return input;

    const output: Record<string, any> = {};
    Object.entries(input).forEach(([key, value]) => {
        if (typeof value === 'string') {
            const isMediaUrlInImageArray = key === 'url' && (parentKey === 'images' || parentKey === 'videos' || parentKey === 'media');
            if (isMediaFieldKey(key) || isMediaUrlInImageArray) {
                output[key] = sanitizeMediaString(value);
                return;
            }
            output[key] = value;
            return;
        }
        if (Array.isArray(value)) {
            if (isMediaFieldKey(key) && value.every((v) => typeof v === 'string')) {
                output[key] = value.map((v) => sanitizeMediaString(v)).filter(Boolean);
                return;
            }
            output[key] = sanitizeMediaPayload(value, key);
            return;
        }
        output[key] = sanitizeMediaPayload(value, key);
    });
    return output;
};

interface DataContextType {
    foodMenu: MenuCategory[];
    updateFoodMenu: React.Dispatch<React.SetStateAction<MenuCategory[]>>;
    drinksData: DrinksData;
    updateDrinksData: React.Dispatch<React.SetStateAction<DrinksData>>;
    headerData: HeaderData;
    updateHeaderData: React.Dispatch<React.SetStateAction<HeaderData>>;
    heroData: HeroData;
    updateHeroData: React.Dispatch<React.SetStateAction<HeroData>>;
    highlightsData: HighlightsData;
    updateHighlightsData: React.Dispatch<React.SetStateAction<HighlightsData>>;
    featuresData: FeaturesData;
    updateFeaturesData: React.Dispatch<React.SetStateAction<FeaturesData>>;
    vibeData: VibeData;
    updateVibeData: React.Dispatch<React.SetStateAction<VibeData>>;
    batteryData: BatteryData;
    updateBatteryData: React.Dispatch<React.SetStateAction<BatteryData>>;
    footerData: FooterData;
    updateFooterData: React.Dispatch<React.SetStateAction<FooterData>>;
    galleryData: GalleryData;
    updateGalleryData: React.Dispatch<React.SetStateAction<GalleryData>>;
    pageGallerySettings: PageGallerySettings;
    updatePageGallerySettings: React.Dispatch<React.SetStateAction<PageGallerySettings>>;
    homeSections: HomeSectionItem[];
    updateHomeSections: React.Dispatch<React.SetStateAction<HomeSectionItem[]>>;
    homeSectionRepeats: HomeSectionRepeats;
    updateHomeSectionRepeats: React.Dispatch<React.SetStateAction<HomeSectionRepeats>>;
    blogData: BlogData;
    updateBlogData: React.Dispatch<React.SetStateAction<BlogData>>;
    testimonialsData: TestimonialsData;
    updateTestimonialsData: React.Dispatch<React.SetStateAction<TestimonialsData>>;
    infoSectionData: InfoSectionData;
    updateInfoSectionData: React.Dispatch<React.SetStateAction<InfoSectionData>>;
    faqData: FAQData;
    updateFaqData: React.Dispatch<React.SetStateAction<FAQData>>;
    eventsData: EventsData;
    updateEventsData: React.Dispatch<React.SetStateAction<EventsData>>;
    instagramHighlightsData: InstagramHighlightsData;
    updateInstagramHighlightsData: React.Dispatch<React.SetStateAction<InstagramHighlightsData>>;
    termsData: TermItem[];
    updateTermsData: React.Dispatch<React.SetStateAction<TermItem[]>>;
    henDoPageData: HenDoPageData;
    updateHenDoPageData: React.Dispatch<React.SetStateAction<HenDoPageData>>;
    birthdayPageData: BirthdayPageData;
    updateBirthdayPageData: React.Dispatch<React.SetStateAction<BirthdayPageData>>;
    songs: Song[];
    updateSongs: React.Dispatch<React.SetStateAction<Song[]>>;
    adminPassword: string;
    updateAdminPassword: React.Dispatch<React.SetStateAction<string>>;
    syncUrl: string;
    updateSyncUrl: React.Dispatch<React.SetStateAction<string>>;
    firebaseConfig: FirebaseConfig;
    updateFirebaseConfig: React.Dispatch<React.SetStateAction<FirebaseConfig>>;
    purgeCache: () => void;
    importDatabase: (json: any) => boolean;
    exportDatabase: () => string;
    saveToHostinger: () => Promise<void>;
    loadFromHostinger: () => Promise<void>;
    saveToFirebase: () => Promise<void>;
    loadFromFirebase: () => Promise<void>;
    uploadFile: (file: Blob | File) => Promise<string | null>;
    fetchServerFiles: () => Promise<MediaRecord[]>;
    repairMediaLibrary: () => Promise<MediaRepairResult>;
    cleanupMediaLibrary: () => Promise<MediaRepairResult>;
    isDataLoading: boolean;
}

const INITIAL_SEO: HeaderData = { 
    logoUrl: "",
    siteTitle: "London Karaoke Club | Private Karaoke Bar & Cocktails in Soho",
    siteDescription: "Luxury private karaoke suites in Soho, London. Over 80,000 songs, signature cocktails, and premium service. Perfect for hen parties and birthdays. Book online.",
    faviconUrl: "/favicon.svg",
    navOrder: ["menu", "gallery", "birthday-karaoke-soho", "hen-do-karaoke-soho", "guides", "drinks", "songs"],
    customScripts: { header: "", footer: "" }
};

const INITIAL_HERO: HeroData = { backgroundImageUrl: "", slides: [], mobileSlides: [], badgeText: "Fridays & Saturdays sell out 1–2 weeks in advance.", headingText: "Private Karaoke in Soho — Open Until 3am", subText: "80,000+ songs, updated monthly. Private spaces for 10–50+ guests. No chains. No boxes. Just your own club.", buttonText: "Book Your Private Room", showBadge: true, showButtons: true };
const INITIAL_HIGHLIGHTS: HighlightsData = { enabled: true, heading: "Best Karaoke in Soho", subtext: "Step into Soho's premier destination for private singing and celebrations.", mainImageUrl: "", featureListTitle: "The LKC Difference", featureList: ["Bespoke Private Booths", "80,000+ Global Hits", "Central Soho Location"], sideImageUrl: "" };
const INITIAL_FEATURES: FeaturesData = {
    enabled: true,
    experience: { label: "The Experience", heading: "Bespoke Private Stage", text: "Luxury karaoke redefined in the heart of London.", image: "" },
    occasions: { heading: "Parties & Occasions", text: "We specialize in unforgettable London events.", items: [{title: "Hen Parties", text: "Premium bubbles and your favorite anthems."}] },
    grid: { heading: "Venue Highlights", items: [{title: "Smart Lighting", description: "Immersive mood lighting.", image: ""}] }
};
const INITIAL_VIBE: VibeData = { enabled: true, label: "The Vibe", heading: "Soho Nightlife", text: "Unmatched energy in London's most iconic district.", image1: "", image2: "", bigImage: "", bottomHeading: "Open until 3am", bottomText: "The party never stops at LKC Soho." };
const INITIAL_STATS: BatteryData = { enabled: true, statPrefix: "Over", statNumber: "80,000", statSuffix: "Songs", subText: "Updated monthly with the latest hits." };
const INITIAL_GALLERY: GalleryData = {
    heading: "Soho Karaoke Gallery",
    subtext: "A glimpse inside our luxury private booths.",
    images: [],
    showOnHome: false,
    homeFeatureEnabled: false,
    collections: [
        {
            id: 'default',
            name: 'Main Gallery',
            subtext: 'A glimpse inside our luxury private booths.',
            images: [],
            defaultViewMode: 'carousel'
        }
    ],
    activeCollectionId: 'default'
};
const INITIAL_PAGE_GALLERY_SETTINGS: PageGallerySettings = {
    home: { enabled: false, collectionId: 'default', viewMode: 'carousel' },
    drinks: { enabled: false, collectionId: 'default', viewMode: 'carousel' },
    food: { enabled: false, collectionId: 'default', viewMode: 'carousel' },
    blog: { enabled: false, collectionId: 'default', viewMode: 'carousel' },
    events: { enabled: false, collectionId: 'default', viewMode: 'carousel' },
    songs: { enabled: false, collectionId: 'default', viewMode: 'carousel' },
    instagram: { enabled: false, collectionId: 'default', viewMode: 'carousel' }
};
const INITIAL_BLOG: BlogData = {
    heading: "Karaoke Planning Guides",
    subtext: "Useful Soho planning guides for birthdays, hen dos, and private karaoke nights in London.",
    posts: [
        {
            id: '1',
            title: 'Welcome to LKC Soho',
            date: '2024-01-01',
            excerpt: 'Discover London\'s newest private karaoke experience.',
            content: 'Welcome to London Karaoke Club.',
            imageUrl: ''
        },
        {
            id: '2',
            title: 'The De Facto Hen Do Karaoke Destination in Soho – London Karaoke Club',
            date: '2025-02-14',
            excerpt: 'London Karaoke Club is the hen do karaoke destination in Soho with private rooms, custom welcomes, and all-night party energy.',
            content: `The De Facto Hen Do Karaoke Destination in Soho – London Karaoke Club

Looking for the ultimate hen night in London? Skip the ordinary and head straight to London Karaoke Club — the undisputed home of hen do karaoke parties in Soho. This isn’t just another night out — this is your bride’s main character moment.

LKC isn’t here to be an option. We’re the destination.

Why London Karaoke Club Is the Hen Do Party Place
- Private Karaoke Rooms – No strangers. No stage fright. Just your own soundproofed zone to unleash the chaos.
- Custom Welcome Messages – Personalised greetings that scream, "Yes, this night is all about her."
- Celebratory Energy Baked In – This place is tuned for party mode. Fast drinks. Loud singalongs. Zero inhibitions.
- Flexible Party Packages – Whether you’re coming classy or full tilt, we’ve got bundles to fit every vibe and volume.
- In the Heart of Soho – Walk in, mic up, and melt the night away in London’s most iconic party district.

You’ve got the bride. We’ve got the night sorted.

From high heels to high notes, London Karaoke Club is where hen dos go to become legends.

Book Now
Forget average. This is the hen party benchmark.
Book your hen do karaoke party now: https://bookings.londonkaraoke.club`,
            imageUrl: ''
        },
        {
            id: '3',
            title: 'Birthday Karaoke Parties in Soho: How to Plan a Night Everyone Talks About',
            date: '2026-02-14',
            excerpt: 'Planning a birthday in London? Here is the LKC blueprint for a private karaoke night with zero stress and maximum fun.',
            content: `Birthday Karaoke Parties in Soho: How to Plan a Night Everyone Talks About

If you want a birthday that feels personal, high-energy, and easy to organize, private karaoke is hard to beat. At London Karaoke Club, birthday groups get their own room, their own soundtrack, and a setup designed for celebration from the first song.

How to Build the Perfect Birthday Night
- Pick your start vibe: warm-up drinks and throwback tracks before the big singalong hits.
- Build a shared queue: mix crowd-pleasers, duets, and one surprise anthem for the birthday moment.
- Plan photo moments: use the room lighting and neon look to capture content between songs.
- Keep food and drinks simple: pre-select favorites so your group spends more time singing and less time deciding.
- End on a finale: choose one last all-group song everyone knows.

Why birthdays work so well at LKC
- Private rooms for your group only
- Huge song catalog across pop, R&B, afrobeats, rock, and classics
- Central Soho location for easy before-and-after plans
- A party atmosphere that works for small or large groups

Birthday nights should feel effortless. We help you set it up fast so your group can focus on having a great time.

            Book your birthday karaoke session now: https://bookings.londonkaraoke.club`,
            imageUrl: ''
        },
        {
            id: '4',
            title: 'Why Karaoke Is Perfect for Team-Building Events',
            slug: 'karaoke-team-building',
            status: 'published',
            publishAt: '2026-03-11',
            date: '2026-03-11',
            excerpt: 'Karaoke is a fun and effective team-building activity that helps colleagues relax, connect, and create memorable shared experiences in a private social setting.',
            metaTitle: 'Why Karaoke Is Perfect for Team-Building Events in London',
            metaDescription: 'Karaoke is one of the best team-building activities in London. Discover how it breaks down barriers, boosts morale, and creates memorable company events.',
            canonical: 'https://www.londonkaraoke.club/guides/karaoke-team-building',
            content: `Why Karaoke Is Perfect for Team-Building Events

Corporate team-building events often struggle to get the balance right. Some feel too formal. Others feel forced. And a lot of them are forgotten almost immediately.

Karaoke is different.

It gives people a reason to relax, laugh, and interact naturally without the pressure that often comes with traditional work events. Instead of awkward small talk or overly structured activities, karaoke creates a shared experience that people actually enjoy.

At London Karaoke Club, we see this first-hand. Work teams come in looking for a fun night out and leave with stronger connections, better energy, and the kind of memories that carry back into the workplace.

Karaoke breaks down workplace barriers

In most office environments, people operate within clear roles. Managers manage. Staff follow structure. Even at social events, those dynamics often remain in place.

Karaoke changes that quickly.

The moment a manager picks up the mic and starts singing, the atmosphere shifts. Titles matter less. People stop performing their work identity and start acting more like themselves. That change helps colleagues connect in a more genuine way.

Because singing involves a level of vulnerability, karaoke naturally lowers social barriers. It creates a relaxed setting where people feel more comfortable with each other, and that often leads to stronger team chemistry.

It encourages teamwork without feeling forced

A lot of team-building activities make collaboration feel obvious and artificial. People can tell when they are being pushed into a bonding exercise.

Karaoke works better because the teamwork happens naturally.

Duets, group songs, singalongs, and shared playlists all create moments of collaboration. People support each other, cheer each other on, and often end up joining in together even if they did not plan to.

That makes karaoke a strong option for teams with a mix of personalities. Some people love the spotlight. Others prefer to stay in the background and support the energy of the room. Both types of people can enjoy the experience without pressure.

It creates memorable shared experiences

The problem with many corporate events is that they leave no real impression. People attend, make polite conversation, and move on.

Karaoke tends to do the opposite.

A surprising performance, a hilarious song choice, a full-room singalong, or an unexpected duet becomes something people talk about long after the event ends. These shared moments turn into inside jokes, references, and stories that stay with the team.

That matters because stronger teams are often built through shared experiences outside the usual work environment. Karaoke creates those moments easily.

It helps people relax

Some work socials still feel like an extension of the office. People feel like they need to say the right thing, act the right way, and stay switched on.

Karaoke creates a more relaxed atmosphere.

Music gives people something to connect through immediately. Instead of forcing conversation, it gives the room energy and direction. Guests can sing, watch, laugh, order drinks, or join in when they feel ready. That flexibility makes the event feel more comfortable and more inclusive.

For teams that want a social event without stiffness, karaoke is one of the easiest ways to create the right mood.

Private karaoke rooms work especially well for corporate groups

Private rooms make karaoke even better for team-building because they remove outside pressure.

In a private space, colleagues feel more comfortable letting go. They are not singing in front of strangers. They are with their own group, in their own room, with the freedom to enjoy the night properly.

That privacy helps people relax faster, which is especially useful for work groups where not everyone knows each other well. It also makes the event feel more exclusive, more personal, and more suited to company celebrations.

For office parties, staff socials, client events, or end-of-year team nights, a private karaoke room creates a much better setting than a crowded public bar.

A great option for different types of company events

Karaoke is not only useful for one kind of work occasion. It works well across a range of corporate events, including:

* team-building nights
* office parties
* company celebrations
* client entertainment
* product launch after-parties
* Christmas parties
* team reward nights

That is part of the appeal. It can be playful and casual, but it can also feel premium and polished when done in the right venue.

Why companies choose karaoke in London

For businesses planning team events in London, karaoke offers something stronger than the usual drinks booking or dinner reservation.

It gives people an experience rather than just a place to stand around. It combines music, energy, interaction, food, drinks, and private space in one setting. That makes it easier to organise and far more memorable for guests.

At London Karaoke Club in Soho, corporate groups choose karaoke because it gives them:

* a private setting
* a social activity everyone understands
* flexible group participation
* food and drink options
* an atmosphere that feels lively but easy

That combination makes it one of the most effective and enjoyable team-building event formats in London.

Karaoke builds morale in a natural way

Good morale cannot be forced. It usually grows when people feel comfortable, included, and genuinely enjoy spending time together.

Karaoke helps create that kind of environment.

It gives teams a break from routine. It allows people to show personality. It creates laughter, confidence, and a sense of shared fun. Those things may seem simple, but they can have a real effect on team spirit.

When people come away from a work event feeling lighter, more connected, and more positive about the people around them, the event has done its job.

Final thoughts

The best team-building activities do not feel like exercises. They feel natural.

That is why karaoke works so well. It breaks down barriers, encourages collaboration, creates memorable moments, and helps colleagues connect in a way that feels easy rather than staged.

For companies looking for a team-building event in London that is fun, social, and genuinely effective, karaoke is one of the strongest options available.

If you are planning a corporate event, office party, or team social in Soho, London Karaoke Club offers private karaoke rooms, food, drinks, and a setting designed for great group nights out.

Suggested internal links:
/events
/corporate-karaoke-soho
/guides/private-karaoke-rooms-london
/birthday-karaoke-soho`,
            imageUrl: ''
        },
        {
            id: '5',
            title: 'Why Karaoke Nights Make Better Birthdays Than a Normal Bar Booking',
            slug: 'karaoke-birthday-vs-bar',
            status: 'published',
            publishAt: '2026-03-11',
            date: '2026-03-11',
            excerpt: 'A private karaoke birthday creates more energy, more shared moments, and a much better group experience than a standard bar booking.',
            metaTitle: 'Why Karaoke Nights Make Better Birthdays Than a Normal Bar Booking in London',
            metaDescription: 'Discover why private karaoke makes a better birthday than a standard bar booking. More fun, more personal, more memorable, and ideal for groups in London.',
            canonical: 'https://www.londonkaraoke.club/guides/karaoke-birthday-vs-bar',
            content: `Why Karaoke Nights Make Better Birthdays Than a Normal Bar Booking

Birthday plans often fall into the same pattern. Someone books a bar, people arrive in small groups, half the table cannot hear each other, and the night ends up feeling like every other night out.

That is exactly why karaoke works better.

A private karaoke birthday gives the group something to do, not just somewhere to stand. It creates energy straight away, keeps everyone involved, and turns the night into an actual shared experience instead of a loose bar meet-up.

At London Karaoke Club, birthday groups usually want the same thing: a night that feels fun, easy, and memorable without becoming messy or dull. Karaoke solves that better than a standard bar booking ever can.

A bar booking often looks better in theory than it does in reality

On paper, booking a bar sounds simple. In practice, it often means:

* waiting for people to arrive
* struggling to hold a conversation over loud music
* standing around because seating is limited
* splitting into smaller groups
* losing the feeling of a proper occasion

For birthdays, that is a weak setup.

The birthday person should feel like the night was built around them. In a normal bar, that can easily get lost. The venue keeps running as usual, the group gets absorbed into the crowd, and the event feels generic.

Karaoke turns the birthday into the event

That is the real difference.

With karaoke, the night has a centre. The group is there for a shared experience. The birthday feels like an occasion rather than just drinks in a busy venue.

People pick songs for the birthday person, sing together, laugh at unexpected performances, and create moments that actually belong to that group. It feels more personal, more lively, and more memorable.

Instead of hoping the atmosphere appears on its own, karaoke gives the atmosphere to you from the start.

It is better for groups

Bar bookings are rarely ideal for groups. Some people want to sit, others want to move around, and conversations often split off into smaller circles.

Private karaoke works better because the group stays together.

Everyone is in the same space. People can sing, watch, join in, order drinks, take videos, and celebrate as one group. Even guests who are not planning to sing still feel part of the night because the entertainment is shared.

That makes karaoke especially good for:

* birthdays
* mixed friendship groups
* birthdays with guests who do not all know each other
* celebrations where you want the whole group involved

It removes the awkwardness

One problem with standard birthday drinks is that the energy can depend too much on conversation.

If the group does not fully click straight away, the night can feel flat.

Karaoke fixes that quickly. Music gives everyone an easy point of connection. People do not need perfect conversation skills. They just need a song, a laugh, and a reason to join in.

That makes karaoke ideal for groups with mixed personalities. Loud people love it. Quieter people often warm up once the room relaxes. And even those who never touch the mic still enjoy the atmosphere.

It feels more private and more personal

A birthday should not feel random.

One of the biggest advantages of private karaoke is that it gives your group its own space. That changes everything. The celebration feels contained, focused, and actually yours.

You are not competing with strangers at the next table. You are not trying to protect a small area in a packed bar. You are not stuck shouting over a DJ just to speak to friends.

Instead, you get a space where the birthday group can actually celebrate properly.

It creates better memories than just drinks

Most bar birthdays blur together. A few photos, a few drinks, the same crowd, the same format.

Karaoke gives you standout moments.

There is always a song choice nobody saw coming. A duet that becomes the highlight of the night. A full-room singalong. A completely chaotic but brilliant performance that people talk about afterwards.

That is what makes a birthday memorable. Not just being out, but having moments that feel specific to that night.

It works for different kinds of birthday groups

Not everyone wants the same kind of birthday.

Some people want a big, energetic night. Others want something more private and controlled. Karaoke works well for both because it can be playful, relaxed, or full-on depending on the group.

It is a strong option for:

* milestone birthdays
* surprise birthdays
* mixed-age groups
* smaller private celebrations
* bigger group parties
* birthdays that lead into a full Soho night out

That flexibility is part of why it works so well.

Food, drinks and entertainment are already built in

A standard bar booking often leaves the rest to chance. You still need atmosphere. You still need a way to keep people engaged. You may still end up moving somewhere else later.

With karaoke, the entertainment is already part of the booking.

That makes the whole night feel more complete. Add food and drinks, and the group has everything it needs in one place. That is easier to organise and much better for the birthday host.

Why karaoke works especially well in Soho

Soho already suits celebration nights. It is central, energetic, and full of life.

A private karaoke booking in Soho gives you the best of both worlds: your own space for the main event, plus the buzz of the area around it. That makes it ideal for groups who want a proper birthday experience rather than just another drinks plan.

Final thoughts

A normal bar booking is easy, but it is rarely special.

Karaoke gives birthdays more energy, more personality, more privacy, and more actual fun. It keeps the group together, gives the night a clear focus, and creates the kind of moments people remember.

That is why private karaoke makes a better birthday than a standard bar booking.

Suggested internal links:
/birthday-karaoke-soho
/events
/
group booking pages`,
            imageUrl: ''
        },
        {
            id: '6',
            title: 'Private Karaoke Rooms in London: What to Look For Before You Book',
            slug: 'private-karaoke-rooms-london',
            status: 'published',
            publishAt: '2026-03-11',
            date: '2026-03-11',
            excerpt: 'Looking for private karaoke rooms in London? Here is what actually matters before you book, from privacy and sound quality to location, drinks, and group fit.',
            metaTitle: 'Private Karaoke Rooms in London: What to Look For Before You Book',
            metaDescription: 'Looking for private karaoke rooms in London? Learn what matters before you book, including privacy, sound, location, drinks, group size, and overall experience.',
            canonical: 'https://www.londonkaraoke.club/guides/private-karaoke-rooms-london',
            content: `Private Karaoke Rooms in London: What to Look For Before You Book

Private karaoke rooms in London can look similar at first glance. A venue shows a few photos, promises a big song list, and says it is ideal for groups. But once you start comparing options properly, the differences become clear very quickly.

Some places are built for real celebrations. Others are just bars with a karaoke feature attached.

If you are booking for a birthday, hen do, team night, or group celebration, the details matter. Privacy, sound quality, room layout, service, and location all shape the night far more than a generic venue description ever will.

At London Karaoke Club, we see the same pattern again and again. Guests who have had average karaoke experiences elsewhere are usually not looking for “just karaoke.” They are looking for a private room that feels like a proper night out.

Why private karaoke rooms work so well

The biggest advantage of a private karaoke room is simple: the night belongs to your group.

You are not sharing the atmosphere with strangers. You are not waiting around for a public stage slot. You are not trying to protect one small corner of a noisy bar while the rest of the venue carries on as normal.

Instead, your group has its own space, its own energy, and the freedom to shape the evening properly. People can sing, sit back, order drinks, laugh, film content, or join in when they feel ready. That flexibility is what makes private karaoke work for so many different types of group.

It feels more personal, more relaxed, and far easier to organise.

The first thing to check is whether the room is actually private

This sounds obvious, but not every “private karaoke” venue feels genuinely private.

Some spaces are semi-open. Some are positioned in a way that still leaves the group exposed to the rest of the venue. Others feel more like an add-on than a room built for the experience itself.

Real private karaoke rooms should give your group a sense of separation from the outside environment. That changes how people behave. Guests relax faster, sing sooner, and stop feeling self-conscious.

For birthdays and work socials especially, that privacy makes a huge difference. It helps the night feel like a real event instead of just another stop on a generic bar crawl.

Sound quality matters more than most people think

People often focus on songs and drinks first, but sound quality is one of the biggest factors in whether the room actually feels good.

A poor karaoke setup makes the whole experience harder work. The mic feels weak, the backing track sounds flat, and the room never fully lifts.

Good private karaoke rooms should make singing feel easy and rewarding, even for people who are not natural performers. Clear audio, well-balanced volume, reliable microphones, and a room layout that carries sound properly all help the night flow.

That is one of the reasons strong venues stand out. When the sound works, the confidence in the room changes immediately.

Room size should match the group, not just the booking minimum

One of the most common mistakes people make is booking a room that technically fits the group but does not actually suit the occasion.

A group of 18 needs a different setup from a group of 40. Even if both can fit into the venue, the energy, movement, drinks flow, and comfort level will be very different.

When comparing private karaoke rooms in London, it is worth checking how the venue handles:

* smaller private groups
* mixed seated and standing groups
* milestone birthdays
* larger party bookings
* work socials and client events

The best venues do not just offer rooms. They offer the right room experience for the group you have.

Location shapes the whole night

London is full of options, but location still makes or breaks group plans.

If a venue is awkward to reach, hidden in the wrong area, or disconnected from the rest of the night, it creates friction before the event has even started.

That is why private karaoke in Soho works so well. It is central, recognisable, and easy for guests travelling from different parts of London. It also gives the group options before and after the booking without making the karaoke itself feel like an afterthought.

For birthdays, hen dos, and team events, central location usually means better turnout, easier planning, and less drop-off during the evening.

Food and drinks should support the night, not complicate it

Some venues treat food and drinks as secondary. Others understand that they are part of the experience.

For group nights, people want the basics covered without needing to over-plan every detail. They want drinks that arrive smoothly, food that suits sharing, and a setup that keeps the room moving instead of interrupting it.

This is especially important for celebrations where the host is trying to manage different personalities and preferences. If the venue already handles drinks, food, and entertainment well, the whole night becomes easier.

That is one of the main reasons people book private karaoke over a normal bar. The format is already built to keep the group engaged.

Song choice is important, but usability matters just as much

A large song library is valuable, but it is not the only thing worth checking.

The system also needs to be easy to use. Guests should be able to search tracks quickly, build a queue without confusion, and keep the room energy moving without technical friction.

A venue can claim thousands of songs, but if the system feels clunky, the experience slows down. A better setup makes it easy for guests to switch between solo songs, duets, throwbacks, and big group singalongs without losing momentum.

That is what helps a room stay lively for the full booking.

Atmosphere is what turns a booking into a proper night out

People do not usually book private karaoke just to sing. They book it because they want the night to feel fun, social, and a bit elevated.

That atmosphere comes from a combination of things:

* lighting
* layout
* room design
* privacy
* sound
* service
* crowd energy within the group

When all of those things line up, the room stops feeling like a hired space and starts feeling like your group’s venue for the night.

That is what people remember afterwards.

Who private karaoke rooms are best for

Private karaoke works especially well for:

* birthday parties
* hen and stag nights
* corporate socials
* milestone celebrations
* mixed friendship groups
* guests who want entertainment without a formal event structure

The reason is simple. It combines activity, privacy, drinks, music, and shared atmosphere in one booking.

That makes it more useful than a standard bar reservation and easier to manage than a venue-hopping plan.

What people are really looking for when they search for private karaoke rooms in London

Most guests are not just looking for a room with microphones.

They are looking for somewhere that feels worth booking.

They want a venue that makes the night easier to organise, gives the group a proper sense of occasion, and delivers enough atmosphere that nobody feels like they settled for the easy option.

That is why the best private karaoke rooms in London tend to stand out for the whole experience, not just the karaoke system itself.

Final thoughts

If you are comparing private karaoke rooms in London, the smartest approach is to look beyond the basic checklist.

Ask whether the room feels genuinely private. Whether the sound will actually carry the night. Whether the location works for your group. Whether drinks and food are built into the experience. And whether the venue feels like somewhere people will remember.

That is what separates a good group night from a forgettable one.

At London Karaoke Club in Soho, private karaoke is designed to feel like a full night out rather than a small add-on to a bar booking. For groups who want privacy, strong atmosphere, and a room that actually feels special, that difference matters.

Suggested internal links:
/birthday-karaoke-soho
/hen-do-karaoke-soho
/events
/gallery
/drinks`,
            imageUrl: ''
        }
    ]
};
const INITIAL_FAQ: FAQData = { enabled: true, heading: "Soho Karaoke FAQs", subtext: "Common questions about booking and our venue.", items: [{question: "Where is the club located?", answer: "We are located in the heart of Soho, London."}] };
const INITIAL_DRINKS: DrinksData = {
    headerImageUrl: "",
    packagesData: { title: "Party Packages", subtitle: "Bespoke group deals", items: [], notes: [] },
    bottleServiceData: [], byTheGlassData: [], shotsData: { title: "Shots", items: [], shooters: { title: "", prices: "", items: [] } },
    cocktailsData: [], winesData: []
};
const INITIAL_INSTAGRAM: InstagramHighlightsData = { 
    enabled: true, 
    heading: "Catch the Highlights", 
    username: "@londonkaraoke.club", 
    highlights: [],
    posts: []
};
const INITIAL_HEN_DO_PAGE: HenDoPageData = {
    heroTitle: 'Hen Do Karaoke in Soho',
    heroSubtitle: 'Private Rooms · 80,000+ Songs · Open Until 3am',
    heroDescription: 'Planning the bride’s last big night? London Karaoke Club gives your group a fully private party space in the heart of Soho.',
    heroImageUrl: '',
    extraImages: [],
    urgencyText: 'Fridays & Saturdays sell out early.',
    whyTitle: 'Built for Big Hen Nights',
    whyIntro: 'Forget awkward shared bars or tiny padded boxes.',
    whyBullets: [
        'A fully private karaoke room',
        'Space for 10–50+ guests',
        'Studio-quality sound',
        '80,000+ songs (updated monthly)',
        'Custom key & tempo control',
        'Open until 3am',
        'Central Soho location'
    ],
    whyOutro: 'Matching outfits? Champagne entrances? Bride spotlight moment? All welcome.',
    drinksTitle: 'Cocktails & Sharing Platters',
    drinksIntro: 'Keep the energy high with:',
    drinksBullets: ['Signature cocktails', 'Prosecco & champagne', 'Sharing platters', 'Pre-booked drinks packages'],
    drinksNote: 'No outside drinks permitted — but everything you need is on site.',
    socialTitle: 'What Other Hen Groups Say',
    testimonials: [
        { quote: 'The perfect hen night. Private, loud, and so much fun.', name: 'Sophie M.' },
        { quote: 'Bride had the best night ever. Staff were amazing.', name: 'Hannah L.' }
    ],
    seoTitle: 'Hen Do Karaoke Soho – The Private Party Option',
    seoParagraphs: [
        'If you’re searching for a hen do karaoke Soho venue that feels exclusive, London Karaoke Club offers private room hire designed specifically for hen parties. Unlike public karaoke bars, your group has full control of the space, music, and atmosphere.',
        'For groups comparing private karaoke hen party London venues, we combine central Soho access, flexible room sizes for 10–50+ guests, and a song library of 80,000+ tracks updated monthly.',
        'Prebooking is essential — weekend hen nights fill quickly.'
    ],
    faqTitle: 'Hen Party FAQs',
    faqs: [
        { question: 'How many people can attend a hen party?', answer: 'Rooms accommodate 10–50+ guests.' },
        { question: 'Do you offer hen packages?', answer: 'Drinks packages can be pre-arranged. Message us for details.' },
        { question: 'Is fancy dress allowed?', answer: 'Yes — themed outfits welcome.' },
        { question: 'Do we need to book in advance?', answer: 'Yes. We do not accept walk-ins.' }
    ],
    finalTitle: 'Ready to Plan the Bride’s Night?',
    finalSubtitle: 'Secure your private hen karaoke room in Soho now.'
};
const INITIAL_BIRTHDAY_PAGE: BirthdayPageData = {
    heroTitle: 'Private Karaoke Birthday Parties in Soho',
    heroSubtitle: 'Your Room. Your Playlist. Your Night. Open Until 3am.',
    heroDescription: 'Celebrate properly — in your own private karaoke space in the heart of Soho.',
    heroHighlights: '80,000+ songs · Studio-quality sound · 10–50+ guests',
    heroImageUrl: '',
    extraImages: [],
    urgencyText: 'Weekend dates sell out fast.',
    whyTitle: 'Built for Big Birthday Energy',
    whyIntroA: 'This isn’t a shared bar corner.',
    whyIntroB: 'This isn’t a tiny padded box.',
    whyBullets: [
        'A fully private karaoke room',
        'Space for 10–50+ guests',
        '80,000+ songs (updated monthly)',
        'Custom key & tempo control',
        'Cocktails & sharing platters',
        'Open until 3am',
        'Central Soho location'
    ],
    whyOutroA: 'Bring the cake. Bring the outfits. Bring the chaos.',
    whyOutroB: 'We’ll handle the sound.',
    milestonesTitle: 'From 18ths to 40ths and Beyond',
    milestonesIntro: 'Whether it’s:',
    milestonesBullets: [
        '18th birthday karaoke Soho',
        '21st birthday party London',
        '30th birthday venue Soho',
        '40th birthday celebration London'
    ],
    milestonesOutroA: 'Your group gets full control of the room and playlist.',
    milestonesOutroB: 'No waiting your turn. No strangers watching. No awkward public mics.',
    milestonesOutroC: 'Just your people.',
    drinksTitle: 'Cocktails That Match the Occasion',
    drinksIntro: 'Pre-arrange:',
    drinksBullets: ['Prosecco & champagne', 'Birthday drinks packages', 'Sharing platters', 'Signature cocktails'],
    drinksNote: 'Our team can help you shape the vibe — low-key drinks or full-blown party.',
    socialTitle: 'What Birthday Groups Say',
    testimonials: [
        { quote: 'Booked for my 30th and it was unreal.', name: 'James T.' },
        { quote: 'Best birthday I’ve had in years.', name: 'Laura P.' }
    ],
    seoTitle: 'Birthday Karaoke Soho – Private Room Hire',
    seoParagraphs: [
        'If you’re searching for birthday karaoke Soho venues, London Karaoke Club offers fully private karaoke room hire designed for group celebrations.',
        'Unlike public karaoke bars, your birthday party has exclusive use of the room, access to 80,000+ songs updated monthly, and late finishes until 3am.',
        'For planners comparing private karaoke birthday London venues, we combine central location, flexible room sizes for 10–50+ guests, and a booking system that shows real-time availability.',
        'Advance booking is essential for weekend dates.'
    ],
    faqTitle: 'Birthday Party FAQs',
    faqs: [
        { question: 'Can I bring a birthday cake?', answer: 'Yes — speak to us in advance.' },
        { question: 'Is decoration allowed?', answer: 'Yes, within reason. Message us for details.' },
        { question: 'Is there a minimum spend?', answer: 'Prices vary by day and group size. Minimum booking is 2 hours.' },
        { question: 'Do you allow outside drinks?', answer: 'No outside food or drink permitted.' }
    ],
    finalTitle: 'Lock In Your Birthday Date',
    finalSubtitle: 'Fridays & Saturdays sell out quickly.'
};
const INITIAL_HOME_SECTION_REPEATS: HomeSectionRepeats = {
    hero: 1,
    instagramHighlights: 1,
    highlights: 1,
    features: 1,
    vibe: 1,
    battery: 1,
    testimonials: 1,
    info: 1,
    faq: 1,
    drinks: 1,
    gallery: 1
};
const INITIAL_HOME_SECTIONS: HomeSectionItem[] = [
    { id: 'home-hero-1', type: 'hero', title: 'Hero', enabled: true },
    { id: 'home-instagram-1', type: 'instagramHighlights', title: 'Instagram Highlights', enabled: true },
    { id: 'home-highlights-1', type: 'highlights', title: 'Highlights', enabled: true },
    { id: 'home-features-1', type: 'features', title: 'Features', enabled: true },
    { id: 'home-vibe-1', type: 'vibe', title: 'Vibe', enabled: true },
    { id: 'home-battery-1', type: 'battery', title: 'Stats', enabled: true },
    { id: 'home-testimonials-1', type: 'testimonials', title: 'Testimonials', enabled: true },
    { id: 'home-info-1', type: 'info', title: 'Info', enabled: true },
    { id: 'home-faq-1', type: 'faq', title: 'FAQ', enabled: true },
    { id: 'home-drinks-1', type: 'drinks', title: 'Drinks', enabled: true },
    { id: 'home-gallery-1', type: 'gallery', title: 'Gallery', enabled: true }
];

const INITIAL_TERMS: TermItem[] = [
    {
        title: "Terms and Conditions for Bookings (Westminster-Compliant)",
        content: "By making a reservation, you agree to be bound by these Terms and Conditions. These terms support the licensing objectives under the Licensing Act 2003: prevention of crime and disorder, public safety, prevention of public nuisance, and protection of children from harm."
    },
    {
        title: "1. Booking Times & Licensed Hours",
        content: "All guests must vacate the premises by closing time in accordance with the premises licence. No extensions beyond licensed hours will be permitted."
    },
    {
        title: "2. Booking Duration",
        content: "Each standard booking slot is 1 hour and 55 minutes. Booking time includes arrival, room use, and exit. Failure to vacate on time may result in staff or security intervention."
    },
    {
        title: "3. Reservations",
        content: "Bookings must be made in advance through authorised channels. All reservations are subject to availability and confirmation. We reserve the right to refuse or cancel any booking where licensing compliance may be compromised."
    },
    {
        title: "4. Cancellation & Amendments",
        content: "All cancellations or amendments must be submitted in writing. Standard: minimum 21 working days’ notice. Peak period (September–December): minimum 28 working days’ notice. Late cancellations or no-shows may result in forfeiture of deposit or full booking fee."
    },
    {
        title: "5. Late Arrivals",
        content: "Guests are expected to arrive on time. Late arrival does not extend the booking duration. Significant delay or failure to attend may result in cancellation without refund."
    },
    {
        title: "6. Conduct, Crime Prevention & Public Order",
        content: "Guests must behave responsibly and in line with the operation of a licensed premises. Disorderly, aggressive, intoxicated, or anti-social behaviour will not be tolerated. We reserve the right to refuse entry or remove individuals or groups without refund where behaviour risks: crime or disorder, public safety, public nuisance, breach of licence conditions."
    },
    {
        title: "7. Age Restriction — Strictly Over 18",
        content: "The premises operates a strictly over-18s policy at all times. No persons under 18 are permitted on the premises, without exception. Valid photographic ID may be required on entry. Entry may be refused and guests removed without refund if age requirements are not met. This policy supports the protection of children from harm licensing objective."
    },
    {
        title: "8. Identification Policy — Fake or Invalid ID (Zero Tolerance)",
        content: "Fake, altered, borrowed, expired, or otherwise invalid identification will not be accepted. If any member of a booking group is found to be using or attempting to use fake or invalid ID: the entire group will be refused entry or removed from the premises, and no refund will be issued. ID checks form part of our Challenge 25 and crime-prevention measures. We reserve the right to retain suspected fake ID where permitted by law and to notify the relevant authorities if required."
    },
    {
        title: "9. Alcohol & Intoxication Policy",
        content: "Alcohol is supplied strictly in accordance with UK licensing law. Alcohol will only be served to guests aged 18 or over who are not intoxicated. Service may be refused and guests may be asked to leave where intoxication is observed."
    },
    {
        title: "10. Damage, Loss & Liability",
        content: "Guests are responsible for any damage caused to the premises, fixtures, fittings, or equipment. We reserve the right to recover repair or replacement costs, including via the payment method on file. We accept no liability for loss or damage to personal belongings."
    },
    {
        title: "11. Safety, CCTV & Security",
        content: "CCTV is in operation in accordance with licence conditions. Security and door supervision may be deployed where required. In an emergency or evacuation, staff and security instructions must be followed immediately."
    },
    {
        title: "12. Noise Control & Neighbour Consideration",
        content: "Guests must comply with all noise-management measures. Excessive noise or behaviour likely to disturb neighbours will not be tolerated. Bookings may be terminated to prevent public nuisance."
    },
    {
        title: "13. Data Protection",
        content: "Personal data is processed in accordance with UK GDPR and the Data Protection Act 2018. By booking, you consent to our data handling practices."
    },
    {
        title: "14. Force Majeure & Operational Changes",
        content: "We reserve the right to amend or cancel bookings due to unforeseen circumstances, including safety, licensing, or operational issues. Where possible, notice will be provided."
    },
    {
        title: "15. Amendments to These Terms",
        content: "These Terms and Conditions may be updated at any time. The version in force at the time of booking shall apply. By making a reservation, you confirm that you have read, understood, and agree to comply with these Terms and Conditions in full."
    }
];

const INITIAL_TESTIMONIALS: TestimonialsData = {
    enabled: true,
    heading: 'Google Reviews',
    subtext: 'Curated 5-star reviews from real London Karaoke Club guests.',
    items: []
};

const mergeDefaultBlogPosts = (data: BlogData): BlogData => {
    const safePosts = Array.isArray(data.posts) ? data.posts : [];
    const existingIds = new Set(safePosts.map(post => post.id));
    const existingTitles = new Set(safePosts.map(post => post.title.trim().toLowerCase()));

    const missingPosts = INITIAL_BLOG.posts.filter(post => {
        const normalizedTitle = post.title.trim().toLowerCase();
        return !existingIds.has(post.id) && !existingTitles.has(normalizedTitle);
    });

    if (missingPosts.length === 0) return data;
    return { ...data, posts: [...missingPosts, ...safePosts] };
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const init = <T,>(key: string, defaultVal: T): T => {
        const saved = localStorage.getItem(`lkc_${key}`);
        if (!saved) return defaultVal;
        try { return JSON.parse(saved); } catch (e) { return defaultVal; }
    };

    const [headerData, setHeaderData] = useState<HeaderData>(() => init('headerData', INITIAL_SEO));
    const [heroData, setHeroData] = useState<HeroData>(() => init('heroData', INITIAL_HERO));
    const [highlightsData, setHighlightsData] = useState<HighlightsData>(() => init('highlightsData', INITIAL_HIGHLIGHTS));
    const [featuresData, setFeaturesData] = useState<FeaturesData>(() => init('featuresData', INITIAL_FEATURES));
    const [vibeData, setVibeData] = useState<VibeData>(() => init('vibeData', INITIAL_VIBE));
    const [batteryData, setBatteryData] = useState<BatteryData>(() => init('batteryData', INITIAL_STATS));
    const [galleryData, setGalleryData] = useState<GalleryData>(() => init('galleryData', INITIAL_GALLERY));
    const [pageGallerySettings, setPageGallerySettings] = useState<PageGallerySettings>(() => init('pageGallerySettings', INITIAL_PAGE_GALLERY_SETTINGS));
    const [homeSections, setHomeSections] = useState<HomeSectionItem[]>(() => init('homeSections', INITIAL_HOME_SECTIONS));
    const [homeSectionRepeats, setHomeSectionRepeats] = useState<HomeSectionRepeats>(() => init('homeSectionRepeats', INITIAL_HOME_SECTION_REPEATS));
    const [blogData, setBlogData] = useState<BlogData>(() => init('blogData', INITIAL_BLOG));
    const [faqData, setFaqData] = useState<FAQData>(() => init('faqData', INITIAL_FAQ));
    const [drinksData, setDrinksData] = useState<DrinksData>(() => init('drinksData', INITIAL_DRINKS));
    const [foodMenu, setFoodMenu] = useState<MenuCategory[]>(() => init('foodMenu', []));
    const [testimonialsData, setTestimonialsData] = useState<TestimonialsData>(() => init('testimonialsData', INITIAL_TESTIMONIALS));
    const [infoSectionData, setInfoSectionData] = useState<InfoSectionData>(() => init('infoSectionData', { enabled: true, heading: "Luxury Private Karaoke Soho", sections: [], footerTitle: "Ready to Sing?", footerText: "Book your private suite in Soho today.", footerHighlight: "No chains, just the London Karaoke Club." }));
    const [eventsData, setEventsData] = useState<EventsData>(() => init('eventsData', { hero: { title: "Corporate & Private Events", subtitle: "The ultimate venue for London group bookings.", image: "" }, sections: [] }));
    const [instagramHighlightsData, setInstagramHighlightsData] = useState<InstagramHighlightsData>(() => init('instagramHighlightsData', INITIAL_INSTAGRAM));
    const [termsData, setTermsData] = useState<TermItem[]>(() => init('termsData', INITIAL_TERMS));
    const [henDoPageData, setHenDoPageData] = useState<HenDoPageData>(() => init('henDoPageData', INITIAL_HEN_DO_PAGE));
    const [birthdayPageData, setBirthdayPageData] = useState<BirthdayPageData>(() => init('birthdayPageData', INITIAL_BIRTHDAY_PAGE));
    const [songs, setSongs] = useState<Song[]>(() => init('songs', []));
    const [adminPassword, setAdminPassword] = useState<string>(() => init('adminPassword', 'admin123'));
    const [syncUrl, setSyncUrl] = useState<string>(() => init('syncUrl', 'https://files.londonkaraoke.club/db.php'));
    const [firebaseConfig, setFirebaseConfig] = useState<FirebaseConfig>(() => init('firebaseConfig', { databaseURL: '', apiKey: '' }));
    const [footerData, setFooterData] = useState<FooterData>(() => init('footerData', { ctaHeading: "Ready to Book?", ctaText: "Secure your private karaoke room in Soho.", ctaButtonText: "Book Now" }));
    const [isDataLoading, setIsDataLoading] = useState(false);

    useEffect(() => {
        setBlogData(prev => mergeDefaultBlogPosts(prev));
    }, []);

    useEffect(() => {
        setTermsData(prev => {
            const safe = Array.isArray(prev) ? prev : [];
            if (safe.length >= 10) return prev;
            return INITIAL_TERMS;
        });
    }, []);

    useEffect(() => {
        setGalleryData(prev => {
            if (typeof prev.homeFeatureEnabled === 'boolean') return prev;
            return { ...prev, homeFeatureEnabled: Boolean(prev.showOnHome) };
        });
    }, []);

    useEffect(() => {
        setVibeData(prev => {
            const heading = prev.bottomHeading || '';
            const normalized = heading.toLowerCase();
            if (
                normalized.includes('till 3am') ||
                normalized.includes('til 3am') ||
                normalized.includes('until 3am') ||
                normalized === 'sing until 3am'
            ) {
                return { ...prev, bottomHeading: 'Open until 3am' };
            }
            return prev;
        });
    }, []);

    useEffect(() => {
        setGalleryData(prev => {
            const hasCollections = Array.isArray(prev.collections) && prev.collections.length > 0;
            if (hasCollections) {
                const normalizedCollections = prev.collections!.map(col => ({
                    ...col,
                    defaultViewMode: col.defaultViewMode === 'grid' ? 'grid' : 'carousel'
                }));
                if (prev.activeCollectionId) return { ...prev, collections: normalizedCollections };
                return { ...prev, collections: normalizedCollections, activeCollectionId: normalizedCollections[0].id };
            }
            const migratedId = 'default';
            return {
                ...prev,
                collections: [{
                    id: migratedId,
                    name: 'Main Gallery',
                    subtext: prev.subtext,
                    images: Array.isArray(prev.images) ? prev.images : [],
                    defaultViewMode: 'carousel'
                }],
                activeCollectionId: migratedId
            };
        });
    }, []);

    useEffect(() => {
        setPageGallerySettings(prev => {
            const merged = { ...INITIAL_PAGE_GALLERY_SETTINGS, ...prev };
            const legacyHomeEnabled = Boolean(galleryData.homeFeatureEnabled ?? galleryData.showOnHome);
            if (legacyHomeEnabled && !merged.home.enabled) {
                merged.home = { ...merged.home, enabled: true };
            }
            return merged;
        });
    }, [galleryData.homeFeatureEnabled, galleryData.showOnHome]);

    useEffect(() => {
        setPageGallerySettings(prev => {
            const collections = (galleryData.collections && galleryData.collections.length > 0)
                ? galleryData.collections
                : [{ id: 'default' }];
            const validIds = new Set(collections.map(c => c.id));
            const modeById = new Map(collections.map(c => [c.id, c.defaultViewMode === 'grid' ? 'grid' : 'carousel'] as const));
            const fallbackId = collections[0].id;
            let changed = false;
            const next = { ...prev };
            (Object.keys(next) as PageGalleryKey[]).forEach(key => {
                const currentId = next[key]?.collectionId;
                const nextId = (!currentId || !validIds.has(currentId)) ? fallbackId : currentId;
                const currentMode = next[key]?.viewMode;
                const fallbackMode = modeById.get(nextId) || 'carousel';
                const nextMode = currentMode === 'grid' || currentMode === 'carousel' ? currentMode : fallbackMode;
                if (nextId !== currentId || nextMode !== currentMode) {
                    next[key] = { ...(next[key] || { enabled: false }), collectionId: nextId, viewMode: nextMode };
                    changed = true;
                }
            });
            return changed ? next : prev;
        });
    }, [galleryData.collections]);

    useEffect(() => {
        setHomeSectionRepeats(prev => {
            const merged: HomeSectionRepeats = { ...INITIAL_HOME_SECTION_REPEATS, ...prev };
            const normalizedEntries = Object.entries(merged).map(([key, val]) => {
                const next = Number.isFinite(val) && val > 0 ? Math.floor(val) : 1;
                return [key, next];
            });
            return Object.fromEntries(normalizedEntries) as HomeSectionRepeats;
        });
    }, []);

    useEffect(() => {
        setHomeSections(prev => {
            const safe = Array.isArray(prev) ? prev : [];
            if (safe.length === 0) return INITIAL_HOME_SECTIONS;
            return safe.map((item, idx) => ({
                id: item.id || `home-${item.type || 'hero'}-${idx + 1}`,
                type: (item.type || 'hero') as HomeSectionType,
                title: item.title || item.type || `Section ${idx + 1}`,
                enabled: item.enabled !== false
            }));
        });
    }, []);

    useEffect(() => {
        const favicon = document.querySelector('link[rel="icon"]');
        if (favicon) favicon.setAttribute('href', headerData.faviconUrl);
    }, [headerData]);

    const persist = (key: string, data: any) => localStorage.setItem(`lkc_${key}`, JSON.stringify(data));
    useEffect(() => { persist('headerData', headerData); }, [headerData]);
    useEffect(() => { persist('heroData', heroData); }, [heroData]);
    useEffect(() => { persist('highlightsData', highlightsData); }, [highlightsData]);
    useEffect(() => { persist('featuresData', featuresData); }, [featuresData]);
    useEffect(() => { persist('vibeData', vibeData); }, [vibeData]);
    useEffect(() => { persist('batteryData', batteryData); }, [batteryData]);
    useEffect(() => { persist('galleryData', galleryData); }, [galleryData]);
    useEffect(() => { persist('pageGallerySettings', pageGallerySettings); }, [pageGallerySettings]);
    useEffect(() => { persist('homeSections', homeSections); }, [homeSections]);
    useEffect(() => { persist('homeSectionRepeats', homeSectionRepeats); }, [homeSectionRepeats]);
    useEffect(() => { persist('blogData', blogData); }, [blogData]);
    useEffect(() => { persist('faqData', faqData); }, [faqData]);
    useEffect(() => { persist('drinksData', drinksData); }, [drinksData]);
    useEffect(() => { persist('foodMenu', foodMenu); }, [foodMenu]);
    useEffect(() => { persist('testimonialsData', testimonialsData); }, [testimonialsData]);
    useEffect(() => { persist('infoSectionData', infoSectionData); }, [infoSectionData]);
    useEffect(() => { persist('eventsData', eventsData); }, [eventsData]);
    useEffect(() => { persist('instagramHighlightsData', instagramHighlightsData); }, [instagramHighlightsData]);
    useEffect(() => { persist('termsData', termsData); }, [termsData]);
    useEffect(() => { persist('henDoPageData', henDoPageData); }, [henDoPageData]);
    useEffect(() => { persist('birthdayPageData', birthdayPageData); }, [birthdayPageData]);
    useEffect(() => { persist('songs', songs); }, [songs]);
    useEffect(() => { persist('adminPassword', adminPassword); }, [adminPassword]);
    useEffect(() => { persist('syncUrl', syncUrl); }, [syncUrl]);
    useEffect(() => { persist('firebaseConfig', firebaseConfig); }, [firebaseConfig]);

    const exportPayloadObject = () => sanitizeMediaPayload({
        headerData, heroData, highlightsData, featuresData, vibeData, batteryData,
        galleryData, pageGallerySettings, homeSections, homeSectionRepeats, blogData, faqData, drinksData, foodMenu, testimonialsData,
        infoSectionData, eventsData, instagramHighlightsData, termsData, henDoPageData, birthdayPageData, songs, adminPassword, version: "6.4"
    });

    const exportDatabase = () => JSON.stringify(exportPayloadObject(), null, 2);

    const importDatabase = (json: any) => {
        try {
            const c = typeof json === 'string' ? JSON.parse(json) : json;
            const next = sanitizeMediaPayload(c);
            if (next.headerData) setHeaderData(next.headerData);
            if (next.heroData) setHeroData(next.heroData);
            if (next.highlightsData) setHighlightsData(next.highlightsData);
            if (next.featuresData) setFeaturesData(next.featuresData);
            if (next.vibeData) setVibeData(next.vibeData);
            if (next.batteryData) setBatteryData(next.batteryData);
            if (next.galleryData) setGalleryData(next.galleryData);
            if (c.pageGallerySettings) setPageGallerySettings(c.pageGallerySettings);
            if (c.homeSections) setHomeSections(c.homeSections);
            if (c.homeSectionRepeats) setHomeSectionRepeats(c.homeSectionRepeats);
            if (next.blogData) setBlogData(mergeDefaultBlogPosts(next.blogData));
            if (next.faqData) setFaqData(next.faqData);
            if (next.drinksData) setDrinksData(next.drinksData);
            if (next.foodMenu) setFoodMenu(next.foodMenu);
            if (next.testimonialsData) setTestimonialsData(next.testimonialsData);
            if (next.infoSectionData) setInfoSectionData(next.infoSectionData);
            if (next.eventsData) setEventsData(next.eventsData);
            if (next.instagramHighlightsData) setInstagramHighlightsData(next.instagramHighlightsData);
            if (next.termsData) setTermsData(next.termsData);
            if (next.henDoPageData) setHenDoPageData(next.henDoPageData);
            if (next.birthdayPageData) setBirthdayPageData(next.birthdayPageData);
            if (next.songs) setSongs(next.songs);
            return true;
        } catch (e) { return false; }
    };

    const saveToFirebase = async () => {
        if (!firebaseConfig.databaseURL) return alert("Set Firebase URL first!");
        setIsDataLoading(true);
        try {
            const url = `${firebaseConfig.databaseURL.replace(/\/$/, '')}/site.json`;
            const response = await fetch(url, { method: 'PUT', body: exportDatabase() });
            if (response.ok) alert("Firebase Sync Successful!");
        } catch (e) { alert("Firebase Error: " + e); } finally { setIsDataLoading(false); }
    };

    const loadFromFirebase = async () => {
        if (!firebaseConfig.databaseURL) return;
        setIsDataLoading(true);
        try {
            const url = `${firebaseConfig.databaseURL.replace(/\/$/, '')}/site.json`;
            const response = await fetch(url);
            const data = await response.json();
            if (data) importDatabase(data);
        } catch (e) { console.error(e); } finally { setIsDataLoading(false); }
    };

    const saveToHostinger = async () => {
        if (!syncUrl) return alert("Set Sync URL (db.php) first!");
        setIsDataLoading(true);
        try {
            const response = await fetch(syncUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminPassword}` },
                body: exportDatabase()
            });
            const res = await response.json();
            if (res.success) alert("Hostinger Sync Successful!");
        } catch (e) { alert("Hostinger Sync Error: " + e); } finally { setIsDataLoading(false); }
    };

    const loadFromHostinger = async () => {
        if (!syncUrl) return;
        setIsDataLoading(true);
        try {
            const response = await fetch(syncUrl, { headers: { 'Authorization': `Bearer ${adminPassword}` } });
            const data = await response.json();
            if (data && !data.error) importDatabase(data);
        } catch (e) { console.warn("Load failed."); } finally { setIsDataLoading(false); }
    };

    const uploadFile = async (file: Blob | File): Promise<string | null> => {
        if (!syncUrl) return null;
        setIsDataLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await fetch(syncUrl, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${adminPassword}` },
                body: formData
            });
            const res = await response.json().catch(() => ({} as any));
            if (!response.ok) return null;

            // Support multiple response formats from custom PHP handlers.
            const key =
                res?.key ||
                res?.media?.key ||
                res?.media?.filename ||
                res?.filename ||
                null;
            const url =
                res?.url ||
                res?.fileUrl ||
                res?.file_url ||
                res?.data?.url ||
                res?.data?.fileUrl ||
                res?.path ||
                null;

            if (typeof key === 'string' && key.length > 0) return getMediaUrl(key);
            if (typeof url === 'string' && url.length > 0) return getMediaUrl(url);
            if (res?.success && typeof res?.url === 'string') return res.url;
            return null;
        } catch (e) { return null; } finally { setIsDataLoading(false); }
    };

    const fetchServerFiles = async (): Promise<MediaRecord[]> => {
        if (!syncUrl) return [];
        try {
            const response = await fetch(`${syncUrl}?list=1`, {
                headers: { 'Authorization': `Bearer ${adminPassword}` },
                cache: 'no-store'
            });
            const data = await response.json().catch(() => ({} as any));
            if (!response.ok) return [];

            const rawFiles = Array.isArray(data?.media)
                ? data.media
                : Array.isArray(data?.files)
                ? data.files
                : Array.isArray(data?.data?.files)
                    ? data.data.files
                    : Array.isArray(data)
                        ? data
                        : [];

            return rawFiles
                .map((item: any, idx: number) => {
                    if (typeof item === 'string') {
                        return normalizeMediaRecord({ url: item }, idx);
                    }
                    return normalizeMediaRecord(item, idx);
                })
                .filter(Boolean) as MediaRecord[];
        } catch (e) { return []; }
    };

    const repairMediaLibrary = async (): Promise<MediaRepairResult> => {
        if (!syncUrl) return { ok: false, error: 'Missing sync URL', statusCode: 0 };
        try {
            const response = await fetch(`${syncUrl}?repair=1`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${adminPassword}` },
                cache: 'no-store'
            });
            const data = await response.json().catch(() => null);
            if (!response.ok || !data?.success) {
                return {
                    ok: false,
                    error: data?.error || `Repair failed (${response.status})`,
                    statusCode: response.status
                };
            }
            return { ok: true, report: data?.report, statusCode: response.status };
        } catch {
            return { ok: false, error: 'Network error while running repair', statusCode: 0 };
        }
    };

    const cleanupMediaLibrary = async (): Promise<MediaRepairResult> => {
        if (!syncUrl) return { ok: false, error: 'Missing sync URL', statusCode: 0 };
        try {
            const response = await fetch(`${syncUrl}?cleanup=1`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${adminPassword}` },
                cache: 'no-store'
            });
            const data = await response.json().catch(() => null);
            if (!response.ok || !data?.success) {
                return {
                    ok: false,
                    error: data?.error || `Cleanup failed (${response.status})`,
                    statusCode: response.status
                };
            }
            return { ok: true, report: data?.report, statusCode: response.status };
        } catch {
            return { ok: false, error: 'Network error while running cleanup', statusCode: 0 };
        }
    };

    useEffect(() => {
        loadFromHostinger();
    }, []);

    return (
        <DataContext.Provider value={{
            foodMenu, updateFoodMenu: setFoodMenu, drinksData, updateDrinksData: setDrinksData,
            headerData, updateHeaderData: setHeaderData, heroData, updateHeroData: setHeroData,
            highlightsData, updateHighlightsData: setHighlightsData, featuresData, updateFeaturesData: setFeaturesData,
            vibeData, updateVibeData: setVibeData, batteryData, updateBatteryData: setBatteryData,
            footerData, updateFooterData: setFooterData, galleryData, updateGalleryData: setGalleryData,
            pageGallerySettings, updatePageGallerySettings: setPageGallerySettings,
            homeSections, updateHomeSections: setHomeSections,
            homeSectionRepeats, updateHomeSectionRepeats: setHomeSectionRepeats,
            blogData, updateBlogData: setBlogData, testimonialsData, updateTestimonialsData: setTestimonialsData,
            infoSectionData, updateInfoSectionData: setInfoSectionData, faqData, updateFaqData: setFaqData,
            eventsData, updateEventsData: setEventsData, instagramHighlightsData, updateInstagramHighlightsData: setInstagramHighlightsData,
            termsData, updateTermsData: setTermsData,
            henDoPageData, updateHenDoPageData: setHenDoPageData,
            birthdayPageData, updateBirthdayPageData: setBirthdayPageData,
            songs, updateSongs: setSongs,
            adminPassword, updateAdminPassword: setAdminPassword, syncUrl, updateSyncUrl: setSyncUrl,
            firebaseConfig, updateFirebaseConfig: setFirebaseConfig, isDataLoading,
            purgeCache: () => {
                Object.keys(localStorage).forEach((key) => {
                    if (key.startsWith('lkc_')) localStorage.removeItem(key);
                });
                localStorage.removeItem('lkc_media_list_cache');
                window.location.reload();
            },
            importDatabase, exportDatabase, saveToHostinger, loadFromHostinger, saveToFirebase, loadFromFirebase, uploadFile,
            fetchServerFiles, repairMediaLibrary, cleanupMediaLibrary
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error('useData must be used within a DataProvider');
    return context;
};
