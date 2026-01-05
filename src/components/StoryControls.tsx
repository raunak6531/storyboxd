'use client';

import React, { useState } from 'react';
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
  onShare: () => void; // Renamed from onCopy
  downloading: boolean;
  sharing: boolean;    // Renamed from copying
  hasReviewData: boolean;
  posterUrl?: string;
}

// Helper component for Accordion Sections
const ControlSection = ({ 
  title, 
  isOpen, 
  onClick, 
  children 
}: { 
  title: string; 
  isOpen: boolean; 
  onClick: () => void; 
  children: React.ReactNode 
}) => (
  <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/30">
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 text-left font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors"
    >
      <span>{title}</span>
      <svg
        className={`w-5 h-5 transform transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#00e054]' : 'text-zinc-500'}`}
        fill="none" viewBox="0 0 24 24" stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    
    {isOpen && (
      <div className="p-4 pt-0 border-t border-zinc-800/50 animate-in slide-in-from-top-2 duration-200">
        <div className="pt-4 flex flex-col gap-6">
          {children}
        </div>
      </div>
    )}
  </div>
);

export default function StoryControls(props: StoryControlsProps) {
  const [openSection, setOpenSection] = useState<string | null>('style');

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="w-full lg:w-[560px] xl:w-[600px] flex-none flex flex-col gap-4">

      {/* SECTION 1: STYLE & TYPOGRAPHY */}
      <ControlSection 
        title="Style & Typography" 
        isOpen={openSection === 'style'} 
        onClick={() => toggleSection('style')}
      >
        {/* Template Selection */}
        <div>
          <label className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-3 block">Template</label>
          <div className="grid grid-cols-3 gap-2">
            {([
              { id: 'bottom', label: 'Classic' },
              { id: 'topLeft', label: 'Editorial' },
              { id: 'centered', label: 'Focused' },
            ] as { id: TemplateType; label: string }[]).map((template) => (
              <button
                key={template.id}
                onClick={() => props.setSelectedTemplate(template.id)}
                className={`relative p-3 rounded-xl border-2 transition-all duration-300 ${
                  props.selectedTemplate === template.id
                    ? 'border-[#00e054] bg-[#00e054]/10'
                    : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
                }`}
              >
                {props.selectedTemplate === template.id && (
                  <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#00e054] rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                <p className={`font-medium text-xs ${props.selectedTemplate === template.id ? 'text-white' : 'text-zinc-400'}`}>
                  {template.label}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Font & Size Group */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Size</label>
              <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">
                {props.fontSizeMultiplier === 1 ? 'Auto' : `${Math.round(props.fontSizeMultiplier * 100)}%`}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-500">A</span>
              <input
                type="range"
                min="0.6"
                max="1.4"
                step="0.1"
                value={props.fontSizeMultiplier}
                onChange={(e) => props.setFontSizeMultiplier(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#00e054]"
              />
              <span className="text-sm text-zinc-500">A</span>
            </div>
          </div>

          <div>
            <label className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-2 block">Font Family</label>
            <div className="grid grid-cols-3 gap-2">
              {['sans', 'serif', 'mono'].map((f) => (
                <button
                  key={f}
                  onClick={() => props.setFontType(f as FontType)}
                  className={`p-2 rounded-lg border transition-all duration-200 ${
                    props.fontType === f
                      ? 'border-[#00e054] bg-[#00e054]/10'
                      : 'border-zinc-700 hover:border-zinc-600'
                  }`}
                >
                  <span className="text-lg block mb-0.5 text-white capitalize" style={{ 
                    fontFamily: f === 'sans' ? 'var(--font-inter)' : f === 'serif' ? 'var(--font-playfair)' : 'var(--font-mono)' 
                  }}>Aa</span>
                  <span className="text-[10px] text-zinc-500 capitalize">{f}</span>
                </button>
              ))}
            </div>
          </div>

           <div>
              <label className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-2 block">Formatting</label>
              <div className="flex gap-2">
                <button
                  onClick={() => props.setIsBold(!props.isBold)}
                  className={`flex-1 h-9 rounded-lg border flex items-center justify-center transition-all ${
                    props.isBold ? 'border-[#00e054] bg-[#00e054]/10 text-white' : 'border-zinc-700 text-zinc-500'
                  }`}
                >
                  <span className="font-bold text-sm">Bold</span>
                </button>
                <button
                  onClick={() => props.setIsItalic(!props.isItalic)}
                  className={`flex-1 h-9 rounded-lg border flex items-center justify-center transition-all ${
                    props.isItalic ? 'border-[#00e054] bg-[#00e054]/10 text-white' : 'border-zinc-700 text-zinc-500'
                  }`}
                >
                  <span className="italic text-sm">Italic</span>
                </button>
              </div>
          </div>
        </div>
      </ControlSection>

      {/* SECTION 2: COLORS */}
      <ControlSection 
        title="Colors & Theme" 
        isOpen={openSection === 'colors'} 
        onClick={() => toggleSection('colors')}
      >
        {/* Accent Color Picker (No Scrollbar) */}
        <div>
           <div className="flex justify-between items-center mb-3">
            <label className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Accent Color</label>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <div className="relative w-12 h-10 rounded-lg overflow-hidden border border-zinc-700 shadow-sm flex-shrink-0">
                <input 
                  type="color" 
                  value={props.accentColor}
                  onChange={(e) => props.setAccentColor(e.target.value)}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] p-0 m-0 border-0 cursor-pointer"
                />
              </div>
              <div className="relative flex-1">
                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-sm">#</span>
                 <input 
                    type="text"
                    value={props.accentColor.replace('#', '')}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^[0-9A-Fa-f]{0,6}$/.test(val)) props.setAccentColor(`#${val}`);
                    }}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg py-2.5 pl-7 pr-3 text-sm font-mono text-white focus:outline-none focus:border-[#00e054] uppercase placeholder-zinc-600"
                    placeholder="HEX"
                    maxLength={6}
                 />
              </div>
            </div>

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
                  onClick={() => props.setAccentColor(preset.color)}
                  className={`w-8 h-8 rounded-full border border-zinc-700 hover:scale-110 transition-transform focus:outline-none ${
                    props.accentColor.toLowerCase() === preset.color.toLowerCase() ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : ''
                  }`}
                  style={{ backgroundColor: preset.color }}
                  title={preset.label}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Theme Base */}
        <div>
          <label className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-2 block">Theme Base</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'neutral', label: 'Neutral', bg: '#ffffff' },
              { id: 'warm', label: 'Warm', bg: '#fff8e7' },
              { id: 'neon', label: 'Neon', bg: '#ffffff' }
            ].map((theme) => (
              <button
                key={theme.id}
                onClick={() => props.setColorTheme(theme.id as ColorTheme)}
                className={`p-2 rounded-lg border transition-all duration-200 flex items-center justify-center gap-2 ${
                  props.colorTheme === theme.id ? 'border-[#00e054] bg-[#00e054]/10' : 'border-zinc-700 hover:border-zinc-600'
                }`}
              >
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.bg }} />
                <span className={`text-xs ${props.colorTheme === theme.id ? 'text-zinc-300' : 'text-zinc-500'}`}>{theme.label}</span>
              </button>
            ))}
          </div>
        </div>
      </ControlSection>

      {/* SECTION 3: BACKGROUND */}
      <ControlSection 
        title="Background Image" 
        isOpen={openSection === 'background'} 
        onClick={() => toggleSection('background')}
      >
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Custom Image</label>
            {props.customBackdrop && (
              <button
                onClick={() => props.setCustomBackdrop(null)}
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
              onChange={props.handleBackgroundUpload}
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
                {props.customBackdrop ? 'Change Image' : 'Upload Image'}
              </span>
            </label>
          </div>
        </div>

        {/* Position Slider */}
        {(!props.customBackdrop || !props.customBackdrop.includes('gradient')) && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Position</label>
              <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">{props.backdropPositionPercent}%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-500">Left</span>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={props.backdropPositionPercent}
                onChange={(e) => props.setBackdropPositionPercent(parseInt(e.target.value))}
                className="flex-1 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#00e054]"
              />
              <span className="text-xs text-zinc-500">Right</span>
            </div>
          </div>
        )}

        {/* Poster Toggle */}
        <div className="flex items-center justify-between pt-2">
          <label className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Show Poster</label>
          <button
            onClick={() => props.setShowPoster(!props.showPoster)}
            className={`relative inline-flex items-center h-6 w-11 rounded-full border transition-colors ${props.showPoster ? 'bg-[#00e054] border-[#00e054]' : 'bg-zinc-800 border-zinc-700'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${props.showPoster ? 'translate-x-5' : 'translate-x-1'}`}></span>
          </button>
        </div>
      </ControlSection>

      {/* SECTION 4: FILTERS */}
      <ControlSection 
        title="Image Filters" 
        isOpen={openSection === 'filters'} 
        onClick={() => toggleSection('filters')}
      >
        {[{
            label: 'Blur', value: props.backdropBlur, max: 20, unit: 'px', 
            onChange: props.setBackdropBlur
          }, {
            label: 'Brightness', value: props.backdropBrightness, max: 200, unit: '%', 
            onChange: props.setBackdropBrightness
          }, {
            label: 'Saturation', value: props.backdropSaturation, max: 200, unit: '%', 
            onChange: props.setBackdropSaturation
          }
        ].map((control) => (
          <div key={control.label}>
            <div className="flex justify-between mb-2">
              <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">{control.label}</span>
              <span className="text-xs text-zinc-500">{control.value}{control.unit}</span>
            </div>
            <input
              type="range"
              min="0"
              max={control.max}
              value={control.value}
              onChange={(e) => control.onChange(parseInt(e.target.value))}
              className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#00e054]"
            />
          </div>
        ))}
      </ControlSection>

      {/* DESKTOP BUTTONS (Matching Mobile functionality) */}
      <div className="hidden lg:flex gap-3 mt-4">
        <button
          onClick={props.onShare}
          disabled={props.sharing || !props.hasReviewData}
          className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-700"
        >
          {props.sharing ? (
             <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          ) : (
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
          )}
          {props.sharing ? 'Sharing...' : 'Share'}
        </button>
        <button
          onClick={props.onDownload}
          disabled={props.downloading || !props.hasReviewData}
          className="flex-1 flex items-center justify-center gap-2 bg-[#00e054] hover:bg-[#00c049] text-black font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#00e054]/20"
        >
          {props.downloading ? (
             <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          ) : (
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          )}
          {props.downloading ? 'Saving...' : 'Download'}
        </button>
      </div>

    </div>
  );
}