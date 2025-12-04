
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';

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
    videoUrl?: string; // Added videoUrl
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

export interface DatabaseConfig {
  host: string;
  user: string;
  pass: string;
  name: string;
  uploadScriptUrl: string;
  photoFolder: string;
  videoFolder: string;
  supabaseUrl?: string;
  supabaseKey?: string;
  storageBucket?: string;
}

export interface Song {
    id: string;
    title: string;
    artist: string;
    genre?: string;
    language?: string;
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
  dbConfig: DatabaseConfig;
  updateDbConfig: (newData: DatabaseConfig) => void;
  
  // New CMS Features
  songs: Song[];
  updateSongs: (newSongs: Song[]) => void;
  bookings: Booking[];
  updateBookings: (newBookings: Booking[]) => void;

  resetToDefaults: () => void;
  
  // Supabase specific
  uploadToSupabase: (file: Blob | File, path: string, bucket?: string) => Promise<string | null>;
  fetchSupabaseFiles: (bucket?: string, folder?: string) => Promise<{name: string, url: string}[]>;
  deleteSupabaseFile: (path: string, bucket?: string) => Promise<boolean>;
}

// --- Initial Data ---

const INITIAL_HEADER_DATA: HeaderData = {
    logoUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,fit=crop,q=95/m7V3XokxQ0Hbg2KE/new-YNq2gqz36OInJMrE.png"
};

const INITIAL_HERO_DATA: HeroData = {
    backgroundImageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1024,fit=crop/m7V3XokxQ0Hbg2KE/london-karaoke-club-header-mv0WRlry1ahM56NV.png",
    slides: [
        "https://mustagmgjfhlynxfisoc.supabase.co/storage/v1/object/public/iii/Video%202.MP4", // Auto-play video
        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1920&auto=format&fit=crop", // Ocean/Rock scene
        "https://mustagmgjfhlynxfisoc.supabase.co/storage/v1/object/public/iii/xmas.jpg"  // Singing Santa from Supabase
    ],
    badgeText: "Winter Wonderland Karaoke",
    headingText: "The Ultimate Karaoke",
    subText: "Private luxury suites, premium cocktails, and over 80,000 songs. The stage is yours.",
    buttonText: "Book Your Room"
};

const INITIAL_HIGHLIGHTS_DATA: HighlightsData = {
  heading: "Get the party started.",
  subtext: "Private rooms, thousands of songs, and delicious cocktails. Your night, your way.",
  mainImageUrl: "https://picsum.photos/seed/singingfriends/1200/600",
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
    heading: "What Our Customers Say",
    subtext: "Don't just take our word for it. Here's what our amazing singers have to say.",
    items: [
        { quote: "The best night out we've had in ages! The song selection is massive and the rooms are so cool. We'll be back for sure.", name: "Sarah J.", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
        { quote: "Booked a room for my birthday and it was epic. The staff were super helpful and the cocktails were delicious. 10/10 experience!", name: "David L.", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704e" },
        { quote: "Perfect for a work social! It was a great way to unwind with the team. The sound system is top-notch. Highly recommend.", name: "Emily C.", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704f" }
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
    { id: '4', url: "https://images.unsplash.com/photo-1525268323886-2818bc24d2bd?q=80&w=1000", caption: "Friends Having Fun" },
    { id: '5', url: "https://images.unsplash.com/photo-1506157786151-c8c3bc666f40?q=80&w=1000", caption: "Live the Moment" },
    { id: '6', url: "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?q=80&w=1000", caption: "Party Time" },
    { id: '7', url: "https://images.unsplash.com/photo-1576692828388-75e921867175?q=80&w=1000", caption: "Sparklers" }
  ],
  videos: [
    { 
        id: '1', 
        url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', 
        thumbnail: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=1000', 
        title: 'Karaoke Fun' 
    }
  ]
};

const INITIAL_DB_CONFIG: DatabaseConfig = {
  host: 'localhost',
  user: 'root',
  pass: 'YnkknF_kipvY7$v',
  name: 'london_karaoke_db',
  uploadScriptUrl: '',
  photoFolder: 'uploads/photos/',
  videoFolder: 'uploads/videos/',
  supabaseUrl: 'https://mustagmgjfhlynxfisoc.supabase.co',
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11c3RhZ21namZobHlueGZpc29jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3Mzk0ODIsImV4cCI6MjA4MDMxNTQ4Mn0.O2U8PKFt2hG_ixoY5XKHnmtjQpRc6FKGqJAFR_ocfFY',
  storageBucket: 'iii'
};

const INITIAL_FOOD_MENU: MenuCategory[] = [
  {
    category: "Small Plates & Sharers",
    description: "Perfect for sharing while you decide on your next song.",
    items: [
      { name: "Karaoke Fried Chicken", description: "Crispy buttermilk chicken strips with sriracha mayo.", price: "8.50" },
      { name: "Halloumi Fries", description: "Served with sweet chili jam and pomegranate seeds.", price: "7.50", note: "V" },
      { name: "Loaded Nachos", description: "Tortilla chips, melted cheese, guacamole, salsa, sour cream, and jalapeños.", price: "12.00", note: "V, GF" },
      { name: "Sticky BBQ Wings", description: "Chicken wings tossed in a rich smoky BBQ glaze.", price: "8.50" },
      { name: "Tempura Prawns", description: "Light and crispy prawns with a soy and ginger dip.", price: "9.50" }
    ]
  },
  {
    category: "Pizzas (12\")",
    description: "Stone-baked goodness.",
    items: [
      { name: "Classic Margherita", description: "Tomato sauce, mozzarella, and fresh basil.", price: "11.00", note: "V" },
      { name: "Pepperoni Passion", description: "Double pepperoni and extra mozzarella.", price: "13.50" },
      { name: "Veggie Supreme", description: "Mushrooms, peppers, red onions, and sweetcorn.", price: "12.50", note: "V" },
      { name: "Spicy Meat Feast", description: "Pepperoni, spicy beef, chicken, and chorizo.", price: "14.50" }
    ]
  }
];

const INITIAL_DRINKS_DATA = {
    headerImageUrl: "https://picsum.photos/seed/barvibes/1600/800",
    packagesData: {
        title: "Drinks Packages",
        subtitle: "Pre-order for the best value and have them waiting in your room.",
        items: [
            { name: "Bronze Package", price: "£150", description: "2 Bottles of Prosecco, 10 Beers or Ciders, 2 Sharing Platters" },
            { name: "Silver Package", price: "£250", description: "1 Bottle of House Spirit (Vodka/Gin/Rum), Mixers, 10 Beers, 2 Sharing Platters" },
            { name: "Gold Package", price: "£400", description: "1 Bottle of Premium Spirit (Grey Goose/Hendricks), Mixers, 2 Bottles of Champagne, 3 Sharing Platters" },
            { name: "Diamond Package", price: "£600", description: "Magnum of Grey Goose, Unlimited Mixers, Magnum of Moët Champagne, extensive food platter selection" }
        ],
        notes: ["* Service charge included in package prices", "* Pre-booking required 24hrs in advance"]
    },
    cocktailsData: [
        {
            category: "Signatures",
            items: [
                { name: "Mic Drop", price: "12.50", description: "Vodka, passion fruit, vanilla, shot of prosecco on the side." },
                { name: "Purple Rain", price: "11.50", description: "Gin, cherry brandy, blue curacao, lemon, soda." },
                { name: "Bohemian Rhapsody", price: "12.00", description: "Rum, pineapple, coconut cream, dark rum float." },
                { name: "Sweet Caroline", price: "11.50", description: "Pink gin, strawberries, lime, elderflower tonic." }
            ]
        },
        {
            category: "Classics",
            items: [
                { name: "Espresso Martini", price: "12.00", description: "Vodka, coffee liqueur, fresh espresso." },
                { name: "Mojito", price: "11.00", description: "White rum, lime, mint, sugar, soda. (Also available in Strawberry/Passion Fruit)" },
                { name: "Old Fashioned", price: "12.50", description: "Bourbon, sugar, bitters, orange twist." },
                { name: "Margarita", price: "11.50", description: "Tequila, lime, triple sec, salt rim." }
            ]
        }
    ],
    bottleServiceData: [
        { category: "Vodka", items: [{ name: "Absolut Blue", price: "£140" }, { name: "Ciroc (Flavours available)", price: "£170" }, { name: "Grey Goose", price: "£180" }, { name: "Belvedere", price: "£185" }] },
        { category: "Gin", items: [{ name: "Beefeater", price: "£140" }, { name: "Bombay Sapphire", price: "£150" }, { name: "Hendrick's", price: "£160" }, { name: "Tanqueray 10", price: "£175" }] },
        { category: "Whisky", items: [{ name: "Jack Daniel's", price: "£140" }, { name: "Jameson", price: "£140" }, { name: "Johnnie Walker Black", price: "£160" }, { name: "Woodford Reserve", price: "£170" }] },
        { category: "Tequila", items: [{ name: "Olmeca Altman", price: "£140" }, { name: "Patron Silver", price: "£180" }, { name: "Don Julio Blanco", price: "£190" }, { name: "Casamigos Reposado", price: "£220" }] }
    ],
    winesData: [
        {
            category: "Wine & Bubbles",
            items: [
                { name: "House White/Red/Rose", price: { "175ml": "7.50", "250ml": "9.50", "Btl": "28.00" }, description: "Pinot Grigio / Merlot / Pinot Blush" },
                { name: "Prosecco DOC", price: { "Glass": "8.50", "Btl": "38.00" }, description: "Extra Dry, Italy" },
                { name: "Moët & Chandon Brut", price: { "Btl": "95.00" }, description: "Champagne, France" },
                { name: "Veuve Clicquot Yellow Label", price: { "Btl": "110.00" }, description: "Champagne, France" },
                { name: "Laurent-Perrier Rosé", price: { "Btl": "160.00" }, description: "Champagne, France" }
            ]
        }
    ],
    byTheGlassData: [
        {
            category: "Beers & Ciders",
            items: [
                { name: "Asahi Super Dry", price: "6.00" },
                { name: "Peroni Nastro Azzurro", price: "6.00" },
                { name: "Camden Hells Lager", price: "6.50" },
                { name: "Brewdog Punk IPA", price: "6.50" },
                { name: "Old Mout Cider (Berries)", price: "6.50" }
            ]
        }
    ],
    shotsData: {
        title: "Shots",
        items: [
            { name: "Tequila Rose", single: "5.00", double: "9.00" },
            { name: "Jägermeister", single: "5.00", double: "9.00" },
            { name: "Sambuca (White/Black)", single: "5.00", double: "9.00" },
            { name: "Baby Guinness", single: "5.50", double: "10.00" }
        ],
        shooters: {
            title: "Shooter Boards",
            prices: "6 Shots for £25 | 12 Shots for £45",
            items: [
                { name: "Jammy Dodger", description: "Chambord, cream, sugar rim" },
                { name: "Skittle Bomb", description: "Cointreau with Red Bull" }
            ]
        }
    }
};

const INITIAL_SONGS: Song[] = [
    { id: '1', title: 'Bohemian Rhapsody', artist: 'Queen', genre: 'Rock', language: 'English' },
    { id: '2', title: 'Mr. Brightside', artist: 'The Killers', genre: 'Rock', language: 'English' },
    { id: '3', title: 'Dancing Queen', artist: 'ABBA', genre: 'Pop', language: 'English' },
    { id: '4', title: 'Sweet Caroline', artist: 'Neil Diamond', genre: 'Pop', language: 'English' },
    { id: '5', title: 'I Will Survive', artist: 'Gloria Gaynor', genre: 'Disco', language: 'English' },
    { id: '6', title: 'Don\'t Stop Believin\'', artist: 'Journey', genre: 'Rock', language: 'English' },
    { id: '7', title: 'Wannabe', artist: 'Spice Girls', genre: 'Pop', language: 'English' },
    { id: '8', title: 'Wonderwall', artist: 'Oasis', genre: 'Rock', language: 'English' },
    { id: '9', title: 'Livin\' on a Prayer', artist: 'Bon Jovi', genre: 'Rock', language: 'English' },
    { id: '10', title: 'Angels', artist: 'Robbie Williams', genre: 'Pop', language: 'English' },
    { id: '11', title: 'Rolling in the Deep', artist: 'Adele', genre: 'Pop', language: 'English' },
    { id: '12', title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars', genre: 'Funk', language: 'English' },
    { id: '13', title: 'Valerie', artist: 'Amy Winehouse', genre: 'Soul', language: 'English' },
    { id: '14', title: 'Shallow', artist: 'Lady Gaga & Bradley Cooper', genre: 'Pop', language: 'English' },
    { id: '15', title: 'Total Eclipse of the Heart', artist: 'Bonnie Tyler', genre: 'Pop', language: 'English' }
];

const INITIAL_BOOKINGS: Booking[] = [
    { id: '101', customerName: 'John Smith', email: 'john@example.com', phone: '07700900123', date: '2024-12-20', time: '20:00', guests: 6, room: 'Disco Room', status: 'confirmed' },
    { id: '102', customerName: 'Alice Johnson', email: 'alice@example.com', phone: '07700900456', date: '2024-12-21', time: '19:00', guests: 12, room: 'VIP Suite', status: 'pending' }
];

const DATA_VERSION = '2.5'; // Bump this to reset local storage on updates

// --- Context ---

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- State Initialization Helper ---
  const init = <T,>(key: string, defaultVal: T): T => {
    // Check version
    const storedVersion = localStorage.getItem('lkc_data_version');
    if (storedVersion !== DATA_VERSION) {
        // If version mismatch, return default (and let the useEffect update storage later)
        return defaultVal;
    }

    const saved = localStorage.getItem(`lkc_${key}`);
    return saved ? JSON.parse(saved) : defaultVal;
  };

  // --- State ---
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
  const [dbConfig, setDbConfig] = useState<DatabaseConfig>(() => init('dbConfig', INITIAL_DB_CONFIG));
  const [songs, setSongs] = useState<Song[]>(() => init('songs', INITIAL_SONGS));
  const [bookings, setBookings] = useState<Booking[]>(() => init('bookings', INITIAL_BOOKINGS));

  // --- Persistence & Supabase Sync ---
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
      // Update Version
      localStorage.setItem('lkc_data_version', DATA_VERSION);
      
      // Init Supabase if config exists
      if (dbConfig.supabaseUrl && dbConfig.supabaseKey) {
          try {
              const client = createClient(dbConfig.supabaseUrl, dbConfig.supabaseKey);
              setSupabase(client);
          } catch (e) {
              console.error("Failed to init Supabase client", e);
          }
      }
  }, [dbConfig.supabaseUrl, dbConfig.supabaseKey]);

  // Generic Saver
  const persist = (key: string, data: any) => {
      localStorage.setItem(`lkc_${key}`, JSON.stringify(data));
      // Sync to Supabase if available (fire and forget)
      if (supabase && key !== 'dbConfig') { // Don't sync config to itself securely
          supabase.from('app_settings').upsert({ key, value: data }).then(({ error }: any) => {
              if (error) console.warn(`Supabase sync error for ${key}:`, error.message);
          });
      }
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
  useEffect(() => { persist('dbConfig', dbConfig); }, [dbConfig]);
  useEffect(() => { persist('songs', songs); }, [songs]);
  useEffect(() => { persist('bookings', bookings); }, [bookings]);

  // --- Reset ---
  const resetToDefaults = () => {
      if (confirm("Reset all data to defaults? This cannot be undone.")) {
          localStorage.clear();
          window.location.reload();
      }
  };

  // --- Supabase Helpers ---
  const uploadToSupabase = async (file: Blob | File, path: string, bucket: string = dbConfig.storageBucket || 'iii'): Promise<string | null> => {
      if (!supabase) {
          console.warn("Supabase not configured");
          return null;
      }
      try {
          const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
              upsert: true
          });
          if (error) throw error;
          
          const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(path);
          return publicUrlData.publicUrl;
      } catch (e) {
          console.error("Upload failed", e);
          return null;
      }
  };

  const fetchSupabaseFiles = async (bucket: string = dbConfig.storageBucket || 'iii', folder: string = ''): Promise<{name: string, url: string}[]> => {
      if (!supabase) return [];
      try {
          const { data, error } = await supabase.storage.from(bucket).list(folder, {
              limit: 100,
              offset: 0,
              sortBy: { column: 'name', order: 'desc' },
          });
          if (error) throw error;
          
          return data.map((file: any) => {
              const path = folder ? `${folder}/${file.name}` : file.name;
              const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(path);
              return {
                  name: file.name,
                  url: publicUrlData.publicUrl
              };
          });
      } catch (e) {
          console.error("List files failed", e);
          return [];
      }
  };

  const deleteSupabaseFile = async (path: string, bucket: string = dbConfig.storageBucket || 'iii'): Promise<boolean> => {
      if (!supabase) return false;
      try {
          const { error } = await supabase.storage.from(bucket).remove([path]);
          if (error) throw error;
          return true;
      } catch (e) {
          console.error("Delete failed", e);
          return false;
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
      dbConfig, updateDbConfig: setDbConfig,
      songs, updateSongs: setSongs,
      bookings, updateBookings: setBookings,
      resetToDefaults,
      uploadToSupabase,
      fetchSupabaseFiles,
      deleteSupabaseFile
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
