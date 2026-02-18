
export type NavKey =
  | 'home'
  | 'menu'
  | 'drinks'
  | 'gallery'
  | 'blog'
  | 'events'
  | 'songs'
  | 'instagram'
  | 'sitemap'
  | 'faqs'
  | 'about'
  | 'contact'
  | 'careers'
  | 'privacy'
  | 'terms'
  | 'booking-policy'
  | 'special-offers';

export type NavItem = {
  label: string;
  href: string;
  section: "Explore" | "Book" | "Events" | "LKC" | "Legal" | "Connect";
  external?: boolean;
};

export const SUMUP_BOOKING_URL = "https://bookings.londonkaraoke.club";
export const WHATSAPP_URL = "https://wa.me/447761383514?text=Hi!%20I'd%20like%20to%20make%20a%20booking%20🎤";

export const ROUTES: Record<NavKey, string> = {
  home: "/",
  menu: "/food",
  drinks: "/drinks",
  gallery: "/gallery",
  blog: "/blog",
  events: "/events",
  songs: "/songs",
  instagram: "/instagram",
  sitemap: "/sitemap",
  faqs: "/faqs",
  about: "/about",
  contact: "/contact",
  careers: "/careers",
  privacy: "/privacy",
  terms: "/terms",
  "booking-policy": "/booking-policy",
  "special-offers": "/#special-offers",
};

export const NAV_LABELS: Record<NavKey, string> = {
  home: "Home",
  menu: "Food Menu",
  drinks: "Drinks Menu",
  gallery: "Gallery",
  blog: "Blog",
  events: "Events",
  songs: "Songs",
  instagram: "Instagram",
  sitemap: "Sitemap",
  faqs: "FAQs",
  about: "About Us",
  contact: "Contact & Location",
  careers: "Careers",
  privacy: "Privacy Policy",
  terms: "Terms of Use",
  "booking-policy": "Booking Policy",
  "special-offers": "Special Offers",
};

export const NAV: NavItem[] = [
  // Explore
  { label: "Home", href: ROUTES.home, section: "Explore" },
  { label: "Gallery", href: ROUTES.gallery, section: "Explore" },
  { label: "Blog", href: ROUTES.blog, section: "Explore" },
  { label: "Food Menu", href: ROUTES.menu, section: "Explore" },
  { label: "Drinks Menu", href: ROUTES.drinks, section: "Explore" },
  { label: "Songs", href: ROUTES.songs, section: "Explore" },

  // Book
  { label: "Book a Room", href: SUMUP_BOOKING_URL, section: "Book", external: true },
  { label: "Special Offers", href: ROUTES["special-offers"], section: "Book" },
  { label: "FAQs", href: ROUTES.faqs, section: "Book" },

  // Events
  { label: "Birthday Parties", href: ROUTES.events, section: "Events" },
  { label: "Hen & Stag Dos", href: ROUTES.events, section: "Events" },
  { label: "Corporate Events", href: ROUTES.events, section: "Events" },

  // LKC
  { label: "About Us", href: ROUTES.about, section: "LKC" },
  { label: "Contact & Location", href: ROUTES.contact, section: "LKC" },
  { label: "Careers", href: ROUTES.careers, section: "LKC" },
  { label: "Sitemap", href: ROUTES.sitemap, section: "LKC" },

  // Legal
  { label: "Privacy Policy", href: ROUTES.privacy, section: "Legal" },
  { label: "Terms of Use", href: ROUTES.terms, section: "Legal" },
  { label: "Booking Policy", href: ROUTES["booking-policy"], section: "Legal" },

  // Connect
  { label: "Live Support", href: WHATSAPP_URL, section: "Connect", external: true },
  { label: "Instagram", href: "https://instagram.com/londonkaraoke.club", section: "Connect", external: true },
  { label: "TikTok", href: "https://tiktok.com/@londonkaraoke.club", section: "Connect", external: true },
  { label: "Facebook", href: "https://facebook.com/londonkaraokeclub", section: "Connect", external: true },
];
