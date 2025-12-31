import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { 
  AppData, 
  DataContextType, 
  HeaderData, 
  HeroData, 
  HighlightsData, 
  FeaturesData, 
  VibeData, 
  BatteryData, 
  GalleryData, 
  BlogData, 
  FAQData, 
  DrinksData, 
  FirebaseConfig,
  TermItem,
  Song,
  TestimonialsData,
  InfoSectionData,
  EventsData
} from '../types';

// Initial data with proper typing
const INITIAL_SEO: HeaderData = { 
  logoUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,fit=crop,q=95/m7V3XokxQ0Hbg2KE/new-YNq2gqz36OInJMrE.png",
  siteTitle: "London Karaoke Club | Private Rooms Soho",
  siteDescription: "Luxury private karaoke booths in London Soho. 80,000+ songs, cocktails and more.",
  faviconUrl: "/favicon.svg",
  navOrder: ["menu", "gallery", "blog", "drinks", "events", "songs"],
  customScripts: { header: "", footer: "" }
};

const INITIAL_HERO: HeroData = { 
  backgroundImageUrl: "https://picsum.photos/seed/karaoke/1920/1080", 
  slides: ["https://picsum.photos/seed/lkc1/1920/1080", "https://picsum.photos/seed/lkc2/1920/1080"], 
  mobileSlides: [], 
  badgeText: "Winter Wonderland", 
  headingText: "Unleash Your Inner Star", 
  subText: "Luxury private suites in Soho.", 
  buttonText: "Book Now", 
  showBadge: true, 
  showButtons: true 
};

const INITIAL_HIGHLIGHTS: HighlightsData = { 
  enabled: true, 
  heading: "Get Loud.", 
  subtext: "Best karaoke in London.", 
  mainImageUrl: "https://picsum.photos/seed/party/1200/800", 
  featureListTitle: "Why LKC?", 
  featureList: ["Private Booths", "80k Songs", "Soho Location"], 
  sideImageUrl: "https://picsum.photos/seed/mic/500/500" 
};

const INITIAL_FEATURES: FeaturesData = {
  enabled: true,
  experience: { 
    label: "Experience", 
    heading: "Private Stage", 
    text: "Your own world.", 
    image: "https://picsum.photos/seed/room/1200/800" 
  },
  occasions: { 
    heading: "Every Occasion", 
    text: "Parties of all sizes.", 
    items: [{title: "Hen Parties", text: "Bubbles and songs."}] 
  },
  grid: { 
    heading: "Features", 
    items: [{id: "1", title: "Neon Lighting", description: "Vibrant vibes.", image: "https://picsum.photos/seed/neon/400/400"}] 
  }
};

const INITIAL_VIBE: VibeData = { 
  enabled: true, 
  label: "The Vibe", 
  heading: "Soho Nights", 
  text: "Join the energy.", 
  image1: "https://picsum.photos/seed/v1/500/500", 
  image2: "https://picsum.photos/seed/v2/500/500", 
  bigImage: "https://picsum.photos/seed/vb/1200/800", 
  bottomHeading: "Sing Hard", 
  bottomText: "Until 3AM." 
};

const INITIAL_STATS: BatteryData = { 
  enabled: true, 
  statPrefix: "Over", 
  statNumber: "80K", 
  statSuffix: "Songs", 
  subText: "Updated daily." 
};

const INITIAL_GALLERY: GalleryData = { 
  heading: "Gallery", 
  subtext: "Moments from Soho", 
  images: [{id: '1', url: 'https://picsum.photos/seed/g1/800/800', caption: 'LKC Party'}], 
  showOnHome: false 
};

const INITIAL_BLOG: BlogData = { 
  heading: "LKC Stories", 
  subtext: "News and events.", 
  posts: [{id: '1', title: 'Welcome', date: '2024-01-01', excerpt: 'Site launched.', content: 'Welcome to LKC.', imageUrl: 'https://picsum.photos/seed/blog/800/600'}] 
};

const INITIAL_FAQ: FAQData = { 
  enabled: true, 
  heading: "FAQ", 
  subtext: "Questions?", 
  items: [{id: "1", question: "Where is it?", answer: "Soho, London."}] 
};

const INITIAL_DRINKS: DrinksData = {
  headerImageUrl: "https://picsum.photos/seed/bar/1600/800",
  packagesData: { title: "Packages", subtitle: "Groups", items: [], notes: [] },
  bottleServiceData: [], 
  byTheGlassData: [], 
  shotsData: { title: "Shots", items: [], shooters: { title: "", prices: "", items: [] } },
  cocktailsData: [], 
  winesData: []
};

const INITIAL_TERMS: TermItem[] = [
  { title: "Age Restriction:", content: "– Our venue is strictly for guests aged 18 and over." },
  { title: "Booking Times:", content: "– All guests must vacate the premises no later than closing time." }
];

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state with proper typing
  const [headerData, setHeaderData] = useState<HeaderData>(() => getStoredData('headerData', INITIAL_SEO));
  const [heroData, setHeroData] = useState<HeroData>(() => getStoredData('heroData', INITIAL_HERO));
  const [highlightsData, setHighlightsData] = useState<HighlightsData>(() => getStoredData('highlightsData', INITIAL_HIGHLIGHTS));
  const [featuresData, setFeaturesData] = useState<FeaturesData>(() => getStoredData('featuresData', INITIAL_FEATURES));
  const [vibeData, setVibeData] = useState<VibeData>(() => getStoredData('vibeData', INITIAL_VIBE));
  const [batteryData, setBatteryData] = useState<BatteryData>(() => getStoredData('batteryData', INITIAL_STATS));
  const [galleryData, setGalleryData] = useState<GalleryData>(() => getStoredData('galleryData', INITIAL_GALLERY));
  const [blogData, setBlogData] = useState<BlogData>(() => getStoredData('blogData', INITIAL_BLOG));
  const [faqData, setFaqData] = useState<FAQData>(() => getStoredData('faqData', INITIAL_FAQ));
  const [drinksData, setDrinksData] = useState<DrinksData>(() => getStoredData('drinksData', INITIAL_DRINKS));
  const [foodMenu, setFoodMenu] = useState<{category: string; description?: string; items: {name: string; description: string; price: string; note?: string}[]}[]>(() => getStoredData('foodMenu', []));
  const [testimonialsData, setTestimonialsData] = useState<TestimonialsData>(() => getStoredData('testimonialsData', { enabled: true, heading: "Loved", subtext: "Reviews from around the web.", items: [] }));
  const [infoSectionData, setInfoSectionData] = useState<InfoSectionData>(() => getStoredData('infoSectionData', { enabled: true, heading: "Private Karaoke in Soho", sections: [], footerTitle: "Ready?", footerText: "Plan your night.", footerHighlight: "No chains, just LKC." }));
  const [eventsData, setEventsData] = useState<EventsData>(() => getStoredData('eventsData', { hero: { title: "Epic Events", subtitle: "Private bookings in Soho.", image: "https://picsum.photos/seed/eventhero/1600/800" }, sections: [] }));
  const [termsData, setTermsData] = useState<TermItem[]>(() => getStoredData('termsData', INITIAL_TERMS));
  const [songs, setSongs] = useState<Song[]>(() => getStoredData('songs', []));
  const [adminPassword, setAdminPassword] = useState<string>(() => getStoredData('adminPassword', ''));
  const [syncUrl, setSyncUrl] = useState<string>(() => getStoredData('syncUrl', 'https://files.londonkaraoke.club/db.php'));
  const [firebaseConfig, setFirebaseConfig] = useState<FirebaseConfig>(() => getStoredData('firebaseConfig', { databaseURL: '', apiKey: '' }));
  const [footerData, setFooterData] = useState<{ctaHeading: string; ctaText: string; ctaButtonText: string}>(() => getStoredData('footerData', { ctaHeading: "Ready?", ctaText: "Book now.", ctaButtonText: "Book" }));
  const [isDataLoading, setIsDataLoading] = useState(false);

  // Helper function to safely get data from localStorage
  function getStoredData<T>(key: string, defaultValue: T): T {
    try {
      const saved = localStorage.getItem(`lkc_${key}`);
      if (!saved) return defaultValue;
      return JSON.parse(saved);
    } catch (e) {
      console.error(`Error parsing ${key} from localStorage:`, e);
      return defaultValue;
    }
  }

  // Helper function to safely store data to localStorage
  const persist = useCallback((key: string, data: any) => {
    try {
      localStorage.setItem(`lkc_${key}`, JSON.stringify(data));
    } catch (e) {
      console.error(`Error storing ${key} to localStorage:`, e);
    }
  }, []);

  // Update document head when header data changes
  useEffect(() => {
    document.title = headerData.siteTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', headerData.siteDescription);
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) favicon.setAttribute('href', headerData.faviconUrl);
  }, [headerData]);

  // Persist data to localStorage when it changes
  useEffect(() => { persist('headerData', headerData); }, [headerData, persist]);
  useEffect(() => { persist('heroData', heroData); }, [heroData, persist]);
  useEffect(() => { persist('highlightsData', highlightsData); }, [highlightsData, persist]);
  useEffect(() => { persist('featuresData', featuresData); }, [featuresData, persist]);
  useEffect(() => { persist('vibeData', vibeData); }, [vibeData, persist]);
  useEffect(() => { persist('batteryData', batteryData); }, [batteryData, persist]);
  useEffect(() => { persist('galleryData', galleryData); }, [galleryData, persist]);
  useEffect(() => { persist('blogData', blogData); }, [blogData, persist]);
  useEffect(() => { persist('faqData', faqData); }, [faqData, persist]);
  useEffect(() => { persist('drinksData', drinksData); }, [drinksData, persist]);
  useEffect(() => { persist('foodMenu', foodMenu); }, [foodMenu, persist]);
  useEffect(() => { persist('testimonialsData', testimonialsData); }, [testimonialsData, persist]);
  useEffect(() => { persist('infoSectionData', infoSectionData); }, [infoSectionData, persist]);
  useEffect(() => { persist('eventsData', eventsData); }, [eventsData, persist]);
  useEffect(() => { persist('termsData', termsData); }, [termsData, persist]);
  useEffect(() => { persist('songs', songs); }, [songs, persist]);
  useEffect(() => { persist('adminPassword', adminPassword); }, [adminPassword, persist]);
  useEffect(() => { persist('syncUrl', syncUrl); }, [syncUrl, persist]);
  useEffect(() => { persist('firebaseConfig', firebaseConfig); }, [firebaseConfig, persist]);

  // Data update functions
  const updateHeaderData = useCallback((data: HeaderData) => setHeaderData(data), []);
  const updateHeroData = useCallback((data: HeroData) => setHeroData(data), []);
  const updateHighlightsData = useCallback((data: HighlightsData) => setHighlightsData(data), []);
  const updateFeaturesData = useCallback((data: FeaturesData) => setFeaturesData(data), []);
  const updateVibeData = useCallback((data: VibeData) => setVibeData(data), []);
  const updateBatteryData = useCallback((data: BatteryData) => setBatteryData(data), []);
  const updateGalleryData = useCallback((data: GalleryData) => setGalleryData(data), []);
  const updateBlogData = useCallback((data: BlogData) => setBlogData(data), []);
  const updateFaqData = useCallback((data: FAQData) => setFaqData(data), []);
  const updateDrinksData = useCallback((data: DrinksData) => setDrinksData(data), []);
  const updateFoodMenu = useCallback((data: {category: string; description?: string; items: {name: string; description: string; price: string; note?: string}[]}[]) => setFoodMenu(data), []);
  const updateTestimonialsData = useCallback((data: TestimonialsData) => setTestimonialsData(data), []);
  const updateInfoSectionData = useCallback((data: InfoSectionData) => setInfoSectionData(data), []);
  const updateEventsData = useCallback((data: EventsData) => setEventsData(data), []);
  const updateTermsData = useCallback((data: TermItem[]) => setTermsData(data), []);
  const updateSongs = useCallback((data: Song[]) => setSongs(data), []);
  const updateAdminPassword = useCallback((password: string) => setAdminPassword(password), []);
  const updateSyncUrl = useCallback((url: string) => setSyncUrl(url), []);
  const updateFirebaseConfig = useCallback((config: FirebaseConfig) => setFirebaseConfig(config), []);

  // Utility functions
  const exportDatabase = useCallback((): string => {
    return JSON.stringify({ 
      headerData, heroData, highlightsData, featuresData, vibeData, batteryData, 
      galleryData, blogData, faqData, drinksData, foodMenu, testimonialsData, 
      infoSectionData, eventsData, termsData, songs, adminPassword, version: "6.0" 
    }, null, 2);
  }, [headerData, heroData, highlightsData, featuresData, vibeData, batteryData, 
      galleryData, blogData, faqData, drinksData, foodMenu, testimonialsData, 
      infoSectionData, eventsData, termsData, songs, adminPassword]);

  const importDatabase = useCallback((json: any): boolean => {
    try {
      const data = typeof json === 'string' ? JSON.parse(json) : json;
      if (data.headerData) setHeaderData(data.headerData);
      if (data.heroData) setHeroData(data.heroData);
      if (data.highlightsData) setHighlightsData(data.highlightsData);
      if (data.featuresData) setFeaturesData(data.featuresData);
      if (data.vibeData) setVibeData(data.vibeData);
      if (data.batteryData) setBatteryData(data.batteryData);
      if (data.galleryData) setGalleryData(data.galleryData);
      if (data.blogData) setBlogData(data.blogData);
      if (data.faqData) setFaqData(data.faqData);
      if (data.drinksData) setDrinksData(data.drinksData);
      if (data.foodMenu) setFoodMenu(data.foodMenu);
      if (data.testimonialsData) setTestimonialsData(data.testimonialsData);
      if (data.infoSectionData) setInfoSectionData(data.infoSectionData);
      if (data.termsData) setTermsData(data.termsData);
      if (data.songs) setSongs(data.songs);
      return true;
    } catch (e) {
      console.error("Error importing database:", e);
      return false;
    }
  }, []);

  const saveToFirebase = useCallback(async () => {
    if (!firebaseConfig.databaseURL) {
      console.error("Firebase URL not configured");
      return;
    }
    
    setIsDataLoading(true);
    try {
      const url = `${firebaseConfig.databaseURL.replace(/\/$/, '')}/site.json`;
      const response = await fetch(url, { 
        method: 'PUT', 
        body: exportDatabase(),
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      console.log("Firebase Sync Successful!");
    } catch (e) {
      console.error("Firebase Error:", e);
    } finally {
      setIsDataLoading(false);
    }
  }, [firebaseConfig.databaseURL, exportDatabase]);

  const loadFromFirebase = useCallback(async () => {
    if (!firebaseConfig.databaseURL) return;
    
    setIsDataLoading(true);
    try {
      const url = `${firebaseConfig.databaseURL.replace(/\/$/, '')}/site.json`;
      const response = await fetch(url);
      const data = await response.json();
      if (data) importDatabase(data);
    } catch (e) {
      console.error("Error loading from Firebase:", e);
    } finally {
      setIsDataLoading(false);
    }
  }, [firebaseConfig.databaseURL, importDatabase]);

  const saveToHostinger = useCallback(async () => {
    if (!syncUrl) {
      console.error("Sync URL not configured");
      return;
    }
    
    setIsDataLoading(true);
    try {
      const response = await fetch(syncUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminPassword}`
        },
        body: exportDatabase()
      });
      
      const res = await response.json();
      if (res.success) {
        console.log("Hostinger Sync Successful!");
      } else {
        console.error("Hostinger Sync Error:", res);
      }
    } catch (e) {
      console.error("Hostinger Sync Error:", e);
    } finally {
      setIsDataLoading(false);
    }
  }, [syncUrl, adminPassword, exportDatabase]);

  const loadFromHostinger = useCallback(async () => {
    if (!syncUrl) return;
    
    setIsDataLoading(true);
    try {
      const response = await fetch(syncUrl, { 
        headers: { 'Authorization': `Bearer ${adminPassword}` } 
      });
      const data = await response.json();
      if (data && !data.error) importDatabase(data);
    } catch (e) {
      console.error("Error loading from Hostinger:", e);
    } finally {
      setIsDataLoading(false);
    }
  }, [syncUrl, adminPassword, importDatabase]);

  const uploadFile = useCallback(async (file: Blob | File): Promise<string | null> => {
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
    } catch (e) {
      console.error("Error uploading file:", e);
      return null;
    } finally {
      setIsDataLoading(false);
    }
  }, [syncUrl, adminPassword]);

  const fetchServerFiles = useCallback(async (): Promise<{name: string, url: string}[]> => {
    if (!syncUrl) return [];
    try {
      const response = await fetch(`${syncUrl}?list=1`, {
        headers: { 'Authorization': `Bearer ${adminPassword}` }
      });
      const data = await response.json();
      if (data.success) return data.files;
      return [];
    } catch (e) {
      console.error("Error fetching server files:", e);
      return [];
    }
  }, [syncUrl, adminPassword]);

  const purgeCache = useCallback(() => {
    localStorage.clear();
    window.location.reload();
  }, []);

  // Load data from hostinger on initial load
  useEffect(() => {
    loadFromHostinger();
  }, [loadFromHostinger]);

  return (
    <DataContext.Provider value={{
      // Data
      foodMenu,
      drinksData,
      headerData,
      heroData,
      highlightsData,
      featuresData,
      vibeData,
      batteryData,
      footerData,
      galleryData,
      blogData,
      testimonialsData,
      infoSectionData,
      faqData,
      eventsData,
      termsData,
      songs,
      adminPassword,
      syncUrl,
      firebaseConfig,
      
      // Update functions
      updateFoodMenu,
      updateDrinksData,
      updateHeaderData,
      updateHeroData,
      updateHighlightsData,
      updateFeaturesData,
      updateVibeData,
      updateBatteryData,
      updateFooterData: setFooterData,
      updateGalleryData,
      updateBlogData,
      updateTestimonialsData,
      updateInfoSectionData,
      updateFaqData,
      updateEventsData,
      updateTermsData,
      updateSongs,
      updateAdminPassword,
      updateSyncUrl,
      updateFirebaseConfig,
      
      // Utility functions
      isDataLoading,
      purgeCache,
      importDatabase,
      exportDatabase,
      saveToHostinger,
      loadFromHostinger,
      saveToFirebase,
      loadFromFirebase,
      uploadFile,
      fetchServerFiles
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};