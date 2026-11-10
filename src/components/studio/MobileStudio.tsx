'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ASPECT_RATIOS } from '../StoryTemplates';
import {
  FormatSection,
  TemplatesSection,
  StyleSection,
  ColorsSection,
  BackgroundSection,
  SectionSharedProps,
  ScrubInfo,
} from './StudioSections';

export type MobileTab = 'format' | 'templates' | 'style' | 'colors' | 'background';
export type SnapPoint = 'peek' | 'half' | 'full';

export interface MobileStudioProps extends SectionSharedProps {
  // Navigation & Export
  onOpenProjects: () => void;
  onDownload: () => void;
  onShare: () => void;
  downloading: boolean;
  sharing: boolean;

  // Render Story Template Canvas
  renderTemplate: () => React.ReactNode;
  canvasWidth: number;
  canvasHeight: number;

  // Undo for Shuffle
  onUndoRandomize?: () => void;
  canUndoRandomize?: boolean;
}

function triggerHaptic(duration = 10) {
  if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(duration);
    } catch {
      // ignore
    }
  }
}

export function MobileStudio(props: MobileStudioProps) {
  const [activeTab, setActiveTab] = useState<MobileTab>('format');
  const [snapPoint, setSnapPoint] = useState<SnapPoint>('half');
  const [scrubbingSlider, setScrubbingSlider] = useState<ScrubInfo | null>(null);
  const [undoToastVisible, setUndoToastVisible] = useState(false);

  // Layout References
  const shellRef = useRef<HTMLDivElement>(null);
  const previewStageRef = useRef<HTMLDivElement>(null);
  const previewScalerRef = useRef<HTMLDivElement>(null);
  const previewFrameRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const sheetContentRef = useRef<HTMLDivElement>(null);
  const sheetBodyRef = useRef<HTMLDivElement>(null);

  // Drag Gesture Refs (to avoid React re-renders during dragging)
  const isDraggingRef = useRef(false);
  const dragStartYRef = useRef(0);
  const dragStartHeightRef = useRef(0);
  const lastYRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const currentHeightRef = useRef(0);
  const snapPointRef = useRef<SnapPoint>(snapPoint);
  useEffect(() => {
    snapPointRef.current = snapPoint;
  }, [snapPoint]);

  // Check reduced motion preference
  const prefersReducedMotion = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Compute heights for snap points based on viewport
  const getSnapHeights = useCallback(() => {
    if (typeof window === 'undefined') {
      return { peek: 76, half: 360, full: 700 };
    }
    const vh = window.innerHeight;
    const peek = 76; // Tab bar + drag handle
    const half = Math.round(vh * 0.45);
    const full = Math.round(vh * 0.88);
    return { peek, half, full };
  }, []);

  // Set Sheet Height via CSS and animate if requested
  const applySheetHeight = useCallback((height: number, animate = true) => {
    currentHeightRef.current = height;
    if (!shellRef.current || !sheetRef.current) return;

    if (animate && !prefersReducedMotion()) {
      sheetRef.current.style.transition = 'height 250ms cubic-bezier(0.32, 0.72, 0, 1)';
    } else {
      sheetRef.current.style.transition = 'none';
    }

    sheetRef.current.style.height = `${height}px`;
    shellRef.current.style.setProperty('--sheet-height', `${height}px`);

    // Clear transition after animation finishes
    if (animate && !prefersReducedMotion()) {
      const timer = setTimeout(() => {
        if (sheetRef.current) sheetRef.current.style.transition = 'none';
      }, 260);
      return () => clearTimeout(timer);
    }
  }, [prefersReducedMotion]);

  // Snap to a specific point with haptics
  const snapTo = useCallback((point: SnapPoint, animate = true) => {
    const heights = getSnapHeights();
    const targetHeight = heights[point];
    setSnapPoint(point);
    applySheetHeight(targetHeight, animate);
    triggerHaptic(10);
  }, [getSnapHeights, applySheetHeight]);

  // Cycle snap points for keyboard accessibility (Enter on drag handle)
  const cycleSnapPoint = useCallback(() => {
    if (snapPoint === 'peek') snapTo('half');
    else if (snapPoint === 'half') snapTo('full');
    else snapTo('peek');
  }, [snapPoint, snapTo]);

  // Initial Snap Setup
  useEffect(() => {
    const heights = getSnapHeights();
    applySheetHeight(heights.half, false);
  }, [getSnapHeights, applySheetHeight]);

  // Recompute preview scale using ResizeObserver and requestAnimationFrame
  const updatePreviewScale = useCallback(() => {
    const stage = previewStageRef.current;
    const scaler = previewScalerRef.current;
    const frame = previewFrameRef.current;
    if (!stage || !scaler || !frame) return;

    const stageRect = stage.getBoundingClientRect();
    const availWidth = Math.max(20, stageRect.width - 24); // 12px margin each side
    const availHeight = Math.max(20, stageRect.height - 24);

    const canvasW = props.canvasWidth;
    const canvasH = props.canvasHeight;

    const scale = Math.min(availWidth / canvasW, availHeight / canvasH);

    requestAnimationFrame(() => {
      scaler.style.transform = `scale(${scale})`;
      frame.style.width = `${canvasW * scale}px`;
      frame.style.height = `${canvasH * scale}px`;
    });
  }, [props.canvasWidth, props.canvasHeight]);

  // Observe Preview Stage Resizes (fires smoothly as sheet moves or screen rotates)
  useEffect(() => {
    const stage = previewStageRef.current;
    if (!stage) return;

    updatePreviewScale();
    const observer = new ResizeObserver(() => {
      updatePreviewScale();
    });
    observer.observe(stage);

    return () => observer.disconnect();
  }, [updatePreviewScale]);

  // Handle VisualViewport for on-screen keyboard (no layout shift)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;

    const handleVisualViewport = () => {
      if (!window.visualViewport || !shellRef.current) return;
      const vpHeight = window.visualViewport.height;
      shellRef.current.style.height = `${vpHeight}px`;
      updatePreviewScale();
    };

    window.visualViewport.addEventListener('resize', handleVisualViewport);
    window.visualViewport.addEventListener('scroll', handleVisualViewport);
    return () => {
      window.visualViewport?.removeEventListener('resize', handleVisualViewport);
      window.visualViewport?.removeEventListener('scroll', handleVisualViewport);
    };
  }, [updatePreviewScale]);

  // DRAG GESTURE HANDLERS (pointer events + velocity fling)
  const handleDragStart = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only drag with primary mouse button / single finger
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    // Don't drag if interactive element inside handle
    if (target.closest('button, input, select, textarea')) return;

    isDraggingRef.current = true;
    dragStartYRef.current = e.clientY;
    dragStartHeightRef.current = currentHeightRef.current || getSnapHeights()[snapPointRef.current];
    lastYRef.current = e.clientY;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;

    if (sheetRef.current) {
      sheetRef.current.style.willChange = 'height';
      sheetRef.current.style.transition = 'none';
      sheetRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handleDragMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !sheetRef.current || !shellRef.current) return;

    const now = performance.now();
    const dt = Math.max(1, now - lastTimeRef.current);
    const dy = e.clientY - lastYRef.current;
    velocityRef.current = dy / dt; // pixels per ms (positive is downward)
    lastYRef.current = e.clientY;
    lastTimeRef.current = now;

    const deltaFromStart = dragStartYRef.current - e.clientY;
    const snapHeights = getSnapHeights();
    const rawHeight = dragStartHeightRef.current + deltaFromStart;

    // Resistance beyond min/max
    const clampedHeight = Math.max(snapHeights.peek - 15, Math.min(snapHeights.full + 15, rawHeight));
    currentHeightRef.current = clampedHeight;

    sheetRef.current.style.height = `${clampedHeight}px`;
    shellRef.current.style.setProperty('--sheet-height', `${clampedHeight}px`);
    updatePreviewScale();
  };

  const handleDragEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    if (sheetRef.current) {
      sheetRef.current.style.willChange = 'auto';
      try {
        sheetRef.current.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }

    const snapHeights = getSnapHeights();
    const height = currentHeightRef.current;
    const vel = velocityRef.current; // positive: pulling down; negative: pushing up

    let targetSnap: SnapPoint = 'half';

    // Fling velocity detection
    if (vel < -0.35) {
      // Strong upward fling
      if (snapPointRef.current === 'peek') targetSnap = 'half';
      else targetSnap = 'full';
    } else if (vel > 0.35) {
      // Strong downward fling
      if (snapPointRef.current === 'full') targetSnap = 'half';
      else targetSnap = 'peek';
    } else {
      // Snap to closest distance
      const distPeek = Math.abs(height - snapHeights.peek);
      const distHalf = Math.abs(height - snapHeights.half);
      const distFull = Math.abs(height - snapHeights.full);

      if (distPeek <= distHalf && distPeek <= distFull) targetSnap = 'peek';
      else if (distFull <= distHalf && distFull <= distPeek) targetSnap = 'full';
      else targetSnap = 'half';
    }

    snapTo(targetSnap, true);
  };

  // Preview Tap Handler: single tap toggles between peek and half
  const handlePreviewTap = (e: React.MouseEvent<HTMLDivElement>) => {
    // If tap came from floating buttons, do not toggle
    const target = e.target as HTMLElement;
    if (target.closest('button, a, input')) return;

    if (snapPoint === 'peek') snapTo('half');
    else snapTo('peek');
  };

  // Tab Selection Handler
  const handleTabClick = (tab: MobileTab) => {
    setActiveTab(tab);
    triggerHaptic(10);
    // If at peek, raise to half
    if (snapPoint === 'peek') {
      snapTo('half');
    }
    // Scroll sheet body to top when switching tabs
    if (sheetBodyRef.current) {
      sheetBodyRef.current.scrollTop = 0;
    }
  };

  // SCRUB MODE: Enter scrub mode when user drags range sliders
  const handleStartScrub = (info: ScrubInfo) => {
    setScrubbingSlider(info);
    triggerHaptic(10);

    // Fade sheet content and collapse visually
    const snapHeights = getSnapHeights();
    const scrubHeight = snapHeights.peek + 58; // Just enough for scrub pill + tab bar
    applySheetHeight(scrubHeight, !prefersReducedMotion());
  };

  const handleEndScrub = useCallback(() => {
    if (!scrubbingSlider) return;
    setScrubbingSlider(null);
    triggerHaptic(10);
    // Restore sheet to previous snap point with 150ms transition
    const snapHeights = getSnapHeights();
    applySheetHeight(snapHeights[snapPointRef.current], !prefersReducedMotion());
  }, [scrubbingSlider, getSnapHeights, applySheetHeight, prefersReducedMotion]);

  // Window pointer listeners to ensure scrub ends reliably on release
  useEffect(() => {
    if (!scrubbingSlider) return;

    const handlePointerUp = () => {
      handleEndScrub();
    };

    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    return () => {
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [scrubbingSlider, handleEndScrub]);

  // SHUFFLE & UNDO
  const handleShuffle = () => {
    props.onRandomize?.();
    setUndoToastVisible(true);
    triggerHaptic(15);
  };

  const handleUndo = () => {
    props.onUndoRandomize?.();
    setUndoToastVisible(false);
    triggerHaptic(15);
  };

  const currentRatioConfig = ASPECT_RATIOS[props.aspectRatio] || ASPECT_RATIOS['9:16'];

  return (
    <div
      ref={shellRef}
      className="fixed inset-0 z-40 flex flex-col bg-black text-white lg:hidden overflow-hidden h-[100dvh] select-none"
      style={{ overscrollBehavior: 'contain' }}
    >
      {/* 1. TOP APP BAR */}
      <header
        className="flex-none flex items-center justify-between px-3 py-2 border-b border-zinc-800/80 bg-zinc-950/95 backdrop-blur-md z-30"
        style={{ paddingTop: 'max(8px, env(safe-area-inset-top))' }}
      >
        {/* Left: Projects View Toggle */}
        <button
          onClick={props.onOpenProjects}
          className="min-w-[44px] min-h-[44px] flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 rounded-xl active:scale-95 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00e054]"
          aria-label="Open saved projects and import"
        >
          <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Projects</span>
        </button>

        {/* Middle: Brand Logo */}
        <div className="flex items-center gap-0.5 text-base font-bold tracking-tight">
          <span className="text-white">Story</span>
          <span className="text-[#00e054]">Boxd</span>
        </div>

        {/* Right: Export Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={props.onShare}
            disabled={props.sharing}
            className="min-w-[44px] min-h-[44px] p-2 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white text-xs font-semibold flex items-center justify-center active:scale-95 transition-all disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00e054]"
            aria-label="Share story"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
          <button
            onClick={props.onDownload}
            disabled={props.downloading}
            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[#00e054] text-black text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow-md shadow-[#00e054]/25 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            aria-label="Download story PNG"
          >
            {props.downloading ? (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            )}
            <span>Save</span>
          </button>
        </div>
      </header>

      {/* 2. PREVIEW STAGE (between top bar and bottom sheet) */}
      <main
        ref={previewStageRef}
        onClick={handlePreviewTap}
        className="flex-1 relative overflow-hidden flex items-center justify-center p-2 cursor-pointer select-none"
        style={{
          marginBottom: 'var(--sheet-height, 45dvh)',
          transition: prefersReducedMotion() ? 'none' : 'margin-bottom 150ms ease-out',
        }}
      >
        {/* Undo Toast */}
        {undoToastVisible && props.canUndoRandomize && (
          <div
            className="absolute top-3 z-30 flex items-center gap-3 px-4 py-2 bg-zinc-900/95 border border-[#00e054]/40 rounded-full shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200"
            role="status"
            aria-live="polite"
          >
            <span className="text-xs text-zinc-300">Shuffled design</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleUndo();
              }}
              className="text-xs font-bold text-[#00e054] hover:underline px-1.5 py-0.5 rounded"
            >
              Undo
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setUndoToastVisible(false);
              }}
              className="text-zinc-500 hover:text-zinc-300 text-xs ml-1"
              aria-label="Dismiss undo toast"
            >
              ×
            </button>
          </div>
        )}

        {/* Scaled Preview Frame */}
        <div
          ref={previewFrameRef}
          className={`relative bg-zinc-850 p-1.5 shadow-2xl overflow-hidden transition-all duration-200 ${
            props.aspectRatio === '9:16'
              ? 'rounded-[2rem]'
              : props.aspectRatio === '4:5'
                ? 'rounded-[1.5rem]'
                : 'rounded-[1.2rem]'
          }`}
        >
          <div
            className={`w-full h-full bg-black overflow-hidden relative ${
              props.aspectRatio === '9:16'
                ? 'rounded-[1.7rem]'
                : props.aspectRatio === '4:5'
                  ? 'rounded-[1.3rem]'
                  : 'rounded-[1rem]'
            }`}
          >
            <div
              ref={previewScalerRef}
              className="origin-top-left"
              style={{
                width: `${props.canvasWidth}px`,
                height: `${props.canvasHeight}px`,
              }}
            >
              {props.renderTemplate()}
            </div>
          </div>
        </div>

        {/* Floating Shuffle Button (bottom right of preview stage) */}
        <div className="absolute right-3 bottom-3 z-20 pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleShuffle();
            }}
            className="min-h-[44px] min-w-[44px] px-3.5 py-2.5 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 hover:border-[#00e054]/50 rounded-full text-white text-xs font-semibold flex items-center gap-1.5 shadow-xl backdrop-blur-md active:scale-95 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00e054]"
            aria-label="Shuffle design randomly"
          >
            <svg className="w-4 h-4 text-[#00e054]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Shuffle</span>
          </button>
        </div>

        {/* Aspect Ratio & Resolution Badge */}
        <div className="absolute left-3 bottom-3 z-10 pointer-events-none opacity-60 flex items-center gap-1.5 text-[10px] text-zinc-400 font-medium">
          <span className="font-semibold text-zinc-300">{currentRatioConfig.label}</span>
          <span>•</span>
          <span className="font-mono">{props.canvasWidth}×{props.canvasHeight}</span>
        </div>
      </main>

      {/* 3. BOTTOM SHEET */}
      <section
        ref={sheetRef}
        role="dialog"
        aria-label="Story customization"
        className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-900 border-t border-zinc-800 rounded-t-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden"
        style={{
          height: 'var(--sheet-height, 45dvh)',
          touchAction: 'none',
        }}
      >
        {/* DRAG HANDLE HEADER */}
        <div
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          onPointerCancel={handleDragEnd}
          className="flex-none pt-2.5 pb-2 px-4 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing border-b border-zinc-800/60"
        >
          {/* Keyboard accessible pill button */}
          <button
            type="button"
            onClick={cycleSnapPoint}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                cycleSnapPoint();
              }
            }}
            tabIndex={0}
            className="w-12 h-1.5 rounded-full bg-zinc-600 hover:bg-zinc-400 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00e054] min-h-[14px]"
            aria-label={`Sheet height: currently ${snapPoint}. Press enter to cycle.`}
          />
        </div>

        {/* FLOATING SCRUB PILL (Visible during range scrubbing) */}
        {scrubbingSlider && (
          <div
            className="flex-none px-4 py-2.5 bg-zinc-950/95 border-b border-[#00e054]/30 shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-150"
            role="region"
            aria-label="Active slider scrub"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {scrubbingSlider.label}
              </span>
              <span className="text-xs font-mono font-bold text-[#00e054] bg-[#00e054]/10 px-2 py-0.5 rounded border border-[#00e054]/30">
                {scrubbingSlider.formatValue
                  ? scrubbingSlider.formatValue(scrubbingSlider.value)
                  : `${scrubbingSlider.value}${scrubbingSlider.unit || ''}`}
              </span>
            </div>
            <input
              type="range"
              min={scrubbingSlider.min}
              max={scrubbingSlider.max}
              step={scrubbingSlider.step}
              value={scrubbingSlider.value}
              onChange={(e) => scrubbingSlider.onChange(parseFloat(e.target.value))}
              className="w-full h-3 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#00e054] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00e054]"
            />
          </div>
        )}

        {/* 4. SHEET BODY CONTENT (Only scrolls here, never page) */}
        <div
          ref={sheetContentRef}
          className={`flex-1 overflow-hidden transition-opacity duration-150 ${
            scrubbingSlider ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <div
            ref={sheetBodyRef}
            id={`tabpanel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
            className="h-full overflow-y-auto px-4 py-3 space-y-4"
            style={{
              overscrollBehavior: 'contain',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {activeTab === 'format' && (
              <FormatSection
                {...props}
                showShuffle={true}
                showSaveDraft={true}
                onStartScrub={handleStartScrub}
              />
            )}

            {activeTab === 'templates' && (
              <TemplatesSection
                selectedTemplate={props.selectedTemplate}
                setSelectedTemplate={props.setSelectedTemplate}
              />
            )}

            {activeTab === 'style' && (
              <StyleSection
                {...props}
                onStartScrub={handleStartScrub}
              />
            )}

            {activeTab === 'colors' && (
              <ColorsSection
                accentColor={props.accentColor}
                setAccentColor={props.setAccentColor}
                colorTheme={props.colorTheme}
                setColorTheme={props.setColorTheme}
              />
            )}

            {activeTab === 'background' && (
              <BackgroundSection
                {...props}
                hideFilters={false}
                onStartScrub={handleStartScrub}
              />
            )}
          </div>
        </div>

        {/* 5. DOCKED TAB BAR AT BOTTOM OF SHEET */}
        <nav
          role="tablist"
          aria-label="Story customization categories"
          className="flex-none bg-zinc-950/98 border-t border-zinc-800 grid grid-cols-5 px-1 z-30"
          style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}
        >
          {([
            {
              id: 'format' as MobileTab,
              label: 'Format',
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              ),
            },
            {
              id: 'templates' as MobileTab,
              label: 'Templates',
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
              ),
            },
            {
              id: 'style' as MobileTab,
              label: 'Style',
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M12 6v14m-4 0h8" />
                </svg>
              ),
            },
            {
              id: 'colors' as MobileTab,
              label: 'Colors',
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4 5 5 0 018-3.6A5 5 0 0119 17a4 4 0 01-4 4H7z" />
                </svg>
              ),
            },
            {
              id: 'background' as MobileTab,
              label: 'Background',
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              ),
            },
          ]).map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => handleTabClick(tab.id)}
                className={`min-h-[48px] py-1.5 flex flex-col items-center justify-center gap-1 transition-colors relative focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00e054] ${
                  isActive ? 'text-[#00e054]' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="shrink-0">{tab.icon}</div>
                <span className="text-[10px] font-medium leading-none tracking-tight">{tab.label}</span>
                {isActive && (
                  <div
                    className="absolute bottom-0 w-8 h-0.5 bg-[#00e054] rounded-full"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </nav>
      </section>
    </div>
  );
}

