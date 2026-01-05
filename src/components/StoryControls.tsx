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

  // Accent Color State
  accentColor: string;
  setAccentColor: (c: string) => void;
  
  // Actions
  onDownload: () => void;
  onCopy: () => void;
  downloading: boolean;
  copying: boolean;
  hasReviewData: boolean;
  posterUrl?: string;
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
  accentColor, setAccentColor,
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

      {/* Modern Accent Color Picker */}
{/* Accent Color Picker (Updated) */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
        <div className="flex justify-between items-center mb-4">
          <label className="text-sm text-zinc-400 font-medium">Accent Color</label>
        </div>

        <div className="flex flex-col gap-4">
          {/* Input Row */}
          <div className="flex gap-3">
             {/* Native Picker Visual */}
            <div className="relative w-12 h-10 rounded-lg overflow-hidden border border-zinc-700 shadow-sm flex-shrink-0">
              <input 
                type="color" 
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] p-0 m-0 border-0 cursor-pointer"
              />
            </div>
            
            {/* Hex Text Input */}
            <div className="relative flex-1">
               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-sm">#</span>
               <input 
                  type="text"
                  value={accentColor.replace('#', '')}
                  onChange={(e) => {
                    const val = e.target.value;
                    // Only update if hex is valid-ish
                    if (/^[0-9A-Fa-f]{0,6}$/.test(val)) {
                      setAccentColor(`#${val}`);
                    }
                  }}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 pl-7 pr-3 text-sm font-mono text-white focus:outline-none focus:border-[#00e054] uppercase placeholder-zinc-600"
                  placeholder="HEX"
                  maxLength={6}
               />
            </div>
          </div>

          {/* Presets (Wrapped, no scroll) */}
          <div className="flex flex-wrap gap-2">
            {[
              { color: '#00e054', label: 'Green' }, 
              { color: '#d4a574', label: 'Gold' },  
              { color: '#40bcf4', label: 'Blue' },  
              { color: '#ff8000', label: 'Orange' },
              { color: '#eb3f5c', label: 'Red' },   
              { color: '#e449a3', label: 'Pink' },  
              { color: '#9d4edd', label: 'Purple' },
              { color: '#ffffff', label: 'White' },
            ].map((preset) => (
              <button
                key={preset.color}
                onClick={() => setAccentColor(preset.color)}
                className={`w-8 h-8 rounded-full border border-zinc-700 hover:scale-110 transition-transform focus:outline-none ${
                  accentColor.toLowerCase() === preset.color.toLowerCase() ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : ''
                }`}
                style={{ backgroundColor: preset.color }}
                title={preset.label}
              />
            ))}
          </div>
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

      {/* Font & Style Group */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 space-y-4">
        <div>
          <label className="text-sm text-zinc-400 mb-3 block">Font</label>
          <div className="grid grid-cols-3 gap-2">
            {['sans', 'serif', 'mono'].map((f) => (
              <button
                key={f}
                onClick={() => setFontType(f as FontType)}
                className={`p-3 rounded-lg border transition-all duration-200 ${
                  fontType === f
                    ? 'border-[#00e054] bg-[#00e054]/10'
                    : 'border-zinc-700 hover:border-zinc-600'
                }`}
              >
                <span className="text-xl block mb-1 text-white capitalize" style={{ 
                  fontFamily: f === 'sans' ? 'var(--font-inter)' : f === 'serif' ? 'var(--font-playfair)' : 'var(--font-mono)' 
                }}>Aa</span>
                <span className="text-xs text-zinc-500 capitalize">{f}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-zinc-800">
           <label className="text-sm text-zinc-400 mb-2 block">Text Style</label>
            <div className="flex gap-2">
              <button
                onClick={() => setIsBold(!isBold)}
                className={`flex-1 h-10 rounded-lg border flex items-center justify-center transition-all ${
                  isBold ? 'border-[#00e054] bg-[#00e054]/10 text-white' : 'border-zinc-700 text-zinc-500'
                }`}
              >
                <span className="font-bold">Bold</span>
              </button>
              <button
                onClick={() => setIsItalic(!isItalic)}
                className={`flex-1 h-10 rounded-lg border flex items-center justify-center transition-all ${
                  isItalic ? 'border-[#00e054] bg-[#00e054]/10 text-white' : 'border-zinc-700 text-zinc-500'
                }`}
              >
                <span className="italic">Italic</span>
              </button>
            </div>
        </div>
      </div>

      {/* Theme Base (Dark/Light/Neon) */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
        <label className="text-sm text-zinc-400 mb-3 block">Theme Base</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'neutral', label: 'Neutral', bg: '#ffffff' },
            { id: 'warm', label: 'Warm', bg: '#fff8e7' },
            { id: 'neon', label: 'Neon', bg: '#ffffff' }
          ].map((theme) => (
            <button
              key={theme.id}
              onClick={() => setColorTheme(theme.id as ColorTheme)}
              className={`p-2 rounded-lg border transition-all duration-200 flex items-center justify-center gap-2 ${
                colorTheme === theme.id ? 'border-[#00e054] bg-[#00e054]/10' : 'border-zinc-700 hover:border-zinc-600'
              }`}
            >
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.bg }} />
              <span className={`text-xs ${colorTheme === theme.id ? 'text-zinc-300' : 'text-zinc-500'}`}>{theme.label}</span>
            </button>
          ))}
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

      {/* Backdrop Adjustments */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
        <h4 className="text-sm text-zinc-400 mb-4 font-medium">Backdrop Adjustments</h4>
        
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

      {/* Backdrop Position & Poster Toggle */}
      <div className="grid grid-cols-1 gap-4">
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
          </div>
        )}

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
          <label className="text-sm text-zinc-400">Show Poster</label>
          <button
            onClick={() => setShowPoster(!showPoster)}
            className={`relative inline-flex items-center h-6 w-11 rounded-full border transition-colors ${showPoster ? 'bg-[#00e054] border-[#00e054]' : 'bg-zinc-800 border-zinc-700'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showPoster ? 'translate-x-5' : 'translate-x-1'}`}></span>
          </button>
        </div>
      </div>

      {/* Download Buttons */}
      <div className="hidden lg:flex gap-3 md:col-span-2">
        <button
          onClick={onCopy}
          disabled={copying || !hasReviewData}
          className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-700"
        >
          {copying ? 'Copying...' : 'Copy'}
        </button>
        <button
          onClick={onDownload}
          disabled={downloading || !hasReviewData}
          className="flex-1 flex items-center justify-center gap-2 bg-[#00e054] hover:bg-[#00c049] text-black font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {downloading ? 'Generating...' : 'Download'}
        </button>
      </div>
    </div>
  );
}