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
  Instagram,
  Volume2,
  VolumeX,
  Trash2,
  ShieldCheck
} from 'lucide-react';
import { supabase } from '../supabase';
import { useAuth } from '../context/AuthContext';

interface VideoData {
  id: string;
  embed_url: string;
  creator_name: string;
  created_at: string;
}

export default function Blogs() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [unmutedVideoId, setUnmutedVideoId] = useState<string | null>(null);
  
  // Admin Delete state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [videoToDelete, setVideoToDelete] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Form state
  const [videoUrl, setVideoUrl] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      console.log('[Blogs] Fetching videos from Supabase...');
      
      // Try fetching with created_at ordering first
      let { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false, nullsFirst: false });

      if (error) {
        console.error('[Blogs] Initial fetch error:', error);
        
        // Fallback: Fetch without ordering if created_at is missing or causing issues
        console.log('[Blogs] Attempting fallback fetch...');
        const fallback = await supabase
          .from('videos')
          .select('*');
        
        if (fallback.error) {
          console.error('[Blogs] Fallback fetch error:', fallback.error);
          throw fallback.error;
        }
        data = fallback.data;
      }

      console.log('[Blogs] Videos received:', data);
      setVideos(data || []);
    } catch (error: any) {
      console.error('[Blogs] Critical error fetching videos:', error.message || error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creatorName) {
      alert('Please enter a creator name');
      return;
    }

    try {
      setUploading(true);
      let finalUrl = videoUrl;

      // Handle file upload if a file is selected
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        console.log(`[Blogs] Uploading file to bucket 'video': ${filePath}`);
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('video')
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('video')
          .getPublicUrl(filePath);
        
        finalUrl = publicUrl;
      }

      if (!finalUrl) {
        alert('Please provide a video URL or upload a file');
        return;
      }

      // Insert into Database
      const { error: dbError } = await supabase
        .from('videos')
        .insert([
          {
            embed_url: finalUrl,
            creator_name: creatorName
          }
        ]);

      if (dbError) throw dbError;

      setShowUploadModal(false);
      setVideoUrl('');
      setCreatorName('');
      setSelectedFile(null);
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
    // Like system removed as per new schema focus on embed_url and creator_name
    console.log('Like clicked for', id);
  };

  const checkAdminAuth = () => {
    return Object.keys(sessionStorage).some(key => key.startsWith('admin_auth_') && sessionStorage.getItem(key) === 'true');
  };

  const getActiveBranchId = () => {
    const authKey = Object.keys(sessionStorage).find(key => key.startsWith('admin_auth_') && sessionStorage.getItem(key) === 'true');
    return authKey ? authKey.replace('admin_auth_', '') : 'shivmandir';
  };

  const initiateDelete = (videoId: string) => {
    setVideoToDelete(videoId);
    if (checkAdminAuth()) {
      setShowConfirmModal(true);
    } else {
      setShowPasswordModal(true);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setPasswordError('');

    try {
      const branchId = 'shivmandir'; // Default branch for verification
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword, branchId }),
      });

      const data = await response.json();
      if (data.success) {
        sessionStorage.setItem(`admin_auth_${branchId}`, 'true');
        setShowPasswordModal(false);
        setShowConfirmModal(true);
        setAdminPassword('');
      } else {
        setPasswordError('Wrong password');
      }
    } catch (err) {
      setPasswordError('Verification failed. Try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const confirmDelete = async () => {
    if (!videoToDelete) return;
    
    try {
      const branchId = getActiveBranchId();
      const response = await fetch(`/api/admin/videos/${branchId}/${videoToDelete}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setVideos(prev => prev.filter(v => v.id !== videoToDelete));
        setShowConfirmModal(false);
        setVideoToDelete(null);
      } else {
        alert('Failed to delete video');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error deleting video');
    }
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
        ) : (
          <section className="px-4">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="w-1 h-6 bg-primary-brown rounded-full"></span>
                Community Reviews
              </h2>
            </div>

            <div className="space-y-8">
              {videos.map((video) => (
                <FullVideoCard 
                  key={video.id} 
                  video={video} 
                  isUnmuted={unmutedVideoId === video.id}
                  onToggleMute={() => setUnmutedVideoId(unmutedVideoId === video.id ? null : video.id)}
                  onDelete={() => initiateDelete(video.id)}
                />
              ))}
              {videos.length === 0 && (
                <p className="text-center text-gray-500 py-10">No videos found. Be the first to share one!</p>
              )}
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
                      <label className="text-sm font-medium text-gray-400 ml-1">Video URL (or upload below)</label>
                      <input 
                        type="url" 
                        placeholder="https://www.instagram.com/reels/..." 
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-brown/50 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400 ml-1">Upload Video File</label>
                      <input 
                        type="file" 
                        accept="video/*"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-brown/50 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary-brown file:text-white hover:file:bg-primary-brown/80"
                      />
                      {selectedFile && (
                        <p className="text-xs text-primary-brown font-medium ml-1">Selected: {selectedFile.name}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400 ml-1">Creator Name</label>
                      <input 
                        type="text"
                        placeholder="Your name or handle" 
                        value={creatorName}
                        onChange={(e) => setCreatorName(e.target.value)}
                        required
                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-brown/50 transition-all"
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
                      'Submit Video'
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-[#1a1a1a] rounded-[32px] p-8 border border-white/10 shadow-2xl"
            >
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 bg-primary-brown/20 rounded-full flex items-center justify-center mb-4">
                  <ShieldCheck className="w-8 h-8 text-primary-brown" />
                </div>
                <h2 className="text-xl font-bold">Admin Access</h2>
                <p className="text-gray-400 text-sm mt-1">Enter password to delete video</p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <input 
                    type="password"
                    placeholder="Enter admin password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    autoFocus
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-brown/50 transition-all text-center text-lg tracking-widest"
                  />
                  {passwordError && (
                    <p className="text-red-500 text-xs mt-2 text-center font-medium">{passwordError}</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setAdminPassword('');
                      setPasswordError('');
                    }}
                    className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isVerifying}
                    className="flex-1 py-4 bg-primary-brown hover:bg-primary-brown/80 rounded-2xl font-bold transition-all disabled:opacity-50"
                  >
                    {isVerifying ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-[#1a1a1a] rounded-[32px] p-8 border border-white/10 shadow-2xl"
            >
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                  <Trash2 className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-xl font-bold">Delete Video?</h2>
                <p className="text-gray-400 text-sm mt-1">This action cannot be undone. The video will be removed from storage and database.</p>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setShowConfirmModal(false);
                    setVideoToDelete(null);
                  }}
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-4 bg-red-500 hover:bg-red-600 rounded-2xl font-bold transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FullVideoCard({ 
  video, 
  isUnmuted, 
  onToggleMute,
  onDelete
}: { 
  video: VideoData;
  isUnmuted: boolean;
  onToggleMute: () => void;
  onDelete: () => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Helper to check if it's a direct video link or an Instagram link
  const embedUrl = video.embed_url || '';
  const isDirectVideo = embedUrl.match(/\.(mp4|webm|ogg)/i);

  useEffect(() => {
    if (isDirectVideo && !thumbnail && !isGenerating) {
      setIsGenerating(true);
      const videoElement = document.createElement('video');
      videoElement.src = embedUrl;
      videoElement.crossOrigin = 'anonymous';
      videoElement.muted = true;
      videoElement.playsInline = true;
      videoElement.currentTime = 1; // Capture at 1 second
      
      const handleCapture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
          try {
            setThumbnail(canvas.toDataURL('image/jpeg', 0.7));
          } catch (e) {
            console.warn('Could not generate thumbnail due to CORS or other issues');
          }
        }
        videoElement.removeEventListener('seeked', handleCapture);
      };

      videoElement.addEventListener('seeked', handleCapture);
      
      // Fallback if seeked doesn't fire
      videoElement.onloadeddata = () => {
        videoElement.currentTime = 1;
      };
    }
  }, [embedUrl, isDirectVideo, thumbnail, isGenerating]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isUnmuted;
    }
  }, [isUnmuted]);

  const handlePlay = () => {
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn("Playback prevented:", err);
          setIsPlaying(false);
        });
      }
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleInteraction = (e: React.MouseEvent) => {
    if (!isDirectVideo) return;
    
    // If clicking the mute button, don't toggle play/pause here
    if ((e.target as HTMLElement).closest('.mute-toggle')) return;

    if (!isPlaying) {
      handlePlay();
      // Unmute on first interaction if not already unmuted
      if (!isUnmuted) onToggleMute();
    } else {
      // If already playing (e.g. from hover), first click should unmute
      if (!isUnmuted) {
        onToggleMute();
      } else {
        handlePause();
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white/5 rounded-[32px] overflow-hidden border border-white/5"
      onMouseEnter={isDirectVideo ? handlePlay : undefined}
      onMouseLeave={isDirectVideo ? handlePause : undefined}
      onClick={handleInteraction}
    >
      <div className="aspect-video relative group bg-black flex items-center justify-center cursor-pointer">
        {isDirectVideo ? (
          <>
            <video 
              key={embedUrl}
              ref={videoRef}
              src={embedUrl} 
              className={`w-full h-full object-cover transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
              muted={!isUnmuted}
              playsInline
              loop
              preload="auto"
              crossOrigin="anonymous"
              onCanPlay={() => {
                if (isPlaying && videoRef.current) {
                  videoRef.current.play().catch(() => {});
                }
              }}
            />
            
            {/* Mute Toggle Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleMute();
              }}
              className="mute-toggle absolute bottom-4 right-4 z-20 p-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10 hover:bg-black/70 transition-all active:scale-90"
            >
              {isUnmuted ? (
                <Volume2 className="w-5 h-5 text-white" />
              ) : (
                <VolumeX className="w-5 h-5 text-white" />
              )}
            </button>

            {/* Delete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="absolute top-4 right-4 z-20 p-2 bg-red-500/20 backdrop-blur-md rounded-full border border-red-500/20 hover:bg-red-500 transition-all active:scale-90 group/del"
            >
              <Trash2 className="w-4 h-4 text-red-500 group-hover/del:text-white" />
            </button>
            
            {/* Thumbnail Overlay */}
            <AnimatePresence>
              {!isPlaying && (
                <motion.div 
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10"
                >
                  {thumbnail ? (
                    <img 
                      src={thumbnail} 
                      alt="Thumbnail" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/5 flex items-center justify-center">
                      <Video className="w-10 h-10 text-white/20 animate-pulse" />
                    </div>
                  )}
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all">
                    <div className="w-16 h-16 bg-primary-brown rounded-full flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-white fill-current" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <div className="text-center p-8">
            <Instagram className="w-12 h-12 text-pink-500 mx-auto mb-4" />
            <p className="text-sm text-gray-400 mb-4">Instagram Video</p>
            <a 
              href={embedUrl} 
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
            <h3 className="text-xl font-bold mb-2">Creator</h3>
            <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
              {video.creator_name || "Anonymous"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-brown flex items-center justify-center text-xs font-bold">
              {video.creator_name ? video.creator_name.substring(0, 2).toUpperCase() : 'C9'}
            </div>
            <span className="text-sm font-medium text-gray-300">{video.creator_name || "Coffee99 Community"}</span>
          </div>
          <span className="text-xs text-gray-500 ml-auto">
            {video.created_at ? new Date(video.created_at).toLocaleDateString() : 'Just now'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
