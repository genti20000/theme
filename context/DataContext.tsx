
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
export interface TestimonialItem { quote: string; name: string; avatar: string; rating?: number; date?: string; }
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
    navOrder: ["menu", "gallery", "blog", "drinks", "events", "songs"],
    customScripts: { header: "", footer: "" }
};

const INITIAL_HERO: HeroData = { backgroundImageUrl: "", slides: [], mobileSlides: [], badgeText: "Winter Wonderland", headingText: "Private Karaoke Bar in Soho", subText: "London's most exclusive private karaoke suites. 80,000+ songs and pro-audio sound.", buttonText: "Book Now", showBadge: true, showButtons: true };
const INITIAL_HIGHLIGHTS: HighlightsData = { enabled: true, heading: "Best Karaoke in Soho", subtext: "Step into Soho's premier destination for private singing and celebrations.", mainImageUrl: "", featureListTitle: "The LKC Difference", featureList: ["Bespoke Private Booths", "80,000+ Global Hits", "Central Soho Location"], sideImageUrl: "" };
const INITIAL_FEATURES: FeaturesData = {
    enabled: true,
    experience: { label: "The Experience", heading: "Bespoke Private Stage", text: "Luxury karaoke redefined in the heart of London.", image: "" },
    occasions: { heading: "Parties & Occasions", text: "We specialize in unforgettable London events.", items: [{title: "Hen Parties", text: "Premium bubbles and your favorite anthems."}] },
    grid: { heading: "Venue Highlights", items: [{title: "Smart Lighting", description: "Immersive mood lighting.", image: ""}] }
};
const INITIAL_VIBE: VibeData = { enabled: true, label: "The Vibe", heading: "Soho Nightlife", text: "Unmatched energy in London's most iconic district.", image1: "", image2: "", bigImage: "", bottomHeading: "open till 3am", bottomText: "The party never stops at LKC Soho." };
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
    heading: "London Karaoke News",
    subtext: "Stay updated with events and nightlife tips.",
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
    const [testimonialsData, setTestimonialsData] = useState<TestimonialsData>(() => init('testimonialsData', { enabled: true, heading: "Client Reviews", subtext: "What people say about London's best karaoke.", items: [] }));
    const [infoSectionData, setInfoSectionData] = useState<InfoSectionData>(() => init('infoSectionData', { enabled: true, heading: "Luxury Private Karaoke Soho", sections: [], footerTitle: "Ready to Sing?", footerText: "Book your private suite in Soho today.", footerHighlight: "No chains, just the London Karaoke Club." }));
    const [eventsData, setEventsData] = useState<EventsData>(() => init('eventsData', { hero: { title: "Corporate & Private Events", subtitle: "The ultimate venue for London group bookings.", image: "" }, sections: [] }));
    const [instagramHighlightsData, setInstagramHighlightsData] = useState<InstagramHighlightsData>(() => init('instagramHighlightsData', INITIAL_INSTAGRAM));
    const [termsData, setTermsData] = useState<TermItem[]>(() => init('termsData', INITIAL_TERMS));
    const [songs, setSongs] = useState<Song[]>(() => init('songs', []));
    const [adminPassword, setAdminPassword] = useState<string>(() => init('adminPassword', 'admin123'));
    const [syncUrl, setSyncUrl] = useState<string>(() => init('syncUrl', 'https://files.londonkaraoke.club/db.php'));
    const [firebaseConfig, setFirebaseConfig] = useState<FirebaseConfig>(() => init('firebaseConfig', { databaseURL: '', apiKey: '' }));
    const [footerData, setFooterData] = useState<FooterData>(() => init('footerData', { ctaHeading: "Ready to Book?", ctaText: "Secure your private karaoke room in Soho.", ctaButtonText: "Book Now" }));
    const [isDataLoading, setIsDataLoading] = useState(false);

    useEffect(() => {
        setBlogData(prev => {
            const safePosts = Array.isArray(prev.posts) ? prev.posts : [];
            const existingIds = new Set(safePosts.map(post => post.id));
            const existingTitles = new Set(safePosts.map(post => post.title.trim().toLowerCase()));

            const missingPosts = INITIAL_BLOG.posts.filter(post => {
                const normalizedTitle = post.title.trim().toLowerCase();
                return !existingIds.has(post.id) && !existingTitles.has(normalizedTitle);
            });

            if (missingPosts.length === 0) return prev;
            return { ...prev, posts: [...missingPosts, ...safePosts] };
        });
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
                return { ...prev, bottomHeading: 'open till 3am' };
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
        document.title = headerData.siteTitle;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', headerData.siteDescription);
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
    useEffect(() => { persist('songs', songs); }, [songs]);
    useEffect(() => { persist('adminPassword', adminPassword); }, [adminPassword]);
    useEffect(() => { persist('syncUrl', syncUrl); }, [syncUrl]);
    useEffect(() => { persist('firebaseConfig', firebaseConfig); }, [firebaseConfig]);

    const exportPayloadObject = () => sanitizeMediaPayload({
        headerData, heroData, highlightsData, featuresData, vibeData, batteryData,
        galleryData, pageGallerySettings, homeSections, homeSectionRepeats, blogData, faqData, drinksData, foodMenu, testimonialsData,
        infoSectionData, eventsData, instagramHighlightsData, termsData, songs, adminPassword, version: "6.4"
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
            if (next.blogData) setBlogData(next.blogData);
            if (next.faqData) setFaqData(next.faqData);
            if (next.drinksData) setDrinksData(next.drinksData);
            if (next.foodMenu) setFoodMenu(next.foodMenu);
            if (next.testimonialsData) setTestimonialsData(next.testimonialsData);
            if (next.infoSectionData) setInfoSectionData(next.infoSectionData);
            if (next.eventsData) setEventsData(next.eventsData);
            if (next.instagramHighlightsData) setInstagramHighlightsData(next.instagramHighlightsData);
            if (next.termsData) setTermsData(next.termsData);
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
            termsData, updateTermsData: setTermsData, songs, updateSongs: setSongs,
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
