
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// --- Types ---
export interface MenuItem {
    name: string;
    description: string;
    price: string;
    note?: string;
}

export interface MenuCategory {
    category: string;
    description?: string;
    items: MenuItem[];
}

export interface DrinkItem {
    name: string;
    price: string | any; // String for simple, Object for wine sizes
    description?: string;
    note?: string;
    single?: string;
    double?: string;
}

export interface DrinkCategory {
    category: string;
    items: DrinkItem[];
    note?: string;
}

export interface DrinksData {
    headerImageUrl: string;
    packagesData: {
        title: string;
        subtitle: string;
        items: any[];
        notes: string[];
    };
    bottleServiceData: DrinkCategory[];
    byTheGlassData: DrinkCategory[];
    shotsData: {
        title: string;
        items: any[];
        shooters: {
            title: string;
            prices: string;
            items: any[];
        };
    };
    cocktailsData: DrinkCategory[];
    winesData: DrinkCategory[];
}

export interface HeaderData { logoUrl: string; }
export interface HeroData { backgroundImageUrl: string; slides: string[]; badgeText: string; headingText: string; subText: string; buttonText: string; }
export interface HighlightsData { heading: string; subtext: string; mainImageUrl: string; featureListTitle: string; featureList: string[]; sideImageUrl: string; }
export interface FeatureGridItem { title: string; description: string; image: string; }
export interface OccasionItem { title: string; text: string; }
export interface FeaturesData {
    experience: { label: string; heading: string; text: string; image: string; };
    occasions: { heading: string; text: string; items: OccasionItem[]; };
    grid: { heading: string; items: FeatureGridItem[]; };
}
export interface VibeData { label: string; heading: string; text: string; image1: string; image2: string; videoUrl?: string; bigImage: string; bottomHeading: string; bottomText: string; }
export interface TestimonialItem { quote: string; name: string; avatar: string; }
export interface TestimonialsData { heading: string; subtext: string; items: TestimonialItem[]; }
export interface BatteryData { statPrefix: string; statNumber: string; statSuffix: string; subText: string; }
export interface FooterData { ctaHeading: string; ctaText: string; ctaButtonText: string; }
export interface GalleryItem { id: string; url: string; caption: string; }
export interface VideoItem { id: string; url: string; thumbnail: string; title: string; }
export interface GalleryData { heading: string; subtext: string; images: GalleryItem[]; videos?: VideoItem[]; }
export interface EventSection { id: string; title: string; subtitle: string; description: string; imageUrl: string; features: string[]; }
export interface EventsData { hero: { title: string; subtitle: string; image: string; }; sections: EventSection[]; }
export interface DatabaseConfig { supabaseUrl: string; supabaseKey: string; storageBucket: string; }
export interface Song { id: string; title: string; artist: string; genre?: string; fileUrl?: string; }
export interface ThemeData { primaryColor: string; secondaryColor: string; backgroundColor: string; textColor: string; headerBg: string; footerBg: string; }

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
    testimonialsData: TestimonialsData;
    updateTestimonialsData: (newData: TestimonialsData) => void;
    batteryData: BatteryData;
    updateBatteryData: (newData: BatteryData) => void;
    footerData: FooterData;
    updateFooterData: (newData: FooterData) => void;
    galleryData: GalleryData;
    updateGalleryData: (newData: GalleryData) => void;
    eventsData: EventsData;
    updateEventsData: (newData: EventsData) => void;
    dbConfig: DatabaseConfig;
    updateDbConfig: (newData: DatabaseConfig) => void;
    songs: Song[];
    updateSongs: (newSongs: Song[]) => void;
    theme: ThemeData;
    updateTheme: (newTheme: ThemeData) => void;

    resetToDefaults: () => void;
    uploadToSupabase: (file: Blob | File, path: string) => Promise<string | null>;
    saveAllToSupabase: () => Promise<void>;
    isDataLoading: boolean;
}

// --- Initial Data ---
const INITIAL_FOOD_MENU: MenuCategory[] = [
    {
        category: "Small Plates",
        description: "Perfect for sharing",
        items: [
            { name: "Crispy Calamari", description: "Served with lemon aioli", price: "9.50" },
            { name: "Truffle Fries", description: "Parmesan, truffle oil, rosemary", price: "6.50" },
            { name: "Nachos", description: "Guacamole, salsa, sour cream, cheese", price: "10.00", note: "Add chicken +£3" }
        ]
    }
];

const INITIAL_DRINKS_DATA: DrinksData = {
    headerImageUrl: "https://picsum.photos/seed/barvibes/1600/800",
    packagesData: {
        title: "Drinks Packages",
        subtitle: "Pre-order for the best value",
        items: [{ name: "Bronze Package", price: "£150", description: "2x Prosecco, 10x Beers, 1x Sharing Platter" }],
        notes: ["Service charge not included."]
    },
    bottleServiceData: [{ category: "Vodka", items: [{ name: "Absolut Blue", price: "£140" }] }],
    byTheGlassData: [{ category: "Beer & Cider", items: [{ name: "Peroni", price: "5.50" }] }],
    shotsData: {
        title: "Shots",
        items: [{ name: "Tequila Rose", single: "£5", double: "£9" }],
        shooters: { title: "Shooters", prices: "£6 each or 4 for £20", items: [{ name: "B52", description: "Kahlua, Baileys" }] }
    },
    cocktailsData: [{ category: "Signatures", items: [{ name: "Pornstar Martini", price: "12.50", description: "Vanilla vodka, passoa" }] }],
    winesData: [{ category: "White", items: [{ name: "Pinot Grigio", price: { "175ml": "7.00", "Btl": "28.00" }, description: "Crisp" }] }]
};

const INITIAL_HEADER_DATA: HeaderData = { logoUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,fit=crop,q=95/m7V3XokxQ0Hbg2KE/new-YNq2gqz36OInJMrE.png" };
const INITIAL_HERO_DATA: HeroData = { backgroundImageUrl: "https://mustagmgjfhlynxfisoc.supabase.co/storage/v1/object/public/iii/uploads/1765035238038_DALL_E_2024-06-26_00.50.27_-_A_vibrant_and_colorful_illustration_promoting_the_low_prices_at_London_Karaoke_Club_Soho._The_background_features_swirling__vivid_colors_like_red__blu.webp", slides: [], badgeText: "Winter Wonderland Karaoke", headingText: "Your Wonderland Awaits", subText: "Private luxury suites, premium cocktails, and over 80,000 songs. The stage is yours.", buttonText: "Book Your Room" };
const INITIAL_HIGHLIGHTS_DATA: HighlightsData = { heading: "Get the party started.", subtext: "Private rooms, thousands of songs, and delicious cocktails.", mainImageUrl: "https://mustagmgjfhlynxfisoc.supabase.co/storage/v1/object/public/iii/uploads/1765033074972_IMG_4681.jpg", featureListTitle: "The Ultimate Experience.", featureList: ["Private Booths", "Huge Song Library"], sideImageUrl: "https://picsum.photos/seed/neonglowmic/400/400" };
const INITIAL_FEATURES_DATA: FeaturesData = { experience: { label: "The Experience", heading: "Your Private Stage.", text: "Step into your own booth.", image: "https://picsum.photos/seed/stylishkaraoke/1400/800" }, occasions: { heading: "A Room For Every Occasion.", text: "Any group size.", items: [{ title: "Parties", text: "Celebrations." }] }, grid: { heading: "The Extras", items: [{ title: "Sound", description: "Crystal clear.", image: "https://picsum.photos/seed/prosoundsystem/400/500" }] } };
const INITIAL_VIBE_DATA: VibeData = { label: "The Vibe", heading: "Heart of the party.", text: "Electric atmosphere.", image1: "", image2: "", videoUrl: "", bigImage: "", bottomHeading: "", bottomText: "" };
const INITIAL_TESTIMONIALS_DATA: TestimonialsData = { heading: "Google Reviews", subtext: "LKC Soho", items: [{ quote: "Great night!", name: "Emma", avatar: "" }] };
const INITIAL_BATTERY_DATA: BatteryData = { statPrefix: "Over", statNumber: "80K+", statSuffix: "songs.", subText: "Always your jam." };
const INITIAL_FOOTER_DATA: FooterData = { ctaHeading: "Ready?", ctaText: "Book now.", ctaButtonText: "Book a Room" };
const INITIAL_GALLERY_DATA: GalleryData = { heading: "Moments", subtext: "Gallery", images: [], videos: [] };
const INITIAL_EVENTS_DATA: EventsData = { hero: { title: "Celebrate", subtitle: "Events", image: "" }, sections: [] };
const INITIAL_DB_CONFIG: DatabaseConfig = { supabaseUrl: '', supabaseKey: '', storageBucket: 'iii' };
const INITIAL_SONGS: Song[] = [{ id: '1', title: 'Bohemian Rhapsody', artist: 'Queen', genre: 'Rock' }];
const INITIAL_THEME: ThemeData = { primaryColor: '#ec4899', secondaryColor: '#eab308', backgroundColor: '#000000', textColor: '#ffffff', headerBg: '#000000', footerBg: '#18181b' };

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const init = <T,>(key: string, defaultVal: T): T => {
        const saved = localStorage.getItem(`lkc_${key}`);
        return saved ? JSON.parse(saved) : defaultVal;
    };

    const [foodMenu, setFoodMenu] = useState<MenuCategory[]>(() => init('foodMenu', INITIAL_FOOD_MENU));
    const [drinksData, setDrinksData] = useState<DrinksData>(() => init('drinksData', INITIAL_DRINKS_DATA));
    const [headerData, setHeaderData] = useState<HeaderData>(() => init('headerData', INITIAL_HEADER_DATA));
    const [heroData, setHeroData] = useState<HeroData>(() => init('heroData', INITIAL_HERO_DATA));
    const [highlightsData, setHighlightsData] = useState<HighlightsData>(() => init('highlightsData', INITIAL_HIGHLIGHTS_DATA));
    const [featuresData, setFeaturesData] = useState<FeaturesData>(() => init('featuresData', INITIAL_FEATURES_DATA));
    const [vibeData, setVibeData] = useState<VibeData>(() => init('vibeData', INITIAL_VIBE_DATA));
    const [testimonialsData, setTestimonialsData] = useState<TestimonialsData>(() => init('testimonialsData', INITIAL_TESTIMONIALS_DATA));
    const [batteryData, setBatteryData] = useState<BatteryData>(() => init('batteryData', INITIAL_BATTERY_DATA));
    const [footerData, setFooterData] = useState<FooterData>(() => init('footerData', INITIAL_FOOTER_DATA));
    const [galleryData, setGalleryData] = useState<GalleryData>(() => init('galleryData', INITIAL_GALLERY_DATA));
    const [eventsData, setEventsData] = useState<EventsData>(() => init('eventsData', INITIAL_EVENTS_DATA));
    const [dbConfig, setDbConfig] = useState<DatabaseConfig>(() => init('dbConfig', INITIAL_DB_CONFIG));
    const [songs, setSongs] = useState<Song[]>(() => init('songs', INITIAL_SONGS));
    const [theme, setTheme] = useState<ThemeData>(() => init('theme', INITIAL_THEME));

    const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
    const [isDataLoading, setIsDataLoading] = useState(false);

    useEffect(() => {
        if (dbConfig.supabaseUrl && dbConfig.supabaseKey) {
            setSupabase(createClient(dbConfig.supabaseUrl, dbConfig.supabaseKey));
        }
    }, [dbConfig.supabaseUrl, dbConfig.supabaseKey]);

    const persist = (key: string, data: any) => localStorage.setItem(`lkc_${key}`, JSON.stringify(data));

    useEffect(() => { persist('foodMenu', foodMenu); }, [foodMenu]);
    useEffect(() => { persist('drinksData', drinksData); }, [drinksData]);
    useEffect(() => { persist('headerData', headerData); }, [headerData]);
    useEffect(() => { persist('heroData', heroData); }, [heroData]);
    useEffect(() => { persist('highlightsData', highlightsData); }, [highlightsData]);
    useEffect(() => { persist('featuresData', featuresData); }, [featuresData]);
    useEffect(() => { persist('vibeData', vibeData); }, [vibeData]);
    useEffect(() => { persist('testimonialsData', testimonialsData); }, [testimonialsData]);
    useEffect(() => { persist('batteryData', batteryData); }, [batteryData]);
    useEffect(() => { persist('footerData', footerData); }, [footerData]);
    useEffect(() => { persist('galleryData', galleryData); }, [galleryData]);
    useEffect(() => { persist('eventsData', eventsData); }, [eventsData]);
    useEffect(() => { persist('dbConfig', dbConfig); }, [dbConfig]);
    useEffect(() => { persist('songs', songs); }, [songs]);
    useEffect(() => { persist('theme', theme); }, [theme]);

    const uploadToSupabase = async (file: Blob | File, path: string): Promise<string | null> => {
        if (!supabase) return null;
        const { error } = await supabase.storage.from(dbConfig.storageBucket).upload(path, file);
        if (error) return null;
        const { data: { publicUrl } } = supabase.storage.from(dbConfig.storageBucket).getPublicUrl(path);
        return publicUrl;
    };

    const saveAllToSupabase = async () => {
        if (!supabase) { alert("Configure Supabase first."); return; }
        setIsDataLoading(true);
        const fullState = {
            foodMenu, drinksData, headerData, heroData, highlightsData, featuresData,
            vibeData, testimonialsData, batteryData, footerData, galleryData, eventsData,
            songs, theme
        };
        try {
            const { error } = await supabase.from('site_settings').upsert({ id: 1, content: fullState, updated_at: new Date() });
            if (error) throw error;
            alert("Saved successfully!");
        } catch (e: any) {
            alert("Error saving: " + e.message);
        } finally { setIsDataLoading(false); }
    };

    useEffect(() => {
        if (supabase) {
            const load = async () => {
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
                    if (c.testimonialsData) setTestimonialsData(c.testimonialsData);
                    if (c.batteryData) setBatteryData(c.batteryData);
                    if (c.footerData) setFooterData(c.footerData);
                    if (c.galleryData) setGalleryData(c.galleryData);
                    if (c.eventsData) setEventsData(c.eventsData);
                    if (c.songs) setSongs(c.songs);
                    if (c.theme) setTheme(c.theme);
                }
                setIsDataLoading(false);
            };
            load();
        }
    }, [supabase]);

    return (
        <DataContext.Provider value={{
            foodMenu, updateFoodMenu: setFoodMenu,
            drinksData, updateDrinksData: setDrinksData,
            headerData, updateHeaderData: setHeaderData,
            heroData, updateHeroData: setHeroData,
            highlightsData, updateHighlightsData: setHighlightsData,
            featuresData, updateFeaturesData: setFeaturesData,
            vibeData, updateVibeData: setVibeData,
            testimonialsData, updateTestimonialsData: setTestimonialsData,
            batteryData, updateBatteryData: setBatteryData,
            footerData, updateFooterData: setFooterData,
            galleryData, updateGalleryData: setGalleryData,
            eventsData, updateEventsData: setEventsData,
            dbConfig, updateDbConfig: setDbConfig,
            songs, updateSongs: setSongs,
            theme, updateTheme: setTheme,
            resetToDefaults: () => { localStorage.clear(); window.location.reload(); },
            uploadToSupabase,
            saveAllToSupabase,
            isDataLoading
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
