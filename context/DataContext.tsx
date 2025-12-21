
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

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
    price: string | object;
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

export interface HeaderData {
    logoUrl: string;
}

export interface HeroData {
    backgroundImageUrl: string;
    slides: string[];
    badgeText: string;
    headingText: string;
    subText: string;
    buttonText: string;
}

export interface HighlightsData {
    heading: string;
    subtext: string;
    mainImageUrl: string;
    featureListTitle: string;
    featureList: string[];
    sideImageUrl: string;
}

export interface FeatureGridItem {
    title: string;
    description: string;
    image: string;
}

export interface OccasionItem {
    title: string;
    text: string;
}

export interface FeaturesData {
    experience: {
        label: string;
        heading: string;
        text: string;
        image: string;
    };
    occasions: {
        heading: string;
        text: string;
        items: OccasionItem[];
    };
    grid: {
        heading: string;
        items: FeatureGridItem[];
    };
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

export interface TestimonialItem {
    quote: string;
    name: string;
    avatar: string;
}

export interface TestimonialsData {
    heading: string;
    subtext: string;
    items: TestimonialItem[];
}

export interface BatteryData {
    statPrefix: string;
    statNumber: string;
    statSuffix: string;
    subText: string;
}

export interface FooterData {
    ctaHeading: string;
    ctaText: string;
    ctaButtonText: string;
}

export interface GalleryItem {
    id: string;
    url: string;
    caption: string;
}

export interface VideoItem {
    id: string;
    url: string;
    thumbnail: string;
    title: string;
}

export interface GalleryData {
    heading: string;
    subtext: string;
    images: GalleryItem[];
    videos?: VideoItem[];
}

export interface EventSection {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    imageUrl: string;
    features: string[];
}

export interface EventsData {
    hero: {
        title: string;
        subtitle: string;
        image: string;
    };
    sections: EventSection[];
}

export interface DatabaseConfig {
    storageBucket?: string;
    // S3 Compatibility
    s3Endpoint?: string;
    s3AccessKey?: string;
    s3SecretKey?: string;
    // Local paths (for simulation fallback)
    photoFolder: string;
    videoFolder: string;
}

export interface Song {
    id: string;
    title: string;
    artist: string;
    genre?: string;
    language?: string;
    fileUrl?: string; // Added for audio uploads
}

export interface Booking {
    id: string;
    customerName: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    guests: number;
    room: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    notes?: string;
}

export interface Blog {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    imageUrl: string;
}

export interface ThemeData {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    headerBg: string;
    footerBg: string;
}

interface DataContextType {
    foodMenu: MenuCategory[];
    updateFoodMenu: (newMenu: MenuCategory[]) => void;
    drinksData: any;
    updateDrinksData: (newData: any) => void;
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
    bookings: Booking[];
    updateBookings: (newBookings: Booking[]) => void;
    blogs: Blog[];
    updateBlogs: (newBlogs: Blog[]) => void;
    theme: ThemeData;
    updateTheme: (newTheme: ThemeData) => void;

    resetToDefaults: () => void;

    // S3 Specific
    uploadToSupabase: (file: Blob | File, path: string, bucket?: string) => Promise<string | null>; // Kept name for compatibility, now uses S3
    fetchSupabaseFiles: (bucket?: string, folder?: string) => Promise<{ name: string, url: string }[]>;
    deleteSupabaseFile: (path: string, bucket?: string) => Promise<boolean>;
    saveAllToSupabase: () => Promise<void>; // Now saves to S3 JSON
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
            { name: "Nachos", description: "Guacamole, salsa, sour cream, cheese", price: "10.00", note: "Add chicken +£3" },
            { name: "Chicken Wings", description: "BBQ or Buffalo sauce", price: "8.50" },
            { name: "Halloumi Fries", description: "Sweet chilli dip", price: "7.50" }
        ]
    },
    {
        category: "Pizzas",
        description: "Stone baked goodness",
        items: [
            { name: "Margherita", description: "Tomato, mozzarella, basil", price: "12.00" },
            { name: "Pepperoni", description: "Tomato, mozzarella, pepperoni", price: "13.50" },
            { name: "Vegetarian", description: "Peppers, onions, mushrooms, olives", price: "13.00" }
        ]
    },
    {
        category: "Burgers",
        items: [
            { name: "Classic Beef", description: "Beef patty, lettuce, tomato, burger sauce", price: "14.00" },
            { name: "Chicken Burger", description: "Fried chicken breast, mayo, lettuce", price: "13.50" }
        ]
    }
];

const INITIAL_DRINKS_DATA: any = {
    headerImageUrl: "https://picsum.photos/seed/barvibes/1600/800",
    packagesData: {
        title: "Drinks Packages",
        subtitle: "Pre-order for the best value",
        items: [
            { name: "Bronze Package", price: "£150", description: "2x Prosecco, 10x Beers, 1x Sharing Platter" },
            { name: "Silver Package", price: "£250", description: "1x House Spirit (70cl), 2x Prosecco, 10x Beers" },
            { name: "Gold Package", price: "£400", description: "1x Premium Spirit (70cl), 1x Champagne, 20x Beers, 2x Sharing Platters" }
        ],
        notes: ["Service charge not included.", "Packages must be pre-ordered 48 hours in advance."]
    },
    bottleServiceData: [
        {
            category: "Vodka",
            items: [
                { name: "Absolut Blue", price: "£140" },
                { name: "Grey Goose", price: "£180" },
                { name: "Belvedere", price: "£190" },
                { name: "Ciroc", price: "£180" }
            ]
        },
        {
            category: "Gin",
            items: [
                { name: "Beefeater", price: "£140" },
                { name: "Hendrick's", price: "£170" },
                { name: "Tanqueray 10", price: "£180" }
            ],
            note: "All bottles served with mixers."
        },
        {
            category: "Whiskey",
            items: [
                { name: "Jack Daniel's", price: "£140" },
                { name: "Jameson", price: "£140" },
                { name: "Johnnie Walker Black", price: "£160" }
            ]
        }
    ],
    byTheGlassData: [
        {
            category: "Beer & Cider",
            items: [
                { name: "Peroni", price: "5.50" },
                { name: "Asahi", price: "5.50" },
                { name: "Meantime Pale Ale", price: "6.00" },
                { name: "Cornish Orchard Cider", price: "5.50" }
            ]
        },
        {
            category: "Soft Drinks",
            items: [
                { name: "Coke / Diet Coke", price: "3.50" },
                { name: "Lemonade", price: "3.50" },
                { name: "Red Bull", price: "4.00" },
                { name: "Still / Sparkling Water", price: "3.00" }
            ]
        }
    ],
    shotsData: {
        title: "Shots",
        items: [
            { name: "Tequila Rose", single: "£5", double: "£9" },
            { name: "Jagermeister", single: "£5", double: "£9" },
            { name: "Sambuca", single: "£5", double: "£9" },
            { name: "Olmeca Tequila", single: "£5", double: "£9" }
        ],
        shooters: {
            title: "Shooters",
            prices: "£6 each or 4 for £20",
            items: [
                { name: "B52", description: "Kahlua, Baileys, Grand Marnier" },
                { name: "Baby Guinness", description: "Kahlua, Baileys" },
                { name: "Jam Doughnut", description: "Chambord, Baileys" }
            ]
        }
    },
    cocktailsData: [
        {
            category: "Signatures",
            items: [
                { name: "Pornstar Martini", price: "12.50", description: "Vanilla vodka, passoa, passionfruit, prosecco shot" },
                { name: "Espresso Martini", price: "12.50", description: "Vodka, kahlua, espresso" },
                { name: "Lychee Collins", price: "12.00", description: "Gin, lychee, lemon, soda" },
                { name: "Spicy Margarita", price: "12.50", description: "Tequila, lime, agave, chilli" }
            ]
        },
        {
            category: "Classics",
            items: [
                { name: "Mojito", price: "11.50", description: "Rum, lime, mint, soda" },
                { name: "Old Fashioned", price: "12.00", description: "Bourbon, bitters, sugar" },
                { name: "Aperol Spritz", price: "10.50", description: "Aperol, prosecco, soda" }
            ]
        }
    ],
    winesData: [
        {
            category: "White",
            items: [
                { name: "Pinot Grigio", price: { "175ml": "7.00", "250ml": "9.50", "Btl": "28.00" }, description: "Crisp and refreshing" },
                { name: "Sauvignon Blanc", price: { "175ml": "8.00", "250ml": "11.00", "Btl": "32.00" }, description: "Zesty and aromatic" }
            ]
        },
        {
            category: "Red",
            items: [
                { name: "Merlot", price: { "175ml": "7.00", "250ml": "9.50", "Btl": "28.00" }, description: "Soft and fruity" },
                { name: "Malbec", price: { "175ml": "8.50", "250ml": "11.50", "Btl": "34.00" }, description: "Full bodied and rich" }
            ]
        },
        {
            category: "Sparkling",
            items: [
                { name: "Prosecco", price: { "Glass": "8.00", "Btl": "35.00" } },
                { name: "Moet & Chandon", price: { "Btl": "90.00" } },
                { name: "Veuve Clicquot", price: { "Btl": "110.00" } }
            ]
        }
    ]
};

const INITIAL_HEADER_DATA: HeaderData = {
    logoUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,fit=crop,q=95/m7V3XokxQ0Hbg2KE/new-YNq2gqz36OInJMrE.png"
};

const INITIAL_HERO_DATA: HeroData = {
    backgroundImageUrl: "https://mustagmgjfhlynxfisoc.supabase.co/storage/v1/object/public/iii/uploads/1765035238038_DALL_E_2024-06-26_00.50.27_-_A_vibrant_and_colorful_illustration_promoting_the_low_prices_at_London_Karaoke_Club_Soho._The_background_features_swirling__vivid_colors_like_red__blu.webp",
    slides: [
        "https://mustagmgjfhlynxfisoc.supabase.co/storage/v1/object/public/iii/uploads/1765035238038_DALL_E_2024-06-26_00.50.27_-_A_vibrant_and_colorful_illustration_promoting_the_low_prices_at_London_Karaoke_Club_Soho._The_background_features_swirling__vivid_colors_like_red__blu.webp",
        "https://mustagmgjfhlynxfisoc.supabase.co/storage/v1/object/public/iii/aloce.mp4"
    ],
    badgeText: "Winter Wonderland Karaoke",
    headingText: "Your Wonderland Awaits",
    subText: "Private luxury suites, premium cocktails, and over 80,000 songs. The stage is yours.",
    buttonText: "Book Your Room"
};

const INITIAL_HIGHLIGHTS_DATA: HighlightsData = {
    heading: "Get the party started.",
    subtext: "Private rooms, thousands of songs, and delicious cocktails. Your night, your way.",
    mainImageUrl: "https://mustagmgjfhlynxfisoc.supabase.co/storage/v1/object/public/iii/uploads/1765033074972_IMG_4681.jpg",
    sideImageUrl: "https://picsum.photos/seed/neonglowmic/400/400",
    featureListTitle: "The Ultimate Karaoke Experience.",
    featureList: [
        "Private Karaoke Booths", "Huge Song Library", "Cocktail Bar",
        "State-of-the-Art Sound", "Central London Location", "Perfect for Parties",
        "Easy Online Booking"
    ]
};

const INITIAL_FEATURES_DATA: FeaturesData = {
    experience: {
        label: "The Experience",
        heading: "Your Private Stage Awaits.",
        text: "Step into your own private karaoke booth and leave the world behind. It's just you, your friends, and thousands of songs at your fingertips.",
        image: "https://picsum.photos/seed/stylishkaraoke/1400/800"
    },
    occasions: {
        heading: "A Room For Every Occasion.",
        text: "From intimate duets to full-blown ensemble performances, we have rooms to fit any group size. Perfect for birthdays, hen parties, corporate events, or just a random Tuesday.",
        items: [
            { title: "For Birthdays & Hens", text: "Make it a celebration to remember. Our team can help you with decorations, drinks packages, and more to make the day extra special." },
            { title: "For Corporate Events", text: "Break the ice and build team spirit. Karaoke is the ultimate team-building activity that's actually fun. Enquire about our corporate packages." },
            { title: "For a Night Out", text: "You don't need a reason to sing. Grab your mates, pick a room, and get ready for a night of epic performances and hilarious memories." }
        ]
    },
    grid: {
        heading: "Everything You Need For The Perfect Night.",
        items: [
            { title: "Massive Song Library", description: "From the latest chart-toppers to timeless classics, our library has over 80,000 songs. You'll always find your anthem.", image: "https://picsum.photos/seed/digitalsongbook/400/500" },
            { title: "Signature Cocktails", description: "Our expert mixologists are ready to craft the perfect drink to fuel your performance. Liquid courage, served chilled.", image: "https://picsum.photos/seed/neoncocktails/400/500" },
            { title: "Pro Sound System", description: "Feel like a star with our professional-grade microphones and sound systems. Crystal clear audio in every room.", image: "https://picsum.photos/seed/prosoundsystem/400/500" }
        ]
    }
};

const INITIAL_VIBE_DATA: VibeData = {
    label: "The Vibe",
    heading: "The heart of the party.",
    text: "It's more than just singing. It's the electric atmosphere, the shared laughter, and the moment you and your friends nail that harmony. It's a vibe you won't find anywhere else.",
    image1: "https://picsum.photos/seed/karaokegroup/600/600",
    image2: "https://picsum.photos/seed/partylights/600/600",
    videoUrl: "https://mustagmgjfhlynxfisoc.supabase.co/storage/v1/object/public/iii/aloce.mp4",
    bigImage: "https://picsum.photos/seed/makingmemories/1400/900",
    bottomHeading: "Unforgettable Nights, Guaranteed.",
    bottomText: "We're in the business of making memories. From incredible highs to hilarious lows, the moments you create here will be the ones you talk about for years to come."
};

const INITIAL_TESTIMONIALS_DATA: TestimonialsData = {
    heading: "Google Reviews",
    subtext: "London Karaoke Club - Soho (Private Hen do | Birthday | Corporate Parties )",
    items: [
        { quote: "Absolutely incredible night! The staff went above and beyond for my sister's hen do. The cocktails were flowing, and the private room was spacious and air-conditioned. Best karaoke in Soho hands down!", name: "Emma Thompson", avatar: "https://lh3.googleusercontent.com/a-/ALV-UjW_yJkLzX8_aB8_c9_d0_e1_f2_g3_h4_i5=s120-c-rp-mo-br100" },
        { quote: "Booked a corporate event here for 30 people and it was flawless. Great service, huge song selection, and the equipment is top tier. Highly recommended for team outings.", name: "James Wilson", avatar: "https://lh3.googleusercontent.com/a-/ALV-UjX_jKkLzX8_aB8_c9_d0_e1_f2_g3_h4_i5=s120-c-rp-mo-br100" },
        { quote: "Such a hidden gem! We celebrated my 30th here and didn't want to leave. 2am finish was perfect. The atmosphere is unmatched.", name: "Sarah Jenkins", avatar: "https://lh3.googleusercontent.com/a-/ALV-UjY_jKkLzX8_aB8_c9_d0_e1_f2_g3_h4_i5=s120-c-rp-mo-br100" }
    ]
};

const INITIAL_BATTERY_DATA: BatteryData = {
    statPrefix: "Over",
    statNumber: "80K+",
    statSuffix: "songs to choose from.",
    subText: "Always your jam."
};

const INITIAL_FOOTER_DATA: FooterData = {
    ctaHeading: "Ready for your spotlight moment?",
    ctaText: "Book your private karaoke room today and get ready for a night of unforgettable performances.",
    ctaButtonText: "Book a Room"
};

const INITIAL_GALLERY_DATA: GalleryData = {
    heading: "Moments & Memories",
    subtext: "A glimpse into the electric atmosphere at London Karaoke Club. From epic solos to group hugs, this is where the magic happens.",
    images: [
        { id: '1', url: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=1000", caption: "Main Stage Vibes" },
        { id: '2', url: "https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=1000", caption: "Neon Nights" },
        { id: '3', url: "https://images.unsplash.com/photo-1572013822606-25805c87707e?q=80&w=1000", caption: "Signature Cocktails" },
        { id: '4', url: "https://images.unsplash.com/photo-1525268323886-2818bc24d2bd?q=80&w=1000", caption: "Friends Having Fun" }
    ],
    videos: [
        {
            id: '1',
            url: 'https://mustagmgjfhlynxfisoc.supabase.co/storage/v1/object/public/iii/aloce.mp4',
            thumbnail: '',
            title: 'Karaoke Fun'
        }
    ]
};

const INITIAL_EVENTS_DATA: EventsData = {
    hero: {
        title: "Celebrate With Us",
        subtitle: "From wild Hen Dos to sophisticated Corporate Events, we make every occasion unforgettable.",
        image: "https://picsum.photos/seed/eventshero/1600/900"
    },
    sections: [
        {
            id: 'birthdays',
            title: "Birthday Parties",
            subtitle: "Make Your Special Day Legendary",
            description: "Turn another year older into the night of a lifetime. Whether it's your 18th, 30th, or 60th, our private rooms are the perfect playground for you and your friends.",
            imageUrl: "https://picsum.photos/seed/birthdayparty/800/600",
            features: ["Complimentary Birthday Shot", "Room Decoration Packages", "Personalized Playlists", "Cake Service Available"]
        },
        {
            id: 'hens',
            title: "Hen & Stag Dos",
            subtitle: "The Ultimate Pre-Wedding Bash",
            description: "Send them off in style with a night of pure, unadulterated fun. Our Hen & Stag packages are designed to loosen everyone up.",
            imageUrl: "https://picsum.photos/seed/henparty/800/600",
            features: ["Prosecco Reception", "Cheeky Cocktail Menu", "Fancy Dress Friendly", "Party Games & Props"]
        },
        {
            id: 'corporate',
            title: "Corporate Events",
            subtitle: "Team Building That Actually Rocks",
            description: "Forget trust falls and awkward ice-breakers. Nothing brings a team together like belting out 'Bohemian Rhapsody' after a few drinks.",
            imageUrl: "https://picsum.photos/seed/corporateevent/800/600",
            features: ["Full Venue Hire Available", "Catering & Buffet Options", "Branding Opportunities", "Invoice Payment Available"]
        }
    ]
};

const INITIAL_DB_CONFIG: DatabaseConfig = {
    storageBucket: 'iii',
    // S3 Config
    s3Endpoint: 'https://mustagmgjfhlynxfisoc.storage.supabase.co/storage/v1/s3',
    s3AccessKey: '843181c0582cb1292990a2e3146aacd2',
    s3SecretKey: 'fbcafb461b63c64ce527d427ecbd827c04ce0fe4994cd9bd3d10cbf884a5e741',
    photoFolder: 'uploads/photos/',
    videoFolder: 'uploads/videos/'
};

const INITIAL_SONGS: Song[] = [
    { id: '1', title: 'Bohemian Rhapsody', artist: 'Queen', genre: 'Rock', language: 'English' },
    { id: '2', title: 'Mr. Brightside', artist: 'The Killers', genre: 'Rock', language: 'English' },
    { id: '3', title: 'Dancing Queen', artist: 'ABBA', genre: 'Pop', language: 'English' }
];

const INITIAL_BOOKINGS: Booking[] = [
    { id: '101', customerName: 'John Smith', email: 'john@example.com', phone: '07700900123', date: '2024-12-20', time: '20:00', guests: 6, room: 'Disco Room', status: 'confirmed' }
];

const INITIAL_BLOGS: Blog[] = [
    { id: '1', title: 'Top 10 Karaoke Songs of 2024', excerpt: 'Discover the tracks that got everyone singing this year.', content: 'Full content here...', date: '2024-12-01', imageUrl: 'https://picsum.photos/seed/blog1/800/600' }
];

const INITIAL_THEME: ThemeData = {
    primaryColor: '#FBBF24',
    secondaryColor: '#EC4899',
    backgroundColor: '#09090b',
    textColor: '#ffffff',
    headerBg: '#000000',
    footerBg: '#18181b'
};

const DATA_VERSION = '3.1'; // Bump version for S3 migration

// --- Helper to convert Blob/File to Uint8Array for S3 (Fixes fs.readFile error) ---
const blobToUint8Array = async (blob: Blob | File): Promise<Uint8Array> => {
    const buffer = await blob.arrayBuffer();
    return new Uint8Array(buffer);
};

// --- Context ---

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // --- State Initialization Helper ---
    const init = <T,>(key: string, defaultVal: T): T => {
        const storedVersion = localStorage.getItem('lkc_data_version');
        if (storedVersion !== DATA_VERSION) {
            return defaultVal;
        }
        const saved = localStorage.getItem(`lkc_${key}`);
        return saved ? JSON.parse(saved) : defaultVal;
    };

    const [foodMenu, setFoodMenu] = useState<MenuCategory[]>(() => init('foodMenu', INITIAL_FOOD_MENU));
    const [drinksData, setDrinksData] = useState<any>(() => init('drinksData', INITIAL_DRINKS_DATA));
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
    const [bookings, setBookings] = useState<Booking[]>(() => init('bookings', INITIAL_BOOKINGS));
    const [blogs, setBlogs] = useState<Blog[]>(() => init('blogs', INITIAL_BLOGS));
    const [theme, setTheme] = useState<ThemeData>(() => init('theme', INITIAL_THEME));

    const [s3Client, setS3Client] = useState<S3Client | null>(null);
    const [isDataLoading, setIsDataLoading] = useState(false);

    useEffect(() => {
        localStorage.setItem('lkc_data_version', DATA_VERSION);

        // Init S3 Client
        if (dbConfig.s3Endpoint && dbConfig.s3AccessKey && dbConfig.s3SecretKey) {
            try {
                const client = new S3Client({
                    endpoint: dbConfig.s3Endpoint,
                    region: 'us-east-1', // Generic region for compatibility
                    credentials: {
                        accessKeyId: dbConfig.s3AccessKey,
                        secretAccessKey: dbConfig.s3SecretKey
                    },
                    forcePathStyle: true // Needed for some S3-compatible providers
                });
                setS3Client(client);
                // Load initial data from S3 if available
                loadFromS3(client);
            } catch (e) {
                console.error("Failed to init S3 client", e);
            }
        }
    }, [dbConfig.s3Endpoint, dbConfig.s3AccessKey, dbConfig.s3SecretKey]);

    // Local Persistence
    const persist = (key: string, data: any) => {
        localStorage.setItem(`lkc_${key}`, JSON.stringify(data));
    };

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
    useEffect(() => { persist('bookings', bookings); }, [bookings]);
    useEffect(() => { persist('blogs', blogs); }, [blogs]);
    useEffect(() => { persist('theme', theme); }, [theme]);

    const resetToDefaults = () => {
        if (confirm("Reset all data to defaults?")) {
            localStorage.clear();
            window.location.reload();
        }
    };

    // --- S3 Actions ---

    const uploadToSupabase = async (file: Blob | File, path: string, bucket: string = dbConfig.storageBucket || 'iii'): Promise<string | null> => {
        if (!s3Client) { console.warn("S3 not configured"); return null; }
        try {
            // Convert to Uint8Array to prevent SDK from trying to check fs for path string
            const body = await blobToUint8Array(file);
            
            const command = new PutObjectCommand({
                Bucket: bucket,
                Key: path,
                Body: body,
                ContentType: file.type,
                ACL: 'public-read'
            });
            await s3Client.send(command);

            const url = `${dbConfig.s3Endpoint}/${bucket}/${path}`;
            return url;
        } catch (e) {
            console.error("S3 Upload failed", e);
            return null;
        }
    };

    const fetchSupabaseFiles = async (bucket: string = dbConfig.storageBucket || 'iii', folder: string = ''): Promise<{ name: string, url: string }[]> => {
        return [];
    };

    const deleteSupabaseFile = async (path: string, bucket: string = dbConfig.storageBucket || 'iii'): Promise<boolean> => {
        if (!s3Client) return false;
        try {
            const command = new DeleteObjectCommand({ Bucket: bucket, Key: path });
            await s3Client.send(command);
            return true;
        } catch (e) { console.error(e); return false; }
    };

    const saveAllToSupabase = async () => {
        if (!s3Client) { alert("S3 not configured!"); return; }
        try {
            const fullState = {
                foodMenu, drinksData, headerData, heroData, highlightsData, featuresData,
                vibeData, testimonialsData, batteryData, footerData, galleryData, eventsData,
                songs, bookings, blogs, theme
            };
            const json = JSON.stringify(fullState);
            const body = new TextEncoder().encode(json); // Convert string to Uint8Array for S3

            const command = new PutObjectCommand({
                Bucket: dbConfig.storageBucket || 'iii',
                Key: 'cms_data.json',
                Body: body,
                ContentType: 'application/json'
            });

            await s3Client.send(command);
            alert("All changes saved to S3 successfully!");
        } catch (e: any) {
            console.error("Save to S3 failed", e);
            alert(`Failed to save: ${e.message}`);
        }
    };

    const loadFromS3 = async (client: S3Client) => {
        setIsDataLoading(true);
        try {
            const command = new GetObjectCommand({
                Bucket: dbConfig.storageBucket || 'iii',
                Key: 'cms_data.json'
            });
            const response = await client.send(command);
            if (response.Body) {
                const str = await response.Body.transformToString();
                const data = JSON.parse(str);

                if (data.foodMenu) setFoodMenu(data.foodMenu);
                if (data.drinksData) setDrinksData(data.drinksData);
                if (data.headerData) setHeaderData(data.headerData);
                if (data.heroData) setHeroData(data.heroData);
                if (data.highlightsData) setHighlightsData(data.highlightsData);
                if (data.featuresData) setFeaturesData(data.featuresData);
                if (data.vibeData) setVibeData(data.vibeData);
                if (data.testimonialsData) setTestimonialsData(data.testimonialsData);
                if (data.batteryData) setBatteryData(data.batteryData);
                if (data.footerData) setFooterData(data.footerData);
                if (data.galleryData) setGalleryData(data.galleryData);
                if (data.eventsData) setEventsData(data.eventsData);
                if (data.songs) setSongs(data.songs);
                if (data.bookings) setBookings(data.bookings);
                if (data.blogs) setBlogs(data.blogs);
                if (data.theme) setTheme(data.theme);
            }
        } catch (e) {
            console.log("No remote config found or load failed", e);
        } finally {
            setIsDataLoading(false);
        }
    };

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
            bookings, updateBookings: setBookings,
            blogs, updateBlogs: setBlogs,
            theme, updateTheme: setTheme,
            resetToDefaults,
            uploadToSupabase,
            fetchSupabaseFiles,
            deleteSupabaseFile,
            saveAllToSupabase,
            isDataLoading
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
