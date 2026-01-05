'use client';

import React from 'react';
import { FontType, ColorTheme, TemplateType } from './StoryTemplates';

interface StoryControlsProps {
  // Template State
  selectedTemplate: TemplateType;
  setSelectedTemplate: (t: TemplateType) => void;
  
  // Text State
  fontSizeMultiplier: number;
  setFontSizeMultiplier: (n: number) => void;
  fontType: FontType;
  setFontType: (f: FontType) => void;
  colorTheme: ColorTheme;
  setColorTheme: (c: ColorTheme) => void;
  isBold: boolean;
  setIsBold: (b: boolean) => void;
  isItalic: boolean;
  setIsItalic: (i: boolean) => void;
  
  // Visuals State
  showPoster: boolean;
  setShowPoster: (b: boolean) => void;
  backdropPositionPercent: number;
  setBackdropPositionPercent: (n: number) => void;
  customBackdrop: string | null;
  setCustomBackdrop: (s: string | null) => void;
  handleBackgroundUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  
  // Filter State
  backdropBlur: number;
  setBackdropBlur: (n: number) => void;
  backdropBrightness: number;
  setBackdropBrightness: (n: number) => void;
  backdropSaturation: number;
  setBackdropSaturation: (n: number) => void;
  
  // Actions
  onDownload: () => void;
  onCopy: () => void;
  downloading: boolean;
  copying: boolean;
  hasReviewData: boolean;
  posterUrl?: string; // To check if poster is available
}

export default function StoryControls({
  selectedTemplate, setSelectedTemplate,
  fontSizeMultiplier, setFontSizeMultiplier,
  fontType, setFontType,
  colorTheme, setColorTheme,
  isBold, setIsBold,
  isItalic, setIsItalic,
  showPoster, setShowPoster,
  backdropPositionPercent, setBackdropPositionPercent,
  customBackdrop, setCustomBackdrop, handleBackgroundUpload,
  backdropBlur, setBackdropBlur,
  backdropBrightness, setBackdropBrightness,
  backdropSaturation, setBackdropSaturation,
  onDownload, onCopy, downloading, copying, hasReviewData, posterUrl
}: StoryControlsProps) {
  
  return (
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

      {/* Backdrop Adjustments (Filters) */}
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

      {/* Backdrop Position Slider - Only show if using image backdrop */}
      {(!customBackdrop || !customBackdrop.includes('gradient')) && (
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
      )}

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
        {!posterUrl && (
          <p className="mt-2 text-xs text-zinc-500">Poster not available for this review</p>
        )}
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
          onClick={onCopy}
          disabled={copying || !hasReviewData}
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
          onClick={onDownload}
          disabled={downloading || !hasReviewData}
          className="flex-1 flex items-center justify-center gap-2 bg-[#00e054] hover:bg-[#00c049] active:bg-[#00b040] text-black font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#00e054]/20 hover:shadow-[#00e054]/30"
          title="Download (Ctrl+D or Cmd+D)"
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
  );
}