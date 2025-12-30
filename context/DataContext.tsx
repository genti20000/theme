
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
    siteTitle: "London Karaoke Club | Private Rooms Soho",
    siteDescription: "Luxury private karaoke booths in London Soho. 80,000+ songs, cocktails and more.",
    faviconUrl: "/favicon.svg",
    navOrder: ["menu", "gallery", "blog", "drinks", "events", "songs"],
    customScripts: { header: "", footer: "" }
};

const INITIAL_HERO: HeroData = { backgroundImageUrl: "https://picsum.photos/seed/karaoke/1920/1080", slides: ["https://picsum.photos/seed/lkc1/1920/1080", "https://picsum.photos/seed/lkc2/1920/1080"], mobileSlides: [], badgeText: "Winter Wonderland", headingText: "Unleash Your Inner Star", subText: "Luxury private suites in Soho.", buttonText: "Book Now", showBadge: true, showButtons: true };
const INITIAL_HIGHLIGHTS: HighlightsData = { enabled: true, heading: "Get Loud.", subtext: "Best karaoke in London.", mainImageUrl: "https://picsum.photos/seed/party/1200/800", featureListTitle: "Why LKC?", featureList: ["Private Booths", "80k Songs", "Soho Location"], sideImageUrl: "https://picsum.photos/seed/mic/500/500" };
const INITIAL_FEATURES: FeaturesData = {
    enabled: true,
    experience: { label: "Experience", heading: "Private Stage", text: "Your own world.", image: "https://picsum.photos/seed/room/1200/800" },
    occasions: { heading: "Every Occasion", text: "Parties of all sizes.", items: [{title: "Hen Parties", text: "Bubbles and songs."}] },
    grid: { heading: "Features", items: [{title: "Neon Lighting", description: "Vibrant vibes.", image: "https://picsum.photos/seed/neon/400/400"}] }
};
const INITIAL_VIBE: VibeData = { enabled: true, label: "The Vibe", heading: "Soho Nights", text: "Join the energy.", image1: "https://picsum.photos/seed/v1/500/500", image2: "https://picsum.photos/seed/v2/500/500", bigImage: "https://picsum.photos/seed/vb/1200/800", bottomHeading: "Sing Hard", bottomText: "Until 3AM." };
const INITIAL_STATS: BatteryData = { enabled: true, statPrefix: "Over", statNumber: "80K", statSuffix: "Songs", subText: "Updated daily." };
const INITIAL_GALLERY: GalleryData = { heading: "Gallery", subtext: "Moments from Soho", images: [{id: '1', url: 'https://picsum.photos/seed/g1/800/800', caption: 'LKC Party'}], showOnHome: false };
const INITIAL_BLOG: BlogData = { heading: "LKC Stories", subtext: "News and events.", posts: [{id: '1', title: 'Welcome', date: '2024-01-01', excerpt: 'Site launched.', content: 'Welcome to LKC.', imageUrl: 'https://picsum.photos/seed/blog/800/600'}] };
const INITIAL_FAQ: FAQData = { enabled: true, heading: "FAQ", subtext: "Questions?", items: [{question: "Where is it?", answer: "Soho, London."}] };
const INITIAL_DRINKS: DrinksData = {
    headerImageUrl: "https://picsum.photos/seed/bar/1600/800",
    packagesData: { title: "Packages", subtitle: "Groups", items: [], notes: [] },
    bottleServiceData: [], byTheGlassData: [], shotsData: { title: "Shots", items: [], shooters: { title: "", prices: "", items: [] } },
    cocktailsData: [], winesData: []
};

const INITIAL_TERMS: TermItem[] = [
    { title: "Age Restriction:", content: "– Our venue is strictly for guests aged 18 and over." },
    { title: "Booking Times:", content: "– All guests must vacate the premises no later than closing time." }
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
    const [testimonialsData, setTestimonialsData] = useState<TestimonialsData>(() => init('testimonialsData', { enabled: true, heading: "Loved", subtext: "Reviews from around the web.", items: [] }));
    const [infoSectionData, setInfoSectionData] = useState<InfoSectionData>(() => init('infoSectionData', { enabled: true, heading: "Private Karaoke in Soho", sections: [], footerTitle: "Ready?", footerText: "Plan your night.", footerHighlight: "No chains, just LKC." }));
    const [eventsData, setEventsData] = useState<EventsData>(() => init('eventsData', { hero: { title: "Epic Events", subtitle: "Private bookings in Soho.", image: "https://picsum.photos/seed/eventhero/1600/800" }, sections: [] }));
    const [termsData, setTermsData] = useState<TermItem[]>(() => init('termsData', INITIAL_TERMS));
    const [songs, setSongs] = useState<Song[]>(() => init('songs', []));
    const [adminPassword, setAdminPassword] = useState<string>(() => init('adminPassword', 'admin123'));
    const [syncUrl, setSyncUrl] = useState<string>(() => init('syncUrl', 'https://files.londonkaraoke.club/db.php'));
    const [firebaseConfig, setFirebaseConfig] = useState<FirebaseConfig>(() => init('firebaseConfig', { databaseURL: '', apiKey: '' }));
    const [footerData, setFooterData] = useState<FooterData>(() => init('footerData', { ctaHeading: "Ready?", ctaText: "Book now.", ctaButtonText: "Book" }));
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
    useEffect(() => { persist('termsData', termsData); }, [termsData]);
    useEffect(() => { persist('songs', songs); }, [songs]);
    useEffect(() => { persist('adminPassword', adminPassword); }, [adminPassword]);
    useEffect(() => { persist('syncUrl', syncUrl); }, [syncUrl]);
    useEffect(() => { persist('firebaseConfig', firebaseConfig); }, [firebaseConfig]);

    const exportDatabase = () => JSON.stringify({ 
        headerData, heroData, highlightsData, featuresData, vibeData, batteryData, 
        galleryData, blogData, faqData, drinksData, foodMenu, testimonialsData, 
        infoSectionData, eventsData, termsData, songs, adminPassword, version: "5.9" 
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
            eventsData, updateEventsData: setEventsData, termsData, updateTermsData: setTermsData,
            songs, updateSongs: setSongs,
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
