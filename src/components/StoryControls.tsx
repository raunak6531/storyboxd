'use client';

import React, { useState } from 'react';
import { FontType, ColorTheme, TemplateType, TextAlign, QuoteStyle } from './StoryTemplates';
import FontPicker from './FontPicker';
import { useWebFont } from '@/hooks/useWebFont';

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
  letterSpacing: number;
  setLetterSpacing: (n: number) => void;
  lineHeight: number;
  setLineHeight: (n: number) => void;

  // Visuals State
  showPoster: boolean;
  setShowPoster: (b: boolean) => void;
  backdropPositionPercent: number;
  setBackdropPositionPercent: (n: number) => void;
  backdropPositionYPercent: number;
  setBackdropPositionYPercent: (n: number) => void;
  customBackdrop: string | null;
  setCustomBackdrop: (s: string | null) => void;
  availableBackdrops: { url: string; thumbnail: string }[];
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

  // Text Alignment & Quote Style
  textAlign: TextAlign;
  setTextAlign: (a: TextAlign) => void;
  quoteStyle: QuoteStyle;
  setQuoteStyle: (q: QuoteStyle) => void;


  // Actions
  onDownload: () => void;
  onShare: () => void; // Renamed to Share
  downloading: boolean;
  sharing: boolean;
  hasReviewData: boolean;
  posterUrl?: string;
  onRandomize: () => void;
}

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
  useWebFont(props.fontType);
  const [openSection, setOpenSection] = useState<string | null>('style');

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="w-full lg:w-[560px] xl:w-[600px] flex-none flex flex-col gap-4">
      {/* SHUFFLE BUTTON */}
      <button
        onClick={props.onRandomize}
        className="w-full h-12 mb-2 relative overflow-hidden bg-zinc-900 border border-zinc-700/50 rounded-xl group transition-all duration-300 hover:border-[#00e054]/50 hover:shadow-[0_0_20px_rgba(0,224,84,0.1)] focus:outline-none"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00e054]/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        <div className="flex items-center justify-center gap-2 relative z-10 text-zinc-400 group-hover:text-[#00e054] font-medium tracking-wide text-sm uppercase">
          <svg className="w-4 h-4 transition-transform duration-500 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Shuffle Design
        </div>
      </button>

      {/* SECTION 1: STYLE & TYPOGRAPHY */}
      <ControlSection
        title="Style & Typography"
        isOpen={openSection === 'style'}
        onClick={() => toggleSection('style')}
      >
        {/* Template Selection with Mini Previews */}
        <div>
          <label className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-3 block">Template</label>
          <div className="grid grid-cols-3 gap-2">
            {([
              {
                id: 'bottom', label: 'Classic', preview: (
                  <svg viewBox="0 0 36 64" fill="none" className="w-full h-full">
                    <rect width="36" height="64" rx="2" fill="#1a1a1a" />
                    <rect x="4" y="4" width="28" height="30" rx="1" fill="#333" opacity="0.5" />
                    <rect x="4" y="38" width="18" height="2" rx="1" fill="#fff" opacity="0.8" />
                    <rect x="4" y="42" width="12" height="1.5" rx="0.75" fill="#00e054" opacity="0.7" />
                    <rect x="4" y="46" width="28" height="1" rx="0.5" fill="#666" opacity="0.4" />
                    <rect x="4" y="49" width="24" height="1" rx="0.5" fill="#666" opacity="0.4" />
                    <rect x="4" y="52" width="20" height="1" rx="0.5" fill="#666" opacity="0.4" />
                    <rect x="4" y="58" width="10" height="1.5" rx="0.75" fill="#555" opacity="0.5" />
                  </svg>
                )
              },
              {
                id: 'topLeft', label: 'Editorial', preview: (
                  <svg viewBox="0 0 36 64" fill="none" className="w-full h-full">
                    <rect width="36" height="64" rx="2" fill="#1a1a1a" />
                    <rect x="0" y="0" width="36" height="64" rx="2" fill="#333" opacity="0.3" />
                    <rect x="4" y="6" width="20" height="2.5" rx="1" fill="#fff" opacity="0.9" />
                    <rect x="4" y="11" width="14" height="1.5" rx="0.75" fill="#00e054" opacity="0.7" />
                    <rect x="4" y="15" width="8" height="8" rx="1" fill="#555" opacity="0.5" />
                    <rect x="4" y="40" width="28" height="1" rx="0.5" fill="#888" opacity="0.4" />
                    <rect x="4" y="43" width="24" height="1" rx="0.5" fill="#888" opacity="0.4" />
                    <rect x="4" y="46" width="20" height="1" rx="0.5" fill="#888" opacity="0.4" />
                  </svg>
                )
              },
              {
                id: 'centered', label: 'Focused', preview: (
                  <svg viewBox="0 0 36 64" fill="none" className="w-full h-full">
                    <rect width="36" height="64" rx="2" fill="#1a1a1a" />
                    <rect x="0" y="0" width="36" height="64" rx="2" fill="#333" opacity="0.3" />
                    <rect x="6" y="14" width="24" height="36" rx="2" fill="#222" opacity="0.8" stroke="#444" strokeWidth="0.5" />
                    <rect x="13" y="18" width="10" height="2" rx="1" fill="#fff" opacity="0.8" />
                    <rect x="14" y="22" width="8" height="1.5" rx="0.75" fill="#00e054" opacity="0.7" />
                    <rect x="10" y="28" width="16" height="1" rx="0.5" fill="#666" opacity="0.4" />
                    <rect x="11" y="31" width="14" height="1" rx="0.5" fill="#666" opacity="0.4" />
                    <rect x="12" y="34" width="12" height="1" rx="0.5" fill="#666" opacity="0.4" />
                    <rect x="14" y="42" width="8" height="1.5" rx="0.75" fill="#555" opacity="0.5" />
                  </svg>
                )
              },
              {
                id: 'minimal', label: 'Minimal', preview: (
                  <svg viewBox="0 0 36 64" fill="none" className="w-full h-full">
                    <rect width="36" height="64" rx="2" fill="#0a0a0a" />
                    <rect x="10" y="16" width="16" height="2" rx="1" fill="#fff" opacity="0.9" />
                    <rect x="12" y="20" width="12" height="1.5" rx="0.75" fill="#00e054" opacity="0.6" />
                    <rect x="8" y="28" width="20" height="1" rx="0.5" fill="#666" opacity="0.3" />
                    <rect x="9" y="31" width="18" height="1" rx="0.5" fill="#666" opacity="0.3" />
                    <rect x="10" y="34" width="16" height="1" rx="0.5" fill="#666" opacity="0.3" />
                    <rect x="13" y="42" width="10" height="1.5" rx="0.75" fill="#555" opacity="0.4" />
                  </svg>
                )
              },
              {
                id: 'split', label: 'Split', preview: (
                  <svg viewBox="0 0 36 64" fill="none" className="w-full h-full">
                    <rect width="36" height="64" rx="2" fill="#1a1a1a" />
                    <rect x="0" y="0" width="36" height="28" rx="2" fill="#333" opacity="0.5" />
                    <rect x="12" y="10" width="12" height="16" rx="1" fill="#555" opacity="0.6" />
                    <rect x="4" y="32" width="18" height="2" rx="1" fill="#fff" opacity="0.8" />
                    <rect x="4" y="36" width="12" height="1.5" rx="0.75" fill="#00e054" opacity="0.7" />
                    <rect x="4" y="42" width="28" height="1" rx="0.5" fill="#666" opacity="0.4" />
                    <rect x="4" y="45" width="24" height="1" rx="0.5" fill="#666" opacity="0.4" />
                  </svg>
                )
              },
              {
                id: 'magazine', label: 'Magazine', preview: (
                  <svg viewBox="0 0 36 64" fill="none" className="w-full h-full">
                    <rect width="36" height="64" rx="2" fill="#1a1a1a" />
                    <rect x="0" y="0" width="36" height="64" rx="2" fill="#333" opacity="0.4" />
                    <rect x="4" y="4" width="16" height="1.5" rx="0.75" fill="#00e054" opacity="0.5" />
                    <rect x="4" y="44" width="20" height="2.5" rx="1" fill="#fff" opacity="0.9" />
                    <rect x="24" y="42" width="8" height="12" rx="1" fill="#555" opacity="0.6" />
                    <rect x="4" y="49" width="14" height="1.5" rx="0.75" fill="#888" opacity="0.5" />
                    <rect x="4" y="54" width="18" height="1" rx="0.5" fill="#666" opacity="0.4" />
                    <rect x="4" y="57" width="15" height="1" rx="0.5" fill="#666" opacity="0.4" />
                  </svg>
                )
              },
              {
                id: 'cinematic', label: 'Cinematic', preview: (
                  <svg viewBox="0 0 36 64" fill="none" className="w-full h-full">
                    <rect width="36" height="64" rx="2" fill="#000" />
                    <rect x="0" y="10" width="36" height="44" fill="#333" opacity="0.4" />
                    <rect x="0" y="0" width="36" height="12" fill="#000" opacity="0.7" />
                    <rect x="0" y="52" width="36" height="12" fill="#000" opacity="0.7" />
                    <rect x="6" y="3" width="24" height="2.5" rx="1" fill="#fff" opacity="0.9" />
                    <rect x="10" y="7" width="16" height="1.5" rx="0.75" fill="#888" opacity="0.5" />
                    <rect x="12" y="55" width="12" height="1.5" rx="0.75" fill="#00e054" opacity="0.7" />
                    <rect x="8" y="58" width="20" height="1" rx="0.5" fill="#666" opacity="0.4" />
                  </svg>
                )
              },
              {
                id: 'gradient', label: 'Gradient', preview: (
                  <svg viewBox="0 0 36 64" fill="none" className="w-full h-full">
                    <defs>
                      <linearGradient id="grd" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00e054" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#1a1a2e" />
                      </linearGradient>
                    </defs>
                    <rect width="36" height="64" rx="2" fill="url(#grd)" />
                    <rect x="6" y="16" width="24" height="32" rx="3" fill="#fff" opacity="0.08" stroke="#fff" strokeWidth="0.3" strokeOpacity="0.2" />
                    <rect x="10" y="22" width="16" height="2" rx="1" fill="#fff" opacity="0.8" />
                    <rect x="12" y="26" width="12" height="1.5" rx="0.75" fill="#00e054" opacity="0.7" />
                    <rect x="9" y="32" width="18" height="1" rx="0.5" fill="#fff" opacity="0.3" />
                    <rect x="10" y="35" width="16" height="1" rx="0.5" fill="#fff" opacity="0.3" />
                    <rect x="11" y="38" width="14" height="1" rx="0.5" fill="#fff" opacity="0.3" />
                  </svg>
                )
              },
              {
                id: 'duotone', label: 'Duotone', preview: (
                  <svg viewBox="0 0 36 64" fill="none" className="w-full h-full">
                    <rect width="36" height="64" rx="2" fill="#0a0a0a" />
                    <rect x="0" y="0" width="36" height="64" rx="2" fill="#00e054" opacity="0.15" />
                    <rect x="4" y="4" width="1.5" height="56" rx="0.75" fill="#00e054" opacity="0.6" />
                    <rect x="8" y="10" width="20" height="3" rx="1" fill="#fff" opacity="0.9" />
                    <rect x="8" y="16" width="14" height="1.5" rx="0.75" fill="#888" opacity="0.5" />
                    <rect x="8" y="22" width="8" height="1.5" rx="0.75" fill="#00e054" opacity="0.6" />
                    <rect x="8" y="30" width="24" height="1" rx="0.5" fill="#666" opacity="0.4" />
                    <rect x="8" y="33" width="20" height="1" rx="0.5" fill="#666" opacity="0.4" />
                    <rect x="8" y="36" width="22" height="1" rx="0.5" fill="#666" opacity="0.4" />
                  </svg>
                )
              },
              {
                id: 'newspaper', label: 'Newspaper', preview: (
                  <svg viewBox="0 0 36 64" fill="none" className="w-full h-full">
                    <rect width="36" height="64" rx="2" fill="#f5f0e8" />
                    <rect x="10" y="3" width="16" height="1.5" rx="0.75" fill="#111" opacity="0.3" />
                    <rect x="5" y="6" width="26" height="3" rx="1" fill="#111" opacity="0.8" />
                    <rect x="4" y="11" width="28" height="0.5" fill="#222" opacity="0.3" />
                    <rect x="4" y="14" width="22" height="3" rx="1" fill="#111" opacity="0.9" />
                    <rect x="4" y="19" width="14" height="1.5" rx="0.75" fill="#555" opacity="0.5" />
                    <rect x="4" y="24" width="28" height="12" rx="1" fill="#ccc" opacity="0.5" />
                    <rect x="4" y="40" width="12" height="1" rx="0.5" fill="#333" opacity="0.4" />
                    <rect x="4" y="43" width="28" height="1" rx="0.5" fill="#333" opacity="0.3" />
                    <rect x="4" y="46" width="24" height="1" rx="0.5" fill="#333" opacity="0.3" />
                    <rect x="4" y="49" width="28" height="1" rx="0.5" fill="#333" opacity="0.3" />
                  </svg>
                )
              },

              {
                id: 'vhs', label: 'Retro VHS', preview: (
                  <svg viewBox="0 0 36 64" fill="none" className="w-full h-full">
                    <rect width="36" height="64" rx="2" fill="#0a0a0a" />
                    <rect x="0" y="0" width="36" height="64" rx="2" fill="#333" opacity="0.3" />
                    <circle cx="7" cy="5" r="1.5" fill="#ff0033" opacity="0.8" />
                    <rect x="11" y="3.5" width="8" height="2" rx="1" fill="#fff" opacity="0.7" />
                    <rect x="4" y="44" width="18" height="2.5" rx="1" fill="#fff" opacity="0.8" />
                    <rect x="4" y="49" width="12" height="1.5" rx="0.75" fill="#888" opacity="0.5" />
                    <rect x="4" y="53" width="8" height="1.5" rx="0.75" fill="#00e054" opacity="0.6" />
                    <rect x="4" y="57" width="28" height="1" rx="0.5" fill="#666" opacity="0.4" />
                    <rect x="4" y="60" width="20" height="1" rx="0.5" fill="#666" opacity="0.4" />
                  </svg>
                )
              },
              {
                id: 'letterboxd', label: 'Letterboxd', preview: (
                  <svg viewBox="0 0 36 64" fill="none" className="w-full h-full">
                    <rect width="36" height="64" rx="2" fill="#14181c" />
                    <rect x="0" y="0" width="36" height="6" fill="#1c2228" />
                    <circle cx="9" cy="3" r="1.2" fill="#ff8000" />
                    <circle cx="12" cy="3" r="1.2" fill="#00e054" />
                    <circle cx="15" cy="3" r="1.2" fill="#40bcf4" />
                    <rect x="0" y="6" width="36" height="26" fill="#333" opacity="0.4" />
                    <rect x="4" y="34" width="8" height="14" rx="1" fill="#555" opacity="0.6" />
                    <rect x="15" y="34" width="16" height="2.5" rx="1" fill="#fff" opacity="0.8" />
                    <rect x="15" y="38" width="10" height="1.5" rx="0.75" fill="#9ab" opacity="0.5" />
                    <rect x="15" y="42" width="6" height="1.5" rx="0.75" fill="#00e054" opacity="0.6" />
                    <rect x="15" y="46" width="17" height="1" rx="0.5" fill="#678" opacity="0.4" />
                    <rect x="15" y="49" width="14" height="1" rx="0.5" fill="#678" opacity="0.4" />
                    <rect x="0" y="60" width="36" height="4" fill="#1c2228" />
                  </svg>
                )
              },
            ] as { id: TemplateType; label: string; preview: React.ReactNode }[]).map((template) => (
              <button
                key={template.id}
                onClick={() => props.setSelectedTemplate(template.id)}
                className={`relative rounded-xl border-2 transition-all duration-300 overflow-hidden ${props.selectedTemplate === template.id
                  ? 'border-[#00e054] bg-[#00e054]/10 shadow-[0_0_12px_rgba(0,224,84,0.15)]'
                  : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
                  }`}
              >
                {props.selectedTemplate === template.id && (
                  <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#00e054] rounded-full flex items-center justify-center z-10">
                    <svg className="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                <div className="p-2 pb-1">
                  <div className="w-full aspect-[9/16] rounded-md overflow-hidden">
                    {template.preview}
                  </div>
                </div>
                <p className={`font-medium text-[10px] pb-2 text-center ${props.selectedTemplate === template.id ? 'text-white' : 'text-zinc-500'}`}>
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

          {/* FONTS - GOOGLE FONTS PICKER */}
          <div>
            <label className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-2 block">Font Family</label>
            <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/50 p-3">
              <FontPicker currentFont={props.fontType} onFontSelect={props.setFontType} />
            </div>
          </div>

          <div>
            <label className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-2 block">Formatting</label>
            <div className="flex gap-2">
              <button
                onClick={() => props.setIsBold(!props.isBold)}
                className={`flex-1 h-9 rounded-lg border flex items-center justify-center transition-all ${props.isBold ? 'border-[#00e054] bg-[#00e054]/10 text-white' : 'border-zinc-700 text-zinc-500'
                  }`}
              >
                <span className="font-bold text-sm">Bold</span>
              </button>
              <button
                onClick={() => props.setIsItalic(!props.isItalic)}
                className={`flex-1 h-9 rounded-lg border flex items-center justify-center transition-all ${props.isItalic ? 'border-[#00e054] bg-[#00e054]/10 text-white' : 'border-zinc-700 text-zinc-500'
                  }`}
              >
                <span className="italic text-sm">Italic</span>
              </button>
            </div>
          </div>

          {/* Letter Spacing */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Letter Spacing</label>
              <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">
                {props.letterSpacing === 0 ? 'Normal' : `${props.letterSpacing > 0 ? '+' : ''}${props.letterSpacing}px`}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-500">Tight</span>
              <input
                type="range"
                min="-2"
                max="8"
                step="0.5"
                value={props.letterSpacing}
                onChange={(e) => props.setLetterSpacing(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#00e054]"
              />
              <span className="text-xs text-zinc-500">Wide</span>
            </div>
          </div>

          {/* Line Height */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Line Height</label>
              <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">
                {props.lineHeight.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-500">Tight</span>
              <input
                type="range"
                min="1.0"
                max="2.2"
                step="0.1"
                value={props.lineHeight}
                onChange={(e) => props.setLineHeight(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#00e054]"
              />
              <span className="text-xs text-zinc-500">Loose</span>
            </div>
            {/* Text Alignment */}
            <div>
              <label className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-2 block">Text Alignment</label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { id: 'left', label: 'Left', icon: '☰' },
                  { id: 'center', label: 'Center', icon: '☰' },
                  { id: 'right', label: 'Right', icon: '☰' },
                ] as { id: TextAlign; label: string; icon: string }[]).map((align) => (
                  <button
                    key={align.id}
                    onClick={() => props.setTextAlign(align.id)}
                    className={`p-2 rounded-lg border transition-all duration-200 flex items-center justify-center gap-1.5 ${props.textAlign === align.id ? 'border-[#00e054] bg-[#00e054]/10 text-white' : 'border-zinc-700 text-zinc-500 hover:border-zinc-600'}`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {align.id === 'left' && <><path strokeLinecap="round" strokeWidth={2} d="M3 6h18M3 12h12M3 18h16" /></>}
                      {align.id === 'center' && <><path strokeLinecap="round" strokeWidth={2} d="M3 6h18M6 12h12M4 18h16" /></>}
                      {align.id === 'right' && <><path strokeLinecap="round" strokeWidth={2} d="M3 6h18M9 12h12M5 18h16" /></>}
                    </svg>
                    <span className="text-xs">{align.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quote Style */}
            <div>
              <label className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-2 block">Quote Style</label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { id: 'double', label: '\u201C \u201D' },
                  { id: 'angle', label: '\u00AB \u00BB' },
                  { id: 'none', label: 'None' },
                ] as { id: QuoteStyle; label: string }[]).map((quote) => (
                  <button
                    key={quote.id}
                    onClick={() => props.setQuoteStyle(quote.id)}
                    className={`p-2 rounded-lg border transition-all duration-200 text-center ${props.quoteStyle === quote.id ? 'border-[#00e054] bg-[#00e054]/10 text-white' : 'border-zinc-700 text-zinc-500 hover:border-zinc-600'}`}
                  >
                    <span className="text-sm font-medium">{quote.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ControlSection>



      {/* SECTION 2: COLORS */}
      <ControlSection title="Colors & Theme" isOpen={openSection === 'colors'} onClick={() => toggleSection('colors')}>
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

            {/* Color Palettes */}
            {([
              { name: 'Classic', colors: ['#00e054', '#40bcf4', '#ff8000', '#eb3f5c', '#9d4edd', '#ffffff'] },
              { name: 'Warm', colors: ['#d4a574', '#e8a87c', '#d35400', '#c0392b', '#f39c12', '#ffeaa7'] },
              { name: 'Cool', colors: ['#74b9ff', '#a29bfe', '#00cec9', '#6c5ce7', '#0984e3', '#dfe6e9'] },
              { name: 'Neon', colors: ['#00ff87', '#ff006e', '#ffbe0b', '#8338ec', '#3a86ff', '#00f5d4'] },
              { name: 'Pastel', colors: ['#fab1a0', '#81ecec', '#ffeaa7', '#dfe6e9', '#a29bfe', '#fd79a8'] },
              { name: 'Film', colors: ['#c8b88a', '#8b7355', '#a0522d', '#2f4f4f', '#b8860b', '#daa520'] },
            ]).map((palette) => (
              <div key={palette.name} className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-600 w-10 flex-shrink-0 uppercase tracking-wider">{palette.name}</span>
                <div className="flex gap-1.5 flex-1">
                  {palette.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => props.setAccentColor(color)}
                      className={`w-7 h-7 rounded-full border hover:scale-110 transition-transform focus:outline-none ${props.accentColor.toLowerCase() === color.toLowerCase()
                        ? 'ring-2 ring-white ring-offset-1 ring-offset-black border-white/50'
                        : 'border-zinc-700/50'
                        }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            ))}
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
                className={`p-2 rounded-lg border transition-all duration-200 flex items-center justify-center gap-2 ${props.colorTheme === theme.id ? 'border-[#00e054] bg-[#00e054]/10' : 'border-zinc-700 hover:border-zinc-600'
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
      <ControlSection title="Background Image" isOpen={openSection === 'background'} onClick={() => toggleSection('background')}>
        {/* ... paste previous content ... */}
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

        {/* TMDB Backdrop Gallery */}
        {props.availableBackdrops.length > 1 && (
          <div>
            <label className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-2 block">Movie Backdrops</label>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-700">
              {props.availableBackdrops.map((bd, i) => (
                <button
                  key={i}
                  onClick={() => props.setCustomBackdrop(bd.url)}
                  className={`shrink-0 w-24 h-14 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${props.customBackdrop === bd.url
                    ? 'border-[#00e054] ring-1 ring-[#00e054]/50'
                    : 'border-zinc-700/50 hover:border-zinc-500'
                    }`}
                >
                  <img
                    src={`/api/proxy-image?url=${encodeURIComponent(bd.thumbnail)}`}
                    alt={`Backdrop ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Position Slider */}
        {(!props.customBackdrop || !props.customBackdrop.includes('gradient')) && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Position X</label>
              <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">{props.backdropPositionPercent}%</span>
            </div>
            <div className="flex items-center gap-3 mb-4">
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

            <div className="flex justify-between items-center mb-2">
              <label className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Position Y</label>
              <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">{props.backdropPositionYPercent}%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-500">Top</span>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={props.backdropPositionYPercent}
                onChange={(e) => props.setBackdropPositionYPercent(parseInt(e.target.value))}
                className="flex-1 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#00e054]"
              />
              <span className="text-xs text-zinc-500">Bottom</span>
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
      <ControlSection title="Image Filters" isOpen={openSection === 'filters'} onClick={() => toggleSection('filters')}>
        {/* ... paste previous content ... */}
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

      {/* DESKTOP BUTTONS (RENAMED TO SHARE) */}
      <div className="hidden lg:flex gap-3 mt-4">
        <button
          onClick={props.onShare}
          disabled={props.sharing || !props.hasReviewData}
          className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-700"
        >
          {props.sharing ? (
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
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
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          )}
          {props.downloading ? 'Saving...' : 'Download'}
        </button>
      </div>

    </div>
  );
}