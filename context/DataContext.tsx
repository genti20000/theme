
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
export interface HeaderData { logoUrl: string; }
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
export interface GalleryData { heading: string; subtext: string; images: { id: string; url: string; caption: string; }[]; }
export interface Song { id: string; title: string; artist: string; genre?: string; fileUrl?: string; }

export interface TestimonialItem { quote: string; name: string; avatar: string; rating?: number; date?: string; }
export interface TestimonialsData { heading: string; subtext: string; items: TestimonialItem[]; }

export interface EventSection { id: string; title: string; subtitle: string; description: string; imageUrl: string; features: string[]; }
export interface EventsData { hero: { title: string; subtitle: string; image: string; }; sections: EventSection[]; }

export interface SupabaseConfig {
    url: string;
    anonKey: string;
    bucket: string;
}

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
    testimonialsData: TestimonialsData;
    updateTestimonialsData: (newData: TestimonialsData) => void;
    eventsData: EventsData;
    updateEventsData: (newData: EventsData) => void;
    songs: Song[];
    updateSongs: (newSongs: Song[]) => void;
    config: SupabaseConfig;
    updateConfig: (newData: SupabaseConfig) => void;
    resetToDefaults: () => void;
    uploadToSupabase: (file: Blob | File, path: string) => Promise<string | null>;
    saveAllToSupabase: () => Promise<void>;
    isDataLoading: boolean;
}

// --- Initial Data Defaults ---
const INITIAL_FOOD_MENU: MenuCategory[] = [
    { category: "Small Plates", items: [{ name: "Crispy Calamari", description: "With lemon aioli", price: "9.50" }] }
];
const INITIAL_DRINKS_DATA: DrinksData = {
    headerImageUrl: "https://picsum.photos/seed/bar/1600/800",
    packagesData: { title: "Packages", subtitle: "Pre-order", items: [], notes: [] },
    bottleServiceData: [], byTheGlassData: [], shotsData: { title: "Shots", items: [], shooters: { title: "Shooters", prices: "", items: [] } },
    cocktailsData: [], winesData: []
};
const INITIAL_HEADER_DATA: HeaderData = { logoUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,fit=crop,q=95/m7V3XokxQ0Hbg2KE/new-YNq2gqz36OInJMrE.png" };
const INITIAL_HERO_DATA: HeroData = { backgroundImageUrl: "https://picsum.photos/seed/karaoke/1920/1080", slides: [], badgeText: "Winter Wonderland", headingText: "Unleash Your Inner Star", subText: "Luxury private suites in Soho.", buttonText: "Book Now" };
const INITIAL_HIGHLIGHTS_DATA: HighlightsData = { heading: "Get Loud.", subtext: "Best karaoke in London.", mainImageUrl: "https://picsum.photos/seed/party/1200/800", featureListTitle: "Why LKC?", featureList: ["Private Booths", "80k Songs"], sideImageUrl: "https://picsum.photos/seed/mic/500/500" };

const INITIAL_FEATURES_DATA: FeaturesData = {
    experience: { label: "Experience", heading: "Private Stage", text: "Your own world.", image: "https://picsum.photos/seed/room/1200/800" },
    occasions: { heading: "Every Occasion", text: "Parties of all sizes.", items: [] },
    grid: { heading: "Features", items: [] }
};

const INITIAL_VIBE_DATA: VibeData = {
    label: "The Vibe",
    heading: "Electric Soho Nights",
    text: "Join us for the most vibrant karaoke experience in London.",
    image1: "https://picsum.photos/seed/vibe1/800/800",
    image2: "https://picsum.photos/seed/vibe2/800/800",
    bigImage: "https://picsum.photos/seed/vibebig/1600/900",
    bottomHeading: "Party Hard",
    bottomText: "Until 3 AM every single night."
};

const INITIAL_BATTERY_DATA: BatteryData = { statPrefix: "Over", statNumber: "80K", statSuffix: "Songs", subText: "Updated monthly." };
const INITIAL_FOOTER_DATA: FooterData = { ctaHeading: "Ready to sing?", ctaText: "Secure your room today.", ctaButtonText: "Book Now" };
const INITIAL_GALLERY_DATA: GalleryData = { heading: "Moments", subtext: "LKC Gallery", images: [] };

const INITIAL_TESTIMONIALS_DATA: TestimonialsData = {
    heading: "Loved by the Crowd",
    subtext: "What our stars have to say about their LKC experience.",
    items: [
        { name: "Sarah J.", quote: "Best night out in Soho! The sound quality is incredible.", avatar: "", rating: 5, date: "a week ago" },
        { name: "James L.", quote: "Private rooms are so much better than the boxes at other places.", avatar: "", rating: 5, date: "2 weeks ago" },
        { name: "Mila R.", quote: "Amazing cocktails and the staff really looked after us for my birthday.", avatar: "", rating: 5, date: "a month ago" }
    ]
};

const INITIAL_EVENTS_DATA: EventsData = { 
    hero: { title: "Special Events", subtitle: "Celebrate in Style", image: "https://picsum.photos/seed/events/1600/900" },
    sections: [] 
};
const INITIAL_SONGS: Song[] = [{ id: '1', title: 'Bohemian Rhapsody', artist: 'Queen' }];
const INITIAL_CONFIG: SupabaseConfig = { url: '', anonKey: '', bucket: 'public' };

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const init = <T,>(key: string, defaultVal: T): T => {
        const saved = localStorage.getItem(`lkc_${key}`);
        if (!saved) return defaultVal;
        try {
            const parsed = JSON.parse(saved);
            if (typeof defaultVal === 'object' && defaultVal !== null && !Array.isArray(defaultVal)) {
                return { ...defaultVal, ...parsed };
            }
            return parsed;
        } catch (e) {
            return defaultVal;
        }
    };

    const [foodMenu, setFoodMenu] = useState<MenuCategory[]>(() => init('foodMenu', INITIAL_FOOD_MENU));
    const [drinksData, setDrinksData] = useState<DrinksData>(() => init('drinksData', INITIAL_DRINKS_DATA));
    const [headerData, setHeaderData] = useState<HeaderData>(() => init('headerData', INITIAL_HEADER_DATA));
    const [heroData, setHeroData] = useState<HeroData>(() => init('heroData', INITIAL_HERO_DATA));
    const [highlightsData, setHighlightsData] = useState<HighlightsData>(() => init('highlightsData', INITIAL_HIGHLIGHTS_DATA));
    const [featuresData, setFeaturesData] = useState<FeaturesData>(() => init('featuresData', INITIAL_FEATURES_DATA));
    const [vibeData, setVibeData] = useState<VibeData>(() => init('vibeData', INITIAL_VIBE_DATA));
    const [batteryData, setBatteryData] = useState<BatteryData>(() => init('batteryData', INITIAL_BATTERY_DATA));
    const [footerData, setFooterData] = useState<FooterData>(() => init('footerData', INITIAL_FOOTER_DATA));
    const [galleryData, setGalleryData] = useState<GalleryData>(() => init('galleryData', INITIAL_GALLERY_DATA));
    const [testimonialsData, setTestimonialsData] = useState<TestimonialsData>(() => init('testimonialsData', INITIAL_TESTIMONIALS_DATA));
    const [eventsData, setEventsData] = useState<EventsData>(() => init('eventsData', INITIAL_EVENTS_DATA));
    const [config, setConfig] = useState<SupabaseConfig>(() => init('config', INITIAL_CONFIG));
    const [songs, setSongs] = useState<Song[]>(() => init('songs', INITIAL_SONGS));

    const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
    const [isDataLoading, setIsDataLoading] = useState(false);

    useEffect(() => {
        if (config.url && config.anonKey) {
            setSupabase(createClient(config.url, config.anonKey));
        }
    }, [config.url, config.anonKey]);

    const persist = (key: string, data: any) => localStorage.setItem(`lkc_${key}`, JSON.stringify(data));

    useEffect(() => { persist('foodMenu', foodMenu); }, [foodMenu]);
    useEffect(() => { persist('drinksData', drinksData); }, [drinksData]);
    useEffect(() => { persist('headerData', headerData); }, [headerData]);
    useEffect(() => { persist('heroData', heroData); }, [heroData]);
    useEffect(() => { persist('highlightsData', highlightsData); }, [highlightsData]);
    useEffect(() => { persist('featuresData', featuresData); }, [featuresData]);
    useEffect(() => { persist('vibeData', vibeData); }, [vibeData]);
    useEffect(() => { persist('batteryData', batteryData); }, [batteryData]);
    useEffect(() => { persist('footerData', footerData); }, [footerData]);
    useEffect(() => { persist('galleryData', galleryData); }, [galleryData]);
    useEffect(() => { persist('testimonialsData', testimonialsData); }, [testimonialsData]);
    useEffect(() => { persist('eventsData', eventsData); }, [eventsData]);
    useEffect(() => { persist('config', config); }, [config]);
    useEffect(() => { persist('songs', songs); }, [songs]);

    const uploadToSupabase = async (file: Blob | File, path: string): Promise<string | null> => {
        if (!supabase) return null;
        const { error } = await supabase.storage.from(config.bucket).upload(path, file, { upsert: true });
        if (error) return null;
        const { data: { publicUrl } } = supabase.storage.from(config.bucket).getPublicUrl(path);
        return publicUrl;
    };

    const saveAllToSupabase = async () => {
        if (!supabase) { alert("Configure Supabase first."); return; }
        setIsDataLoading(true);
        const fullState = {
            foodMenu, drinksData, headerData, heroData, highlightsData, featuresData,
            vibeData, batteryData, footerData, galleryData, testimonialsData, eventsData, songs, updatedAt: new Date().toISOString()
        };
        try {
            const { error } = await supabase.from('site_settings').upsert({ id: 1, content: fullState });
            if (error) throw error;
            alert("Saved to Supabase!");
        } catch (e: any) {
            alert("Error saving: " + e.message);
        } finally { setIsDataLoading(false); }
    };

    useEffect(() => {
        if (supabase) {
            const fetchSettings = async () => {
                setIsDataLoading(true);
                const { data, error } = await supabase.from('site_settings').select('content').eq('id', 1).single();
                if (data?.content) {
                    const c = data.content;
                    if (c.foodMenu) setFoodMenu(c.foodMenu);
                    if (c.drinksData) setDrinksData(c.drinksData);
                    if (c.headerData) setHeaderData(c.headerData);
                    if (c.heroData) setHeroData(c.heroData);
                    if (c.highlightsData) setHighlightsData(c.highlightsData);
                    if (c.featuresData) setFeaturesData(c.featuresData);
                    if (c.vibeData) setVibeData(c.vibeData);
                    if (c.batteryData) setBatteryData(c.batteryData);
                    if (c.footerData) setFooterData(c.footerData);
                    if (c.galleryData) setGalleryData(c.galleryData);
                    if (c.testimonialsData) setTestimonialsData(c.testimonialsData);
                    if (c.eventsData) setEventsData(c.eventsData);
                    if (c.songs) setSongs(c.songs);
                }
                setIsDataLoading(false);
            };
            fetchSettings();
        }
    }, [supabase]);

    return (
        <DataContext.Provider value={{
            foodMenu, updateFoodMenu: setFoodMenu, drinksData, updateDrinksData: setDrinksData,
            headerData, updateHeaderData: setHeaderData, heroData, updateHeroData: setHeroData,
            highlightsData, updateHighlightsData: setHighlightsData, featuresData, updateFeaturesData: setFeaturesData,
            vibeData, updateVibeData: setVibeData,
            batteryData, updateBatteryData: setBatteryData, footerData, updateFooterData: setFooterData,
            galleryData, updateGalleryData: setGalleryData, 
            testimonialsData, updateTestimonialsData: setTestimonialsData,
            eventsData, updateEventsData: setEventsData,
            config, updateConfig: setConfig,
            songs, updateSongs: setSongs, resetToDefaults: () => { localStorage.clear(); window.location.reload(); },
            uploadToSupabase, saveAllToSupabase, isDataLoading
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
