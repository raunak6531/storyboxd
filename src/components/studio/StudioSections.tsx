'use client';

import React from 'react';
import { AspectRatio, ASPECT_RATIOS, ColorTheme, QuoteStyle, TemplateType, TextAlign } from '../StoryTemplates';
import FontPicker from '../FontPicker';

export interface ScrubInfo {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  formatValue?: (v: number) => string;
  onChange: (v: number) => void;
}

export interface SectionSharedProps {
  // Format / Aspect Ratio
  aspectRatio: AspectRatio;
  setAspectRatio: (r: AspectRatio) => void;

  // Template
  selectedTemplate: TemplateType;
  setSelectedTemplate: (t: TemplateType) => void;

  // Text
  fontSizeMultiplier: number;
  setFontSizeMultiplier: (n: number) => void;
  fontType: string;
  setFontType: (f: string) => void;
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

  // Visuals
  showPoster: boolean;
  setShowPoster: (b: boolean) => void;
  showCredit: boolean;
  setShowCredit: (b: boolean) => void;
  backdropPositionPercent: number;
  setBackdropPositionPercent: (n: number) => void;
  backdropPositionYPercent: number;
  setBackdropPositionYPercent: (n: number) => void;
  customBackdrop: string | null;
  setCustomBackdrop: (s: string | null) => void;
  availableBackdrops: { url: string; thumbnail: string }[];
  handleBackgroundUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;

  // Filter
  backdropBlur: number;
  setBackdropBlur: (n: number) => void;
  backdropBrightness: number;
  setBackdropBrightness: (n: number) => void;
  backdropSaturation: number;
  setBackdropSaturation: (n: number) => void;

  // Accent Color
  accentColor: string;
  setAccentColor: (c: string) => void;

  // Text Alignment & Quote Style
  textAlign: TextAlign;
  setTextAlign: (a: TextAlign) => void;
  quoteStyle: QuoteStyle;
  setQuoteStyle: (q: QuoteStyle) => void;

  // Actions
  onRandomize?: () => void;
  onSaveDraft?: () => void;
  savingProject?: boolean;
  isSavedProject?: boolean;

  // Optional Scrub Handler for Mobile
  onStartScrub?: (info: ScrubInfo) => void;
}

/**
 * Range slider with optional mobile scrub capability
 */
export function ScrubSlider({
  id,
  label,
  value,
  min,
  max,
  step,
  unit = '',
  formatValue,
  leftLabel,
  rightLabel,
  onChange,
  onStartScrub,
  className = '',
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  formatValue?: (v: number) => string;
  leftLabel?: React.ReactNode;
  rightLabel?: React.ReactNode;
  onChange: (v: number) => void;
  onStartScrub?: (info: ScrubInfo) => void;
  className?: string;
}) {
  const displayVal = formatValue ? formatValue(value) : `${value}${unit}`;

  const handlePointerDown = () => {
    if (onStartScrub) {
      onStartScrub({
        id,
        label,
        value,
        min,
        max,
        step,
        unit,
        formatValue,
        onChange,
      });
    }
  };

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-2">
        <label className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">{label}</label>
        <span className="text-xs text-zinc-300 font-mono bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700/50">
          {displayVal}
        </span>
      </div>
      <div className="flex items-center gap-3">
        {leftLabel && <span className="text-xs text-zinc-500 shrink-0 select-none">{leftLabel}</span>}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          onPointerDown={handlePointerDown}
          className="flex-1 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#00e054] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00e054]"
        />
        {rightLabel && <span className="text-xs text-zinc-500 shrink-0 select-none">{rightLabel}</span>}
      </div>
    </div>
  );
}

/**
 * 1. FORMAT SECTION: Aspect Ratios, Shuffle, and Save Draft
 */
export function FormatSection(props: SectionSharedProps & { showSaveDraft?: boolean; showShuffle?: boolean }) {
  const { showSaveDraft = false, showShuffle = true } = props;

  return (
    <div className="space-y-4">
      {/* Aspect Ratio Grid */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 shadow-lg">
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-[#00e054]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            Format & Ratio
          </span>
          <span className="text-[11px] text-zinc-400 font-mono bg-zinc-800/80 px-2 py-0.5 rounded-md border border-zinc-700/50">
            {ASPECT_RATIOS[props.aspectRatio].width} × {ASPECT_RATIOS[props.aspectRatio].height}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {(Object.keys(ASPECT_RATIOS) as AspectRatio[]).map((ratioKey) => {
            const config = ASPECT_RATIOS[ratioKey];
            const isSelected = props.aspectRatio === ratioKey;

            return (
              <button
                key={ratioKey}
                type="button"
                onClick={() => props.setAspectRatio(ratioKey)}
                className={`min-h-[44px] flex flex-col items-center justify-center py-2.5 px-1.5 rounded-lg border transition-all duration-200 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00e054] ${
                  isSelected
                    ? 'bg-[#00e054] text-black border-[#00e054] shadow-md shadow-[#00e054]/25 font-bold scale-[1.02]'
                    : 'bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 hover:text-white border-zinc-700/40 hover:border-zinc-600'
                }`}
                title={config.description}
              >
                {/* Visual aspect ratio icon */}
                <div className="h-5 flex items-center justify-center mb-1.5 pointer-events-none">
                  {ratioKey === '9:16' && (
                    <div className={`w-2.5 h-4.5 rounded-[2px] border-2 ${isSelected ? 'border-black bg-black/20' : 'border-zinc-400'}`} />
                  )}
                  {ratioKey === '4:5' && (
                    <div className={`w-3 h-3.5 rounded-[2px] border-2 ${isSelected ? 'border-black bg-black/20' : 'border-zinc-400'}`} />
                  )}
                  {ratioKey === '1:1' && (
                    <div className={`w-3.5 h-3.5 rounded-[2px] border-2 ${isSelected ? 'border-black bg-black/20' : 'border-zinc-400'}`} />
                  )}
                  {ratioKey === '16:9' && (
                    <div className={`w-4.5 h-2.5 rounded-[2px] border-2 ${isSelected ? 'border-black bg-black/20' : 'border-zinc-400'}`} />
                  )}
                </div>
                <span className="text-xs font-bold leading-tight">{config.label}</span>
                <span className={`text-[10px] leading-tight mt-0.5 ${isSelected ? 'text-black/80 font-medium' : 'text-zinc-500'}`}>
                  {config.sublabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Optional Shuffle Button */}
      {showShuffle && props.onRandomize && (
        <button
          onClick={props.onRandomize}
          className="w-full min-h-[44px] h-12 relative overflow-hidden bg-zinc-900 border border-zinc-700/50 rounded-xl group transition-all duration-300 hover:border-[#00e054]/50 hover:shadow-[0_0_20px_rgba(0,224,84,0.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00e054] active:scale-[0.99]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00e054]/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          <div className="flex items-center justify-center gap-2 relative z-10 text-zinc-400 group-hover:text-[#00e054] font-medium tracking-wide text-sm uppercase">
            <svg className="w-4 h-4 transition-transform duration-500 group-hover:rotate-180 text-[#00e054]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Shuffle Design
          </div>
        </button>
      )}

      {/* Optional Save Draft */}
      {showSaveDraft && props.onSaveDraft && (
        <button
          onClick={props.onSaveDraft}
          disabled={props.savingProject}
          className="w-full min-h-[44px] py-3 px-4 bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00e054]"
        >
          <svg className="w-4 h-4 text-[#00e054]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          <span>{props.savingProject ? 'Saving Draft…' : props.isSavedProject ? 'Update Saved Project' : 'Save Project to Drafts'}</span>
        </button>
      )}
    </div>
  );
}

/**
 * 2. TEMPLATES SECTION: 12 templates mini preview cards
 */
export const TEMPLATE_LIST: { id: TemplateType; label: string; preview: React.ReactNode }[] = [
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
        <rect x="4" y="8" width="14" height="21" rx="1" fill="#222" stroke="#333" strokeWidth="0.5" />
        <rect x="20" y="12" width="12" height="2" rx="1" fill="#fff" opacity="0.8" />
        <rect x="20" y="16" width="8" height="1.5" rx="0.75" fill="#00e054" opacity="0.7" />
        <rect x="4" y="38" width="28" height="1" rx="0.5" fill="#666" opacity="0.4" />
        <rect x="4" y="41" width="24" height="1" rx="0.5" fill="#666" opacity="0.4" />
        <rect x="4" y="44" width="20" height="1" rx="0.5" fill="#666" opacity="0.4" />
      </svg>
    )
  },
  {
    id: 'split', label: 'Polaroid', preview: (
      <svg viewBox="0 0 36 64" fill="none" className="w-full h-full">
        <rect width="36" height="64" rx="2" fill="#141414" />
        <rect x="3" y="4" width="30" height="34" rx="1.5" fill="#fff" />
        <rect x="5" y="6" width="26" height="24" rx="1" fill="#333" />
        <rect x="10" y="32" width="16" height="1.5" rx="0.75" fill="#888" />
        <rect x="4" y="44" width="28" height="1.2" rx="0.6" fill="#fff" opacity="0.7" />
        <rect x="4" y="47" width="22" height="1.2" rx="0.6" fill="#fff" opacity="0.7" />
        <rect x="12" y="54" width="12" height="1.5" rx="0.75" fill="#00e054" opacity="0.8" />
      </svg>
    )
  },
  {
    id: 'magazine', label: 'Magazine', preview: (
      <svg viewBox="0 0 36 64" fill="none" className="w-full h-full">
        <rect width="36" height="64" rx="2" fill="#1a1a1a" />
        <rect x="0" y="0" width="36" height="64" rx="2" fill="#2a2a2a" opacity="0.4" />
        <rect x="4" y="4" width="28" height="4" rx="1" fill="#fff" opacity="0.9" />
        <line x1="4" y1="10" x2="32" y2="10" stroke="#00e054" strokeWidth="0.75" />
        <rect x="4" y="14" width="14" height="18" rx="1" fill="#333" stroke="#444" strokeWidth="0.5" />
        <rect x="20" y="16" width="12" height="1.5" rx="0.75" fill="#fff" opacity="0.7" />
        <rect x="20" y="19" width="10" height="1" rx="0.5" fill="#888" opacity="0.5" />
        <rect x="4" y="36" width="28" height="1" rx="0.5" fill="#aaa" opacity="0.5" />
        <rect x="4" y="39" width="26" height="1" rx="0.5" fill="#aaa" opacity="0.5" />
        <rect x="4" y="42" width="20" height="1" rx="0.5" fill="#aaa" opacity="0.5" />
      </svg>
    )
  },
  {
    id: 'cinematic', label: 'Cinematic', preview: (
      <svg viewBox="0 0 36 64" fill="none" className="w-full h-full">
        <rect width="36" height="64" rx="2" fill="#000" />
        <rect x="0" y="12" width="36" height="24" fill="#333" opacity="0.6" />
        <line x1="0" y1="12" x2="36" y2="12" stroke="#222" strokeWidth="0.5" />
        <line x1="0" y1="36" x2="36" y2="36" stroke="#222" strokeWidth="0.5" />
        <rect x="6" y="40" width="24" height="2" rx="1" fill="#fff" opacity="0.9" />
        <rect x="10" y="44" width="16" height="1.5" rx="0.75" fill="#00e054" opacity="0.8" />
        <rect x="4" y="49" width="28" height="1" rx="0.5" fill="#777" opacity="0.4" />
        <rect x="6" y="52" width="24" height="1" rx="0.5" fill="#777" opacity="0.4" />
      </svg>
    )
  },
  {
    id: 'gradient', label: 'Vibrant', preview: (
      <svg viewBox="0 0 36 64" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="prev-grad-sub" x1="0" y1="0" x2="36" y2="64" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ff006e" />
            <stop offset="0.5" stopColor="#8338ec" />
            <stop offset="1" stopColor="#3a86ff" />
          </linearGradient>
        </defs>
        <rect width="36" height="64" rx="2" fill="url(#prev-grad-sub)" />
        <rect x="6" y="8" width="24" height="2" rx="1" fill="#fff" opacity="0.9" />
        <rect x="8" y="13" width="20" height="28" rx="2" fill="#000" opacity="0.4" />
        <rect x="11" y="17" width="14" height="1.5" rx="0.75" fill="#fff" opacity="0.8" />
        <rect x="10" y="46" width="16" height="1.5" rx="0.75" fill="#ffbe0b" />
      </svg>
    )
  },
  {
    id: 'duotone', label: 'Duotone', preview: (
      <svg viewBox="0 0 36 64" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="prev-duo-sub" x1="0" y1="0" x2="36" y2="64" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00e054" stopOpacity="0.8" />
            <stop offset="1" stopColor="#0a0a0a" />
          </linearGradient>
        </defs>
        <rect width="36" height="64" rx="2" fill="#0a0a0a" />
        <rect x="0" y="0" width="36" height="64" rx="2" fill="url(#prev-duo-sub)" opacity="0.5" />
        <rect x="4" y="8" width="16" height="2" rx="1" fill="#00e054" />
        <rect x="4" y="12" width="22" height="3" rx="1" fill="#fff" opacity="0.9" />
        <rect x="4" y="32" width="28" height="1.2" rx="0.6" fill="#00e054" opacity="0.6" />
        <rect x="4" y="35" width="24" height="1.2" rx="0.6" fill="#00e054" opacity="0.6" />
        <rect x="4" y="42" width="12" height="1.5" rx="0.75" fill="#fff" opacity="0.5" />
      </svg>
    )
  },
  {
    id: 'newspaper', label: 'Gazette', preview: (
      <svg viewBox="0 0 36 64" fill="none" className="w-full h-full">
        <rect width="36" height="64" rx="2" fill="#f4ecd8" />
        <rect x="3" y="3" width="30" height="3" rx="0.5" fill="#1a1a1a" />
        <line x1="3" y1="7.5" x2="33" y2="7.5" stroke="#1a1a1a" strokeWidth="0.5" />
        <rect x="3" y="9.5" width="18" height="1.8" rx="0.5" fill="#1a1a1a" />
        <rect x="3" y="12.5" width="14" height="12" rx="0.5" fill="#bbb" stroke="#888" strokeWidth="0.3" />
        <rect x="19" y="12.5" width="14" height="0.8" rx="0.4" fill="#333" opacity="0.7" />
        <rect x="19" y="14.5" width="14" height="0.8" rx="0.4" fill="#333" opacity="0.7" />
        <rect x="19" y="16.5" width="11" height="0.8" rx="0.4" fill="#333" opacity="0.7" />
        <rect x="3" y="27" width="30" height="0.8" rx="0.4" fill="#333" opacity="0.7" />
        <rect x="3" y="29" width="30" height="0.8" rx="0.4" fill="#333" opacity="0.7" />
        <rect x="3" y="31" width="22" height="0.8" rx="0.4" fill="#333" opacity="0.7" />
      </svg>
    )
  },
  {
    id: 'letterboxd', label: 'Boxd Green', preview: (
      <svg viewBox="0 0 36 64" fill="none" className="w-full h-full">
        <rect width="36" height="64" rx="2" fill="#14181c" />
        <rect x="4" y="4" width="28" height="2" rx="1" fill="#00e054" />
        <rect x="4" y="9" width="12" height="18" rx="1" fill="#2c3440" stroke="#456" strokeWidth="0.5" />
        <rect x="18" y="11" width="14" height="2" rx="1" fill="#fff" opacity="0.9" />
        <rect x="18" y="15" width="10" height="1.5" rx="0.75" fill="#00e054" />
        <rect x="4" y="33" width="28" height="1" rx="0.5" fill="#9ab" opacity="0.5" />
        <rect x="4" y="36" width="24" height="1" rx="0.5" fill="#9ab" opacity="0.5" />
        <rect x="4" y="39" width="20" height="1" rx="0.5" fill="#9ab" opacity="0.5" />
      </svg>
    )
  },
  {
    id: 'wrapped', label: 'Wrapped', preview: (
      <svg viewBox="0 0 36 64" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="prev-wrap-sub" x1="0" y1="0" x2="36" y2="64" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00e054" />
            <stop offset="0.6" stopColor="#14181c" />
            <stop offset="1" stopColor="#ff8000" />
          </linearGradient>
        </defs>
        <rect width="36" height="64" rx="2" fill="url(#prev-wrap-sub)" />
        <circle cx="18" cy="14" r="8" fill="#fff" opacity="0.15" />
        <rect x="6" y="26" width="24" height="3" rx="1.5" fill="#fff" opacity="0.95" />
        <rect x="10" y="31" width="16" height="1.5" rx="0.75" fill="#00e054" />
        <rect x="6" y="36" width="24" height="16" rx="2" fill="#000" opacity="0.4" />
        <rect x="9" y="40" width="18" height="1" rx="0.5" fill="#fff" opacity="0.7" />
        <rect x="9" y="43" width="14" height="1" rx="0.5" fill="#fff" opacity="0.7" />
      </svg>
    )
  },
];

export function TemplatesSection(props: Pick<SectionSharedProps, 'selectedTemplate' | 'setSelectedTemplate'>) {
  return (
    <div>
      <label className="text-xs text-zinc-400 uppercase tracking-wider font-semibold mb-3 block">
        Choose Template
      </label>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
        {TEMPLATE_LIST.map((template) => {
          const isSelected = props.selectedTemplate === template.id;
          return (
            <button
              key={template.id}
              type="button"
              onClick={() => props.setSelectedTemplate(template.id)}
              className={`group flex flex-col items-center p-2 rounded-xl border transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00e054] active:scale-95 ${
                isSelected
                  ? 'border-[#00e054] bg-[#00e054]/10 shadow-[0_0_15px_rgba(0,224,84,0.15)] ring-1 ring-[#00e054]/40'
                  : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-850'
              }`}
            >
              <div className="w-full aspect-[9/16] max-h-24 rounded-lg overflow-hidden mb-1.5 shadow-sm transition-transform duration-200 group-hover:scale-105">
                {template.preview}
              </div>
              <p className={`text-xs font-semibold truncate w-full text-center ${
                isSelected ? 'text-[#00e054]' : 'text-zinc-400 group-hover:text-zinc-200'
              }`}>
                {template.label}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * 3. STYLE & TYPOGRAPHY SECTION
 */
export function StyleSection(props: SectionSharedProps) {
  return (
    <div className="space-y-5">
      {/* Font Size Slider */}
      <ScrubSlider
        id="fontSize"
        label="Size"
        value={props.fontSizeMultiplier}
        min={0.6}
        max={2.0}
        step={0.05}
        formatValue={(v) => (v === 1 ? 'Auto' : `${Math.round(v * 100)}%`)}
        leftLabel="A"
        rightLabel="A"
        onChange={props.setFontSizeMultiplier}
        onStartScrub={props.onStartScrub}
      />

      {/* Font Family (Google Fonts Picker) */}
      <div>
        <label className="text-xs text-zinc-400 uppercase tracking-wider font-semibold mb-2 block">
          Font Family
        </label>
        <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/50 p-3">
          <FontPicker currentFont={props.fontType} onFontSelect={props.setFontType} />
        </div>
      </div>

      {/* Formatting (Bold, Italic) */}
      <div>
        <label className="text-xs text-zinc-400 uppercase tracking-wider font-semibold mb-2 block">
          Formatting
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => props.setIsBold(!props.isBold)}
            className={`min-h-[44px] flex-1 rounded-lg border flex items-center justify-center transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00e054] active:scale-98 ${
              props.isBold ? 'border-[#00e054] bg-[#00e054]/10 text-[#00e054] font-bold' : 'border-zinc-700 bg-zinc-900/60 text-zinc-400'
            }`}
          >
            <span className="font-bold text-sm">Bold</span>
          </button>
          <button
            type="button"
            onClick={() => props.setIsItalic(!props.isItalic)}
            className={`min-h-[44px] flex-1 rounded-lg border flex items-center justify-center transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00e054] active:scale-98 ${
              props.isItalic ? 'border-[#00e054] bg-[#00e054]/10 text-[#00e054] font-bold' : 'border-zinc-700 bg-zinc-900/60 text-zinc-400'
            }`}
          >
            <span className="italic text-sm">Italic</span>
          </button>
        </div>
      </div>

      {/* Letter Spacing */}
      <ScrubSlider
        id="letterSpacing"
        label="Letter Spacing"
        value={props.letterSpacing}
        min={-2}
        max={8}
        step={0.5}
        formatValue={(v) => (v === 0 ? 'Normal' : `${v > 0 ? '+' : ''}${v}px`)}
        leftLabel="Tight"
        rightLabel="Wide"
        onChange={props.setLetterSpacing}
        onStartScrub={props.onStartScrub}
      />

      {/* Line Height */}
      <ScrubSlider
        id="lineHeight"
        label="Line Height"
        value={props.lineHeight}
        min={1.0}
        max={2.2}
        step={0.1}
        formatValue={(v) => v.toFixed(1)}
        leftLabel="Tight"
        rightLabel="Loose"
        onChange={props.setLineHeight}
        onStartScrub={props.onStartScrub}
      />

      {/* Text Alignment */}
      <div>
        <label className="text-xs text-zinc-400 uppercase tracking-wider font-semibold mb-2 block">
          Text Alignment
        </label>
        <div className="grid grid-cols-3 gap-2">
          {([
            { id: 'left' as TextAlign, label: 'Left', icon: 'M3 6h18M3 12h12M3 18h16' },
            { id: 'center' as TextAlign, label: 'Center', icon: 'M3 6h18M6 12h12M4 18h16' },
            { id: 'right' as TextAlign, label: 'Right', icon: 'M3 6h18M9 12h12M5 18h16' },
          ]).map((align) => (
            <button
              key={align.id}
              type="button"
              onClick={() => props.setTextAlign(align.id)}
              className={`min-h-[44px] p-2 rounded-lg border transition-all duration-200 flex items-center justify-center gap-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00e054] active:scale-98 ${
                props.textAlign === align.id
                  ? 'border-[#00e054] bg-[#00e054]/10 text-white font-semibold'
                  : 'border-zinc-700 bg-zinc-900/60 text-zinc-400 hover:border-zinc-600'
              }`}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeWidth={2} d={align.icon} />
              </svg>
              <span className="text-xs">{align.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quote Style */}
      <div>
        <label className="text-xs text-zinc-400 uppercase tracking-wider font-semibold mb-2 block">
          Quote Style
        </label>
        <div className="grid grid-cols-3 gap-2">
          {([
            { id: 'double' as QuoteStyle, label: '\u201C \u201D' },
            { id: 'angle' as QuoteStyle, label: '\u00AB \u00BB' },
            { id: 'none' as QuoteStyle, label: 'None' },
          ]).map((quote) => (
            <button
              key={quote.id}
              type="button"
              onClick={() => props.setQuoteStyle(quote.id)}
              className={`min-h-[44px] p-2 rounded-lg border transition-all duration-200 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00e054] active:scale-98 ${
                props.quoteStyle === quote.id
                  ? 'border-[#00e054] bg-[#00e054]/10 text-white font-semibold'
                  : 'border-zinc-700 bg-zinc-900/60 text-zinc-400 hover:border-zinc-600'
              }`}
            >
              <span className="text-sm font-medium">{quote.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * 4. COLORS & THEME SECTION
 */
export const COLOR_PALETTES = [
  { name: 'Classic', colors: ['#00e054', '#40bcf4', '#ff8000', '#eb3f5c', '#9d4edd', '#ffffff'] },
  { name: 'Warm', colors: ['#d4a574', '#e8a87c', '#d35400', '#c0392b', '#f39c12', '#ffeaa7'] },
  { name: 'Cool', colors: ['#74b9ff', '#a29bfe', '#00cec9', '#6c5ce7', '#0984e3', '#dfe6e9'] },
  { name: 'Neon', colors: ['#00ff87', '#ff006e', '#ffbe0b', '#8338ec', '#3a86ff', '#00f5d4'] },
  { name: 'Pastel', colors: ['#fab1a0', '#81ecec', '#ffeaa7', '#dfe6e9', '#a29bfe', '#fd79a8'] },
  { name: 'Film', colors: ['#c8b88a', '#8b7355', '#a0522d', '#2f4f4f', '#b8860b', '#daa520'] },
];

export function ColorsSection(props: Pick<SectionSharedProps, 'accentColor' | 'setAccentColor' | 'colorTheme' | 'setColorTheme'>) {
  return (
    <div className="space-y-5">
      {/* Accent Color Input */}
      <div>
        <label className="text-xs text-zinc-400 uppercase tracking-wider font-semibold mb-3 block">
          Accent Color
        </label>
        <div className="flex gap-3 items-center">
          <div className="relative w-12 h-11 rounded-lg overflow-hidden border border-zinc-700 shadow-sm shrink-0">
            <input
              type="color"
              value={props.accentColor}
              onChange={(e) => props.setAccentColor(e.target.value)}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] p-0 m-0 border-0 cursor-pointer"
              aria-label="Pick custom accent color"
            />
          </div>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-sm pointer-events-none">#</span>
            <input
              type="text"
              value={props.accentColor.replace('#', '')}
              onChange={(e) => {
                const val = e.target.value;
                if (/^[0-9A-Fa-f]{0,6}$/.test(val)) props.setAccentColor(`#${val}`);
              }}
              className="w-full min-h-[44px] bg-zinc-900 border border-zinc-700 rounded-lg py-2.5 pl-7 pr-3 text-sm font-mono text-white focus:outline-none focus:border-[#00e054] uppercase placeholder-zinc-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00e054]"
              placeholder="HEX"
              maxLength={6}
            />
          </div>
        </div>
      </div>

      {/* Preset Palettes */}
      <div className="space-y-3">
        <label className="text-xs text-zinc-400 uppercase tracking-wider font-semibold block">
          Preset Palettes
        </label>
        {COLOR_PALETTES.map((palette) => (
          <div key={palette.name} className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-500 w-12 shrink-0 uppercase tracking-wider font-medium">{palette.name}</span>
            <div className="flex gap-2 flex-1">
              {palette.colors.map((color) => {
                const isSelected = props.accentColor.toLowerCase() === color.toLowerCase();
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => props.setAccentColor(color)}
                    className={`min-w-[34px] min-h-[34px] w-8 h-8 rounded-full border transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00e054] active:scale-95 ${
                      isSelected
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-black border-white scale-110'
                        : 'border-zinc-700/60 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                    aria-label={`Select color ${color}`}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Theme Base */}
      <div>
        <label className="text-xs text-zinc-400 uppercase tracking-wider font-semibold mb-2 block">
          Theme Base
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'neutral' as ColorTheme, label: 'Neutral', bg: '#ffffff' },
            { id: 'warm' as ColorTheme, label: 'Warm', bg: '#fff8e7' },
            { id: 'neon' as ColorTheme, label: 'Neon', bg: '#ffffff' },
          ].map((theme) => {
            const isSelected = props.colorTheme === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => props.setColorTheme(theme.id)}
                className={`min-h-[44px] p-2 rounded-lg border transition-all duration-200 flex items-center justify-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00e054] active:scale-98 ${
                  isSelected ? 'border-[#00e054] bg-[#00e054]/10 text-white font-semibold' : 'border-zinc-700 bg-zinc-900/60 text-zinc-400 hover:border-zinc-600'
                }`}
              >
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: theme.bg }} />
                <span className="text-xs">{theme.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * 5. BACKGROUND SECTION: Upload, TMDB backdrops, Position, Toggles, Filters
 */
export function BackgroundSection(props: SectionSharedProps & { hideFilters?: boolean }) {
  const { hideFilters = false } = props;

  return (
    <div className="space-y-5">
      {/* Custom Image Upload */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Custom Image</label>
          {props.customBackdrop && (
            <button
              type="button"
              onClick={() => props.setCustomBackdrop(null)}
              className="text-xs text-red-400 hover:text-red-300 transition-colors py-1 px-2 rounded hover:bg-red-950/30"
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
            id="backdrop-upload-section"
          />
          <label
            htmlFor="backdrop-upload-section"
            className="min-h-[44px] flex items-center justify-center gap-2 w-full p-3 rounded-lg border border-dashed border-zinc-700 hover:border-[#00e054] hover:bg-zinc-800/50 cursor-pointer transition-all duration-200 group focus-within:ring-2 focus-within:ring-[#00e054]"
          >
            <svg className="w-5 h-5 text-zinc-500 group-hover:text-[#00e054]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm text-zinc-400 group-hover:text-white font-medium">
              {props.customBackdrop ? 'Change Custom Image' : 'Upload Image (Max 5MB)'}
            </span>
          </label>
        </div>
      </div>

      {/* TMDB Backdrop Gallery */}
      {props.availableBackdrops.length > 1 && (
        <div>
          <label className="text-xs text-zinc-400 uppercase tracking-wider font-semibold mb-2 block">
            Movie Backdrops ({props.availableBackdrops.length})
          </label>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-700 -mx-1 px-1">
            {props.availableBackdrops.map((bd, i) => (
              <button
                key={i}
                type="button"
                onClick={() => props.setCustomBackdrop(bd.url)}
                className={`min-h-[44px] shrink-0 w-24 h-14 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00e054] ${
                  props.customBackdrop === bd.url
                    ? 'border-[#00e054] ring-2 ring-[#00e054]/50'
                    : 'border-zinc-700/60 hover:border-zinc-500'
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

      {/* Position Sliders (if not gradient) */}
      {(!props.customBackdrop || !props.customBackdrop.includes('gradient')) && (
        <div className="space-y-4 pt-1">
          <ScrubSlider
            id="posX"
            label="Position X"
            value={props.backdropPositionPercent}
            min={0}
            max={100}
            step={1}
            unit="%"
            leftLabel="Left"
            rightLabel="Right"
            onChange={props.setBackdropPositionPercent}
            onStartScrub={props.onStartScrub}
          />

          <ScrubSlider
            id="posY"
            label="Position Y"
            value={props.backdropPositionYPercent}
            min={0}
            max={100}
            step={1}
            unit="%"
            leftLabel="Top"
            rightLabel="Bottom"
            onChange={props.setBackdropPositionYPercent}
            onStartScrub={props.onStartScrub}
          />
        </div>
      )}

      {/* Poster Toggle */}
      <div className="flex items-center justify-between pt-2">
        <label className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Show Poster</label>
        <button
          type="button"
          onClick={() => props.setShowPoster(!props.showPoster)}
          className={`min-w-[44px] min-h-[44px] p-2 inline-flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00e054] rounded-lg`}
          aria-label="Toggle poster display"
        >
          <span className={`relative inline-flex items-center h-6 w-11 rounded-full border transition-colors ${
            props.showPoster ? 'bg-[#00e054] border-[#00e054]' : 'bg-zinc-800 border-zinc-700'
          }`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              props.showPoster ? 'translate-x-5' : 'translate-x-1'
            }`} />
          </span>
        </button>
      </div>

      {/* Credit Toggle */}
      <div className="flex items-center justify-between pt-1">
        <label className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Show StoryBoxd credit</label>
        <button
          type="button"
          onClick={() => props.setShowCredit(!props.showCredit)}
          className={`min-w-[44px] min-h-[44px] p-2 inline-flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00e054] rounded-lg`}
          aria-label="Toggle StoryBoxd watermark credit"
        >
          <span className={`relative inline-flex items-center h-6 w-11 rounded-full border transition-colors ${
            props.showCredit ? 'bg-[#00e054] border-[#00e054]' : 'bg-zinc-800 border-zinc-700'
          }`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              props.showCredit ? 'translate-x-5' : 'translate-x-1'
            }`} />
          </span>
        </button>
      </div>

      {/* Image Filters (included in background tab on mobile) */}
      {!hideFilters && (
        <div className="pt-3 border-t border-zinc-800/80 space-y-4">
          <label className="text-xs text-zinc-400 uppercase tracking-wider font-semibold block">
            Image Filters
          </label>
          <ScrubSlider
            id="blur"
            label="Blur"
            value={props.backdropBlur}
            min={0}
            max={20}
            step={1}
            unit="px"
            onChange={props.setBackdropBlur}
            onStartScrub={props.onStartScrub}
          />
          <ScrubSlider
            id="brightness"
            label="Brightness"
            value={props.backdropBrightness}
            min={0}
            max={200}
            step={5}
            unit="%"
            onChange={props.setBackdropBrightness}
            onStartScrub={props.onStartScrub}
          />
          <ScrubSlider
            id="saturation"
            label="Saturation"
            value={props.backdropSaturation}
            min={0}
            max={200}
            step={5}
            unit="%"
            onChange={props.setBackdropSaturation}
            onStartScrub={props.onStartScrub}
          />
        </div>
      )}
    </div>
  );
}

/**
 * 6. FILTERS SECTION (for desktop standalone accordion)
 */
export function FiltersSection(props: Pick<SectionSharedProps, 'backdropBlur' | 'setBackdropBlur' | 'backdropBrightness' | 'setBackdropBrightness' | 'backdropSaturation' | 'setBackdropSaturation' | 'onStartScrub'>) {
  return (
    <div className="space-y-4">
      <ScrubSlider
        id="blur"
        label="Blur"
        value={props.backdropBlur}
        min={0}
        max={20}
        step={1}
        unit="px"
        onChange={props.setBackdropBlur}
        onStartScrub={props.onStartScrub}
      />
      <ScrubSlider
        id="brightness"
        label="Brightness"
        value={props.backdropBrightness}
        min={0}
        max={200}
        step={5}
        unit="%"
        onChange={props.setBackdropBrightness}
        onStartScrub={props.onStartScrub}
      />
      <ScrubSlider
        id="saturation"
        label="Saturation"
        value={props.backdropSaturation}
        min={0}
        max={200}
        step={5}
        unit="%"
        onChange={props.setBackdropSaturation}
        onStartScrub={props.onStartScrub}
      />
    </div>
  );
}

