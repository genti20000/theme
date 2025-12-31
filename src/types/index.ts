// Improved type definitions for the London Karaoke Club site

export interface MenuItem {
  id?: string;
  name: string;
  description: string;
  price: string;
  note?: string;
}

export interface MenuCategory {
  id?: string;
  category: string;
  description?: string;
  items: MenuItem[];
}

export interface DrinkItem {
  id?: string;
  name: string;
  price: string | { single?: string; double?: string };
  description?: string;
  note?: string;
}

export interface DrinkCategory {
  id?: string;
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

export interface HeaderData {
  logoUrl: string;
  siteTitle: string;
  siteDescription: string;
  faviconUrl: string;
  navOrder: string[];
  customScripts?: {
    header?: string;
    footer?: string;
  };
}

export interface HeroData {
  backgroundImageUrl: string;
  slides: string[];
  mobileSlides?: string[];
  badgeText: string;
  headingText: string;
  subText: string;
  buttonText: string;
  showBadge?: boolean;
  showButtons?: boolean;
}

export interface HighlightsData {
  enabled?: boolean;
  heading: string;
  subtext: string;
  mainImageUrl: string;
  mobileMainImageUrl?: string;
  featureListTitle: string;
  featureList: string[];
  sideImageUrl: string;
}

export interface FeaturesData {
  enabled?: boolean;
  experience: {
    label: string;
    heading: string;
    text: string;
    image: string;
    mobileImage?: string;
  };
  occasions: {
    heading: string;
    text: string;
    items: {
      title: string;
      text: string;
    }[];
  };
  grid: {
    heading: string;
    items: {
      id?: string;
      title: string;
      description: string;
      image: string;
    }[];
  };
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

export interface BatteryData {
  enabled?: boolean;
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

export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
}

export interface GalleryData {
  heading: string;
  subtext: string;
  images: GalleryImage[];
  videos?: any[];
  showOnHome?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  imageUrl: string;
}

export interface BlogData {
  heading: string;
  subtext: string;
  posts: BlogPost[];
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  genre?: string;
  fileUrl?: string;
}

export interface TestimonialItem {
  id?: string;
  quote: string;
  name: string;
  avatar: string;
  rating?: number;
  date?: string;
}

export interface TestimonialsData {
  enabled?: boolean;
  heading: string;
  subtext: string;
  items: TestimonialItem[];
}

export interface InfoSectionData {
  enabled?: boolean;
  heading: string;
  sections: {
    title: string;
    content: string;
    color?: string;
  }[];
  footerTitle: string;
  footerText: string;
  footerHighlight: string;
}

export interface FAQItem {
  id?: string;
  question: string;
  answer: string;
}

export interface FAQData {
  enabled?: boolean;
  heading: string;
  subtext: string;
  items: FAQItem[];
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

export interface TermItem {
  title: string;
  content: string;
}

export interface FirebaseConfig {
  databaseURL: string;
  apiKey: string;
}

export interface AppData {
  foodMenu: MenuCategory[];
  drinksData: DrinksData;
  headerData: HeaderData;
  heroData: HeroData;
  highlightsData: HighlightsData;
  featuresData: FeaturesData;
  vibeData: VibeData;
  batteryData: BatteryData;
  footerData: FooterData;
  galleryData: GalleryData;
  blogData: BlogData;
  testimonialsData: TestimonialsData;
  infoSectionData: InfoSectionData;
  faqData: FAQData;
  eventsData: EventsData;
  termsData: TermItem[];
  songs: Song[];
  adminPassword: string;
  syncUrl: string;
  firebaseConfig: FirebaseConfig;
}

export interface DataContextType extends AppData {
  updateFoodMenu: (data: MenuCategory[]) => void;
  updateDrinksData: (data: DrinksData) => void;
  updateHeaderData: (data: HeaderData) => void;
  updateHeroData: (data: HeroData) => void;
  updateHighlightsData: (data: HighlightsData) => void;
  updateFeaturesData: (data: FeaturesData) => void;
  updateVibeData: (data: VibeData) => void;
  updateBatteryData: (data: BatteryData) => void;
  updateFooterData: (data: FooterData) => void;
  updateGalleryData: (data: GalleryData) => void;
  updateBlogData: (data: BlogData) => void;
  updateTestimonialsData: (data: TestimonialsData) => void;
  updateInfoSectionData: (data: InfoSectionData) => void;
  updateFaqData: (data: FAQData) => void;
  updateEventsData: (data: EventsData) => void;
  updateTermsData: (data: TermItem[]) => void;
  updateSongs: (data: Song[]) => void;
  updateAdminPassword: (password: string) => void;
  updateSyncUrl: (url: string) => void;
  updateFirebaseConfig: (config: FirebaseConfig) => void;
  isDataLoading: boolean;
  purgeCache: () => void;
  importDatabase: (json: any) => boolean;
  exportDatabase: () => string;
  saveToHostinger: () => Promise<void>;
  loadFromHostinger: () => Promise<void>;
  saveToFirebase: () => Promise<void>;
  loadFromFirebase: () => Promise<void>;
  uploadFile: (file: Blob | File) => Promise<string | null>;
  fetchServerFiles: () => Promise<{ name: string; url: string }[]>;
}

export type Page = 'home' | 'menu' | 'drinks' | 'gallery' | 'admin' | 'terms' | 'songs' | 'events' | 'blog';