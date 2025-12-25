
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// --- Types ---
export interface MenuItem { name: string; description: string; price: string; note?: string; }
export interface MenuCategory { category: string; description?: string; items: MenuItem[]; }
export interface DrinkItem { name: string; price: string | any; description?: string; note?: string; single?: string; double?: string; }
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

export interface SupabaseConfig { url: string; anonKey: string; bucket: string; }
export interface FirebaseConfig { databaseURL: string; apiKey: string; }

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
    config: SupabaseConfig;
    updateConfig: (newData: SupabaseConfig) => void;
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
    fetchServerFiles: () => Promise<ServerFile[]>;
    uploadFile: (file: Blob | File) => Promise<string | null>;
    saveAllToSupabase: () => Promise<void>;
    isDataLoading: boolean;
}

const INITIAL_SEO: HeaderData = { 
    logoUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,fit=crop,q=95/m7V3XokxQ0Hbg2KE/new-YNq2gqz36OInJMrE.png",
    siteTitle: "London Karaoke Club | Private Rooms Soho",
    siteDescription: "Luxury private karaoke booths in London Soho. 80,000+ songs, cocktails and more."
};

const INITIAL_INFO: InfoSectionData = {
    heading: "Private Karaoke in Soho | London Karaoke Club",
    sections: [
        { title: "No Boxes, Just Epic Sound", content: "We are not a franchise. Our spaces are your personal club.", color: "pink" }
    ],
    footerTitle: "Prebook Your Exclusive Space",
    footerText: "Advance prebooking is required—no walk-ins allowed.",
    footerHighlight: "Prebook Now | Plan via WhatsApp"
};

const INITIAL_FAQ: FAQData = {
    heading: "Common Questions",
    subtext: "Everything you need to know before you sing.",
    items: [{ question: "What are the hours?", answer: "2pm to 3am daily." }]
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const init = <T,>(key: string, defaultVal: T): T => {
        const saved = localStorage.getItem(`lkc_${key}`);
        if (!saved) return defaultVal;
        try { return JSON.parse(saved); } catch (e) { return defaultVal; }
    };

    const [headerData, setHeaderData] = useState<HeaderData>(() => init('headerData', INITIAL_SEO));
    const [heroData, setHeroData] = useState<HeroData>(() => init('heroData', { slides: [], badgeText: "Winter Wonderland", headingText: "Unleash Your Inner Star", subText: "Luxury suites.", buttonText: "Book Now", backgroundImageUrl: "" }));
    const [foodMenu, setFoodMenu] = useState<MenuCategory[]>(() => init('foodMenu', []));
    const [drinksData, setDrinksData] = useState<DrinksData>(() => init('drinksData', { headerImageUrl: "", packagesData: { title: "Packages", subtitle: "", items: [], notes: [] }, bottleServiceData: [], byTheGlassData: [], shotsData: { title: "Shots", items: [], shooters: { title: "", prices: "", items: [] } }, cocktailsData: [], winesData: [] }));
    const [highlightsData, setHighlightsData] = useState<HighlightsData>(() => init('highlightsData', { heading: "Get Loud", subtext: "", mainImageUrl: "", featureListTitle: "", featureList: [], sideImageUrl: "" }));
    const [featuresData, setFeaturesData] = useState<FeaturesData>(() => init('featuresData', { experience: { label: "", heading: "", text: "", image: "" }, occasions: { heading: "", text: "", items: [] }, grid: { heading: "", items: [] } }));
    const [vibeData, setVibeData] = useState<VibeData>(() => init('vibeData', { label: "", heading: "", text: "", image1: "", image2: "", bigImage: "", bottomHeading: "", bottomText: "" }));
    const [batteryData, setBatteryData] = useState<BatteryData>(() => init('batteryData', { statPrefix: "Over", statNumber: "80K", statSuffix: "Songs", subText: "" }));
    const [footerData, setFooterData] = useState<FooterData>(() => init('footerData', { ctaHeading: "", ctaText: "", ctaButtonText: "Book Now" }));
    const [galleryData, setGalleryData] = useState<GalleryData>(() => init('galleryData', { heading: "Moments", subtext: "", images: [], videos: [] }));
    const [blogData, setBlogData] = useState<BlogData>(() => init('blogData', { heading: "LKC Stories", subtext: "", posts: [] }));
    const [testimonialsData, setTestimonialsData] = useState<TestimonialsData>(() => init('testimonialsData', { heading: "Loved", subtext: "", items: [] }));
    const [infoSectionData, setInfoSectionData] = useState<InfoSectionData>(() => init('infoSectionData', INITIAL_INFO));
    const [faqData, setFaqData] = useState<FAQData>(() => init('faqData', INITIAL_FAQ));
    const [eventsData, setEventsData] = useState<EventsData>(() => init('eventsData', { hero: { title: "", subtitle: "", image: "" }, sections: [] }));
    const [songs, setSongs] = useState<Song[]>(() => init('songs', []));
    const [adminPassword, setAdminPassword] = useState<string>(() => init('adminPassword', 'admin123'));
    const [syncUrl, setSyncUrl] = useState<string>(() => init('syncUrl', ''));
    const [config, setConfig] = useState<SupabaseConfig>(() => init('config', { url: '', anonKey: '', bucket: 'public' }));
    const [firebaseConfig, setFirebaseConfig] = useState<FirebaseConfig>(() => init('firebaseConfig', { databaseURL: '', apiKey: '' }));
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
    useEffect(() => { persist('config', config); }, [config]);
    useEffect(() => { persist('firebaseConfig', firebaseConfig); }, [firebaseConfig]);

    const exportDatabase = () => JSON.stringify({ 
        headerData, heroData, foodMenu, drinksData, highlightsData, featuresData, vibeData, batteryData, 
        footerData, galleryData, blogData, testimonialsData, infoSectionData, faqData, eventsData, songs, 
        adminPassword, version: "4.0" 
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
        if (!firebaseConfig.databaseURL) return alert("Setup Firebase URL first!");
        setIsDataLoading(true);
        try {
            const url = `${firebaseConfig.databaseURL.replace(/\/$/, '')}/site.json${firebaseConfig.apiKey ? `?auth=${firebaseConfig.apiKey}` : ''}`;
            const response = await fetch(url, { method: 'PUT', body: exportDatabase() });
            if (response.ok) alert("Synced to Firebase Realtime Database!");
            else throw new Error("Firebase sync failed");
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
            const response = await fetch(syncUrl, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${adminPassword}` },
                body: formData
            });
            const res = await response.json();
            return res.success ? res.url : null;
        } catch (e) { return null; } finally { setIsDataLoading(false); }
    };

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
            config, updateConfig: setConfig, firebaseConfig, updateFirebaseConfig: setFirebaseConfig,
            resetToDefaults: () => { localStorage.clear(); window.location.reload(); },
            purgeCache: () => { localStorage.clear(); window.location.reload(); },
            importDatabase, exportDatabase, saveToHostinger, loadFromHostinger, saveToFirebase, loadFromFirebase,
            uploadFile, saveAllToSupabase: async () => {}, fetchServerFiles: async () => [], isDataLoading
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
