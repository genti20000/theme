
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useData, BlogPost } from '../context/DataContext';
import PageGallerySection from './PageGallerySection';
import { getMediaUrl } from '../lib/media';
import RelatedPlanningLinks from './RelatedPlanningLinks';

const slugifyFallback = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const BlogPage: React.FC = () => {
  const { blogData } = useData();
  const { slug } = useParams();
  const selectedPost: BlogPost | null = slug
    ? blogData.posts.find((post) => (post.slug || slugifyFallback(post.title)) === slug) || null
    : null;

  return (
    <>
    <div className="bg-black min-h-screen text-white pt-24 pb-24">
      <div className="container mx-auto px-6">
        {!selectedPost ? (
            <>
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-400">
                        {blogData.heading}
                    </h1>
                    <p className="text-gray-400 text-xl max-w-2xl mx-auto">{blogData.subtext}</p>
                    <p className="mt-4 text-sm leading-6 text-zinc-500 max-w-3xl mx-auto">
                      Jump to the highest-intent pages:
                      {' '}
                      <Link to="/birthday-karaoke-soho" className="text-yellow-300 hover:text-white">birthday karaoke Soho</Link>,
                      {' '}
                      <Link to="/hen-do-karaoke-soho" className="text-yellow-300 hover:text-white">hen do karaoke Soho</Link>,
                      {' '}
                      <Link to="/events" className="text-yellow-300 hover:text-white">corporate events</Link>,
                      {' '}
                      <Link to="/gallery" className="text-yellow-300 hover:text-white">gallery</Link>.
                    </p>
                    <p className="mt-3 text-sm leading-6 text-zinc-400 max-w-3xl mx-auto">
                      For pre-wedding groups specifically, use the dedicated
                      {' '}
                      <Link to="/hen-do-karaoke-soho" className="text-fuchsia-300 hover:text-white">hen do karaoke Soho landing page</Link>
                      {' '}
                      before comparing dates and menus.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogData.posts.map((post) => (
                        <Link
                            key={post.id} 
                            to={`/guides/${post.slug || slugifyFallback(post.title)}`}
                            className="bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-zinc-800 group cursor-pointer transition-all hover:border-pink-500/50 hover:shadow-[0_0_30px_rgba(236,72,153,0.1)]"
                        >
                            <div className="aspect-video relative overflow-hidden">
                                {post.imageUrl ? (
                                  <>
                                    <img src={getMediaUrl(post.imageUrl)} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
                                  </>
                                ) : (
                                  <div className="w-full h-full bg-zinc-950 flex items-center justify-center text-zinc-500 text-xs font-bold uppercase tracking-widest text-center px-6">
                                    Add Blog Image In Admin
                                  </div>
                                )}
                            </div>
                            <div className="p-8">
                                <h3 className="text-2xl font-bold mb-4 group-hover:text-yellow-400 transition-colors">{post.title}</h3>
                                <p className="text-gray-400 line-clamp-3 leading-relaxed">{post.excerpt}</p>
                                <div className="mt-6 flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                                    Read Full Story <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </>
        ) : (
            <div className="max-w-4xl mx-auto animate-fade-in-up">
                <Link
                    to="/guides"
                    className="mb-12 inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-bold uppercase tracking-widest text-xs"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to Feed
                </Link>
                
                {selectedPost.imageUrl ? (
                  <img src={getMediaUrl(selectedPost.imageUrl)} className="w-full h-[50vh] object-cover rounded-[3rem] mb-12 shadow-2xl border border-zinc-800" alt="" />
                ) : (
                  <div className="w-full h-[50vh] rounded-[3rem] mb-12 shadow-2xl border border-zinc-800 bg-zinc-950 flex items-center justify-center text-zinc-500 text-sm font-bold uppercase tracking-widest">
                    No Image
                  </div>
                )}
                
                <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight">{selectedPost.title}</h1>
                
                <div className="prose prose-invert prose-pink max-w-none text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                    {selectedPost.content}
                </div>

                <RelatedPlanningLinks
                  className="mt-12"
                  title="Plan your night:"
                  intro="If this article is part of a group booking plan, continue with the"
                  links={[
                    { to: '/birthday-karaoke-soho', label: 'Birthday karaoke in Soho' },
                    { to: '/hen-do-karaoke-soho', label: 'Hen do karaoke in Soho' },
                    { to: '/events', label: 'Corporate karaoke events in London' },
                  ]}
                />
            </div>
        )}
      </div>
    </div>
    <PageGallerySection pageKey="blog" />
    </>
  );
};

export default BlogPage;
