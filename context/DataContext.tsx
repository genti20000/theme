
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

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
    fetchServerFiles: () => Promise<{name: string, url: string}[]>;
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
    { title: "Age Policy", content: "– Our Soho venue is strictly for guests aged 18 and over." },
    { title: "Booking Confirmation", content: "– All bookings are subject to our standard terms and conditions." }
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

    const exportDatabase = () => JSON.stringify({ 
        headerData, heroData, highlightsData, featuresData, vibeData, batteryData, 
        galleryData, pageGallerySettings, homeSections, homeSectionRepeats, blogData, faqData, drinksData, foodMenu, testimonialsData, 
        infoSectionData, eventsData, instagramHighlightsData, termsData, songs, adminPassword, version: "6.3" 
    }, null, 2);

    const importDatabase = (json: any) => {
        try {
            const c = typeof json === 'string' ? JSON.parse(json) : json;
            if (c.headerData) setHeaderData(c.headerData);
            if (c.heroData) setHeroData(c.heroData);
            if (c.highlightsData) setHighlightsData(c.highlightsData);
            if (c.featuresData) setFeaturesData(c.featuresData);
            if (c.vibeData) setVibeData(c.vibeData);
            if (c.batteryData) setBatteryData(c.batteryData);
            if (c.galleryData) setGalleryData(c.galleryData);
            if (c.pageGallerySettings) setPageGallerySettings(c.pageGallerySettings);
            if (c.homeSections) setHomeSections(c.homeSections);
            if (c.homeSectionRepeats) setHomeSectionRepeats(c.homeSectionRepeats);
            if (c.blogData) setBlogData(c.blogData);
            if (c.faqData) setFaqData(c.faqData);
            if (c.drinksData) setDrinksData(c.drinksData);
            if (c.foodMenu) setFoodMenu(c.foodMenu);
            if (c.testimonialsData) setTestimonialsData(c.testimonialsData);
            if (c.infoSectionData) setInfoSectionData(c.infoSectionData);
            if (c.eventsData) setEventsData(c.eventsData);
            if (c.instagramHighlightsData) setInstagramHighlightsData(c.instagramHighlightsData);
            if (c.termsData) setTermsData(c.termsData);
            if (c.songs) setSongs(c.songs);
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
            const url =
                res?.url ||
                res?.fileUrl ||
                res?.file_url ||
                res?.data?.url ||
                res?.data?.fileUrl ||
                res?.path ||
                null;

            if (typeof url === 'string' && url.length > 0) return url;
            if (res?.success && typeof res?.url === 'string') return res.url;
            return null;
        } catch (e) { return null; } finally { setIsDataLoading(false); }
    };

    const fetchServerFiles = async (): Promise<{name: string, url: string}[]> => {
        if (!syncUrl) return [];
        try {
            const response = await fetch(`${syncUrl}?list=1`, {
                headers: { 'Authorization': `Bearer ${adminPassword}` }
            });
            const data = await response.json().catch(() => ({} as any));
            if (!response.ok) return [];

            const rawFiles = Array.isArray(data?.files)
                ? data.files
                : Array.isArray(data?.data?.files)
                    ? data.data.files
                    : Array.isArray(data)
                        ? data
                        : [];

            return rawFiles
                .map((item: any, idx: number) => {
                    if (typeof item === 'string') {
                        const name = item.split('/').pop() || `file-${idx + 1}`;
                        return { name, url: item };
                    }
                    const url = item?.url || item?.fileUrl || item?.file_url || item?.path || '';
                    const name = item?.name || item?.filename || (typeof url === 'string' ? (url.split('/').pop() || `file-${idx + 1}`) : `file-${idx + 1}`);
                    return url ? { name, url } : null;
                })
                .filter(Boolean) as { name: string; url: string }[];
        } catch (e) { return []; }
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
            purgeCache: () => { localStorage.clear(); window.location.reload(); },
            importDatabase, exportDatabase, saveToHostinger, loadFromHostinger, saveToFirebase, loadFromFirebase, uploadFile,
            fetchServerFiles
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
