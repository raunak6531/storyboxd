'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { RealTemplateCard } from './RealTemplateCard';
import { TemplateType } from '@/components/StoryTemplates';
import { playfair, permanentMarker } from './fonts';

interface TemplateOption {
  id: TemplateType;
  label: string;
}

const HERO_TEMPLATES: TemplateOption[] = [
  { id: 'minimal', label: 'Minimal' },
  { id: 'split', label: 'Polaroid' },
  { id: 'newspaper', label: 'Newspaper' },
  { id: 'cinematic', label: 'Cinematic' },
];

const HERO_IMAGES: Partial<Record<TemplateType, string>> = {
  minimal: '/images/previews/hero/Minimal.png',
  split: '/images/previews/hero/Polaroid.png',
  newspaper: '/images/previews/hero/Newspaper.png',
  cinematic: '/images/previews/hero/Cinematic.png',
};

export function HeroStoryCard() {
  const [activeTemplate, setActiveTemplate] = useState<TemplateType>('minimal');
  const [cardWidth, setCardWidth] = useState(285);
  const cardRef = useRef<HTMLDivElement>(null);
  const userInteractedRef = useRef(false);

  useEffect(() => {
    const updateSize = () => {
      if (cardRef.current) {
        setCardWidth(cardRef.current.clientWidth);
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const interval = setInterval(() => {
      if (userInteractedRef.current) return;
      setActiveTemplate((current) => {
        const currentIndex = HERO_TEMPLATES.findIndex((t) => t.id === current);
        const nextIndex = (currentIndex + 1) % HERO_TEMPLATES.length;
        return HERO_TEMPLATES[nextIndex].id;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const handleSelectTemplate = (id: TemplateType) => {
    userInteractedRef.current = true;
    setActiveTemplate(id);
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${playfair.variable} ${permanentMarker.variable}`}>
      {/* Phone device frame */}
      <div
        ref={cardRef}
        role="img"
        aria-label="Preview of a StoryBoxd story for a sample film review"
        className="relative w-[min(285px,74vw)] aspect-[9/16] rounded-[32px] overflow-hidden bg-black select-none transition-transform duration-300"
        style={{
          boxShadow:
            '0 0 0 9px #161616, 0 0 0 10px #242424, 0 32px 80px -12px rgba(0,0,0,0.85), 0 0 110px rgba(0,224,84,0.1)',
        }}
      >
        {/* Dynamic camera island pill */}
        <div
          className="absolute top-2.5 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-black/90 rounded-full z-30 pointer-events-none border border-white/10 flex items-center justify-end pr-2"
          aria-hidden="true"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#1c1c1e] border border-white/10" />
        </div>

        {/* Ambient glass glare highlight */}
        <div
          className="absolute inset-0 pointer-events-none z-20 bg-gradient-to-tr from-transparent via-transparent to-white/[0.04]"
          aria-hidden="true"
        />

        {/* Crossfading template cards */}
        {HERO_TEMPLATES.map((t, index) => {
          const imgSrc = HERO_IMAGES[t.id];
          return (
            <div
              key={t.id}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                activeTemplate === t.id ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {imgSrc ? (
                <Image
                  src={imgSrc}
                  alt={`${t.label} story preview`}
                  fill
                  sizes="(max-width: 768px) 74vw, 285px"
                  priority={index === 0}
                  className="object-cover w-full h-full"
                />
              ) : (
                <RealTemplateCard template={t.id} width={cardWidth} />
              )}
            </div>
          );
        })}
      </div>

      {/* Template selector chips */}
      <div className="flex gap-1.5 flex-wrap justify-center pt-0.5" role="group" aria-label="Try a template">
        {HERO_TEMPLATES.map((t) => {
          const isActive = activeTemplate === t.id;
          return (
            <button
              key={t.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => handleSelectTemplate(t.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-full cursor-pointer transition-all duration-150 hover:-translate-y-0.5 ${
                isActive
                  ? 'bg-[#00e054] text-[#00200c] border border-[#00e054] font-bold shadow-[0_2px_12px_rgba(0,224,84,0.3)] scale-[1.03]'
                  : 'bg-[#101010] text-[#9b9b9b] border border-[#242424] hover:text-[#f2f2f2] hover:border-[#444]'
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
