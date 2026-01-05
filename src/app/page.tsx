'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import html2canvas from 'html2canvas';
import { ReviewData } from '@/app/api/scrape/route';
import { TemplateBottom, TemplateTopLeft, TemplateCentered, TemplateType, FontType, ColorTheme, TextStyle } from '@/components/StoryTemplates';
import StoryControls from '@/components/StoryControls';

interface RecentReview {
  url: string;
  movieTitle: string;
  username: string;
  posterUrl: string;
  timestamp: number;
}

const STORAGE_KEY = 'storyboxd_recent_downloads';
const MAX_RECENT_DOWNLOADS = 12;

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState('');
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('bottom');
  const [mounted, setMounted] = useState(false);
  const [recentDownloads, setRecentDownloads] = useState<RecentReview[]>([]);

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
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: reviewUrl }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to fetch review');
      setReviewData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
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
    
    // Ensure fonts are loaded
    await document.fonts.ready;
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const canvas = await html2canvas(storyRef.current, {
      width: 1080,
      height: 1920,
      scale: 1,
      useCORS: true,
      // allowTaint: true, <--- REMOVED: This was causing the crash!
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

      // Check for native sharing support
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `My review of ${reviewData.movieTitle}`,
          text: 'Check out my review on Letterboxd!'
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        // Simple toast feedback logic could go here, for now we just rely on button state
        alert('Image copied to clipboard!');
      }
    } catch (err) {
      console.error('Share failed:', err);
      // Fallback if sharing/copying completely fails
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
      
      {/* Animated background gradient */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-[#00e054] rounded-full mix-blend-multiply filter blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 -right-40 w-80 h-80 bg-orange-500 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className={`relative z-10 max-w-6xl mx-auto px-6 py-12 transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Header */}
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

        {/* Input Form */}
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

        {error && (
          <div className="bg-red-950/50 border border-red-900/50 rounded-xl p-4 mb-8 text-center text-red-400">{error}</div>
        )}

        {/* Loading Skeleton */}
        {loading && !reviewData && (
          <div className="flex flex-col lg:flex-row gap-8 items-start justify-center animate-pulse">
             <div className="w-full lg:w-[600px] h-96 bg-zinc-900/30 rounded-xl" />
             <div className="w-[270px] h-[480px] bg-zinc-900/30 rounded-[2.5rem]" />
          </div>
        )}

        {/* Main Interface */}
        {reviewData && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
              
              {/* Controls */}
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

              {/* Preview */}
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
        
        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-zinc-900 text-center lg:block hidden">
          <p className="text-zinc-600 text-sm">
            Made with <span className="text-orange-500">♥</span> for movie lovers
          </p>
        </div>

        {/* Mobile Sticky Action Bar */}
        {reviewData && (
          <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/90 backdrop-blur-lg border-t border-zinc-800 p-4 lg:hidden z-50 flex gap-3 pb-safe">
            <button
              onClick={handleShare}
              disabled={sharing}
              className="flex-1 bg-zinc-800 text-white font-medium py-3 rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              {sharing ? (
                 <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              ) : (
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
              )}
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
        
        {/* Hidden Render Target */}
        <div ref={storyRef} style={{ position: 'absolute', left: '-9999px', top: 0 }}>
           {renderTemplate()}
        </div>

      </div>
    </div>
  );
}