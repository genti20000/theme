
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
export interface GalleryData { heading: string; subtext: string; images: GalleryImage[]; videos?: any[]; showOnHome?: boolean; }

export interface BlogPost { id: string; title: string; date: string; excerpt: string; content: string; imageUrl: string; }
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
    logoUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,fit=crop,q=95/m7V3XokxQ0Hbg2KE/new-YNq2gqz36OInJMrE.png",
    siteTitle: "London Karaoke Club | Private Karaoke Bar & Cocktails in Soho",
    siteDescription: "Luxury private karaoke suites in Soho, London. Over 80,000 songs, signature cocktails, and premium service. Perfect for hen parties and birthdays. Book online.",
    faviconUrl: "/favicon.svg",
    navOrder: ["menu", "gallery", "blog", "drinks", "events", "songs"],
    customScripts: { header: "", footer: "" }
};

const INITIAL_HERO: HeroData = { backgroundImageUrl: "https://picsum.photos/seed/karaoke/1920/1080", slides: ["https://picsum.photos/seed/lkc1/1920/1080", "https://picsum.photos/seed/lkc2/1920/1080"], mobileSlides: [], badgeText: "Winter Wonderland", headingText: "Private Karaoke Bar in Soho", subText: "London's most exclusive private karaoke suites. 80,000+ songs and pro-audio sound.", buttonText: "Book Now", showBadge: true, showButtons: true };
const INITIAL_HIGHLIGHTS: HighlightsData = { enabled: true, heading: "Best Karaoke in Soho", subtext: "Step into Soho's premier destination for private singing and celebrations.", mainImageUrl: "https://picsum.photos/seed/party/1200/800", featureListTitle: "The LKC Difference", featureList: ["Bespoke Private Booths", "80,000+ Global Hits", "Central Soho Location"], sideImageUrl: "https://picsum.photos/seed/mic/500/500" };
const INITIAL_FEATURES: FeaturesData = {
    enabled: true,
    experience: { label: "The Experience", heading: "Bespoke Private Stage", text: "Luxury karaoke redefined in the heart of London.", image: "https://picsum.photos/seed/room/1200/800" },
    occasions: { heading: "Parties & Occasions", text: "We specialize in unforgettable London events.", items: [{title: "Hen Parties", text: "Premium bubbles and your favorite anthems."}] },
    grid: { heading: "Venue Highlights", items: [{title: "Smart Lighting", description: "Immersive mood lighting.", image: "https://picsum.photos/seed/neon/400/400"}] }
};
const INITIAL_VIBE: VibeData = { enabled: true, label: "The Vibe", heading: "Soho Nightlife", text: "Unmatched energy in London's most iconic district.", image1: "https://picsum.photos/seed/v1/500/500", image2: "https://picsum.photos/seed/v2/500/500", bigImage: "https://picsum.photos/seed/vb/1200/800", bottomHeading: "Sing Until 3AM", bottomText: "The party never stops at LKC Soho." };
const INITIAL_STATS: BatteryData = { enabled: true, statPrefix: "Over", statNumber: "80,000", statSuffix: "Songs", subText: "Updated monthly with the latest hits." };
const INITIAL_GALLERY: GalleryData = { heading: "Soho Karaoke Gallery", subtext: "A glimpse inside our luxury private booths.", images: [{id: '1', url: 'https://picsum.photos/seed/g1/800/800', caption: 'LKC Party'}], showOnHome: false };
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
            imageUrl: 'https://picsum.photos/seed/blog/800/600'
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
Book your hen do karaoke party now: https://www.sumupbookings.com/londonkaraokeclub`,
            imageUrl: 'https://picsum.photos/seed/hen-do-soho/1200/800'
        }
    ]
};
const INITIAL_FAQ: FAQData = { enabled: true, heading: "Soho Karaoke FAQs", subtext: "Common questions about booking and our venue.", items: [{question: "Where is the club located?", answer: "We are located in the heart of Soho, London."}] };
const INITIAL_DRINKS: DrinksData = {
    headerImageUrl: "https://picsum.photos/seed/bar/1600/800",
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
    const [blogData, setBlogData] = useState<BlogData>(() => init('blogData', INITIAL_BLOG));
    const [faqData, setFaqData] = useState<FAQData>(() => init('faqData', INITIAL_FAQ));
    const [drinksData, setDrinksData] = useState<DrinksData>(() => init('drinksData', INITIAL_DRINKS));
    const [foodMenu, setFoodMenu] = useState<MenuCategory[]>(() => init('foodMenu', []));
    const [testimonialsData, setTestimonialsData] = useState<TestimonialsData>(() => init('testimonialsData', { enabled: true, heading: "Client Reviews", subtext: "What people say about London's best karaoke.", items: [] }));
    const [infoSectionData, setInfoSectionData] = useState<InfoSectionData>(() => init('infoSectionData', { enabled: true, heading: "Luxury Private Karaoke Soho", sections: [], footerTitle: "Ready to Sing?", footerText: "Book your private suite in Soho today.", footerHighlight: "No chains, just the London Karaoke Club." }));
    const [eventsData, setEventsData] = useState<EventsData>(() => init('eventsData', { hero: { title: "Corporate & Private Events", subtitle: "The ultimate venue for London group bookings.", image: "https://picsum.photos/seed/eventhero/1600/800" }, sections: [] }));
    const [instagramHighlightsData, setInstagramHighlightsData] = useState<InstagramHighlightsData>(() => init('instagramHighlightsData', INITIAL_INSTAGRAM));
    const [termsData, setTermsData] = useState<TermItem[]>(() => init('termsData', INITIAL_TERMS));
    const [songs, setSongs] = useState<Song[]>(() => init('songs', []));
    const [adminPassword, setAdminPassword] = useState<string>(() => init('adminPassword', 'admin123'));
    const [syncUrl, setSyncUrl] = useState<string>(() => init('syncUrl', 'https://files.londonkaraoke.club/db.php'));
    const [firebaseConfig, setFirebaseConfig] = useState<FirebaseConfig>(() => init('firebaseConfig', { databaseURL: '', apiKey: '' }));
    const [footerData, setFooterData] = useState<FooterData>(() => init('footerData', { ctaHeading: "Ready to Book?", ctaText: "Secure your private karaoke room in Soho.", ctaButtonText: "Book Now" }));
    const [isDataLoading, setIsDataLoading] = useState(false);

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
        galleryData, blogData, faqData, drinksData, foodMenu, testimonialsData, 
        infoSectionData, eventsData, instagramHighlightsData, termsData, songs, adminPassword, version: "6.2" 
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
            const res = await response.json();
            return res.success ? res.url : null;
        } catch (e) { return null; } finally { setIsDataLoading(false); }
    };

    const fetchServerFiles = async (): Promise<{name: string, url: string}[]> => {
        if (!syncUrl) return [];
        try {
            const response = await fetch(`${syncUrl}?list=1`, {
                headers: { 'Authorization': `Bearer ${adminPassword}` }
            });
            const data = await response.json();
            if (data.success) return data.files;
            return [];
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
