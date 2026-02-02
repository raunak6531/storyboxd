'use client';

import { ReviewData } from '@/lib/clientScraper';

export type TemplateType = 'bottom' | 'topLeft' | 'centered' | 'minimal' | 'split' | 'magazine' | 'cinematic' | 'gradient' | 'duotone';

// Updated Font Types
// Updated Font Types - can be a preset key or a font family name
export type FontType = string;

export type ColorTheme = 'neutral' | 'warm' | 'neon';

export interface TextStyle {
    fontType: FontType;
    colorTheme: ColorTheme;
    isBold: boolean;
    isItalic: boolean;
    letterSpacing: number;  // in pixels
    lineHeight: number;     // multiplier (e.g., 1.4)
}

export interface TemplateProps {
    data: ReviewData;
    fontSizeMultiplier?: number;
    textStyle?: TextStyle;
    backdropPositionPercent?: number;
    showPoster?: boolean;
    customBackdropUrl?: string | null;
    processedBackdropUrl?: string | null; // Pre-processed image with filters baked in
    backdropBlur?: number;
    backdropBrightness?: number;
    backdropSaturation?: number;
    accentColor?: string;
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

export function getAutoScale(textLength: number): number {
    if (textLength <= 80) return 1.1;
    if (textLength <= 150) return 1.0;
    if (textLength <= 250) return 0.85;
    if (textLength <= 400) return 0.7;
    if (textLength <= 600) return 0.55;
    return 0.45;
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
