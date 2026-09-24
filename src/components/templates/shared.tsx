'use client';

import { ReviewData } from '@/lib/clientScraper';

export type TemplateType = 'bottom' | 'topLeft' | 'centered' | 'minimal' | 'split' | 'magazine' | 'cinematic' | 'gradient' | 'duotone' | 'newspaper' | 'letterboxd' | 'wrapped';

// Updated Font Types
// Updated Font Types - can be a preset key or a font family name
export type FontType = string;

export type ColorTheme = 'neutral' | 'warm' | 'neon';

export type TextAlign = 'left' | 'center' | 'right';
export type QuoteStyle = 'double' | 'angle' | 'none';

export interface TextStyle {
    fontType: FontType;
    colorTheme: ColorTheme;
    isBold: boolean;
    isItalic: boolean;
    letterSpacing: number;  // in pixels
    lineHeight: number;     // multiplier (e.g., 1.4)
    textAlign: TextAlign;
    quoteStyle: QuoteStyle;
}

export type AspectRatio = '9:16' | '4:5' | '1:1' | '16:9';

export interface AspectRatioConfig {
    id: AspectRatio;
    label: string;
    sublabel: string;
    description: string;
    width: number;
    height: number;
    previewWidth: number;
    previewHeight: number;
    scale: number;
}

export const ASPECT_RATIOS: Record<AspectRatio, AspectRatioConfig> = {
    '9:16': {
        id: '9:16',
        label: '9:16',
        sublabel: 'Story',
        description: 'Instagram Story, TikTok, Reels',
        width: 1080,
        height: 1920,
        previewWidth: 270,
        previewHeight: 480,
        scale: 0.25,
    },
    '4:5': {
        id: '4:5',
        label: '4:5',
        sublabel: 'Portrait',
        description: 'Instagram Feed Post',
        width: 1080,
        height: 1350,
        previewWidth: 270,
        previewHeight: 337.5,
        scale: 0.25,
    },
    '1:1': {
        id: '1:1',
        label: '1:1',
        sublabel: 'Square',
        description: 'Twitter / Bluesky / Feed',
        width: 1080,
        height: 1080,
        previewWidth: 270,
        previewHeight: 270,
        scale: 0.25,
    },
    '16:9': {
        id: '16:9',
        label: '16:9',
        sublabel: 'Landscape',
        description: 'Twitter Banner / Desktop',
        width: 1920,
        height: 1080,
        previewWidth: 320,
        previewHeight: 180,
        scale: 320 / 1920,
    },
};

export interface TemplateProps {
    data: ReviewData;
    fontSizeMultiplier?: number;
    textStyle?: TextStyle;
    backdropPositionPercent?: number;
    backdropPositionYPercent?: number;
    showPoster?: boolean;
    customBackdropUrl?: string | null;
    processedBackdropUrl?: string | null; // Pre-processed image with filters baked in
    backdropBlur?: number;
    backdropBrightness?: number;
    backdropSaturation?: number;
    accentColor?: string;
    canvasWidth?: number;
    canvasHeight?: number;
    aspectRatio?: AspectRatio;
}

export function getQuoteWrapped(text: string, quoteStyle: QuoteStyle): string {
    switch (quoteStyle) {
        case 'double': return `\u201C${text}\u201D`;
        case 'angle': return `\u00AB ${text} \u00BB`;
        case 'none': return text;
    }
}

export function proxyUrl(url: string): string {
    if (!url) return '';
    return `/api/proxy-image?url=${encodeURIComponent(url)}`;
}

export function hexToRgba(hex: string, alpha: number) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getBackgroundImage(data: ReviewData, customUrl?: string | null, processedUrl?: string | null) {
    // If we have a pre-processed image (with filters baked in), use it
    if (processedUrl) {
        return `url(${processedUrl})`;
    }
    if (customUrl) {
        if (customUrl.includes('gradient')) return customUrl;
        return `url(${customUrl})`;
    }
    return data.backdropUrl ? `url(${proxyUrl(data.backdropUrl)})` : 'none';
}

export function getAutoScale(textLength: number, aspectRatio: AspectRatio = '9:16'): number {
    let base = 1.0;
    if (textLength <= 80) base = 1.1;
    else if (textLength <= 150) base = 1.0;
    else if (textLength <= 250) base = 0.85;
    else if (textLength <= 400) base = 0.7;
    else if (textLength <= 600) base = 0.55;
    else base = 0.45;

    if (aspectRatio === '1:1') return base * 0.9;
    if (aspectRatio === '4:5') return base * 0.95;
    if (aspectRatio === '16:9') return base * 0.9;
    return base;
}

// UPDATE FONTS MAPPING
export const FONTS: Record<FontType, string> = {
    sans: 'var(--font-inter), Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    serif: 'var(--font-playfair), "Playfair Display", Georgia, serif',
    mono: 'var(--font-mono), "Space Mono", "Courier New", monospace',
    courier: 'var(--font-courier), "Courier Prime", Courier, monospace',
    marker: 'var(--font-marker), "Permanent Marker", cursive',
    anton: 'var(--font-anton), "Anton", sans-serif',
};

interface ColorConfig {
    primary: string;
    textShadow: string;
    titleShadow: string;
}

export const COLORS: Record<ColorTheme, ColorConfig> = {
    neutral: {
        primary: '#ffffff',
        textShadow: '0 2px 20px rgba(0,0,0,0.5)',
        titleShadow: '0 2px 10px rgba(0,0,0,0.5)',
    },
    warm: {
        primary: '#fff8e7',
        textShadow: '0 2px 30px rgba(0,0,0,0.7)',
        titleShadow: '0 4px 20px rgba(0,0,0,0.6), 0 0 40px rgba(212,165,116,0.2)',
    },
    neon: {
        primary: '#ffffff',
        textShadow: '',
        titleShadow: '',
    },
};

export const DEFAULT_STYLE: TextStyle = {
    fontType: 'sans',
    colorTheme: 'neutral',
    isBold: false,
    isItalic: false,
    letterSpacing: 0,
    lineHeight: 1.4,
    textAlign: 'center',
    quoteStyle: 'double',
};

export function StarRating({ rating, size = 48, color, shadow }: { rating: number; size?: number; color: string; shadow?: string }) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;

    return (
        <span style={{
            color: color,
            fontSize: `${size}px`,
            fontWeight: 'bold',
            letterSpacing: '4px',
            textShadow: shadow || '0 2px 10px rgba(0,0,0,0.3)',
        }}>
            {'★'.repeat(fullStars)}
            {hasHalf && '½'}
        </span>
    );
}
