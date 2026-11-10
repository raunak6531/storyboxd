'use client';

import React, { useState } from 'react';
import { useWebFont } from '@/hooks/useWebFont';
import {
  FormatSection,
  TemplatesSection,
  StyleSection,
  ColorsSection,
  BackgroundSection,
  FiltersSection,
  SectionSharedProps,
} from './studio/StudioSections';

export interface StoryControlsProps extends SectionSharedProps {
  onDownload: () => void;
  onShare: () => void;
  downloading: boolean;
  sharing: boolean;
  hasReviewData: boolean;
  posterUrl?: string;
  onRandomize: () => void;
  onSaveDraft: () => void;
  savingProject: boolean;
  isSavedProject: boolean;
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
      className="w-full flex items-center justify-between p-3 lg:p-4 text-left font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors"
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
      <div className="p-3 lg:p-4 pt-0 border-t border-zinc-800/50 animate-in slide-in-from-top-2 duration-200">
        <div className="pt-3 lg:pt-4 flex flex-col gap-4 lg:gap-6">
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
    <div className="w-full flex-none flex flex-col gap-3 lg:gap-4 lg:w-[560px] xl:w-[600px]">
      <FormatSection {...props} showShuffle={true} showSaveDraft={false} />

      {/* SECTION 1: STYLE & TYPOGRAPHY */}
      <ControlSection
        title="Style & Typography"
        isOpen={openSection === 'style'}
        onClick={() => toggleSection('style')}
      >
        <TemplatesSection
          selectedTemplate={props.selectedTemplate}
          setSelectedTemplate={props.setSelectedTemplate}
        />
        <StyleSection {...props} />
      </ControlSection>

      {/* SECTION 2: COLORS */}
      <ControlSection
        title="Colors & Theme"
        isOpen={openSection === 'colors'}
        onClick={() => toggleSection('colors')}
      >
        <ColorsSection
          accentColor={props.accentColor}
          setAccentColor={props.setAccentColor}
          colorTheme={props.colorTheme}
          setColorTheme={props.setColorTheme}
        />
      </ControlSection>

      {/* SECTION 3: BACKGROUND */}
      <ControlSection
        title="Background Image"
        isOpen={openSection === 'background'}
        onClick={() => toggleSection('background')}
      >
        <BackgroundSection {...props} hideFilters={true} />
      </ControlSection>

      {/* SECTION 4: FILTERS */}
      <ControlSection
        title="Image Filters"
        isOpen={openSection === 'filters'}
        onClick={() => toggleSection('filters')}
      >
        <FiltersSection
          backdropBlur={props.backdropBlur}
          setBackdropBlur={props.setBackdropBlur}
          backdropBrightness={props.backdropBrightness}
          setBackdropBrightness={props.setBackdropBrightness}
          backdropSaturation={props.backdropSaturation}
          setBackdropSaturation={props.setBackdropSaturation}
        />
      </ControlSection>

      {/* DESKTOP BUTTONS */}
      <div className="hidden lg:flex gap-3 mt-4">
        <button
          onClick={props.onSaveDraft}
          disabled={props.savingProject || !props.hasReviewData}
          className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-700"
        >
          {props.savingProject ? 'Saving…' : props.isSavedProject ? 'Save Changes' : 'Save Draft'}
        </button>
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
