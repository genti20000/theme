
export type Page = 'home' | 'menu' | 'drinks' | 'gallery' | 'imageEditor' | 'admin' | 'terms' | 'songs' | 'events' | 'blog' | 'instagram' | 'sitemap';

export type NavItem = {
  label: string;
  href: Page | string;
  section: "Explore" | "Book" | "Events" | "LKC" | "Legal" | "Connect";
  external?: boolean;
};

export const SUMUP_BOOKING_URL = "https://www.sumupbookings.com/londonkaraokeclub";
export const WHATSAPP_URL = "https://wa.me/447761383514?text=Hi!%20I'd%20like%20to%20make%20a%20booking%20🎤";

export const NAV: NavItem[] = [
  // Explore
  { label: "Home", href: "home", section: "Explore" },
  { label: "Gallery", href: "gallery", section: "Explore" },
  { label: "Blog", href: "blog", section: "Explore" },
  { label: "Food Menu", href: "menu", section: "Explore" },
  { label: "Drinks Menu", href: "drinks", section: "Explore" },
  { label: "Songs", href: "songs", section: "Explore" },

  // Book
  { label: "Book a Room", href: SUMUP_BOOKING_URL, section: "Book", external: true },
  { label: "Special Offers", href: "home", section: "Book" }, // In-page anchor logic
  { label: "FAQs", href: "home", section: "Book" }, // In-page anchor logic

  // Events
  { label: "Birthday Parties", href: "events", section: "Events" },
  { label: "Hen & Stag Dos", href: "events", section: "Events" },
  { label: "Corporate Events", href: "events", section: "Events" },

  // LKC
  { label: "About Us", href: "home", section: "LKC" },
  { label: "Contact & Location", href: "home", section: "LKC" },
  { label: "Careers", href: "home", section: "LKC" },
  { label: "Sitemap", href: "sitemap", section: "LKC" },

  // Legal
  { label: "Privacy Policy", href: "terms", section: "Legal" },
  { label: "Terms of Use", href: "terms", section: "Legal" },
  { label: "Booking Policy", href: "terms", section: "Legal" },
  { label: "Legal", href: "terms", section: "Legal" },

  // Connect
  { label: "WhatsApp", href: WHATSAPP_URL, section: "Connect", external: true },
  { label: "Instagram", href: "https://instagram.com/londonkaraoke.club", section: "Connect", external: true },
  { label: "TikTok", href: "https://tiktok.com/@londonkaraoke.club", section: "Connect", external: true },
  { label: "Facebook", href: "https://facebook.com/londonkaraokeclub", section: "Connect", external: true },
];
