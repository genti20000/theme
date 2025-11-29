
import React from 'react';
import { useData } from '../context/DataContext';

interface FooterProps {
  onNavigate: (page: 'home' | 'menu' | 'drinks' | 'gallery' | 'imageEditor' | 'admin' | 'terms') => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { footerData } = useData();
  const BOOKING_URL = "https://squareup.com/appointments/book/aijx16oiq683tl/LCK48B0G6CF51/services";

  return (
    <footer className="bg-zinc-900 text-gray-400 text-xs">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12 pb-12 border-b border-gray-700">
          <h4 className="text-3xl font-bold text-white mb-4">{footerData.ctaHeading}</h4>
          <p className="text-gray-300 mb-6 max-w-lg mx-auto text-base">{footerData.ctaText}</p>
          <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-bold py-3 px-6 rounded-full border-2 border-white transition-transform duration-300 ease-in-out hover:scale-105">
            {footerData.ctaButtonText}
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div>
            <h5 className="font-bold text-white mb-4">Explore</h5>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('home')} className="bg-transparent p-0 text-gray-400 hover:text-white text-left">Home</button></li>
              <li><button onClick={() => onNavigate('gallery')} className="bg-transparent p-0 text-gray-400 hover:text-white text-left">Gallery</button></li>
              <li><button onClick={() => onNavigate('menu')} className="bg-transparent p-0 text-gray-400 hover:text-white text-left">Food Menu</button></li>
              <li><button onClick={() => onNavigate('drinks')} className="bg-transparent p-0 text-gray-400 hover:text-white text-left">Drinks Menu</button></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-white mb-4">Book</h5>
            <ul className="space-y-2">
              <li><a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">Book a Room</a></li>
              <li><a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">Special Offers</a></li>
              <li><a href="#" className="hover:text-white">FAQs</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-white mb-4">Events</h5>
            <ul className="space-y-2">
              <li><a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">Birthday Parties</a></li>
              <li><a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">Hen & Stag Dos</a></li>
              <li><a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">Corporate Events</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-white mb-4">LKC</h5>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Contact & Location</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-white mb-4">Connect</h5>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Instagram</a></li>
              <li><a href="#" className="hover:text-white">TikTok</a></li>
              <li><a href="#" className="hover:text-white">Facebook</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-700">
            <p className="mb-4">More ways to sing: find us in the heart of London. Or call 020 1234 5678.</p>
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex flex-col md:flex-row gap-4">
                    <p>Copyright © 2024 London Karaoke Club. All rights reserved.</p>
                    <button onClick={() => onNavigate('admin')} className="text-gray-600 hover:text-gray-400 text-xs text-left md:ml-4">Admin Login</button>
                </div>
                <div className="flex space-x-4 mt-4 md:mt-0">
                    <button onClick={() => onNavigate('terms')} className="bg-transparent p-0 text-gray-400 hover:text-white text-left text-xs">Privacy Policy</button>
                    <button onClick={() => onNavigate('terms')} className="bg-transparent p-0 text-gray-400 hover:text-white text-left text-xs">Terms of Use</button>
                    <button onClick={() => onNavigate('terms')} className="bg-transparent p-0 text-gray-400 hover:text-white text-left text-xs">Booking Policy</button>
                    <button onClick={() => onNavigate('terms')} className="bg-transparent p-0 text-gray-400 hover:text-white text-left text-xs">Legal</button>
                    <a href="#" className="hover:text-white">Site Map</a>
                </div>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
