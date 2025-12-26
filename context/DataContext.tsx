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
export interface HeaderData { logoUrl: string; siteTitle: string; siteDescription: string; }
export interface HeroData { backgroundImageUrl: string; slides: string[]; badgeText: string; headingText: string; subText: string; buttonText: string; }
export interface HighlightsData { heading: string; subtext: string; mainImageUrl: string; featureListTitle: string; featureList: string[]; sideImageUrl: string; }

export interface FeaturesData {
    experience: { label: string; heading: string; text: string; image: string; };
    occasions: { heading: string; text: string; items: { title: string; text: string; }[]; };
    grid: { heading: string; items: { title: string; description: string; image: string; }[]; };
}

export interface VibeData {
    label: string;
    heading: string;
    text: string;
    image1: string;
    image2: string;
    videoUrl?: string;
    bigImage: string;
    bottomHeading: string;
    bottomText: string;
}

export interface BatteryData { statPrefix: string; statNumber: string; statSuffix: string; subText: string; }
export interface FooterData { ctaHeading: string; ctaText: string; ctaButtonText: string; }

export interface GalleryData { 
  heading: string; 
  subtext: string; 
  images: { id: string; url: string; caption: string; }[]; 
  videos?: { id: string; url: string; thumbnail: string; title: string; }[]; 
}

export interface BlogPost {
    id: string;
    title: string;
    date: string;
    excerpt: string;
    content: string;
    imageUrl: string;
}

export interface BlogData { heading: string; subtext: string; posts: BlogPost[]; }
export interface Song { id: string; title: string; artist: string; genre?: string; fileUrl?: string; }
export interface TestimonialItem { quote: string; name: string; avatar: string; rating?: number; date?: string; }
export interface TestimonialsData { heading: string; subtext: string; items: TestimonialItem[]; }

export interface InfoSectionData {
    heading: string;
    sections: { title: string; content: string; color?: string; }[];
    footerTitle: string;
    footerText: string;
    footerHighlight: string;
}

export interface FAQItem { question: string; answer: string; }
export interface FAQData { heading: string; subtext: string; items: FAQItem[]; }

export interface EventSection { id: string; title: string; subtitle: string; description: string; imageUrl: string; features: string[]; }
export interface EventsData { hero: { title: string; subtitle: string; image: string; }; sections: EventSection[]; }

export interface FirebaseConfig { databaseURL: string; apiKey: string; projectId: string; }

interface ServerFile { name: string; url: string; type: 'image' | 'video'; }

interface DataContextType {
    foodMenu: MenuCategory[];
    updateFoodMenu: (newMenu: MenuCategory[]) => void;
    drinksData: DrinksData;
    updateDrinksData: (newData: DrinksData) => void;
    headerData: HeaderData;
    updateHeaderData: (newData: HeaderData) => void;
    heroData: HeroData;
    updateHeroData: (newData: HeroData) => void;
    highlightsData: HighlightsData;
    updateHighlightsData: (newData: HighlightsData) => void;
    featuresData: FeaturesData;
    updateFeaturesData: (newData: FeaturesData) => void;
    vibeData: VibeData;
    updateVibeData: (newData: VibeData) => void;
    batteryData: BatteryData;
    updateBatteryData: (newData: BatteryData) => void;
    footerData: FooterData;
    updateFooterData: (newData: FooterData) => void;
    galleryData: GalleryData;
    updateGalleryData: (newData: GalleryData) => void;
    blogData: BlogData;
    updateBlogData: (newData: BlogData) => void;
    testimonialsData: TestimonialsData;
    updateTestimonialsData: (newData: TestimonialsData) => void;
    infoSectionData: InfoSectionData;
    updateInfoSectionData: (newData: InfoSectionData) => void;
    faqData: FAQData;
    updateFaqData: (newData: FAQData) => void;
    eventsData: EventsData;
    updateEventsData: (newData: EventsData) => void;
    songs: Song[];
    updateSongs: (newSongs: Song[]) => void;
    adminPassword: string;
    updateAdminPassword: (newPass: string) => void;
    syncUrl: string;
    updateSyncUrl: (newUrl: string) => void;
    firebaseConfig: FirebaseConfig;
    updateFirebaseConfig: (newData: FirebaseConfig) => void;
    resetToDefaults: () => void;
    purgeCache: () => void;
    importDatabase: (json: string) => void;
    exportDatabase: () => string;
    saveToHostinger: () => Promise<void>;
    loadFromHostinger: () => Promise<void>;
    saveToFirebase: () => Promise<void>;
    loadFromFirebase: () => Promise<void>;
    uploadFile: (file: Blob | File) => Promise<string | null>;
    fetchServerFiles: () => Promise<ServerFile[]>;
    isDataLoading: boolean;
}

const INITIAL_FIREBASE: FirebaseConfig = {
    databaseURL: "https://gen-lang-client-0728122670-default-rtdb.firebaseio.com/",
    apiKey: "AIzaSyD4Hr17UMR3eHksOPkUAw7Ad11i8P20gEU",
    projectId: "gen-lang-client-0728122670"
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const init = <T,>(key: string, defaultVal: T): T => {
        const saved = localStorage.getItem(`lkc_${key}`);
        if (!saved) return defaultVal;
        try { return JSON.parse(saved); } catch (e) { return defaultVal; }
    };

    const [headerData, setHeaderData] = useState<HeaderData>(() => init('headerData', { logoUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,fit=crop,q=95/m7V3XokxQ0Hbg2KE/new-YNq2gqz36OInJMrE.png", siteTitle: "London Karaoke Club", siteDescription: "Luxury private karaoke booths in London Soho." }));
    const [heroData, setHeroData] = useState<HeroData>(() => init('heroData', { slides: [], badgeText: "Winter Wonderland", headingText: "Unleash Your Inner Star", subText: "Luxury suites.", buttonText: "Book Now", backgroundImageUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=2070&auto=format&fit=crop" }));
    const [foodMenu, setFoodMenu] = useState<MenuCategory[]>(() => init('foodMenu', []));
    const [drinksData, setDrinksData] = useState<DrinksData>(() => init('drinksData', { headerImageUrl: "", packagesData: { title: "Packages", subtitle: "", items: [], notes: [] }, bottleServiceData: [], byTheGlassData: [], shotsData: { title: "Shots", items: [], shooters: { title: "", prices: "", items: [] } }, cocktailsData: [], winesData: [] }));
    const [highlightsData, setHighlightsData] = useState<HighlightsData>(() => init('highlightsData', { heading: "Get Loud", subtext: "The ultimate Soho destination for private karaoke.", mainImageUrl: "https://images.unsplash.com/photo-1525362081669-2b476bb628c3?q=80&w=2000&auto=format&fit=crop", featureListTitle: "Why LKC?", featureList: ["Private Boutique Suites", "Premium Sound Engineering", "Hostess Service", "80,000+ Song Library"], sideImageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop" }));
    const [featuresData, setFeaturesData] = useState<FeaturesData>(() => init('featuresData', { 
        experience: { label: "The Stage", heading: "Boutique Suites", text: "Immerse yourself in a world of neon and sound.", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop" }, 
        occasions: { heading: "Parties & Occasions", text: "From birthdays to corporate takeovers.", items: [
            { title: "Hen & Stag", text: "Celebrate the last night of freedom in style." },
            { title: "Corporate", text: "Team building with a microphone and cocktails." },
            { title: "Birthdays", text: "Your special day, your stage, your anthem." }
        ] }, 
        grid: { heading: "The LKC Standard", items: [] } 
    }));
    const [vibeData, setVibeData] = useState<VibeData>(() => init('vibeData', { label: "Atmosphere", heading: "Soho Nights", text: "Where the pulse of London meets your vocal chords.", image1: "https://images.unsplash.com/photo-1514525253361-bee8a4874a73?q=80&w=1964&auto=format&fit=crop", image2: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop", bigImage: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=2070&auto=format&fit=crop", bottomHeading: "Scream If You Want To Go Faster", bottomText: "London's premier late-night karaoke club." }));
    const [batteryData, setBatteryData] = useState<BatteryData>(() => init('batteryData', { statPrefix: "Over", statNumber: "80K", statSuffix: "Songs", subText: "Updated weekly with the latest global hits." }));
    const [footerData, setFooterData] = useState<FooterData>(() => init('footerData', { ctaHeading: "Ready to take the stage?", ctaText: "Book your private suite in Soho today.", ctaButtonText: "Book Online Now" }));
    const [galleryData, setGalleryData] = useState<GalleryData>(() => init('galleryData', { 
        heading: "LKC Moments", 
        subtext: "Glimpses into the most legendary nights in Soho.", 
        images: [
            { id: "1", url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070&auto=format&fit=crop", caption: "Cocktail Perfection" },
            { id: "2", url: "https://images.unsplash.com/photo-1496337589254-7e19d01ced44?q=80&w=2070&auto=format&fit=crop", caption: "The Neon Vibe" },
            { id: "3", url: "https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=2070&auto=format&fit=crop", caption: "Group Anthems" },
            { id: "4", url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070&auto=format&fit=crop", caption: "Late Night Energy" },
            { id: "5", url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=2069&auto=format&fit=crop", caption: "Soho's Finest" },
            { id: "6", url: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=2070&auto=format&fit=crop", caption: "Vocal Mastery" }
        ], 
        videos: [] 
    }));
    const [blogData, setBlogData] = useState<BlogData>(() => init('blogData', { heading: "LKC Stories", subtext: "Trends, news, and tips from the heart of Soho.", posts: [] }));
    const [testimonialsData, setTestimonialsData] = useState<TestimonialsData>(() => init('testimonialsData', { heading: "Loved by the Crowd", subtext: "Real stories from our stage.", items: [] }));
    const [infoSectionData, setInfoSectionData] = useState<InfoSectionData>(() => init('infoSectionData', { heading: "Soho's Hidden Stage", sections: [], footerTitle: "", footerText: "", footerHighlight: "" }));
    const [faqData, setFaqData] = useState<FAQData>(() => init('faqData', { heading: "Common Questions", subtext: "Everything you need to know before you sing.", items: [] }));
    const [eventsData, setEventsData] = useState<EventsData>(() => init('eventsData', { hero: { title: "Bespoke Events", subtitle: "We make it personal.", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070&auto=format&fit=crop" }, sections: [] }));
    const [songs, setSongs] = useState<Song[]>(() => init('songs', []));
    const [adminPassword, setAdminPassword] = useState<string>(() => init('adminPassword', 'admin123'));
    const [syncUrl, setSyncUrl] = useState<string>(() => init('syncUrl', ''));
    const [firebaseConfig, setFirebaseConfig] = useState<FirebaseConfig>(() => init('firebaseConfig', INITIAL_FIREBASE));
    const [isDataLoading, setIsDataLoading] = useState(false);

    useEffect(() => {
        document.title = headerData.siteTitle;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', headerData.siteDescription);
    }, [headerData]);

    const persist = (key: string, data: any) => localStorage.setItem(`lkc_${key}`, JSON.stringify(data));

    useEffect(() => { persist('headerData', headerData); }, [headerData]);
    useEffect(() => { persist('heroData', heroData); }, [heroData]);
    useEffect(() => { persist('foodMenu', foodMenu); }, [foodMenu]);
    useEffect(() => { persist('drinksData', drinksData); }, [drinksData]);
    useEffect(() => { persist('highlightsData', highlightsData); }, [highlightsData]);
    useEffect(() => { persist('featuresData', featuresData); }, [featuresData]);
    useEffect(() => { persist('vibeData', vibeData); }, [vibeData]);
    useEffect(() => { persist('batteryData', batteryData); }, [batteryData]);
    useEffect(() => { persist('footerData', footerData); }, [footerData]);
    useEffect(() => { persist('galleryData', galleryData); }, [galleryData]);
    useEffect(() => { persist('blogData', blogData); }, [blogData]);
    useEffect(() => { persist('testimonialsData', testimonialsData); }, [testimonialsData]);
    useEffect(() => { persist('infoSectionData', infoSectionData); }, [infoSectionData]);
    useEffect(() => { persist('faqData', faqData); }, [faqData]);
    useEffect(() => { persist('eventsData', eventsData); }, [eventsData]);
    useEffect(() => { persist('songs', songs); }, [songs]);
    useEffect(() => { persist('adminPassword', adminPassword); }, [adminPassword]);
    useEffect(() => { persist('syncUrl', syncUrl); }, [syncUrl]);
    useEffect(() => { persist('firebaseConfig', firebaseConfig); }, [firebaseConfig]);

    const exportDatabase = () => JSON.stringify({ 
        headerData, heroData, foodMenu, drinksData, highlightsData, featuresData, vibeData, batteryData, 
        footerData, galleryData, blogData, testimonialsData, infoSectionData, faqData, eventsData, songs, 
        adminPassword, version: "5.1" 
    }, null, 2);

    const importDatabase = (json: string | any) => {
        try {
            const c = typeof json === 'string' ? JSON.parse(json) : json;
            if (c.headerData) setHeaderData(c.headerData);
            if (c.heroData) setHeroData(c.heroData);
            if (c.foodMenu) setFoodMenu(c.foodMenu);
            if (c.drinksData) setDrinksData(c.drinksData);
            if (c.highlightsData) setHighlightsData(c.highlightsData);
            if (c.featuresData) setFeaturesData(c.featuresData);
            if (c.vibeData) setVibeData(c.vibeData);
            if (c.batteryData) setBatteryData(c.batteryData);
            if (c.footerData) setFooterData(c.footerData);
            if (c.galleryData) setGalleryData(c.galleryData);
            if (c.blogData) setBlogData(c.blogData);
            if (c.testimonialsData) setTestimonialsData(c.testimonialsData);
            if (c.infoSectionData) setInfoSectionData(c.infoSectionData);
            if (c.faqData) setFaqData(c.faqData);
            if (c.eventsData) setEventsData(c.eventsData);
            if (c.songs) setSongs(c.songs);
            return true;
        } catch (e) { return false; }
    };

    const saveToFirebase = async () => {
        if (!firebaseConfig.projectId) return alert("Setup Firebase Project ID first!");
        setIsDataLoading(true);
        try {
            const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/settings/site?key=${firebaseConfig.apiKey}`;
            const payload = { fields: { content: { stringValue: exportDatabase() }, updatedAt: { timestampValue: new Date().toISOString() } } };
            const response = await fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (response.ok) alert("Synced to Firebase Firestore!");
            else throw new Error("Firestore sync failed");
        } catch (e) { alert("Firebase Error: " + e); } finally { setIsDataLoading(false); }
    };

    const loadFromFirebase = async () => {
        if (!firebaseConfig.projectId) return;
        setIsDataLoading(true);
        try {
            const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/settings/site?key=${firebaseConfig.apiKey}`;
            const response = await fetch(url);
            const data = await response.json();
            if (data?.fields?.content?.stringValue) importDatabase(data.fields.content.stringValue);
        } catch (e) { console.error(e); } finally { setIsDataLoading(false); }
    };

    const saveToHostinger = async () => {
        if (!syncUrl) return alert("Setup Sync URL first!");
        setIsDataLoading(true);
        try {
            const response = await fetch(syncUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminPassword}` },
                body: exportDatabase()
            });
            const res = await response.json();
            if (res.success) alert("Synced to MySQL & Server Storage!");
        } catch (e) { alert("Hostinger Error: " + e); } finally { setIsDataLoading(false); }
    };

    const loadFromHostinger = async () => {
        if (!syncUrl) return;
        setIsDataLoading(true);
        try {
            const response = await fetch(syncUrl, { headers: { 'Authorization': `Bearer ${adminPassword}` } });
            const data = await response.json();
            if (data && !data.error) importDatabase(data);
        } catch (e) { console.error(e); } finally { setIsDataLoading(false); }
    };

    const uploadFile = async (file: Blob | File): Promise<string | null> => {
        if (!syncUrl) return null;
        setIsDataLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await fetch(syncUrl, { method: 'POST', headers: { 'Authorization': `Bearer ${adminPassword}` }, body: formData });
            const res = await response.json();
            return res.success ? res.url : null;
        } catch (e) { return null; } finally { setIsDataLoading(false); }
    };

    const fetchServerFiles = async (): Promise<ServerFile[]> => {
        if (!syncUrl) return [];
        try {
            const response = await fetch(`${syncUrl}?action=list`, { headers: { 'Authorization': `Bearer ${adminPassword}` } });
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (e) { return []; }
    };

    const purgeCache = () => { if (confirm("Delete all local data?")) { localStorage.clear(); window.location.reload(); } };

    return (
        <DataContext.Provider value={{
            foodMenu, updateFoodMenu: setFoodMenu, drinksData, updateDrinksData: setDrinksData,
            headerData, updateHeaderData: setHeaderData, heroData, updateHeroData: setHeroData,
            highlightsData, updateHighlightsData: setHighlightsData, featuresData, updateFeaturesData: setFeaturesData,
            vibeData, updateVibeData: setVibeData, batteryData, updateBatteryData: setBatteryData,
            footerData, updateFooterData: setFooterData, galleryData, updateGalleryData: setGalleryData,
            blogData, updateBlogData: setBlogData, testimonialsData, updateTestimonialsData: setTestimonialsData,
            infoSectionData, updateInfoSectionData: setInfoSectionData, faqData, updateFaqData: setFaqData,
            eventsData, updateEventsData: setEventsData, songs, updateSongs: setSongs,
            adminPassword, updateAdminPassword: setAdminPassword, syncUrl, updateSyncUrl: setSyncUrl,
            firebaseConfig, updateFirebaseConfig: setFirebaseConfig, resetToDefaults: () => {},
            purgeCache, importDatabase, exportDatabase, saveToHostinger, loadFromHostinger, saveToFirebase, loadFromFirebase,
            uploadFile, fetchServerFiles, isDataLoading
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
