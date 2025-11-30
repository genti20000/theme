

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

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
}

// --- Initial Data ---

const INITIAL_HEADER_DATA: HeaderData = {
    logoUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,fit=crop,q=95/m7V3XokxQ0Hbg2KE/new-YNq2gqz36OInJMrE.png"
};

const INITIAL_HERO_DATA: HeroData = {
    backgroundImageUrl: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1024,fit=crop/m7V3XokxQ0Hbg2KE/london-karaoke-club-header-mv0WRlry1ahM56NV.png",
    slides: [
        "https://images.unsplash.com/photo-1543589077-47d81606c1bf?q=80&w=1920&auto=format&fit=crop", 
        "https://images.unsplash.com/photo-1516450360452-631d408d8495?q=80&w=1920&auto=format&fit=crop", 
        "https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=1920&auto=format&fit=crop", 
        "https://images.unsplash.com/photo-1513297887119-d46091b24bfa?q=80&w=1920&auto=format&fit=crop", 
        "https://images.unsplash.com/photo-1576692828388-75e921867175?q=80&w=1920&auto=format&fit=crop", 
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1920&auto=format&fit=crop", 
        "https://images.unsplash.com/photo-1525268323886-2818bc24d2bd?q=80&w=1920&auto=format&fit=crop", 
        "https://images.unsplash.com/photo-1572569766952-b6736780c354?q=80&w=1920&auto=format&fit=crop", 
        "https://images.unsplash.com/photo-1506157786151-c8c3bc666f40?q=80&w=1920&auto=format&fit=crop",  
        "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1920&auto=format&fit=crop", 
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1920&auto=format&fit=crop"  
    ],
    badgeText: "Winter Wonderland Karaoke",
    headingText: "Unleash Your Inner Star",
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
        thumbnail: 'https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?q=80&w=800', 
        title: 'Saturday Night Vibes' 
    },
    { 
        id: '2', 
        url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', 
        thumbnail: 'https://images.unsplash.com/photo-1516450360452-631d408d8495?q=80&w=800', 
        title: 'Private Room Experience' 
    }
  ]
};

const INITIAL_DB_CONFIG: DatabaseConfig = {
  host: "localhost",
  user: "root",
  pass: "",
  name: "london_karaoke_db",
  uploadScriptUrl: "https://londonkaraoke.club/upload.php",
  photoFolder: "uploads/photos/",
  videoFolder: "uploads/videos/"
};

const INITIAL_SONGS: Song[] = [
    { id: '1', title: 'Bohemian Rhapsody', artist: 'Queen', genre: 'Rock', language: 'English' },
    { id: '2', title: 'I Will Survive', artist: 'Gloria Gaynor', genre: 'Disco', language: 'English' },
    { id: '3', title: 'Sweet Caroline', artist: 'Neil Diamond', genre: 'Pop', language: 'English' },
    { id: '4', title: 'Mr. Brightside', artist: 'The Killers', genre: 'Indie Rock', language: 'English' },
    { id: '5', title: 'Dancing Queen', artist: 'ABBA', genre: 'Pop', language: 'English' },
    { id: '6', title: 'Don\'t Stop Believin\'', artist: 'Journey', genre: 'Rock', language: 'English' },
    { id: '7', title: 'Wannabe', artist: 'Spice Girls', genre: 'Pop', language: 'English' },
    { id: '8', title: 'Wonderwall', artist: 'Oasis', genre: 'Britpop', language: 'English' },
    { id: '9', title: 'Shape of You', artist: 'Ed Sheeran', genre: 'Pop', language: 'English' },
    { id: '10', title: 'Rolling in the Deep', artist: 'Adele', genre: 'Pop', language: 'English' },
];

const INITIAL_BOOKINGS: Booking[] = [
    { id: '1', customerName: 'Alice Smith', email: 'alice@example.com', phone: '07700900123', date: '2023-12-24', time: '20:00', guests: 10, room: 'Room 1 (The Stage)', status: 'confirmed' },
    { id: '2', customerName: 'Bob Jones', email: 'bob@example.com', phone: '07700900456', date: '2023-12-25', time: '18:00', guests: 6, room: 'Room 3 (Neon Den)', status: 'pending' },
];

const INITIAL_FOOD_MENU: MenuCategory[] = [
  {
    category: 'Small Plates',
    items: [
      { name: 'Octopus Roll', description: 'Guacamole, brioche bread, spicy mayonnaise', price: '25' },
      { name: 'Mediterranean Platter (V)', description: 'Grilled pita, feta, olives, hummus, red pepper & aubergine relish', price: '11', note: 'Vegan option available' },
      { name: 'Tomato, Basil & Mozzarella Bruschetta (V)', description: 'Toasted bread, fresh tomatoes, mozzarella, basil pesto, olive oil', price: '11' },
      { name: 'Calamari', description: 'Lightly buttered salt and pepper squid, served with tartar sauce', price: '14' },
      { name: 'Black Angus Beef Carpaccio (GF)', description: 'Black Angus beef, wild rocket, pomegranate seeds, gherkins, carrots, truffle mayo', price: '18' },
      { name: 'Tempura Prawn Tacos', description: 'Guacamole, cherry tomato, pickled red onions, lime, avocado, tempura prawn', price: '15' },
      { name: 'Baked Prawns', description: 'King prawns, tomato sauce, garlic, chilli, parsley, olive oil, homemade bread', price: '18' },
      { name: 'Baked Camembert (V)', description: 'Camembert cheese, walnut, honey, rosemary, truffle, homemade bread', price: '16' },
    ],
  },
  {
    category: 'Pinsa',
    description: '(A crisp yet soft bread from Rome - a taste and textural sensation)',
    items: [
      { name: 'Al Funghi (V)', description: 'Truffle paste, mix mushrooms, soft cheese, olives powder', price: '15' },
      { name: 'Al Pesto (V)', description: 'Basil pesto, soft cheese, cherry tomato\'s, olive', price: '15' },
      { name: 'Burrata Pinsa', description: 'Burrata, basil pesto, mozzarella, tomato sauce, crudo, prosciutto', price: '17' },
    ],
  },
  {
    category: 'Mains & Sharing',
    items: [
      { name: 'Mini Burgers (Sharing for 4)', description: 'Fresh tomatoes, red onion, lettuce, light house sauce, on a whole wheat bun', price: '16' },
      { name: 'Steak Sandwich & French Fries', description: 'Steak, basil pesto, mozzarella, pepper sauce, red onion, tomato, lettuce, mayo', price: '22' },
      { name: 'Chicken Sandwich', description: 'Cesar dressing, mozzarella, crispy chicken, wild rocket, fresh tomatoes, onion', price: '20' },
    ],
  },
  {
    category: 'Sides',
    items: [
      { name: 'Padron Peppers with Smashed Feta (V, GF)', description: 'Blistered padron peppers, served with creamy smashed feta', price: '6' },
      { name: 'Corn Ribs (V, GF)', description: 'Crispy sweetcorn, tossed with parmesan chives, garlic & smoker paprika', price: '6' },
      { name: 'Homemade Focaccia Bread (V)', description: 'With olives, cherry tomatoes, rosemary', price: '6' },
      { name: 'Parmesan and Truffle Fries (V, GF)', description: '', price: '6.5' },
      { name: 'French Fries (VG)', description: '', price: '6' },
    ],
  },
  {
    category: 'Desserts',
    items: [
      { name: 'Vanilla Cheesecake (GF)', description: 'With wild berries compote & fresh fruit', price: '8.5' },
      { name: 'Truffon Chocolate (GF)', description: 'Raspberry purée, exotic fruit, pistachio crumble', price: '8.5' },
    ],
  },
];

const INITIAL_DRINKS_DATA = {
  headerImageUrl: 'https://picsum.photos/seed/barvibes/1600/800',
  packagesData: {
    title: 'PACKAGES',
    subtitle: 'Advanced Bookings Only',
    items: [
      { name: 'Birthday Package', price: '£50', description: '1 x Bottle of Prosecco, 10 x Porn Star Shots' },
      { name: 'Cocktail Party Package', price: '£120', description: '1 x *Martini Tree, 2 x Bottles of Prosecco' },
      { name: 'Wine Party Package', price: '£120', description: '6 x House wine (btl)' },
      { name: 'Party Starter Package', price: '£120', description: '2 x Btl House Wine, 1 Btl Prosecco, 10 x btl Beers*' },
      { name: 'Deluxe Party Package', price: '£275', description: '2x btl house wine, 2x Prosecco (btl), 1 X House Spirit (btl), 2 mixer jugs' },
      { name: 'Ultimate Party Package', price: '£475', description: '1 X *Martini Tree, 2 Prosecco (btl), 1 X Premium Spirit (btl), 2 mixer jugs, 10+ Guests only.' },
    ],
    notes: [
      '*Choose from Espresso Martini or Porn Star Martini. After 10 pm Beer tokens will be issued',
      '12.5% discretionary service charge will be added to your bill'
    ]
  },
  cocktailsData: [
      { category: 'Cocktails', items: [ { name: 'Smoke that Peach', price: '14.5', description: 'A refreshing mixture of Scotch whisky, peach and lemon, served tall over crushed ice' }, { name: 'Soho Ice Tea', price: '14.5', description: 'Hendricks gin, fresh cucumber, elderflower cordial, lemon juice, shaken and served in a chilled martini glass' }, { name: 'Negroni Illegal', price: '14.5', description: 'Mescal, Martini Rosso, Campari, served on a rocks glass with ice and orange zest' }, { name: 'Hugo Spritz', price: '14.5', description: 'St Germain elderflower liqueur, mint, topped up with Prosecco' }, { name: 'Rum Puncher', price: '14.5', description: 'Bacardi Oro & Carta Blanca rum, almond, orange liqueur shaken with pineapple and orange juice, served tall over ice' }, { name: 'Aperol Spritz', price: '13.5', description: 'Aperol aperitivo, Prosecco, soda water' }, { name: 'Lychee Colada', price: '14.5', description: 'Bacardi, lychee liqueur, fresh lime juice, pineapple juice, coconut liqueur, shaken and served in a chilled martini glass' } ] },
      { category: 'Mocktails', items: [ { name: 'Passion Fruit and Apple', price: '7', description: 'Fresh Passionfruit and apple juice shaken with sugar and fresh lemon juice served tall over ice' }, { name: 'Virgin Mojito', price: '7', description: 'Apple juice, fresh mint, lime, soda, brown sugar' }, { name: 'Berry Nice', price: '7', description: 'Cranberry juice, strawberry purée, sugar syrup' }, { name: 'Elderflower Pressé', price: '7', description: 'Elderflower cordial, lime juice, soda' }, { name: 'Peroni Nastro Azzurro 0.0 (0%)', price: '6.5' } ] }
  ],
  bottleServiceData: [
    { category: 'Vodka', items: [ { name: 'Grey Goose Magnum', price: '£600' }, { name: 'Belvedere Magnum', price: '£600' }, { name: 'Cîroc Magnum', price: '£600' }, { name: 'Grey Goose', price: '£250' }, { name: 'Belvedere', price: '£250' }, { name: 'Cîroc', price: '£250' }, { name: 'Cîroc Flavoured', price: '£250' }, { name: 'Crystal Head', price: '£350' } ] },
    { category: 'Champagne', items: [ { name: 'Dom Pérignon', price: '£450' }, { name: 'Cristal', price: '£600' }, { name: 'Ace of Spades', price: '£700' }, { name: 'Moët', price: '£175' }, { name: 'Laurent Perrier Rose', price: '£225' } ] },
    { category: 'Gin', items: [ { name: 'Hendrick\'s', price: '£250' }, { name: 'Tanqueray 10', price: '£250' } ] },
    { category: 'Cognac', items: [ { name: 'Hennessy', price: '£300' }, { name: 'Courvoisier', price: '£275' }, { name: 'Courvoisier XO', price: '£700' }, { name: 'Hennessy XO', price: '£750' } ] },
    { category: 'Rum', items: [ { name: 'Ron Zacapa 23', price: '£450' }, { name: 'Ron Zacapa XO', price: '£700' } ] },
    { category: 'Tequila', items: [ { name: 'Patron Silver', price: '£250' }, { name: 'Patron Reposado', price: '£275' }, { name: 'Patron Anejo', price: '£300' }, { name: 'Don Julio 1942', price: '£750' } ] },
    { category: 'Whisky', items: [ { name: 'Jack Daniel\'s Single Barrel', price: '£350' }, { name: 'Chivas Regal 15', price: '£400' }, { name: 'Woodford Reserve', price: '£300' }, { name: 'JW Blue Label', price: '£700' } ] },
    { category: 'House Spirits', note: 'House spirits with 2 jugs of mixers', items: [ { name: 'Beefeater Gin', price: '£185' }, { name: 'Jack Daniels', price: '£185' }, { name: 'Absolut Vodka', price: '£185' }, { name: 'Olmeca Tequila', price: '£185' }, { name: 'Havana 3', price: '£185' }, { name: 'Tequila Rose', price: '£185' }, { name: 'Jägermeister', price: '£185' }, { name: 'Havana 7', price: '£250' } ] }
  ],
  winesData: [
    { category: 'White Wine', items: [ { name: 'Eclat de Joie Blanc', price: { '175ml': '7.5', bottle: '26' }, description: 'From the south of France, a Grenache Blanc and Vermentino blend is a total sunshine shipper! Super light, clean, and crisp...' }, { name: 'Pinot Grigio, Castelnuovo', price: { '175ml': '8.5', bottle: '30' }, description: 'Pale straw in colour with light golden hues, this Pinot Grigio from Sartori has a clean, fruity and floral bouquet.' }, { name: 'Sauvignon Blanc Cotes de Gascogne, Bellevigne', price: { bottle: '35' }, description: 'Crisp and lively palate featuring zesty lemon, green apple, and subtle pineapple.' } ] },
    { category: 'Rosé Wine', items: [ { name: 'Pinot Grigio Blush, Castelnuovo', price: { '175ml': '8', bottle: '29' }, description: 'The harmonious citrus and floral notes combined superbly with the fresh, mouth-filling palate and mineral notes.' } ] },
    { category: 'Red Wine', items: [ { name: 'Eclat de Joie Rouge', price: { '175ml': '7.5', bottle: '26' }, description: 'Blend of Syrah and Grenache grapes - Think plump ripe plums and blackberries, soft and easy' }, { name: 'Malbec, Levalet', price: { '175ml': '8', bottle: '28' }, description: 'From the South of France, ranging from the Mediterranean coast to Provence.' }, { name: 'Syrah, Sans Chagrin', price: { bottle: '35' }, description: 'Syrah made with minimal intervention in the Languedoc. From organically farmed vines rooted in limestone soils.' } ] },
    { category: 'Champagne & Sparkling Wine', items: [ { name: 'Prosecco Extra Dry', price: { Glass: '9.5', Bottle: '35' } }, { name: 'Prosecco Rosé', price: { Bottle: '45' } }, { name: 'Taittinger NV Brut Reserve', price: { Bottle: '125' } }, { name: 'Moet & Chandon NV', price: { Bottle: '175' } }, { name: 'Laurent Perrier Cuvée Rose Brut NV', price: { Bottle: '225' } }, { name: 'Dom Pérignon', price: { Bottle: '450' } }, { name: 'Cristal', price: { Bottle: '600' } }, { name: 'Ace of Spades', price: { Bottle: '700' } } ] }
  ],
  byTheGlassData: [
    { category: 'Beers & Ciders', items: [ { name: 'Asahi Super Dry (5.2%)', price: '6.9' }, { name: 'Corona Extra (4.5%)', price: '6.9' }, { name: 'Peroni Nastro Azzurro (5.1%)', price: '6.9' }, { name: 'Old Mout (4%)', description: '(assorted flavours)', price: '7.5' } ] },
    { category: 'House Spirits', items: [ { name: 'House spirits (50ml)', price: '12.5' }, { name: 'House spirits (25ml)', price: '7' }, { name: 'Mixer', price: '2' }, { name: 'Red Bull mixer', price: '3' } ] }
  ],
  shotsData: {
    title: 'Shots',
    singleDouble: true,
    items: [
      { name: 'Jagerbomb', single: '9', double: '12' },
      { name: 'Skittlebomb', single: '9', double: '12' },
      { name: 'Slippery Nipple', single: '7', double: '12' },
      { name: 'Baby Guinness', single: '7', double: '12' },
      { name: 'B52', single: '7', double: '12' },
      { name: 'Brain Hemorrhage', single: '7', double: '12' },
      { name: 'Tequila Rose', single: '7', double: '12' },
      { name: 'Patrón Reposado', single: '10', double: '14.9' },
      { name: 'Patron Silver', single: '10', double: '14.5' },
      { name: 'Cazcabel Honey', single: '9', double: '12' },
      { name: 'Cazcabel Coffee', single: '9', double: '12' }
    ],
    shooters: {
      title: '6 Shooters',
      prices: 'Single £25 Double £32',
      items: [
        { name: 'Kamikaze', description: 'Absolut, Cointreau, lime juice' },
        { name: 'Raspberry Gimlet', description: 'Absolut, Chambord, lime juice' },
        { name: 'Red Snapper', description: 'Jack Daniels, Amaretto, cranberry juice' },
        { name: 'Melon Ball', description: 'Absolut, Midori, pineapple juice' },
        { name: 'Kool Aid', description: 'Absolut, Amaretto, Midori, cranberry juice' }
      ]
    }
  }
};


// --- Context Implementation ---

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Use lazy initialization for state to prevent overwriting saved data with defaults on mount/reload
  // DATA_VERSION ensures that if we update the code structure, old local storage doesn't break the app
  const DATA_VERSION = '1.3'; 
  const checkVersion = () => {
      const storedVersion = localStorage.getItem('lkc_data_version');
      if (storedVersion !== DATA_VERSION) {
          console.log("Data version mismatch. Clearing legacy data.");
          localStorage.clear();
          localStorage.setItem('lkc_data_version', DATA_VERSION);
          return true; // Version changed
      }
      return false; // Version same
  };

  const isReset = checkVersion();

  const [foodMenu, setFoodMenu] = useState<MenuCategory[]>(() => {
      if (isReset) return INITIAL_FOOD_MENU;
      const saved = localStorage.getItem('lkc_foodMenu');
      return saved ? JSON.parse(saved) : INITIAL_FOOD_MENU;
  });
  
  const [drinksData, setDrinksData] = useState<any>(() => {
      if (isReset) return INITIAL_DRINKS_DATA;
      const saved = localStorage.getItem('lkc_drinksData');
      return saved ? JSON.parse(saved) : INITIAL_DRINKS_DATA;
  });

  const [headerData, setHeaderData] = useState<HeaderData>(() => {
      if (isReset) return INITIAL_HEADER_DATA;
      const saved = localStorage.getItem('lkc_headerData');
      return saved ? JSON.parse(saved) : INITIAL_HEADER_DATA;
  });

  const [heroData, setHeroData] = useState<HeroData>(() => {
      if (isReset) return INITIAL_HERO_DATA;
      const saved = localStorage.getItem('lkc_heroData');
      return saved ? JSON.parse(saved) : INITIAL_HERO_DATA;
  });

  const [highlightsData, setHighlightsData] = useState<HighlightsData>(() => {
      if (isReset) return INITIAL_HIGHLIGHTS_DATA;
      const saved = localStorage.getItem('lkc_highlightsData');
      return saved ? JSON.parse(saved) : INITIAL_HIGHLIGHTS_DATA;
  });

  const [featuresData, setFeaturesData] = useState<FeaturesData>(() => {
      if (isReset) return INITIAL_FEATURES_DATA;
      const saved = localStorage.getItem('lkc_featuresData');
      return saved ? JSON.parse(saved) : INITIAL_FEATURES_DATA;
  });

  const [vibeData, setVibeData] = useState<VibeData>(() => {
      if (isReset) return INITIAL_VIBE_DATA;
      const saved = localStorage.getItem('lkc_vibeData');
      return saved ? JSON.parse(saved) : INITIAL_VIBE_DATA;
  });

  const [testimonialsData, setTestimonialsData] = useState<TestimonialsData>(() => {
      if (isReset) return INITIAL_TESTIMONIALS_DATA;
      const saved = localStorage.getItem('lkc_testimonialsData');
      return saved ? JSON.parse(saved) : INITIAL_TESTIMONIALS_DATA;
  });

  const [batteryData, setBatteryData] = useState<BatteryData>(() => {
      if (isReset) return INITIAL_BATTERY_DATA;
      const saved = localStorage.getItem('lkc_batteryData');
      return saved ? JSON.parse(saved) : INITIAL_BATTERY_DATA;
  });

  const [footerData, setFooterData] = useState<FooterData>(() => {
      if (isReset) return INITIAL_FOOTER_DATA;
      const saved = localStorage.getItem('lkc_footerData');
      return saved ? JSON.parse(saved) : INITIAL_FOOTER_DATA;
  });

  const [galleryData, setGalleryData] = useState<GalleryData>(() => {
      if (isReset) return INITIAL_GALLERY_DATA;
      const saved = localStorage.getItem('lkc_galleryData');
      return saved ? JSON.parse(saved) : INITIAL_GALLERY_DATA;
  });

  const [dbConfig, setDbConfig] = useState<DatabaseConfig>(() => {
      if (isReset) return INITIAL_DB_CONFIG;
      const saved = localStorage.getItem('lkc_dbConfig');
      return saved ? JSON.parse(saved) : INITIAL_DB_CONFIG;
  });

  // --- CMS Data States ---
  const [songs, setSongs] = useState<Song[]>(() => {
      if (isReset) return INITIAL_SONGS;
      const saved = localStorage.getItem('lkc_songs');
      return saved ? JSON.parse(saved) : INITIAL_SONGS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
      if (isReset) return INITIAL_BOOKINGS;
      const saved = localStorage.getItem('lkc_bookings');
      return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });


  // Save to LocalStorage whenever state changes
  useEffect(() => { localStorage.setItem('lkc_foodMenu', JSON.stringify(foodMenu)); }, [foodMenu]);
  useEffect(() => { localStorage.setItem('lkc_drinksData', JSON.stringify(drinksData)); }, [drinksData]);
  useEffect(() => { localStorage.setItem('lkc_headerData', JSON.stringify(headerData)); }, [headerData]);
  useEffect(() => { localStorage.setItem('lkc_heroData', JSON.stringify(heroData)); }, [heroData]);
  useEffect(() => { localStorage.setItem('lkc_highlightsData', JSON.stringify(highlightsData)); }, [highlightsData]);
  useEffect(() => { localStorage.setItem('lkc_featuresData', JSON.stringify(featuresData)); }, [featuresData]);
  useEffect(() => { localStorage.setItem('lkc_vibeData', JSON.stringify(vibeData)); }, [vibeData]);
  useEffect(() => { localStorage.setItem('lkc_testimonialsData', JSON.stringify(testimonialsData)); }, [testimonialsData]);
  useEffect(() => { localStorage.setItem('lkc_batteryData', JSON.stringify(batteryData)); }, [batteryData]);
  useEffect(() => { localStorage.setItem('lkc_footerData', JSON.stringify(footerData)); }, [footerData]);
  useEffect(() => { localStorage.setItem('lkc_galleryData', JSON.stringify(galleryData)); }, [galleryData]);
  useEffect(() => { localStorage.setItem('lkc_dbConfig', JSON.stringify(dbConfig)); }, [dbConfig]);
  useEffect(() => { localStorage.setItem('lkc_songs', JSON.stringify(songs)); }, [songs]);
  useEffect(() => { localStorage.setItem('lkc_bookings', JSON.stringify(bookings)); }, [bookings]);

  const updateFoodMenu = (newMenu: MenuCategory[]) => setFoodMenu(newMenu);
  const updateDrinksData = (newData: any) => setDrinksData(newData);
  const updateHeaderData = (newData: HeaderData) => setHeaderData(newData);
  const updateHeroData = (newData: HeroData) => setHeroData(newData);
  const updateHighlightsData = (newData: HighlightsData) => setHighlightsData(newData);
  const updateFeaturesData = (newData: FeaturesData) => setFeaturesData(newData);
  const updateVibeData = (newData: VibeData) => setVibeData(newData);
  const updateTestimonialsData = (newData: TestimonialsData) => setTestimonialsData(newData);
  const updateBatteryData = (newData: BatteryData) => setBatteryData(newData);
  const updateFooterData = (newData: FooterData) => setFooterData(newData);
  const updateGalleryData = (newData: GalleryData) => setGalleryData(newData);
  const updateDbConfig = (newData: DatabaseConfig) => setDbConfig(newData);
  
  const updateSongs = (newSongs: Song[]) => setSongs(newSongs);
  const updateBookings = (newBookings: Booking[]) => setBookings(newBookings);

  const resetToDefaults = () => {
    if (confirm("Are you sure you want to reset all content to default? This cannot be undone.")) {
        // Clear local storage first
        const keysToRemove = [
            'lkc_foodMenu', 'lkc_drinksData', 'lkc_headerData', 'lkc_heroData', 
            'lkc_highlightsData', 'lkc_featuresData', 'lkc_vibeData', 'lkc_testimonialsData', 
            'lkc_batteryData', 'lkc_footerData', 'lkc_galleryData', 'lkc_dbConfig',
            'lkc_songs', 'lkc_bookings'
        ];
        keysToRemove.forEach(key => localStorage.removeItem(key));

        // Then set state to defaults
        setFoodMenu(INITIAL_FOOD_MENU);
        setDrinksData(INITIAL_DRINKS_DATA);
        setHeaderData(INITIAL_HEADER_DATA);
        setHeroData(INITIAL_HERO_DATA);
        setHighlightsData(INITIAL_HIGHLIGHTS_DATA);
        setFeaturesData(INITIAL_FEATURES_DATA);
        setVibeData(INITIAL_VIBE_DATA);
        setTestimonialsData(INITIAL_TESTIMONIALS_DATA);
        setBatteryData(INITIAL_BATTERY_DATA);
        setFooterData(INITIAL_FOOTER_DATA);
        setGalleryData(INITIAL_GALLERY_DATA);
        setDbConfig(INITIAL_DB_CONFIG);
        setSongs(INITIAL_SONGS);
        setBookings(INITIAL_BOOKINGS);
    }
  };

  return (
    <DataContext.Provider value={{ 
        foodMenu, updateFoodMenu, 
        drinksData, updateDrinksData, 
        headerData, updateHeaderData,
        heroData, updateHeroData,
        highlightsData, updateHighlightsData,
        featuresData, updateFeaturesData,
        vibeData, updateVibeData,
        testimonialsData, updateTestimonialsData,
        batteryData, updateBatteryData,
        footerData, updateFooterData,
        galleryData, updateGalleryData,
        dbConfig, updateDbConfig,
        songs, updateSongs,
        bookings, updateBookings,
        resetToDefaults 
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