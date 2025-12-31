'use client';

import { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { ReviewData } from '@/app/api/scrape/route';
import { TemplateBottom, TemplateTopLeft, TemplateCentered, FontType, ColorTheme, TextStyle } from '@/components/StoryTemplates';

type TemplateType = 'bottom' | 'topLeft' | 'centered';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('bottom');
  const [mounted, setMounted] = useState(false);

  // Text customization
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1); // 0.6 to 1.4 range
  const [fontType, setFontType] = useState<FontType>('sans');
  const [colorTheme, setColorTheme] = useState<ColorTheme>('neutral');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  // Combined text style object
  const textStyle: TextStyle = { fontType, colorTheme, isBold, isItalic };

  const storyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset font size when new review loads
  useEffect(() => {
    if (reviewData) {
      setFontSizeMultiplier(1);
    }
  }, [reviewData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setReviewData(null);

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
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

  const handleDownload = async () => {
    if (!storyRef.current) return;

    setDownloading(true);
    setError('');

    try {
      // Wait a bit for images to fully load
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

      const dataUrl = canvas.toDataURL('image/png');

      const link = document.createElement('a');
      link.download = `${reviewData?.movieTitle || 'story'}-letterboxd.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to generate image:', err);
      setError('Failed to generate image. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const renderTemplate = () => {
    if (!reviewData) return null;

    const templateProps = {
      data: reviewData,
      fontSizeMultiplier,
      textStyle
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
      <div className={`relative z-10 max-w-2xl mx-auto px-6 py-12 transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>

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
        </div>

        {/* URL Input Form */}
        <form onSubmit={handleSubmit} className="mb-10">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#00e054]/20 to-orange-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
            <div className="relative bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl p-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste your Letterboxd review URL..."
                  className="flex-1 bg-transparent px-5 py-4 text-white placeholder-zinc-500 focus:outline-none text-base"
                />
                <button
                  type="submit"
                  disabled={loading || !url}
                  className="bg-[#00e054] text-black font-semibold px-8 py-4 rounded-xl hover:bg-[#00c948] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 group/btn"
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
          <p className="text-zinc-600 text-sm mt-4 text-center">
            Paste any Letterboxd review URL to get started
          </p>
        </form>

        {/* Error message */}
        {error && (
          <div className="bg-red-950/50 border border-red-900/50 rounded-xl p-4 mb-8 backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <p className="text-red-400 text-center">{error}</p>
          </div>
        )}

        {/* Preview Section - Side by Side Layout */}
        {reviewData && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Side by side container */}
            <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">

              {/* Left: Controls */}
              <div className="w-full lg:w-80 space-y-6">

                {/* Template Selection */}
                <div>
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

                {/* Font Type Selector - 3 very distinct fonts */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                  <label className="text-sm text-zinc-400 mb-3 block">Font</label>
                  <div className="grid grid-cols-3 gap-2">
                    {/* Sans */}
                    <button
                      onClick={() => setFontType('sans')}
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        fontType === 'sans'
                          ? 'border-[#00e054] bg-[#00e054]/10'
                          : 'border-zinc-700 hover:border-zinc-600'
                      }`}
                    >
                      <span className="text-xl block mb-1 text-white" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
                        Aa
                      </span>
                      <span className={`text-xs ${fontType === 'sans' ? 'text-zinc-300' : 'text-zinc-500'}`}>
                        Sans
                      </span>
                    </button>

                    {/* Serif */}
                    <button
                      onClick={() => setFontType('serif')}
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        fontType === 'serif'
                          ? 'border-[#00e054] bg-[#00e054]/10'
                          : 'border-zinc-700 hover:border-zinc-600'
                      }`}
                    >
                      <span className="text-xl block mb-1 text-white" style={{ fontFamily: 'var(--font-playfair), "Playfair Display", serif' }}>
                        Aa
                      </span>
                      <span className={`text-xs ${fontType === 'serif' ? 'text-zinc-300' : 'text-zinc-500'}`}>
                        Serif
                      </span>
                    </button>

                    {/* Mono */}
                    <button
                      onClick={() => setFontType('mono')}
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        fontType === 'mono'
                          ? 'border-[#00e054] bg-[#00e054]/10'
                          : 'border-zinc-700 hover:border-zinc-600'
                      }`}
                    >
                      <span className="text-xl block mb-1 text-white" style={{ fontFamily: 'var(--font-mono), "Space Mono", monospace' }}>
                        Aa
                      </span>
                      <span className={`text-xs ${fontType === 'mono' ? 'text-zinc-300' : 'text-zinc-500'}`}>
                        Mono
                      </span>
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
                        colorTheme === 'neutral'
                          ? 'border-[#00e054] bg-[#00e054]/10'
                          : 'border-zinc-700 hover:border-zinc-600'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-white" />
                      <span className={`text-xs ${colorTheme === 'neutral' ? 'text-zinc-300' : 'text-zinc-500'}`}>
                        Neutral
                      </span>
                    </button>

                    <button
                      onClick={() => setColorTheme('warm')}
                      className={`p-2 rounded-lg border transition-all duration-200 flex items-center justify-center gap-2 ${
                        colorTheme === 'warm'
                          ? 'border-[#d4a574] bg-[#d4a574]/10'
                          : 'border-zinc-700 hover:border-zinc-600'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-[#d4a574]" />
                      <span className={`text-xs ${colorTheme === 'warm' ? 'text-zinc-300' : 'text-zinc-500'}`}>
                        Warm
                      </span>
                    </button>

                    <button
                      onClick={() => setColorTheme('neon')}
                      className={`p-2 rounded-lg border transition-all duration-200 flex items-center justify-center gap-2 ${
                        colorTheme === 'neon'
                          ? 'border-[#00e054] bg-[#00e054]/10'
                          : 'border-zinc-700 hover:border-zinc-600'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-[#00e054] shadow-[0_0_8px_rgba(0,224,84,0.8)]" />
                      <span className={`text-xs ${colorTheme === 'neon' ? 'text-zinc-300' : 'text-zinc-500'}`}>
                        Neon
                      </span>
                    </button>
                  </div>
                </div>

                {/* Bold & Italic Toggles */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                  <label className="text-sm text-zinc-400 mb-3 block">Text Style</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsBold(!isBold)}
                      className={`flex-1 p-2 rounded-lg border transition-all duration-200 ${
                        isBold
                          ? 'border-[#00e054] bg-[#00e054]/10 text-white'
                          : 'border-zinc-700 hover:border-zinc-600 text-zinc-500'
                      }`}
                    >
                      <span className="font-bold text-lg">B</span>
                    </button>

                    <button
                      onClick={() => setIsItalic(!isItalic)}
                      className={`flex-1 p-2 rounded-lg border transition-all duration-200 ${
                        isItalic
                          ? 'border-[#00e054] bg-[#00e054]/10 text-white'
                          : 'border-zinc-700 hover:border-zinc-600 text-zinc-500'
                      }`}
                    >
                      <span className="italic text-lg">I</span>
                    </button>
                  </div>
                </div>

                {/* Download Button - Desktop */}
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="hidden lg:flex w-full bg-[#00e054] hover:bg-[#00c049] text-black font-semibold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 items-center justify-center gap-2"
                >
                  {downloading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download Story
                    </>
                  )}
                </button>
              </div>

              {/* Right: Phone Preview */}
              <div className="flex-shrink-0">
                <div className="relative">
                  {/* Phone frame mockup */}
                  <div className="bg-zinc-800 rounded-[2.5rem] p-2 shadow-2xl shadow-black/50">
                    <div className="bg-black rounded-[2rem] overflow-hidden relative" style={{ width: '270px', height: '480px' }}>
                      {/* Notch */}
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full z-10" />
                      {/* Preview content */}
                      <div className="transform scale-[0.25] origin-top-left">
                        {renderTemplate()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Download Button - Mobile (below preview) */}
            <div className="lg:hidden mt-6 flex justify-center">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="bg-[#00e054] hover:bg-[#00c049] text-black font-semibold py-3 px-8 rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
              >
                {downloading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Story
                  </>
                )}
              </button>
            </div>

            {/* Hidden full-size render target for download */}
            <div
              ref={storyRef}
              style={{
                position: 'absolute',
                left: '-9999px',
                top: 0,
              }}
            >
              {renderTemplate()}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-zinc-900 text-center">
          <p className="text-zinc-600 text-sm">
            Made with <span className="text-orange-500">♥</span> for movie lovers
          </p>
        </div>
      </div>
    </div>
  );
}
