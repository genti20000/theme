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
export interface HeaderData { logoUrl: string; siteTitle: string; siteDescription: string; faviconUrl: string; }
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

export interface GalleryImage { id: string; url: string; caption: string; }
export interface GalleryData { heading: string; subtext: string; images: GalleryImage[]; videos?: any[]; }

export interface BlogPost { id: string; title: string; date: string; excerpt: string; content: string; imageUrl: string; }
export interface BlogData { heading: string; subtext: string; posts: BlogPost[]; }
export interface Song { id: string; title: string; artist: string; genre?: string; fileUrl?: string; }
export interface TestimonialItem { quote: string; name: string; avatar: string; rating?: number; date?: string; }
export interface TestimonialsData { heading: string; subtext: string; items: TestimonialItem[]; }

export interface InfoSectionData {
    heading: string;
    intro: string;
    sections: { title: string; content: string; color?: string; }[];
    footerTitle: string;
    footerText: string;
    footerHighlight: string;
}

export interface FAQItem { question: string; answer: string; }
export interface FAQData { heading: string; subtext: string; items: FAQItem[]; }

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
    siteDescription: "Luxury private karaoke booths in London Soho. 60,000+ songs, cocktails and more.",
    faviconUrl: "/favicon.svg"
};

const INITIAL_HERO: HeroData = { backgroundImageUrl: "https://picsum.photos/seed/karaoke/1920/1080", slides: ["https://picsum.photos/seed/lkc1/1920/1080", "https://picsum.photos/seed/lkc2/1920/1080"], badgeText: "Winter Wonderland", headingText: "Unleash Your Inner Star", subText: "Luxury private suites in Soho.", buttonText: "Book Now" };
const INITIAL_HIGHLIGHTS: HighlightsData = { heading: "Get Loud.", subtext: "The ultimate private karaoke experience in London Soho. High-end systems, plush decor, and enough energy to power the city.", mainImageUrl: "https://picsum.photos/seed/party/1200/800", featureListTitle: "Why LKC?", featureList: ["Private Soho Suites", "60,000+ Songs", "Premium Cocktail Bar", "Full Table Service"], sideImageUrl: "https://picsum.photos/seed/mic/500/500" };
const INITIAL_FEATURES: FeaturesData = {
    experience: { label: "The Experience", heading: "Your Private Stage", text: "We're not a box. We're a world. Every room at LKC is individually designed with top-tier sound and neon aesthetics to make every song feel like a concert.", image: "https://picsum.photos/seed/room/1200/800" },
    occasions: { heading: "Every Occasion", text: "Whether it's a birthday, a corporate team build, or just a Tuesday night out, we have the space and the spirit.", items: [{title: "Hen & Stag Parties", text: "Prosecco packages, dedicated hosts, and your favorite anthems."}, {title: "Corporate Events", text: "Impress the team with something better than a pub quiz."}, {title: "Birthdays", text: "The perfect destination to celebrate another trip around the sun."}] },
    grid: { heading: "The LKC Vibe", items: [{title: "Massive Library", description: "60,000+ songs in every language and genre.", image: "https://picsum.photos/seed/library/400/400"}, {title: "Neon Soho", description: "Vibrant lighting that follows your voice.", image: "https://picsum.photos/seed/neon/400/400"}, {title: "Signature Drinks", description: "Artisan cocktails delivered to your door.", image: "https://picsum.photos/seed/cocktail/400/400"}] }
};
const INITIAL_VIBE: VibeData = { label: "The Vibe", heading: "Soho Nights", text: "When the sun goes down, the volume goes up. Join the energy of London's most iconic party district.", image1: "https://picsum.photos/seed/v1/500/500", image2: "https://picsum.photos/seed/v2/500/500", bigImage: "https://picsum.photos/seed/vb/1200/800", bottomHeading: "SING IT LOUD", bottomText: "Open until 3AM daily for those who aren't ready to call it a night." };
const INITIAL_STATS: BatteryData = { statPrefix: "Over", statNumber: "60K", statSuffix: "Songs", subText: "Updated daily with the latest chart-toppers." };
const INITIAL_GALLERY: GalleryData = { heading: "Gallery", subtext: "Moments from the heart of Soho.", images: [{id: '1', url: 'https://picsum.photos/seed/g1/800/800', caption: 'Karaoke Room 1'}] };

const INITIAL_DRINKS: DrinksData = {
    headerImageUrl: "https://picsum.photos/seed/bar/1600/800",
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
    winesData: [
        {
            category: "Wine & Bubbles",
            items: [
                { name: "House White/Red/Rose", price: { "175ml": "7.50", "250ml": "9.50", "Btl": "28.00" }, description: "Pinot Grigio / Merlot / Pinot Blush" },
                { name: "Prosecco DOC", price: { "Btl": "38.00" }, description: "Extra Dry, Italy" },
                { name: "Moët & Chandon Brut", price: { "Btl": "95.00" }, description: "Champagne, France" },
                { name: "Veuve Clicquot Yellow Label", price: { "Btl": "110.00" }, description: "Champagne, France" },
                { name: "Laurent-Perrier Rosé", price: { "Btl": "160.00" }, description: "Champagne, France" }
            ]
        }
    ],
    bottleServiceData: [
        {
            category: "Vodka",
            items: [
                { name: "Absolut Blue", price: "£140" },
                { name: "Ciroc (Flavours)", price: "£170" },
                { name: "Grey Goose", price: "£180" },
                { name: "Belvedere", price: "£185" }
            ]
        },
        {
            category: "Gin",
            items: [
                { name: "Beefeater", price: "£140" },
                { name: "Bombay Sapphire", price: "£150" },
                { name: "Hendrick's", price: "£160" },
                { name: "Tanqueray 10", price: "£175" }
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

const INITIAL_INFO: InfoSectionData = {
    heading: "Private Karaoke in Soho | London Karaoke Club",
    intro: "Welcome to London Karaoke Club, Soho’s premier destination for private karaoke, open daily from 2pm to 3am. Steps from Oxford Street, Bond Street, Tottenham Court Road, and minutes from London Bridge, Victoria, Marylebone, and the West End, we’re at the heart of London’s nightlife.\n\nSay goodbye to chain karaoke’s claustrophobic, padded boxes. Our entire private spaces with dedicated private entrances host groups of 10 to 50+ for hen dos, birthdays, weddings, or corporate events, delivering 60,000+ songs through studio-quality sound equipment. Advance prebooking is essential—no walk-ins allowed. Prebook your private karaoke night and sing until 3am in Soho’s open, electric spaces!",
    sections: [
        { 
            title: "No Boxes, Just Epic Sound", 
            content: "We’re not a franchise. No imprisoned, padded rooms or lifeless playlists. Our entire private spaces are your personal club: velvet drapes, fairy lights, open layouts, and studio-quality sound equipment that delivers crystal-clear audio, outshining most London venues. With 60,000+ songs, guests use the Remote Controller to browse via smartphones and add tracks to the Queue. Customize with Custom Key & Tempo, tweak Customizable Vocals for lead or backup, and enjoy 400+ new songs monthly via Daily Updates. Explore our song catalogue for 10 to 50+ guests in a vibrant, unconfined space, secured by prebooking.", 
            color: "pink-500" 
        },
        { 
            title: "Soho’s Premier Locations", 
            content: "Our venues are Soho’s pulse, surrounded by Mayfair, Marylebone, and the West End. Hidden in plain sight, our spaces open into electric, open areas with private entrances, perfect for groups of 10 to 50+. Open 2pm to 3am daily, we outlast competitors, hosting late-night cast parties, tour wrap-ups, or work celebrations. Prebook in advance—no walk-ins ensures your exclusive space. Our 5-star service delivers better value than pricy chains, and if you’re lost, we’ll guide you to your private entrance.", 
            color: "white" 
        },
        { 
            title: "Gourmet Treats, Vibrant Nights", 
            content: "Indulge in delicious sharing platters, gourmet snacks, and reasonably priced cocktails, crafted for groups of 10 to 50+ at hen parties, birthdays, or corporate events. Our menu, paired with studio-quality sound in open spaces, elevates your late-night karaoke until 3am. See our event packages to plan a prebooked night that surpasses Soho’s boxed venues.", 
            color: "white" 
        }
    ],
    footerTitle: "Prebook Your Exclusive Space",
    footerText: "Advance prebooking is required—no walk-ins allowed, ensuring your group of 10 to 50+ enjoys an exclusive, open space with a private entrance Soho venues. Use our instant online booking or WhatsApp for tailored planning. Open 2pm to 3am daily, we deliver flawless execution. Missing a song? Contact us to add it!",
    footerHighlight: "Prebook Now | Plan via WhatsApp. No chains, no boxes—just your private, spectacular night in Soho."
};

const INITIAL_FAQ: FAQData = { 
    heading: "Common Questions", 
    subtext: "Everything you need to know before you sing your heart out.", 
    items: [
        { question: "Do you accept walk-ins?", answer: "No, we operate on a pre-booking basis only. Advance prebooking is required—no walk-ins allowed, ensuring your group enjoys an exclusive space." },
        { question: "What are your opening hours?", answer: "We are open daily from 2pm until 3am, outlasting most competitors in the Soho area." },
        { question: "Where are you located?", answer: "We are at the heart of London’s nightlife in Soho, steps from Oxford Street, Bond Street, Tottenham Court Road, and minutes from the West End." },
        { question: "How many songs do you have?", answer: "We deliver 60,000+ songs through studio-quality sound equipment, with 400+ new songs added monthly via Daily Updates." },
        { question: "What size groups can you host?", answer: "Our private spaces with dedicated private entrances host groups of 10 to 50+ for hen dos, birthdays, weddings, or corporate events." },
        { question: "Can I customize the sound?", answer: "Yes! Guests use a Remote Controller via smartphones to add tracks, customize key and tempo, and even tweak vocals for lead or backup." }
    ] 
};

const INITIAL_TERMS: TermItem[] = [
    { title: "Age Restriction:", content: "– Our venue is strictly for guests aged 18 and over. Valid physical ID is required for entry." },
    { title: "Booking Times:", content: "– All guests must vacate the premises no later than closing time. Prebooking required 24hrs in advance for packages." }
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
    const [blogData, setBlogData] = useState<BlogData>(() => init('blogData', { heading: "LKC Stories", subtext: "News and events from Soho.", posts: [] }));
    const [faqData, setFaqData] = useState<FAQData>(() => init('faqData', INITIAL_FAQ));
    const [drinksData, setDrinksData] = useState<DrinksData>(() => init('drinksData', INITIAL_DRINKS));
    const [foodMenu, setFoodMenu] = useState<MenuCategory[]>(() => init('foodMenu', [{category: "Sharing Platters", items: [{name: "Party Platter", description: "Mini sliders, wings, and fries.", price: "25.00"}]} ]));
    const [testimonialsData, setTestimonialsData] = useState<TestimonialsData>(() => init('testimonialsData', { heading: "Loved on Google", subtext: "Real reviews from our Soho regulars.", items: [{name: "Sarah W.", quote: "Best night in Soho! The cocktails are incredible.", avatar: "", rating: 5, date: "2 days ago"}] }));
    const [infoSectionData, setInfoSectionData] = useState<InfoSectionData>(() => init('infoSectionData', INITIAL_INFO));
    const [eventsData, setEventsData] = useState<EventsData>(() => init('eventsData', { hero: { title: "Epic Events", subtitle: "Private bookings in Soho.", image: "https://picsum.photos/seed/eventhero/1600/800" }, sections: [] }));
    const [termsData, setTermsData] = useState<TermItem[]>(() => init('termsData', INITIAL_TERMS));
    const [songs, setSongs] = useState<Song[]>(() => init('songs', []));
    const [adminPassword, setAdminPassword] = useState<string>(() => init('adminPassword', 'admin123'));
    const [syncUrl, setSyncUrl] = useState<string>(() => init('syncUrl', 'https://files.londonkaraoke.club/db.php'));
    const [firebaseConfig, setFirebaseConfig] = useState<FirebaseConfig>(() => init('firebaseConfig', { databaseURL: '', apiKey: '' }));
    const [footerData, setFooterData] = useState<FooterData>(() => init('footerData', { ctaHeading: "Ready to sing?", ctaText: "Check availability and book your room online. Advance booking only.", ctaButtonText: "Book Now" }));
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
        infoSectionData, eventsData, termsData, songs, adminPassword, version: "5.5" 
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
