'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { RealTemplateCard } from './RealTemplateCard';
import { TemplateType } from '@/components/StoryTemplates';
import { playfair, permanentMarker } from './fonts';

interface GalleryTemplate {
  id: TemplateType;
  name: string;
  tag: string;
}

const ALL_12_TEMPLATES: GalleryTemplate[] = [
  { id: 'minimal', name: 'Minimal', tag: 'Indie & Quiet' },
  { id: 'split', name: 'Polaroid', tag: 'Vintage 35mm' },
  { id: 'newspaper', name: 'Newspaper', tag: 'Broadsheet' },
  { id: 'cinematic', name: 'Cinematic', tag: 'Blockbuster' },
  { id: 'bottom', name: 'Classic', tag: 'Poster Gradient' },
  { id: 'topLeft', name: 'Editorial', tag: 'Modern Print' },
  { id: 'centered', name: 'Focused', tag: 'Minimal Box' },
  { id: 'magazine', name: 'Magazine', tag: 'Cahiers du Cinéma' },
  { id: 'gradient', name: 'Gradient', tag: 'Vibrant Mesh' },
  { id: 'duotone', name: 'Duotone', tag: 'High Contrast' },
  { id: 'letterboxd', name: 'Letterboxd', tag: 'Authentic Log' },
  { id: 'wrapped', name: 'Wrapped', tag: 'Year in Review' },
];

const TEMPLATE_IMAGES: Record<TemplateType, string> = {
  minimal: '/images/previews/templates/Minimal.png',
  split: '/images/previews/templates/Polaroid.png',
  newspaper: '/images/previews/templates/Newspaper.png',
  cinematic: '/images/previews/templates/Cinematic.png',
  bottom: '/images/previews/templates/Classic.png',
  topLeft: '/images/previews/templates/Editorial.png',
  centered: '/images/previews/templates/Focused.png',
  magazine: '/images/previews/templates/Magazine.png',
  gradient: '/images/previews/templates/Gradient.png',
  duotone: '/images/previews/templates/Duotone.png',
  letterboxd: '/images/previews/templates/Letterboxd.png',
  wrapped: '/images/previews/templates/Wrapped.png',
};

export function TemplateGallery() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === 'left' ? -340 : 340;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className={`relative group/gallery ${playfair.variable} ${permanentMarker.variable}`}>
      {/* Scroll navigation arrows */}
      <div className="hidden sm:flex justify-end gap-2 mb-4">
        <button
          type="button"
          onClick={() => handleScroll('left')}
          disabled={!canScrollLeft}
          aria-label="Scroll templates left"
          className="w-9 h-9 rounded-full bg-[#141414] border border-[#242424] text-[#f2f2f2] grid place-items-center cursor-pointer transition-all hover:bg-[#202020] hover:border-[#444] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleScroll('right')}
          disabled={!canScrollRight}
          aria-label="Scroll templates right"
          className="w-9 h-9 rounded-full bg-[#141414] border border-[#242424] text-[#f2f2f2] grid place-items-center cursor-pointer transition-all hover:bg-[#202020] hover:border-[#444] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-3 px-1 focus-visible:outline-none"
        tabIndex={0}
        role="region"
        aria-label="Story templates horizontal gallery"
      >
        {ALL_12_TEMPLATES.map((t) => {
          const imgSrc = TEMPLATE_IMAGES[t.id];

          return (
            <Link
              key={t.id}
              href="/studio"
              className="flex flex-col items-center gap-3 flex-none snap-start group text-decoration-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00e054] rounded-[32px] p-1 transition-all duration-200 hover:-translate-y-1.5"
            >
              <div
                className="relative w-[270px] aspect-[9/16] rounded-[28px] overflow-hidden border border-[#242424] group-hover:border-[#00e054] transition-all duration-300 group-hover:shadow-[0_20px_50px_rgba(0,224,84,0.15)] bg-black"
                style={{
                  boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                }}
              >
                {imgSrc ? (
                  <Image
                    src={imgSrc}
                    alt={`${t.name} template preview`}
                    fill
                    sizes="270px"
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <RealTemplateCard template={t.id} width={270} />
                )}
              </div>
              <div className="text-center">
                <span className="block text-sm font-semibold text-[#f2f2f2] group-hover:text-[#00e054] transition-colors">
                  {t.name}
                </span>
                <span className="block text-xs text-[#666] group-hover:text-[#9b9b9b] transition-colors mt-0.5">
                  {t.tag}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
