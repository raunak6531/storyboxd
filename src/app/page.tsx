'use client';

import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { ReviewData } from '@/app/api/scrape/route';
import { TemplateBottom, TemplateTopLeft, TemplateCentered } from '@/components/StoryTemplates';

type TemplateType = 'bottom' | 'topLeft' | 'centered';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('bottom');
  const storyRef = useRef<HTMLDivElement>(null);

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

    switch (selectedTemplate) {
      case 'bottom':
        return <TemplateBottom data={reviewData} />;
      case 'topLeft':
        return <TemplateTopLeft data={reviewData} />;
      case 'centered':
        return <TemplateCentered data={reviewData} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">
          StoryBoxd
        </h1>
        <p className="text-gray-400 mb-8">
          Turn your Letterboxd reviews into beautiful Instagram stories
        </p>

        {/* URL Input Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste your Letterboxd review URL..."
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded-full px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#00e054]"
            />
            <button
              type="submit"
              disabled={loading || !url}
              className="bg-white text-black font-semibold px-8 py-4 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Loading...' : 'Create story'}
            </button>
          </div>
          <p className="text-gray-500 text-sm mt-3 text-center sm:text-left">
            Works with reviews, movies and profiles
          </p>
        </form>

        {/* Error message */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-8">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Preview Section */}
        {reviewData && (
          <div className="space-y-8">
            {/* Movie Info */}
            <div className="bg-zinc-900 rounded-xl p-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-1">
                {reviewData.movieTitle} <span className="text-gray-400">({reviewData.year})</span>
              </h2>
              <p className="text-[#00e054] text-xl mb-2">
                {'★'.repeat(Math.floor(reviewData.ratingNumber))}
                {reviewData.ratingNumber % 1 !== 0 && '½'}
              </p>
              <p className="text-gray-400 text-sm italic max-w-lg mx-auto">
                &ldquo;{reviewData.reviewText.length > 150
                  ? reviewData.reviewText.substring(0, 150) + '...'
                  : reviewData.reviewText}&rdquo;
              </p>
              <p className="text-gray-500 text-xs mt-2">by {reviewData.username}</p>
            </div>

            {/* Template Selection */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-center">Select style</h2>
              <div className="flex justify-center gap-2 flex-wrap">
                {([
                  { id: 'bottom', label: 'Bottom', icon: '▼' },
                  { id: 'topLeft', label: 'Top Left', icon: '◤' },
                  { id: 'centered', label: 'Centered', icon: '◉' },
                ] as { id: TemplateType; label: string; icon: string }[]).map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`px-4 py-2 rounded-full border-2 flex items-center gap-2 transition-all ${
                      selectedTemplate === template.id
                        ? 'border-[#00e054] bg-[#00e054]/20 text-[#00e054]'
                        : 'border-gray-600 hover:border-gray-400 text-gray-400'
                    }`}
                  >
                    <span>{template.icon}</span>
                    <span className="text-sm">{template.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Story Preview (scaled down for display) */}
            <div className="flex justify-center">
              <div className="transform scale-[0.25] origin-top" style={{ height: '480px' }}>
                <div>
                  {renderTemplate()}
                </div>
              </div>
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

            {/* Download Button */}
            <div className="flex justify-center">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="bg-white text-black font-semibold px-12 py-4 rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {downloading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
