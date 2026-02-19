
import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import PageGallerySection from './PageGallerySection';

const SongLibrary: React.FC = () => {
  const { songs, isDataLoading } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const filteredSongs = useMemo(() => {
    if (!searchTerm) return songs;
    const lower = searchTerm.toLowerCase();
    return songs.filter(song => 
      song.title.toLowerCase().includes(lower) || 
      song.artist.toLowerCase().includes(lower)
    );
  }, [songs, searchTerm]);

  const totalPages = Math.ceil(filteredSongs.length / itemsPerPage);
  const currentSongs = filteredSongs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
    <div className="bg-black min-h-screen text-white pt-24 pb-12">
        <div className="container mx-auto px-6">
            <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-400 mb-4">
                    Song Library
                </h2>
                <p className="text-gray-400">Search over 80,000 songs instantly.</p>
            </div>

            <div className="max-w-2xl mx-auto mb-10">
                <input 
                    type="text" 
                    placeholder="Search for artist or song title..." 
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-full py-4 px-6 text-lg text-white focus:border-pink-500 outline-none transition-all"
                />
            </div>

            {isDataLoading ? (
                <div className="max-w-4xl mx-auto space-y-4">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="h-14 bg-zinc-900 rounded animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <div className="max-w-4xl mx-auto bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="grid grid-cols-12 bg-zinc-800 p-4 font-bold text-gray-300 text-sm md:text-base border-b border-zinc-700">
                        <div className="col-span-6 md:col-span-5">Title</div>
                        <div className="col-span-6 md:col-span-5">Artist</div>
                        <div className="col-span-0 md:col-span-2 hidden md:block">Genre</div>
                    </div>
                    {currentSongs.length > 0 ? (
                        currentSongs.map((song, idx) => (
                            <div key={song.id} className={`grid grid-cols-12 p-4 border-b border-zinc-800/50 hover:bg-zinc-800/50 transition-colors items-center ${idx % 2 === 0 ? 'bg-transparent' : 'bg-zinc-900/30'}`}>
                                <div className="col-span-6 md:col-span-5 font-medium text-white">{song.title}</div>
                                <div className="col-span-6 md:col-span-5 text-gray-400">{song.artist}</div>
                                <div className="col-span-0 md:col-span-2 hidden md:block text-xs text-zinc-500 uppercase tracking-wider">{song.genre || '-'}</div>
                            </div>
                        ))
                    ) : (
                        <div className="p-12 text-center text-gray-500">
                            No songs found matching "{searchTerm}"
                        </div>
                    )}
                </div>
            )}

            {!isDataLoading && totalPages > 1 && (
                <div className="flex justify-center mt-8 gap-2">
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 bg-zinc-800 rounded hover:bg-zinc-700 disabled:opacity-50">Prev</button>
                    <span className="px-4 py-2 text-gray-400">Page {currentPage} of {totalPages}</span>
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 bg-zinc-800 rounded hover:bg-zinc-700 disabled:opacity-50">Next</button>
                </div>
            )}
        </div>
    </div>
    <PageGallerySection pageKey="songs" />
    </>
  );
};

export default SongLibrary;
