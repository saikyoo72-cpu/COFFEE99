import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  ChevronLeft, 
  Heart, 
  Share2, 
  MessageCircle, 
  Play, 
  Pause,
  Upload,
  X,
  Loader2,
  Video,
  Instagram
} from 'lucide-react';
import { supabase } from '../supabase';
import { useAuth } from '../context/AuthContext';

interface VideoData {
  id: string;
  video_url: string;
  review: string;
  created_at: string;
}

export default function Blogs() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [videoUrl, setVideoUrl] = useState('');
  const [review, setReview] = useState('');

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl) return;

    try {
      setUploading(true);

      // Insert into Database
      const { error: dbError } = await supabase
        .from('videos')
        .insert([
          {
            video_url: videoUrl,
            review: review
          }
        ]);

      if (dbError) throw dbError;

      setShowUploadModal(false);
      setVideoUrl('');
      setReview('');
      fetchVideos();
      alert('Video submitted successfully!');
    } catch (error: any) {
      console.error('Error submitting video:', error);
      alert(`Submission failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleLike = async (id: string) => {
    // Like system removed as per new schema focus on video_url and review
    console.log('Like clicked for', id);
  };

  // All videos are displayed in a single list now as 'type' is removed
  const allVideos = videos;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white font-sans selection:bg-primary-brown/30">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0f0f0f]/80 backdrop-blur-xl border-b border-white/5 h-16 flex items-center justify-between px-4">
        <Link to="/" className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-bold tracking-tight">Blogs</h1>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="p-2 bg-primary-brown hover:bg-primary-brown/80 rounded-full transition-all active:scale-95"
        >
          <Plus className="w-6 h-6 text-white" />
        </button>
      </nav>

      <main className="pt-20 pb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary-brown" />
            <p className="text-gray-500 animate-pulse">Loading amazing content...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] px-8 text-center gap-6">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
              <Video className="w-10 h-10 text-gray-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">No videos yet</h3>
              <p className="text-gray-500 text-sm max-w-xs">Be the first one to share a review!</p>
            </div>
            <button 
              onClick={() => setShowUploadModal(true)}
              className="px-8 py-3 bg-primary-brown text-white rounded-full font-bold text-sm uppercase tracking-widest"
            >
              Submit Now
            </button>
          </div>
        ) : (
          <section className="px-4">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="w-1 h-6 bg-primary-brown rounded-full"></span>
                Community Reviews
              </h2>
            </div>
            <div className="space-y-8">
              {allVideos.map((video) => (
                <FullVideoCard key={video.id} video={video} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-lg bg-[#1a1a1a] rounded-t-[32px] sm:rounded-[32px] overflow-hidden border border-white/10"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold">Share Video</h2>
                  <button 
                    onClick={() => setShowUploadModal(false)}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleUpload} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400 ml-1">Instagram Video URL</label>
                      <input 
                        type="url" 
                        placeholder="https://www.instagram.com/reels/..." 
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        required
                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-brown/50 transition-all"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400 ml-1">Review (Optional)</label>
                      <textarea 
                        placeholder="What do you think about this?" 
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        rows={3}
                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-brown/50 transition-all resize-none"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={uploading}
                    className="w-full py-4 bg-primary-brown text-white rounded-full font-bold text-base hover:bg-primary-brown/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Review'
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FullVideoCard({ video }: { video: VideoData }) {
  // Helper to check if it's a direct video link or an Instagram link
  const isDirectVideo = video.video_url.match(/\.(mp4|webm|ogg)/i);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white/5 rounded-[32px] overflow-hidden border border-white/5"
    >
      <div className="aspect-video relative group bg-black flex items-center justify-center">
        {isDirectVideo ? (
          <video 
            src={video.video_url} 
            className="w-full h-full object-cover"
            controls
            playsInline
          />
        ) : (
          <div className="text-center p-8">
            <Instagram className="w-12 h-12 text-pink-500 mx-auto mb-4" />
            <p className="text-sm text-gray-400 mb-4">Instagram Video</p>
            <a 
              href={video.video_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-xs font-bold transition-all"
            >
              Watch on Instagram
            </a>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold mb-2">Review</h3>
            <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
              {video.review || "No review provided."}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-brown flex items-center justify-center text-xs font-bold">
              C99
            </div>
            <span className="text-sm font-medium text-gray-300">Coffee99 Community</span>
          </div>
          <span className="text-xs text-gray-500 ml-auto">
            {new Date(video.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
