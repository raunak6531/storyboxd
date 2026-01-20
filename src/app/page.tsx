'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import html2canvas from 'html2canvas';
// IMPORT THE NEW CLIENT SCRAPER
import { scrapeLetterboxd, ReviewData } from '@/lib/clientScraper';
import { TemplateBottom, TemplateTopLeft, TemplateCentered, TemplateType, FontType, ColorTheme, TextStyle } from '@/components/StoryTemplates';
import StoryControls from '@/components/StoryControls';

interface RecentReview {
  url: string;
  movieTitle: string;
  username: string;
  posterUrl: string;
  timestamp: number;
}

type InputMode = 'import' | 'custom';

const STORAGE_KEY = 'storyboxd_recent_downloads';
const MAX_RECENT_DOWNLOADS = 12;

export default function Home() {
  const [inputMode, setInputMode] = useState<InputMode>('import');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState('');
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('bottom');
  const [mounted, setMounted] = useState(false);
  const [recentDownloads, setRecentDownloads] = useState<RecentReview[]>([]);

  // Custom mode form state
  const [customTitle, setCustomTitle] = useState('');
  const [customYear, setCustomYear] = useState('');
  const [customDirector, setCustomDirector] = useState('');
  const [customRating, setCustomRating] = useState(0);
  const [customReview, setCustomReview] = useState('');
  const [customUsername, setCustomUsername] = useState('');
  const [customPoster, setCustomPoster] = useState<string>('');
  const [tmdbSearchQuery, setTmdbSearchQuery] = useState('');
  const [tmdbResults, setTmdbResults] = useState<Array<{ id: number; title: string; year: string; poster: string }>>([]);
  const [searchingTmdb, setSearchingTmdb] = useState(false);

  // Text customization
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1);
  const [fontType, setFontType] = useState<FontType>('sans');
  const [colorTheme, setColorTheme] = useState<ColorTheme>('neutral');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [showPoster, setShowPoster] = useState(false);

  // Visuals State
  const [backdropPositionPercent, setBackdropPositionPercent] = useState(50);
  const [customBackdrop, setCustomBackdrop] = useState<string | null>(null);
  
  // Filter State
  const [backdropBlur, setBackdropBlur] = useState(0);
  const [backdropBrightness, setBackdropBrightness] = useState(100);
  const [backdropSaturation, setBackdropSaturation] = useState(100);

  // Accent Color
  const [accentColor, setAccentColor] = useState('#00e054');

  const textStyle: TextStyle = { fontType, colorTheme, isBold, isItalic };
  const storyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    loadRecentDownloads();
  }, []);

  useEffect(() => {
    return () => {
      if (customBackdrop && customBackdrop.startsWith('blob:')) {
        URL.revokeObjectURL(customBackdrop);
      }
    };
  }, [customBackdrop]);

  const loadRecentDownloads = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const downloads = JSON.parse(stored) as RecentReview[];
        const updatedDownloads = downloads.map(d => ({
          ...d,
          posterUrl: d.posterUrl || ''
        }));
        setRecentDownloads(updatedDownloads);
      }
    } catch (err) {
      console.error('Failed to load recent downloads:', err);
    }
  };

  const saveToRecentDownloads = useCallback((data: ReviewData, reviewUrl: string) => {
    try {
      const recent: RecentReview = {
        url: reviewUrl,
        movieTitle: data.movieTitle,
        username: data.username,
        posterUrl: data.posterUrl || '',
        timestamp: Date.now(),
      };
      
      setRecentDownloads(prev => {
        const existing = prev.filter(r => r.url !== reviewUrl);
        const updated = [recent, ...existing].slice(0, MAX_RECENT_DOWNLOADS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error('Failed to save recent download:', err);
    }
  }, []);

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomBackdrop(url);
    }
  };

  // TMDB Search
  const searchTmdb = async (query: string) => {
    if (!query.trim()) return;
    setSearchingTmdb(true);
    try {
      const res = await fetch(`/api/tmdb-search?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      setTmdbResults(data.results || []);
    } catch (err) {
      console.error('TMDB search failed:', err);
      setTmdbResults([]);
    } finally {
      setSearchingTmdb(false);
    }
  };

  const selectTmdbMovie = async (movie: { id: number; title: string; year: string; poster: string }) => {
    setCustomTitle(movie.title);
    setCustomYear(movie.year);
    setCustomPoster(movie.poster);
    setTmdbResults([]);
    setTmdbSearchQuery('');

    // Also fetch director
    try {
      const res = await fetch(`/api/movie-details?title=${encodeURIComponent(movie.title)}&year=${movie.year}&slug=`);
      const data = await res.json();
      if (data.director) {
        setCustomDirector(data.director);
      }
    } catch (err) {
      console.error('Failed to fetch director:', err);
    }
  };

  const handleCustomSubmit = () => {
    if (!customTitle.trim()) {
      setError('Please enter a movie title');
      return;
    }

    const ratingStars = '★'.repeat(Math.floor(customRating)) + (customRating % 1 !== 0 ? '½' : '');

    const data: ReviewData = {
      movieTitle: customTitle,
      year: customYear,
      director: customDirector,
      rating: ratingStars,
      ratingNumber: customRating,
      reviewText: customReview,
      username: customUsername || 'User',
      displayName: customUsername || 'User',
      posterUrl: customPoster,
      backdropUrl: customPoster, // Use poster as backdrop
      movieUrl: ''
    };

    setReviewData(data);
    setError('');
  };

  // --- LOADING FUNCTION FOR IMPORT MODE ---
  const loadReviewFromUrl = async (reviewUrl: string) => {
    setUrl(reviewUrl);
    setLoading(true);
    setError('');
    setReviewData(null);
    setCustomBackdrop(null);
    setBackdropBlur(0);
    setBackdropBrightness(100);
    setBackdropSaturation(100);
    setAccentColor('#00e054'); 

    try {
      // Direct Client Call - No server API needed!
      const data = await scrapeLetterboxd(reviewUrl);
      
      if (!data || !data.movieTitle) {
        throw new Error('Could not find review data. Make sure the link is correct.');
      }
      
      setReviewData(data);
    } catch (err) {
      console.error('Load Error:', err);
      setError('Failed to load review. The proxy might be busy, please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reviewData) setFontSizeMultiplier(1);
  }, [reviewData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    await loadReviewFromUrl(url.trim());
  };

  const generateImage = async (): Promise<string> => {
    if (!storyRef.current) throw new Error('Story ref not available');
    
    await document.fonts.ready;
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const canvas = await html2canvas(storyRef.current, {
      width: 1080,
      height: 1920,
      scale: 1,
      useCORS: true,
      backgroundColor: '#000000',
      logging: false,
    });
    return canvas.toDataURL('image/png');
  };

  const handleDownload = useCallback(async () => {
    if (!storyRef.current || !reviewData) return;
    setDownloading(true);
    try {
      const dataUrl = await generateImage();
      const link = document.createElement('a');
      link.download = `${reviewData.movieTitle || 'story'}-letterboxd.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      if (url) saveToRecentDownloads(reviewData, url);
    } catch (err) {
      console.error(err);
      setError('Failed to generate image. Please try again.');
    } finally {
      setDownloading(false);
    }
  }, [reviewData, url, saveToRecentDownloads]);

  const handleShare = async () => {
    if (!storyRef.current || !reviewData) return;
    setSharing(true);
    try {
      const dataUrl = await generateImage();
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `${reviewData.movieTitle}.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `My review of ${reviewData.movieTitle}`,
          text: 'Check out my review on Letterboxd!'
        });
      } else {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        alert('Image copied to clipboard!');
      }
    } catch (err) {
      console.error('Share failed:', err);
      setError('Share failed. Try downloading instead.');
    } finally {
      setSharing(false);
    }
  };

  const renderTemplate = () => {
    if (!reviewData) return null;
    const props = {
      data: reviewData,
      fontSizeMultiplier,
      textStyle,
      backdropPositionPercent,
      showPoster,
      customBackdropUrl: customBackdrop,
      backdropBlur,
      backdropBrightness,
      backdropSaturation,
      accentColor,
    };

    switch (selectedTemplate) {
      case 'bottom': return <TemplateBottom {...props} />;
      case 'topLeft': return <TemplateTopLeft {...props} />;
      case 'centered': return <TemplateCentered {...props} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-zinc-950 text-white overflow-hidden pb-24 lg:pb-0">
      
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-[#00e054] rounded-full mix-blend-multiply filter blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 -right-40 w-80 h-80 bg-orange-500 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className={`relative z-10 max-w-6xl mx-auto px-6 py-12 transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-[#00e054] rounded-full animate-pulse" />
            <span className="text-sm text-zinc-400">Letterboxd → Instagram</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-white via-white to-zinc-400 bg-clip-text text-transparent">Story</span>
            <span className="bg-gradient-to-r from-[#00e054] to-emerald-400 bg-clip-text text-transparent">Boxd</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-md mx-auto leading-relaxed">
            Transform your Letterboxd reviews into stunning Instagram stories
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-xl p-1">
            <button
              onClick={() => setInputMode('import')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                inputMode === 'import'
                  ? 'bg-[#00e054] text-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Import from Letterboxd
            </button>
            <button
              onClick={() => setInputMode('custom')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                inputMode === 'custom'
                  ? 'bg-[#00e054] text-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Create Custom
            </button>
          </div>
        </div>

        {/* Import Mode Form */}
        {inputMode === 'import' && (
          <form onSubmit={handleSubmit} className="mb-10 max-w-3xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00e054]/20 to-orange-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
              <div className="relative bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl p-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste your Letterboxd review URL..."
                    className="flex-1 bg-transparent px-4 py-3 text-white placeholder-zinc-500 focus:outline-none text-sm md:text-base"
                  />
                  <button
                    type="submit"
                    disabled={loading || !url}
                    className="bg-[#00e054] text-black font-semibold px-6 py-3 rounded-xl hover:bg-[#00c948] disabled:opacity-40 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? 'Creating...' : 'Create Story'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Custom Mode Form */}
        {inputMode === 'custom' && (
          <div className="mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00e054]/20 to-orange-500/20 rounded-3xl blur opacity-40 group-hover:opacity-60 transition duration-500" />
              <div className="relative bg-zinc-900/90 backdrop-blur-xl border border-zinc-800/80 rounded-3xl overflow-hidden">

                {/* TMDB Search Header */}
                <div className="bg-gradient-to-r from-zinc-800/50 to-zinc-900/50 border-b border-zinc-800 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-[#00e054]/10 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#00e054]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Find Your Movie</h3>
                      <p className="text-xs text-zinc-500">Search TMDB to auto-fill details</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={tmdbSearchQuery}
                        onChange={(e) => setTmdbSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), searchTmdb(tmdbSearchQuery))}
                        placeholder="Search movies..."
                        className="w-full bg-zinc-800/80 border border-zinc-700/50 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#00e054]/50 focus:ring-1 focus:ring-[#00e054]/20 transition-all"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => searchTmdb(tmdbSearchQuery)}
                      disabled={searchingTmdb || !tmdbSearchQuery.trim()}
                      className="bg-[#00e054] hover:bg-[#00c948] disabled:bg-zinc-700 disabled:text-zinc-400 text-black font-medium px-5 py-3 rounded-xl transition-all flex items-center gap-2"
                    >
                      {searchingTmdb ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      )}
                      <span className="hidden sm:inline">Search</span>
                    </button>
                  </div>
                  {tmdbResults.length > 0 && (
                    <div className="mt-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl overflow-hidden max-h-52 overflow-y-auto">
                      {tmdbResults.map((movie) => (
                        <button
                          key={movie.id}
                          onClick={() => selectTmdbMovie(movie)}
                          className="w-full px-4 py-3 text-left hover:bg-[#00e054]/10 flex items-center gap-4 border-b border-zinc-700/30 last:border-0 transition-colors"
                        >
                          {movie.poster ? (
                            <img src={movie.poster} alt="" className="w-10 h-14 object-cover rounded-lg shadow-lg" />
                          ) : (
                            <div className="w-10 h-14 bg-zinc-700 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-medium truncate">{movie.title}</div>
                            <div className="text-sm text-zinc-400">{movie.year}</div>
                          </div>
                          <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Form Body */}
                <div className="p-5 space-y-5">

                  {/* Divider with OR */}
                  <div className="flex items-center gap-4 py-1">
                    <div className="flex-1 h-px bg-zinc-800"></div>
                    <span className="text-xs text-zinc-500 font-medium">OR ENTER MANUALLY</span>
                    <div className="flex-1 h-px bg-zinc-800"></div>
                  </div>

                  {/* Movie Details Section */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wide">Movie Title</label>
                      <input
                        type="text"
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                        placeholder="Enter movie title"
                        className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-[#00e054]/50 focus:ring-1 focus:ring-[#00e054]/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wide">Year</label>
                      <input
                        type="text"
                        value={customYear}
                        onChange={(e) => setCustomYear(e.target.value)}
                        placeholder="2024"
                        className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-[#00e054]/50 focus:ring-1 focus:ring-[#00e054]/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wide">Director</label>
                      <input
                        type="text"
                        value={customDirector}
                        onChange={(e) => setCustomDirector(e.target.value)}
                        placeholder="Director name"
                        className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-[#00e054]/50 focus:ring-1 focus:ring-[#00e054]/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wide">Your Name</label>
                      <input
                        type="text"
                        value={customUsername}
                        onChange={(e) => setCustomUsername(e.target.value)}
                        placeholder="Your username"
                        className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-[#00e054]/50 focus:ring-1 focus:ring-[#00e054]/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div className="bg-zinc-800/30 rounded-xl p-4">
                    <label className="block text-xs font-medium text-zinc-400 mb-3 uppercase tracking-wide">Your Rating</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setCustomRating(customRating === star ? star - 0.5 : star)}
                          className="text-4xl transition-all transform hover:scale-110 active:scale-95"
                        >
                          <span className={`${
                            customRating >= star
                              ? 'text-[#00e054] drop-shadow-[0_0_8px_rgba(0,224,84,0.5)]'
                              : customRating >= star - 0.5
                                ? 'text-[#00e054]/50'
                                : 'text-zinc-700 hover:text-zinc-500'
                          } transition-all`}>
                            ★
                          </span>
                        </button>
                      ))}
                      <div className="ml-3 flex items-center gap-2">
                        {customRating > 0 ? (
                          <>
                            <span className="text-xl font-bold text-white">{customRating}</span>
                            <button
                              onClick={() => setCustomRating(0)}
                              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                            >
                              Clear
                            </button>
                          </>
                        ) : (
                          <span className="text-sm text-zinc-500">Click to rate</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Review Text */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wide">Your Review</label>
                    <textarea
                      value={customReview}
                      onChange={(e) => setCustomReview(e.target.value)}
                      placeholder="Write your thoughts about the movie..."
                      rows={4}
                      className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#00e054]/50 focus:ring-1 focus:ring-[#00e054]/20 transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="button"
                    onClick={handleCustomSubmit}
                    disabled={!customTitle.trim()}
                    className="w-full bg-gradient-to-r from-[#00e054] to-emerald-500 hover:from-[#00c948] hover:to-emerald-400 disabled:from-zinc-700 disabled:to-zinc-700 disabled:text-zinc-400 text-black font-bold px-6 py-4 rounded-xl transition-all shadow-lg shadow-[#00e054]/20 hover:shadow-[#00e054]/30 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Create Story
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-950/50 border border-red-900/50 rounded-xl p-4 mb-8 text-center text-red-400">{error}</div>
        )}

        {loading && !reviewData && (
          <div className="flex flex-col lg:flex-row gap-8 items-start justify-center animate-pulse">
             <div className="w-full lg:w-[600px] h-96 bg-zinc-900/30 rounded-xl" />
             <div className="w-[270px] h-[480px] bg-zinc-900/30 rounded-[2.5rem]" />
          </div>
        )}

        {reviewData && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
              
              <StoryControls
                selectedTemplate={selectedTemplate}
                setSelectedTemplate={setSelectedTemplate}
                fontSizeMultiplier={fontSizeMultiplier}
                setFontSizeMultiplier={setFontSizeMultiplier}
                fontType={fontType}
                setFontType={setFontType}
                colorTheme={colorTheme}
                setColorTheme={setColorTheme}
                isBold={isBold}
                setIsBold={setIsBold}
                isItalic={isItalic}
                setIsItalic={setIsItalic}
                showPoster={showPoster}
                setShowPoster={setShowPoster}
                backdropPositionPercent={backdropPositionPercent}
                setBackdropPositionPercent={setBackdropPositionPercent}
                customBackdrop={customBackdrop}
                setCustomBackdrop={setCustomBackdrop}
                handleBackgroundUpload={handleBackgroundUpload}
                backdropBlur={backdropBlur}
                setBackdropBlur={setBackdropBlur}
                backdropBrightness={backdropBrightness}
                setBackdropBrightness={setBackdropBrightness}
                backdropSaturation={backdropSaturation}
                setBackdropSaturation={setBackdropSaturation}
                accentColor={accentColor}
                setAccentColor={setAccentColor}
                onDownload={handleDownload}
                onShare={handleShare}
                downloading={downloading}
                sharing={sharing}
                hasReviewData={!!reviewData}
                posterUrl={reviewData.posterUrl}
              />

              <div className="flex-shrink-0">
                <div className="bg-zinc-800 rounded-[2.5rem] p-2 shadow-2xl">
                  <div className="bg-black rounded-[2rem] overflow-hidden relative" style={{ width: '270px', height: '480px' }}>
                    <div className="transform scale-[0.25] origin-top-left">
                      {renderTemplate()}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
        
        <div className="mt-16 pt-8 border-t border-zinc-900 text-center lg:block hidden">
          <p className="text-zinc-600 text-sm">
            Made with <span className="text-orange-500">♥</span> for movie lovers
          </p>
        </div>

        {reviewData && (
          <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/90 backdrop-blur-lg border-t border-zinc-800 p-4 lg:hidden z-50 flex gap-3 pb-safe">
            <button
              onClick={handleShare}
              disabled={sharing}
              className="flex-1 bg-zinc-800 text-white font-medium py-3 rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex-1 bg-[#00e054] text-black font-bold py-3 rounded-xl active:scale-95 transition-transform shadow-lg shadow-[#00e054]/20 flex items-center justify-center gap-2"
            >
              {downloading ? (
                 <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              ) : (
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              )}
              Save
            </button>
          </div>
        )}
        
        <div ref={storyRef} style={{ position: 'absolute', left: '-9999px', top: 0 }}>
           {renderTemplate()}
        </div>

      </div>
    </div>
  );
}