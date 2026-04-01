import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from '../components/Logo';
import { ArrowLeft, Play, User, Clock, Eye, Search, Instagram, ExternalLink, PlayCircle, Plus, X as CloseIcon, CheckCircle2, Trash2, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';
import AuthModal from '../components/AuthModal';

// Error Handling Spec for Supabase Operations
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface SupabaseErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
  }
}

function handleSupabaseError(error: unknown, operationType: OperationType, path: string | null, user: any) {
  let errorMessage = 'Unknown error';
  
  if (error && typeof error === 'object') {
    const err = error as any;
    errorMessage = err.message || err.details || err.hint || (typeof err.error === 'string' ? err.error : JSON.stringify(err));
  } else {
    errorMessage = String(error);
  }

  const errInfo: SupabaseErrorInfo = {
    error: errorMessage,
    authInfo: {
      userId: user?.id,
      email: user?.email,
    },
    operationType,
    path
  }
  console.warn('Supabase Operation Info: ', JSON.stringify(errInfo));
  return errInfo;
}

const videos = [
  {
    id: 1,
    title: "Coffee99 Experience at Shimundri",
    creator: "Coffee Lover",
    creatorAvatar: "https://picsum.photos/seed/user1/100/100",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    type: "youtube",
    views: "1.2K views",
    postedAt: "2 days ago"
  },
  {
    id: 2,
    title: "Morning Ritual at Coffee99",
    creator: "Daily Brew",
    creatorAvatar: "https://picsum.photos/seed/user2/100/100",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    type: "youtube",
    views: "850 views",
    postedAt: "5 days ago"
  },
  {
    id: 3,
    title: "The Perfect Latte Art",
    creator: "Barista Skills",
    creatorAvatar: "https://picsum.photos/seed/user3/100/100",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    type: "youtube",
    views: "2.4K views",
    postedAt: "1 week ago"
  },
  {
    id: 4,
    title: "Coffee99 Vibe Check",
    creator: "Vibe Master",
    creatorAvatar: "https://picsum.photos/seed/user4/100/100",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    type: "youtube",
    views: "1.1K views",
    postedAt: "3 days ago"
  },
  {
    id: 5,
    title: "Weekend Hangout Spot",
    creator: "Social Bee",
    creatorAvatar: "https://picsum.photos/seed/user5/100/100",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    type: "youtube",
    views: "920 views",
    postedAt: "4 days ago"
  },
  {
    id: 6,
    title: "Best Coffee in Town!",
    creator: "Foodie Explorer",
    creatorAvatar: "https://picsum.photos/seed/user6/100/100",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    type: "youtube",
    views: "3.1K views",
    postedAt: "2 weeks ago"
  }
];

const shorts = [
  {
    id: 1,
    caption: "Morning rush at Coffee99 ☕",
    thumbnail: "https://picsum.photos/seed/short1/400/711",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    type: "short",
    views: "12K"
  },
  {
    id: 2,
    caption: "That perfect pour... 😍",
    thumbnail: "https://picsum.photos/seed/short2/400/711",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    type: "short",
    views: "8.5K"
  },
  {
    id: 3,
    caption: "Weekend vibes are here!",
    thumbnail: "https://picsum.photos/seed/short3/400/711",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    type: "short",
    views: "15K"
  },
  {
    id: 4,
    caption: "Secret menu item? 👀",
    thumbnail: "https://picsum.photos/seed/short4/400/711",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    type: "short",
    views: "22K"
  },
  {
    id: 5,
    caption: "Coffee art level: Pro",
    thumbnail: "https://picsum.photos/seed/short5/400/711",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    type: "short",
    views: "9.1K"
  },
  {
    id: 6,
    caption: "POV: You found the best spot",
    thumbnail: "https://picsum.photos/seed/short6/400/711",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    type: "short",
    views: "11K"
  }
];

const VideoSkeleton = () => (
  <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/5">
    <div className="aspect-video bg-white/5 animate-pulse" />
    <div className="p-4 flex gap-3">
      <div className="w-10 h-10 rounded-full bg-white/5 shrink-0 animate-pulse" />
      <div className="flex-grow space-y-2">
        <div className="h-4 bg-white/5 rounded w-3/4 animate-pulse" />
        <div className="h-3 bg-white/5 rounded w-1/2 animate-pulse" />
      </div>
    </div>
  </div>
);

const ShortSkeleton = () => (
  <div className="min-w-[140px] sm:min-w-[180px] aspect-[9/16] bg-[#1a1a1a] rounded-2xl border border-white/5 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent animate-shimmer" />
    <div className="absolute bottom-4 left-4 right-4 space-y-2">
      <div className="h-3 bg-white/5 rounded w-3/4 animate-pulse" />
      <div className="h-2 bg-white/5 rounded w-1/2 animate-pulse" />
    </div>
  </div>
);

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR_pL_Y_X_X_X/pub?output=csv'; // Placeholder for user to replace
const SUBMIT_URL = ''; // PASTE YOUR GOOGLE APPS SCRIPT URL HERE

const parseVideoUrl = (url: string) => {
  if (!url) return { embedUrl: '', type: 'unknown' };

  // YouTube Shorts
  if (url.includes('youtube.com/shorts/')) {
    const ytShortMatch = url.match(/shorts\/([^"&?\/\s]{11})/);
    if (ytShortMatch) return { embedUrl: `https://www.youtube.com/embed/${ytShortMatch[1]}`, type: 'short' };
  }

  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  if (ytMatch) return { embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}`, type: 'youtube' };

  // Instagram
  if (url.includes('instagram.com')) {
    const igMatch = url.match(/instagram\.com\/(?:p|reel)\/([^\/?#&]+)/);
    if (igMatch) {
      const type = url.includes('/reel/') ? 'short' : 'instagram';
      return { embedUrl: `https://www.instagram.com/p/${igMatch[1]}/embed`, type };
    }
  }

  // Facebook
  if (url.includes('facebook.com')) {
    return { embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&width=560`, type: 'facebook' };
  }

  return { embedUrl: url, type: 'other' };
};

export default function Blogs() {
  const { user, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dynamicVideos, setDynamicVideos] = useState<any[]>(videos);
  const [dynamicShorts, setDynamicShorts] = useState<any[]>(shorts);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({ link: '', creator: '', title: '', description: '' });

  const handleSignIn = () => {
    setIsAuthModalOpen(true);
  };

  const handleDelete = async (videoId: string, type: 'short' | 'video') => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        const { error } = await supabase
          .from('videos')
          .delete()
          .eq('id', videoId);
        
        if (error) throw error;
        
        // Optimistic update
        if (type === 'short') {
          setDynamicShorts(prev => prev.filter(v => v.id !== videoId));
        } else {
          setDynamicVideos(prev => prev.filter(v => v.id !== videoId));
        }
      } catch (error) {
        handleSupabaseError(error, OperationType.DELETE, `videos/${videoId}`, user);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate URL
    const { embedUrl, type: videoType } = parseVideoUrl(formData.link);
    if (!embedUrl || videoType === 'unknown') {
      alert('Please enter a valid video URL (YouTube, Instagram, or Facebook)');
      return;
    }

    // Sanitize inputs (basic)
    const sanitizedTitle = formData.title.trim().substring(0, 100);
    const sanitizedCreator = formData.creator.trim().substring(0, 50) || "Anonymous Creator";
    const sanitizedDescription = formData.description?.trim().substring(0, 500) || "";
    
    const videoData = {
      title: sanitizedTitle,
      creator: sanitizedCreator,
      description: sanitizedDescription,
      creator_avatar: user?.user_metadata?.avatar_url || `https://picsum.photos/seed/${sanitizedCreator}/100/100`,
      video_url: embedUrl,
      type: videoType,
      views: "0 views",
      posted_at: new Date().toISOString(),
      author_uid: user?.id || null
    };

    try {
      setIsUploading(true);
      console.log('[Blogs] Submitting video data:', videoData);
      const { data, error } = await supabase
        .from('videos')
        .insert([videoData])
        .select();
      
      if (error) throw error;
      
      console.log('[Blogs] Video submitted successfully. Insert result:', data);
      setIsUploading(false);
      setIsSubmitted(true);
      
      // Refresh video list immediately
      fetchVideos();
      
      setTimeout(() => {
        setIsSubmitted(false);
        setIsSubmitModalOpen(false);
        setFormData({ link: '', creator: '', title: '', description: '' });
      }, 2500);
    } catch (error) {
      console.error('[Blogs] Submission error:', error);
      setIsUploading(false);
      setIsSubmitted(false);
      handleSupabaseError(error, OperationType.CREATE, 'videos', user);
      alert('Failed to submit video. Please try again later.');
    }
  };

  const fetchVideos = React.useCallback(async () => {
    console.log('[Blogs] Fetching videos from Supabase...');
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('posted_at', { ascending: false });
      
      if (error) {
        console.error('[Blogs] Supabase fetch error:', error.message);
        handleSupabaseError(error, OperationType.LIST, 'videos', user);
        // Only show static fallbacks if database fetch fails completely
        setDynamicVideos(videos);
        setDynamicShorts(shorts);
        return;
      }
      
      console.log('[Blogs] Fetch results from database:', data);

      if (data && data.length > 0) {
        console.log(`[Blogs] Successfully fetched ${data.length} videos from database. Disabling static fallbacks.`);
        // Map snake_case from DB to camelCase for frontend
        const mappedData = data.map((v: any) => ({
          ...v,
          creatorAvatar: v.creator_avatar,
          embedUrl: v.video_url,
          postedAt: v.posted_at,
          authorUid: v.author_uid
        }));
        const fetchedVideos = mappedData.filter((v: any) => v.type !== 'short');
        const fetchedShorts = mappedData.filter((v: any) => v.type === 'short');
        
        // ONLY show fetched data, no static fallbacks mixed in
        setDynamicVideos(fetchedVideos);
        setDynamicShorts(fetchedShorts);
      } else {
        console.log('[Blogs] No videos found in database. Showing empty state or static fallbacks as placeholder.');
        // If database is empty, we can choose to show nothing or fallbacks. 
        // User said "REMOVE or disable static fallback system when database is working".
        // If it's working but empty, we'll show empty arrays or static ones? 
        // Let's show empty arrays to be strictly "no fallback".
        setDynamicVideos([]);
        setDynamicShorts([]);
      }
    } catch (error) {
      console.error('[Blogs] Unexpected error during fetch:', error);
      handleSupabaseError(error, OperationType.LIST, 'videos', user);
      setDynamicVideos(videos);
      setDynamicShorts(shorts);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchVideos();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('videos-changes')
      .on('postgres_changes' as any, { event: '*', table: 'videos' }, () => {
        fetchVideos();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchVideos]);

  const filteredVideos = dynamicVideos.filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.creator.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: any) => {
    if (!date) return '';
    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString([], { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
    // Handle Firestore Timestamp (for backward compatibility if any data remains)
    if (date && typeof date === 'object' && 'seconds' in date) {
      return new Date(date.seconds * 1000).toLocaleDateString([], { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
    return String(date);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white selection:bg-[#ff3c3c]/30">
      {/* Modern App-like Header with Search */}
      <header className="fixed top-0 w-full z-50 bg-[#0f0f0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center gap-4">
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <Logo className="h-8 w-auto" />
            <span className="hidden lg:inline font-bold text-lg tracking-tight group-hover:text-[#ff3c3c] transition-colors">
              Creator Hub
            </span>
          </Link>

          {/* YouTube-style Search Bar */}
          <div className="flex-grow max-w-2xl hidden md:block">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-500 group-focus-within:text-[#ff3c3c] transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search videos, creators, or shorts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#121212] border border-white/10 rounded-full py-2 pl-11 pr-4 text-sm focus:outline-none focus:border-[#ff3c3c]/50 focus:ring-1 focus:ring-[#ff3c3c]/50 transition-all placeholder:text-gray-600"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {user ? (
              <button 
                onClick={() => signOut()}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-full text-xs sm:text-sm font-medium transition-all duration-300 border border-white/5 group"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            ) : (
              <button 
                onClick={() => handleSignIn()}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-full text-xs sm:text-sm font-medium transition-all duration-300 border border-white/5 group"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}
            <button 
              onClick={() => {
                setIsSubmitModalOpen(true);
              }}
              className="flex items-center gap-2 px-3 sm:px-5 py-2 bg-[#ff3c3c] hover:bg-[#ff5555] text-white rounded-full text-xs sm:text-sm font-bold transition-all shadow-lg shadow-[#ff3c3c]/20 active:scale-95 group"
            >
              <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform" />
              <span className="hidden xs:inline">Submit</span>
            </button>
            <Link 
              to="/" 
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-full text-xs sm:text-sm font-medium transition-all duration-300 border border-white/5 group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Submission Modal */}
      <AnimatePresence>
        {isSubmitModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSubmitModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-[#121212] border border-white/10 rounded-[32px] p-8 shadow-2xl"
            >
              <button 
                onClick={() => setIsSubmitModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white transition-colors"
              >
                <CloseIcon className="h-5 w-5" />
              </button>

              {isSubmitted ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-[#ff3c3c]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-8 w-8 text-[#ff3c3c]" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Video Submitted!</h3>
                  <p className="text-gray-400">Our team will review your link and it will appear on the hub shortly.</p>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-2">Submit Your Video</h3>
                    <p className="text-gray-400 text-sm">Share your Coffee99 experience with the community.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">Video Link</label>
                      <input 
                        required
                        type="url"
                        placeholder="YouTube, Instagram, or Facebook link"
                        value={formData.link}
                        onChange={(e) => setFormData({...formData, link: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-[#ff3c3c]/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">Creator Name (Optional)</label>
                      <input 
                        type="text"
                        placeholder="Your name or handle"
                        value={formData.creator}
                        onChange={(e) => setFormData({...formData, creator: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-[#ff3c3c]/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">Video Title</label>
                      <input 
                        required
                        type="text"
                        placeholder="What's this video about?"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-[#ff3c3c]/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">Description (Optional)</label>
                      <textarea 
                        placeholder="Tell us more about this video..."
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={3}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-[#ff3c3c]/50 transition-all resize-none"
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={isUploading}
                      className={`w-full py-4 bg-[#ff3c3c] hover:bg-[#ff5555] text-white rounded-2xl font-bold uppercase tracking-widest text-sm transition-all shadow-lg shadow-[#ff3c3c]/20 active:scale-[0.98] mt-4 flex items-center justify-center gap-2 ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isUploading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        'Submit Link'
                      )}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-smooth">
        {/* Dynamic Featured Area: Instagram Banner - Optimized for height */}
        <motion.section 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/5"
        >
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-5 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-l from-[#ff3c3c] to-transparent" />
          </div>
          
          <div className="relative p-5 md:p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="shrink-0 relative">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full p-0.5 bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] shadow-xl">
                <div className="w-full h-full rounded-full border-2 border-[#0f0f0f] overflow-hidden bg-black flex items-center justify-center p-3">
                  <Logo className="w-full h-auto" />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-[#ff3c3c] p-1.5 rounded-full border-2 border-[#0f0f0f]">
                <Instagram className="h-3 w-3 text-white" />
              </div>
            </div>

            <div className="flex-grow text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                  Follow <span className="text-[#ff3c3c]">@Coffee99</span>
                </h2>
                <div className="hidden md:flex -space-x-2 items-center">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-6 h-6 rounded-full border border-[#0f0f0f] overflow-hidden bg-[#1a1a1a]">
                      <img src={`https://picsum.photos/seed/follower${i}/100/100`} alt="Follower" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <span className="ml-3 text-[10px] text-gray-500 font-bold uppercase tracking-wider">50k+ fans</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm md:text-base max-w-xl mb-4 font-light leading-snug line-clamp-1 md:line-clamp-2">
                Join our community for daily brewing tips, behind-the-scenes, and exclusive updates.
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <a 
                  href="https://www.instagram.com/coffee99official/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-2 bg-[#ff3c3c] text-white rounded-full text-sm font-bold hover:bg-[#ff5555] transition-all shadow-lg shadow-[#ff3c3c]/20 group active:scale-95"
                >
                  <Instagram className="h-4 w-4" />
                  Follow on Instagram
                  <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                </a>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Shorts Section - Optimized for horizontal snap scrolling */}
        <section className="mb-12">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-7 h-7 bg-[#ff3c3c] rounded-lg flex items-center justify-center shadow-lg shadow-[#ff3c3c]/20">
              <PlayCircle className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Shorts</h2>
          </div>
          
          <div className="relative">
            <div className="flex gap-3.5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth touch-pan-x" style={{ WebkitOverflowScrolling: 'touch' }}>
              {isLoading ? (
                Array(6).fill(0).map((_, i) => <ShortSkeleton key={i} />)
              ) : (
                dynamicShorts.map((short, idx) => (
                  <motion.div
                    key={short.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.03 }}
                    className="min-w-[140px] sm:min-w-[180px] aspect-[9/16] relative rounded-2xl overflow-hidden group snap-start cursor-pointer border border-white/5"
                  >
                    <div className="w-full h-full bg-[#1a1a1a]">
                      <iframe
                        src={short.embedUrl}
                        title={short.caption || short.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    
                    <div className="absolute bottom-0 p-4 w-full bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none">
                      <p className="text-xs font-medium line-clamp-2 mb-1 group-hover:text-[#ff3c3c] transition-colors">
                        {short.caption || short.title}
                      </p>
                      <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                        <Eye className="h-2.5 w-2.5" />
                        {short.views}
                      </div>
                    </div>

                    {/* Delete Button for Creator */}
                    {user?.id === short.authorUid && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(short.id, 'short');
                        }}
                        className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-red-600 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
                        title="Delete Short"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Main Videos Grid */}
        <section>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-1 h-6 bg-[#ff3c3c] rounded-full" />
            <h2 className="text-2xl font-bold tracking-tight">Recommended</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {isLoading ? (
              Array(6).fill(0).map((_, i) => <VideoSkeleton key={i} />)
            ) : (
              filteredVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-[#1a1a1a] mb-4 shadow-2xl group-hover:shadow-[#ff3c3c]/5 transition-all duration-300">
                    <iframe
                      src={video.embedUrl}
                      title={video.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                    <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-2xl" />
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="shrink-0">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-[#1a1a1a]">
                        <img 
                          src={video.creatorAvatar} 
                          alt={video.creator}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-base leading-snug mb-1 line-clamp-2 group-hover:text-[#ff3c3c] transition-colors">
                          {video.title}
                        </h3>
                        {user?.id === video.authorUid && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(video.id, 'video');
                            }}
                            className="p-1.5 text-gray-500 hover:text-red-500 transition-colors"
                            title="Delete Video"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <div className="flex flex-col text-sm text-gray-400">
                        <span className="hover:text-white transition-colors">{video.creator}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span>{video.views}</span>
                          <span className="w-1 h-1 bg-gray-600 rounded-full" />
                          <span>{formatDate(video.postedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* Custom Styles for Hide Scrollbar and Shimmer */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes shimmer {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
}
