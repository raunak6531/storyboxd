'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export function DynamicIslandNav() {
  const [scrolled, setScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle clicking outside to collapse on mobile
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setIsHovered(false);
      }
    };

    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // Full nav is shown if we are near the top of the page OR if the user is hovering/interacting
  const isExpanded = !scrolled || isHovered;

  const handleLinkClick = () => {
    if (scrolled) {
      setIsHovered(false);
    }
  };

  const handleIslandClick = (e: React.MouseEvent) => {
    // If collapsed, tapping expands it
    if (scrolled && !isHovered) {
      e.stopPropagation();
      setIsHovered(true);
    }
  };

  return (
    <header className="fixed top-3 sm:top-4 left-0 right-0 z-50 flex justify-center px-3 sm:px-4 pointer-events-none">
      <div
        ref={navRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleIslandClick}
        className="pointer-events-auto"
      >
        <nav
          aria-label="Dynamic Island Navigation"
          className={`relative flex items-center bg-[#000000]/92 backdrop-blur-2xl border rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] select-none overflow-hidden ${
            isExpanded
              ? 'w-[min(94vw,760px)] px-3 sm:px-4 py-2 justify-between border-white/[0.12] shadow-[0_24px_60px_-10px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.06),0_0_28px_rgba(0,224,84,0.08)]'
              : 'w-[190px] px-3 py-1.5 justify-between border-white/[0.15] shadow-[0_12px_32px_-6px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.08),0_0_18px_rgba(0,224,84,0.18)] cursor-pointer hover:border-[#00e054]/60 hover:shadow-[0_0_24px_rgba(0,224,84,0.25)] hover:scale-[1.03]'
          }`}
        >
          {/* Ambient top specular highlight */}
          <div
            className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
            aria-hidden="true"
          />

          {/* Left: Dynamic Island Lens & Logo */}
          <Link
            href="/"
            onClick={handleLinkClick}
            className="flex items-center gap-2.5 group pl-1 pr-2 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00e054] rounded-full"
          >
            {/* Authentic camera / sensor lens pill */}
            <div className="relative w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#121214] border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-[#00e054]/40 transition-colors">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#00e054] shadow-[0_0_8px_#00e054] animate-pulse" />
            </div>
            <span className="font-bold text-sm sm:text-base tracking-[-0.04em] text-[#f2f2f2] whitespace-nowrap">
              Story<b className="text-[#00e054]">Boxd</b>
            </span>
          </Link>

          {/* Center: Inset Navigation Capsule (Revealed when expanded on desktop) */}
          <div
            className={`hidden md:flex items-center gap-1 bg-[#141416]/90 p-1 rounded-full border border-white/[0.05] whitespace-nowrap transition-all duration-400 ${
              isExpanded
                ? 'opacity-100 max-w-[420px] pointer-events-auto delay-75 scale-100'
                : 'opacity-0 max-w-0 pointer-events-none scale-95 overflow-hidden'
            }`}
          >
            <a
              href="#how"
              onClick={handleLinkClick}
              className="px-3 py-1 text-xs font-medium text-[#9b9b9b] hover:text-[#f2f2f2] hover:bg-white/[0.08] rounded-full transition-all"
            >
              How it works
            </a>
            <a
              href="#templates"
              onClick={handleLinkClick}
              className="px-3 py-1 text-xs font-medium text-[#9b9b9b] hover:text-[#f2f2f2] hover:bg-white/[0.08] rounded-full transition-all"
            >
              Templates
            </a>
            <a
              href="#features"
              onClick={handleLinkClick}
              className="px-3 py-1 text-xs font-medium text-[#9b9b9b] hover:text-[#f2f2f2] hover:bg-white/[0.08] rounded-full transition-all"
            >
              Features
            </a>
            <a
              href="#faq"
              onClick={handleLinkClick}
              className="px-3 py-1 text-xs font-medium text-[#9b9b9b] hover:text-[#f2f2f2] hover:bg-white/[0.08] rounded-full transition-all"
            >
              FAQ
            </a>
          </div>

          {/* Right State 1: Collapsed mini expand indicator */}
          {!isExpanded && (
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#00e054] pr-1.5 transition-opacity duration-300">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00e054] shadow-[0_0_6px_#00e054] animate-ping" />
              <svg className="w-3.5 h-3.5 text-[#00e054] transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          )}

          {/* Right State 2: Expanded full 'Open studio' button */}
          <div
            className={`transition-all duration-300 flex-shrink-0 ${
              isExpanded
                ? 'opacity-100 max-w-[160px] pointer-events-auto'
                : 'opacity-0 max-w-0 overflow-hidden pointer-events-none'
            }`}
          >
            <Link
              href="/studio"
              onClick={handleLinkClick}
              className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#00e054] hover:bg-[#05f55c] text-[#00200c] font-bold text-xs sm:text-sm px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-[0_0_16px_rgba(0,224,84,0.3)] hover:shadow-[0_0_24px_rgba(0,224,84,0.5)] transition-all hover:scale-[1.03] active:scale-[0.98] whitespace-nowrap"
            >
              <span>Open studio</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
