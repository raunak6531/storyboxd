'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import html2canvas from 'html2canvas';
import { ReviewData } from '@/app/api/scrape/route';
import { TemplateBottom, TemplateTopLeft, TemplateCentered, FontType, ColorTheme, TextStyle } from '@/components/StoryTemplates';

type TemplateType = 'bottom' | 'topLeft' | 'centered';

interface RecentReview {
  url: string;
  movieTitle: string;
  username: string;
  posterUrl: string;
  timestamp: number;
}

// Example Letterboxd review URLs for demo
const EXAMPLE_URLS = [
  { url: 'https://letterboxd.com/film/the-shape-of-water/', label: 'The Shape of Water' },
  { url: 'https://letterboxd.com/film/parasite-2019/', label: 'Parasite' },
  { url: 'https://letterboxd.com/film/dune-2021/', label: 'Dune' },
];

const STORAGE_KEY = 'storyboxd_recent_downloads';
const MAX_RECENT_DOWNLOADS = 12;

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [copying, setCopying] = useState(false);
  const [error, setError] = useState('');
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('bottom');
  const [mounted, setMounted] = useState(false);
  const [recentDownloads, setRecentDownloads] = useState<RecentReview[]>([]);

  // Text customization
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1); // 0.6 to 1.4 range
  const [fontType, setFontType] = useState<FontType>('sans');
  const [colorTheme, setColorTheme] = useState<ColorTheme>('neutral');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [showPoster, setShowPoster] = useState(false);

  // Backdrop customizations
  const [backdropPositionPercent, setBackdropPositionPercent] = useState(50); // 0–100 (50=center)
  const [customBackdrop, setCustomBackdrop] = useState<string | null>(null);
  
  // New Filter State
  const [backdropBlur, setBackdropBlur] = useState(0);
  const [backdropBrightness, setBackdropBrightness] = useState(100);
  const [backdropSaturation, setBackdropSaturation] = useState(100);

  // Combined text style object
  const textStyle: TextStyle = { fontType, colorTheme, isBold, isItalic };

  const storyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    // Load recent downloads from localStorage
    loadRecentDownloads();
  }, []);

  // Clean up object URL when component unmounts or changes
  useEffect(() => {
    return () => {
      if (customBackdrop && customBackdrop.startsWith('blob:')) {
        URL.revokeObjectURL(customBackdrop);
      }
    };
  }, [customBackdrop]);

  // Load recent downloads from localStorage
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

  // Save download to recent downloads
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

  // Handle file upload for custom background
  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomBackdrop(url);
    }
  };

  // Load review from URL
  const loadReviewFromUrl = async (reviewUrl: string) => {
    setUrl(reviewUrl);
    setLoading(true);
    setError('');
    setReviewData(null);
    setCustomBackdrop(null);
    // Reset filters
    setBackdropBlur(0);
    setBackdropBrightness(100);
    setBackdropSaturation(100);

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: reviewUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch review');
      }

      setReviewData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Reset font size when new review loads
  useEffect(() => {
    if (reviewData) {
      setFontSizeMultiplier(1);
    }
  }, [reviewData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    await loadReviewFromUrl(url.trim());
  };

  const generateImage = async (): Promise<string> => {
    if (!storyRef.current) throw new Error('Story ref not available');

    await new Promise(resolve => setTimeout(resolve, 500));

    const canvas = await html2canvas(storyRef.current, {
      width: 1080,
      height: 1920,
      scale: 1,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#000000',
      logging: false,
    });

    return canvas.toDataURL('image/png');
  };

  const handleDownload = useCallback(async () => {
    if (!storyRef.current || !reviewData) return;

    setDownloading(true);
    setError('');

    try {
      const dataUrl = await generateImage();

      const link = document.createElement('a');
      link.download = `${reviewData.movieTitle || 'story'}-letterboxd.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (url) {
        saveToRecentDownloads(reviewData, url);
      }
    } catch (err) {
      console.error('Failed to generate image:', err);
      setError('Failed to generate image. Please try again.');
    } finally {
      setDownloading(false);
    }
  }, [reviewData, url, saveToRecentDownloads]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && reviewData && !downloading) {
        e.preventDefault();
        handleDownload();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [reviewData, downloading, handleDownload]);

  const handleCopyToClipboard = async () => {
    if (!storyRef.current || !reviewData) return;

    setCopying(true);
    setError('');

    try {
      const dataUrl = await generateImage();
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);

      const originalText = document.querySelector('[data-copy-button]')?.textContent;
      const copyButton = document.querySelector('[data-copy-button]') as HTMLElement;
      if (copyButton) {
        copyButton.textContent = 'Copied!';
        setTimeout(() => {
          if (copyButton && originalText) {
            copyButton.textContent = originalText;
          }
        }, 2000);
      }
    } catch (err) {
      console.error('Failed to copy image:', err);
      setError('Failed to copy image. Please try downloading instead.');
    } finally {
      setCopying(false);
    }
  };

  const renderTemplate = () => {
    if (!reviewData) return null;

    const templateProps = {
      data: reviewData,
      fontSizeMultiplier,
      textStyle,
      backdropPositionPercent,
      showPoster,
      customBackdropUrl: customBackdrop,
      backdropBlur,
      backdropBrightness,
      backdropSaturation,
    };

    switch (selectedTemplate) {
      case 'bottom':
        return <TemplateBottom {...templateProps} />;
      case 'topLeft':
        return <TemplateTopLeft {...templateProps} />;
      case 'centered':
        return <TemplateCentered {...templateProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-zinc-950 text-white overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-[#00e054] rounded-full mix-blend-multiply filter blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 -right-40 w-80 h-80 bg-orange-500 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Main Content */}
      <div className={`relative z-10 max-w-6xl mx-auto px-6 py-12 transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>

        {/* Hero Section */}
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
          <p className="text-sm text-zinc-600 mt-2">
            Press <kbd className="px-2 py-1 bg-zinc-800 rounded text-zinc-400">Enter</kbd> to submit • <kbd className="px-2 py-1 bg-zinc-800 rounded text-zinc-400">Ctrl+D</kbd> to download
          </p>
        </div>

        {/* URL Input Form */}
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !loading && url.trim()) {
                      handleSubmit(e);
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={loading || !url}
                  className="bg-[#00e054] text-black font-semibold px-6 py-3 rounded-xl hover:bg-[#00c948] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                >
                  {loading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Story</span>
                      <svg className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
            <p className="text-zinc-600 text-sm">
              Paste any Letterboxd review URL to get started
            </p>
            <span className="text-zinc-700 hidden sm:inline">•</span>
            <div className="flex items-center gap-2">
              <span className="text-zinc-600 text-sm">Try examples:</span>
              <div className="flex gap-2 flex-wrap justify-center">
                {EXAMPLE_URLS.map((example, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => loadReviewFromUrl(example.url)}
                    disabled={loading}
                    className="text-xs px-3 py-1 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 rounded-full text-zinc-400 hover:text-white transition-colors disabled:opacity-40"
                  >
                    {example.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </form>

        {/* Error message */}
        {error && (
          <div className="bg-red-950/50 border border-red-900/50 rounded-xl p-4 mb-8 backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <p className="text-red-400 text-center">{error}</p>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && !reviewData && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
              {/* Left: Controls Skeleton */}
              <div className="w-full lg:w-[560px] xl:w-[600px] flex-none grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 h-20 bg-zinc-900/50 border border-zinc-800 rounded-xl animate-pulse" />
                <div className="h-24 bg-zinc-900/50 border border-zinc-800 rounded-xl animate-pulse" />
                <div className="h-24 bg-zinc-900/50 border border-zinc-800 rounded-xl animate-pulse" />
                <div className="h-24 bg-zinc-900/50 border border-zinc-800 rounded-xl animate-pulse" />
                <div className="h-24 bg-zinc-900/50 border border-zinc-800 rounded-xl animate-pulse" />
                <div className="h-24 bg-zinc-900/50 border border-zinc-800 rounded-xl animate-pulse" />
                <div className="md:col-span-2 h-12 bg-zinc-900/50 border border-zinc-800 rounded-xl animate-pulse" />
              </div>
              {/* Right: Phone Preview Skeleton */}
              <div className="flex-shrink-0">
                <div className="bg-zinc-800 rounded-[2.5rem] p-2 shadow-2xl shadow-black/50">
                  <div className="bg-black rounded-[2rem] overflow-hidden relative" style={{ width: '270px', height: '480px' }}>
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-6 bg-zinc-900 rounded-full z-10" />
                    <div className="w-full h-full bg-zinc-900/30 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preview Section - Side by Side Layout */}
        {reviewData && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Side by side container */}
            <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">

              {/* Left: Controls */}
              <div className="w-full lg:w-[560px] xl:w-[600px] flex-none grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Template Selection */}
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-3">Style</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { id: 'bottom', label: 'Classic' },
                      { id: 'topLeft', label: 'Editorial' },
                      { id: 'centered', label: 'Focused' },
                    ] as { id: TemplateType; label: string }[]).map((template) => (
                      <button
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`relative p-3 rounded-xl border-2 transition-all duration-300 ${
                          selectedTemplate === template.id
                            ? 'border-[#00e054] bg-[#00e054]/10'
                            : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
                        }`}
                      >
                        {selectedTemplate === template.id && (
                          <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#00e054] rounded-full flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                        <p className={`font-medium text-xs ${selectedTemplate === template.id ? 'text-white' : 'text-zinc-400'}`}>
                          {template.label}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text Size Slider */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm text-zinc-400">Text Size</label>
                    <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">
                      {fontSizeMultiplier === 1 ? 'Auto' : `${Math.round(fontSizeMultiplier * 100)}%`}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-500">A</span>
                    <input
                      type="range"
                      min="0.6"
                      max="1.4"
                      step="0.1"
                      value={fontSizeMultiplier}
                      onChange={(e) => setFontSizeMultiplier(parseFloat(e.target.value))}
                      className="flex-1 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#00e054]"
                    />
                    <span className="text-sm text-zinc-500">A</span>
                  </div>
                  <button
                    onClick={() => setFontSizeMultiplier(1)}
                    className="text-xs text-zinc-500 hover:text-[#00e054] mt-2 transition-colors"
                  >
                    Reset to Auto
                  </button>
                </div>

                {/* Font Type Selector */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                  <label className="text-sm text-zinc-400 mb-3 block">Font</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setFontType('sans')}
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        fontType === 'sans'
                          ? 'border-[#00e054] bg-[#00e054]/10'
                          : 'border-zinc-700 hover:border-zinc-600'
                      }`}
                    >
                      <span className="text-xl block mb-1 text-white" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>Aa</span>
                      <span className={`text-xs ${fontType === 'sans' ? 'text-zinc-300' : 'text-zinc-500'}`}>Sans</span>
                    </button>
                    <button
                      onClick={() => setFontType('serif')}
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        fontType === 'serif'
                          ? 'border-[#00e054] bg-[#00e054]/10'
                          : 'border-zinc-700 hover:border-zinc-600'
                      }`}
                    >
                      <span className="text-xl block mb-1 text-white" style={{ fontFamily: 'var(--font-playfair), "Playfair Display", serif' }}>Aa</span>
                      <span className={`text-xs ${fontType === 'serif' ? 'text-zinc-300' : 'text-zinc-500'}`}>Serif</span>
                    </button>
                    <button
                      onClick={() => setFontType('mono')}
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        fontType === 'mono'
                          ? 'border-[#00e054] bg-[#00e054]/10'
                          : 'border-zinc-700 hover:border-zinc-600'
                      }`}
                    >
                      <span className="text-xl block mb-1 text-white" style={{ fontFamily: 'var(--font-mono), "Space Mono", monospace' }}>Aa</span>
                      <span className={`text-xs ${fontType === 'mono' ? 'text-zinc-300' : 'text-zinc-500'}`}>Mono</span>
                    </button>
                  </div>
                </div>

                {/* Color Theme Selector */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                  <label className="text-sm text-zinc-400 mb-3 block">Color</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setColorTheme('neutral')}
                      className={`p-2 rounded-lg border transition-all duration-200 flex items-center justify-center gap-2 ${
                        colorTheme === 'neutral' ? 'border-[#00e054] bg-[#00e054]/10' : 'border-zinc-700 hover:border-zinc-600'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-white" />
                      <span className={`text-xs ${colorTheme === 'neutral' ? 'text-zinc-300' : 'text-zinc-500'}`}>Neutral</span>
                    </button>
                    <button
                      onClick={() => setColorTheme('warm')}
                      className={`p-2 rounded-lg border transition-all duration-200 flex items-center justify-center gap-2 ${
                        colorTheme === 'warm' ? 'border-[#d4a574] bg-[#d4a574]/10' : 'border-zinc-700 hover:border-zinc-600'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-[#d4a574]" />
                      <span className={`text-xs ${colorTheme === 'warm' ? 'text-zinc-300' : 'text-zinc-500'}`}>Warm</span>
                    </button>
                    <button
                      onClick={() => setColorTheme('neon')}
                      className={`p-2 rounded-lg border transition-all duration-200 flex items-center justify-center gap-2 ${
                        colorTheme === 'neon' ? 'border-[#4FD1C5] bg-[#4FD1C5]/10' : 'border-zinc-700 hover:border-zinc-600'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-[#4FD1C5] shadow-[0_0_8px_rgba(79,209,197,0.8)]" />
                      <span className={`text-xs ${colorTheme === 'neon' ? 'text-zinc-300' : 'text-zinc-500'}`}>Teal</span>
                    </button>
                  </div>
                </div>

                {/* Custom Background Upload */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm text-zinc-400">Custom Background</label>
                    {customBackdrop && (
                      <button
                        onClick={() => setCustomBackdrop(null)}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBackgroundUpload}
                      className="hidden"
                      id="backdrop-upload"
                    />
                    <label
                      htmlFor="backdrop-upload"
                      className="flex items-center justify-center gap-2 w-full p-3 rounded-lg border border-dashed border-zinc-700 hover:border-[#00e054] hover:bg-zinc-800/50 cursor-pointer transition-all duration-200 group"
                    >
                      <svg className="w-5 h-5 text-zinc-500 group-hover:text-[#00e054]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm text-zinc-400 group-hover:text-white">
                        {customBackdrop ? 'Change Image' : 'Upload Image'}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Backdrop Filters (New) */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                  <h4 className="text-sm text-zinc-400 mb-4 font-medium">Backdrop Adjustments</h4>
                  
                  {/* Blur */}
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs text-zinc-500">Blur</span>
                      <span className="text-xs text-zinc-500">{backdropBlur}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={backdropBlur}
                      onChange={(e) => setBackdropBlur(parseInt(e.target.value))}
                      className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#00e054]"
                    />
                  </div>

                  {/* Brightness */}
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs text-zinc-500">Brightness</span>
                      <span className="text-xs text-zinc-500">{backdropBrightness}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={backdropBrightness}
                      onChange={(e) => setBackdropBrightness(parseInt(e.target.value))}
                      className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#00e054]"
                    />
                  </div>

                  {/* Saturation */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-xs text-zinc-500">Saturation</span>
                      <span className="text-xs text-zinc-500">{backdropSaturation}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={backdropSaturation}
                      onChange={(e) => setBackdropSaturation(parseInt(e.target.value))}
                      className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#00e054]"
                    />
                  </div>
                </div>

                {/* Backdrop Position Slider */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm text-zinc-400">Backdrop Position</label>
                    <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">{backdropPositionPercent}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-500">Left</span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={1}
                      value={backdropPositionPercent}
                      onChange={(e) => setBackdropPositionPercent(parseInt(e.target.value))}
                      className="flex-1 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#00e054]"
                    />
                    <span className="text-xs text-zinc-500">Right</span>
                  </div>
                  <button
                    onClick={() => setBackdropPositionPercent(50)}
                    className="text-xs text-zinc-500 hover:text-[#00e054] mt-2 transition-colors"
                  >
                    Reset to Center
                  </button>
                </div>

                {/* Show Poster Toggle */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-zinc-400">Show Poster</label>
                    <button
                      onClick={() => setShowPoster(!showPoster)}
                      className={`relative inline-flex items-center h-6 w-11 rounded-full border transition-colors ${showPoster ? 'bg-[#00e054] border-[#00e054]' : 'bg-zinc-800 border-zinc-700'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showPoster ? 'translate-x-5' : 'translate-x-1'}`}></span>
                    </button>
                  </div>
                </div>

                {/* Text Style */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                  <label className="text-sm text-zinc-400 mb-3 block">Text Style</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsBold(!isBold)}
                      className={`flex-1 p-2 rounded-lg border transition-all duration-200 ${
                        isBold ? 'border-[#00e054] bg-[#00e054]/10 text-white' : 'border-zinc-700 hover:border-zinc-600 text-zinc-500'
                      }`}
                    >
                      <span className="font-bold text-lg">B</span>
                    </button>
                    <button
                      onClick={() => setIsItalic(!isItalic)}
                      className={`flex-1 p-2 rounded-lg border transition-all duration-200 ${
                        isItalic ? 'border-[#00e054] bg-[#00e054]/10 text-white' : 'border-zinc-700 hover:border-zinc-600 text-zinc-500'
                      }`}
                    >
                      <span className="italic text-lg">I</span>
                    </button>
                  </div>
                </div>

                {/* Download & Copy Buttons (Desktop) */}
                <div className="hidden lg:flex gap-3 md:col-span-2">
                  <button
                    onClick={handleCopyToClipboard}
                    disabled={copying || !reviewData}
                    className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-700 hover:border-zinc-600"
                    data-copy-button
                  >
                    {copying ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Copying...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDownload}
                    disabled={downloading || !reviewData}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#00e054] hover:bg-[#00c049] active:bg-[#00b040] text-black font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#00e054]/20 hover:shadow-[#00e054]/30"
                  >
                    {downloading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>Download</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

              {/* Right: Phone Preview */}
              <div className="flex-shrink-0">
                <div className="relative">
                  {/* Phone frame mockup */}
                  <div className="bg-zinc-800 rounded-[2.5rem] p-2 shadow-2xl shadow-black/50">
                    <div className="bg-black rounded-[2rem] overflow-hidden relative" style={{ width: '270px', height: '480px' }}>
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full z-10" />
                      <div className="transform scale-[0.25] origin-top-left">
                        {renderTemplate()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Download & Copy Buttons (Mobile) */}
            <div className="lg:hidden mt-6 flex flex-col sm:flex-row gap-3 justify-center px-4">
              <button
                onClick={handleCopyToClipboard}
                disabled={copying || !reviewData}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-700 hover:border-zinc-600"
                data-copy-button
              >
                {copying ? 'Copying...' : 'Copy'}
              </button>
              <button
                onClick={handleDownload}
                disabled={downloading || !reviewData}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#00e054] hover:bg-[#00c049] active:bg-[#00b040] text-black font-semibold py-3 px-8 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#00e054]/20 hover:shadow-[#00e054]/30"
              >
                {downloading ? 'Generating...' : 'Download'}
              </button>
            </div>

            {/* Hidden full-size render target */}
            <div ref={storyRef} style={{ position: 'absolute', left: '-9999px', top: 0 }}>
              {renderTemplate()}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-zinc-900 text-center">
          <p className="text-zinc-600 text-sm">Made with <span className="text-orange-500">♥</span> for movie lovers</p>
        </div>
      </div>
    </div>
  );
}