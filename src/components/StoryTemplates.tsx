'use client';

import { ReviewData } from '@/app/api/scrape/route';

// Font type - 3 very distinct font families
export type FontType = 'sans' | 'serif' | 'mono';

// Color theme
export type ColorTheme = 'neutral' | 'warm' | 'neon';

// Backdrop horizontal position
// Use percentage (0–100) for horizontal backdrop position
// 0 = left, 50 = center, 100 = right

// Text style options
 export interface TextStyle {
   fontType: FontType;
   colorTheme: ColorTheme;
   isBold: boolean;
   isItalic: boolean;
 }
 
 interface TemplateProps {
   data: ReviewData;
   fontSizeMultiplier?: number;
   textStyle?: TextStyle;
   backdropPositionPercent?: number; // 0–100
  showPoster?: boolean;
 }

// Helper to proxy image URLs to avoid CORS issues
function proxyUrl(url: string): string {
  if (!url) return '';
  return `/api/proxy-image?url=${encodeURIComponent(url)}`;
}

// Font families using CSS variables from layout.tsx Google Fonts
const FONTS: Record<FontType, string> = {
  sans: 'var(--font-inter), Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  serif: 'var(--font-playfair), "Playfair Display", Georgia, serif',
  mono: 'var(--font-mono), "Space Mono", "Courier New", monospace',
};

// Color configurations
interface ColorConfig {
  primary: string;
  accent: string;
  star: string;
  textShadow: string;
  titleShadow: string;
}

const COLORS: Record<ColorTheme, ColorConfig> = {
  neutral: {
    primary: '#ffffff',
    accent: '#a0a0a0',
    star: '#00e054',
    textShadow: '0 2px 20px rgba(0,0,0,0.5)',
    titleShadow: '0 2px 10px rgba(0,0,0,0.5)',
  },
  warm: {
    primary: '#fff8e7',
    accent: '#d4a574',
    star: '#d4a574',
    textShadow: '0 2px 30px rgba(0,0,0,0.7)',
    titleShadow: '0 4px 20px rgba(0,0,0,0.6), 0 0 40px rgba(212,165,116,0.2)',
  },
  neon: {
    primary: '#ffffff',
    accent: '#00e054',
    star: '#00e054',
    textShadow: '0 0 20px rgba(0,224,84,0.4), 0 0 40px rgba(0,224,84,0.2), 0 2px 10px rgba(0,0,0,0.8)',
    titleShadow: '0 0 30px rgba(0,224,84,0.6), 0 0 60px rgba(0,224,84,0.3)',
  },
};

// Default text style
const DEFAULT_STYLE: TextStyle = {
  fontType: 'sans',
  colorTheme: 'neutral',
  isBold: false,
  isItalic: false,
};

// Auto-scale font size based on text length
function getAutoScale(textLength: number): number {
  if (textLength <= 80) return 1.1;      // Short text - slightly bigger
  if (textLength <= 150) return 1.0;     // Normal
  if (textLength <= 250) return 0.85;    // Medium - slightly smaller
  if (textLength <= 400) return 0.7;     // Long - smaller
  if (textLength <= 600) return 0.55;    // Very long - much smaller
  return 0.45;                           // Extremely long - minimum
}

// Helper to render star rating with inline styles
function StarRating({ rating, size = 48, colorTheme = 'neutral' }: { rating: number; size?: number; colorTheme?: ColorTheme }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;
  const colors = COLORS[colorTheme];

  return (
    <span style={{
      color: colors.star,
      fontSize: `${size}px`,
      fontWeight: 'bold',
      letterSpacing: '4px',
      textShadow: colorTheme === 'neon' ? '0 0 20px rgba(0,224,84,0.8), 0 0 40px rgba(0,224,84,0.4)' : 'none',
    }}>
      {'★'.repeat(fullStars)}
      {hasHalf && '½'}
    </span>
  );
}

// Template 1: Info at bottom (like screenshot 1)
export function TemplateBottom({ data, fontSizeMultiplier = 1, textStyle = DEFAULT_STYLE, backdropPositionPercent = 50, showPoster = false }: TemplateProps) {
  const autoScale = getAutoScale(data.reviewText.length);
  const scale = fontSizeMultiplier * autoScale;
  const reviewFontSize = Math.round(52 * scale);

  const font = FONTS[textStyle.fontType];
  const colors = COLORS[textStyle.colorTheme];
  const fontWeight = textStyle.isBold ? 700 : 400;
  const fontStyleCss = textStyle.isItalic ? 'italic' : 'normal';

  return (
    <div style={{
      position: 'relative',
      width: '1080px',
      height: '1920px',
      backgroundColor: '#000000',
      overflow: 'hidden',
      backgroundImage: data.backdropUrl ? `url(${proxyUrl(data.backdropUrl)})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: `${backdropPositionPercent}% center`,
      backgroundRepeat: 'no-repeat',
      fontFamily: font,
    }}>

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.2) 70%, transparent 100%)',
      }} />


      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '80px 64px',
        textAlign: 'center',
      }}>
        {/* Review text */}
        <p style={{
          color: colors.primary,
          fontSize: `${reviewFontSize}px`,
          fontWeight: fontWeight,
          fontStyle: fontStyleCss,
          marginBottom: '48px',
          lineHeight: 1.5,
          maxWidth: '950px',
          marginLeft: 'auto',
          marginRight: 'auto',
          textShadow: colors.textShadow,
        }}>
          "{data.reviewText}"
        </p>

        {/* Rating */}
        <div style={{ marginBottom: '24px' }}>
          <StarRating rating={data.ratingNumber} size={56} colorTheme={textStyle.colorTheme} />
        </div>

        {/* Title row with optional poster */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '28px',
          marginTop: '8px',
          marginBottom: '16px',
        }}>
          {showPoster && data.posterUrl && (
            <img
              src={proxyUrl(data.posterUrl)}
              alt=""
              style={{
                width: '200px',
                height: '300px',
                objectFit: 'cover',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 12px 36px rgba(0,0,0,0.6)'
              }}
            />
          )}
          <div style={{ textAlign: 'left' }}>
            <h2 style={{
              color: colors.primary,
              fontSize: '56px',
              fontWeight: textStyle.isBold ? 800 : 700,
              marginBottom: '8px',
              textShadow: colors.titleShadow,
            }}>
              {data.movieTitle}
            </h2>
            <p style={{ color: colors.accent, fontSize: '40px', fontWeight: 300, textAlign: 'center' }}>
              {data.year}
            </p>
          </div>
        </div>

        {/* Director */}
        {data.director && (
          <p style={{ color: '#888888', fontSize: '32px', marginBottom: '40px', fontWeight: 300 }}>
            Directed by {data.director}
          </p>
        )}

        {/* Username */}
        <p style={{ color: '#666666', fontSize: '32px', fontWeight: 400 }}>
          Review by <span style={{ color: colors.accent }}>{data.username}</span>
        </p>
      </div>
    </div>
  );
}

// Template 2: Info card at top-left (like screenshot 2)
export function TemplateTopLeft({ data, fontSizeMultiplier = 1, textStyle = DEFAULT_STYLE, backdropPositionPercent = 50, showPoster = false }: TemplateProps) {
  const autoScale = getAutoScale(data.reviewText.length);
  const scale = fontSizeMultiplier * autoScale;
  const reviewFontSize = Math.round(48 * scale);

  const font = FONTS[textStyle.fontType];
  const colors = COLORS[textStyle.colorTheme];
  const fontWeight = textStyle.isBold ? 700 : 400;
  const fontStyleCss = textStyle.isItalic ? 'italic' : 'normal';

  return (
    <div style={{
      position: 'relative',
      width: '1080px',
      height: '1920px',
      backgroundColor: '#000000',
      overflow: 'hidden',
      backgroundImage: data.backdropUrl ? `url(${proxyUrl(data.backdropUrl)})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: `${backdropPositionPercent}% center`,
      backgroundRepeat: 'no-repeat',
      fontFamily: font,
    }}>
      {/* Gradient overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.7) 100%)',
      }} />
      {/* Top-left legibility mask */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '560px',
        height: '420px',
        background: 'linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0) 70%)',
        pointerEvents: 'none'
      }} />

      {/* Top-left card */}
      <div style={{
        position: 'absolute',
        top: '100px',
        left: '64px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '32px',
      }}>
        {/* Poster thumbnail */}
        {showPoster && data.posterUrl && (
          <img
            src={proxyUrl(data.posterUrl)}
            alt=""
            crossOrigin="anonymous"
            style={{
              width: '180px',
              height: '270px',
              objectFit: 'cover',
              borderRadius: '12px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            }}
          />
        )}

        <div style={{ textAlign: 'left', paddingTop: '8px' }}>
          {/* Title and year */}
          <h2 style={{
            color: colors.primary,
            fontSize: '52px',
            fontWeight: textStyle.isBold ? 800 : 700,
            textShadow: colors.titleShadow,
            marginBottom: '8px',
          }}>
            {data.movieTitle}
          </h2>
          <p style={{ color: colors.accent, fontSize: '36px', fontWeight: 300, marginBottom: '12px' }}>
            {data.year}
          </p>

          {/* Director */}
          {data.director && (
            <p style={{ color: '#888888', fontSize: '28px', fontWeight: 300, marginBottom: '16px' }}>
              Directed by {data.director}
            </p>
          )}

          {/* Divider */}
          <div style={{ height: '1px', width: '100%', background: 'rgba(255,255,255,0.12)', margin: '8px 0 12px 0' }} />

          {/* Username */}
          <p style={{ color: '#888888', fontSize: '28px' }}>
            Review by <span style={{ color: colors.accent }}>{data.username}</span>
          </p>
        </div>
      </div>

      {/* Review text below the card */}
      <div style={{
        position: 'absolute',
        top: '500px',
        left: '64px',
        right: '64px',
      }}>
        <p style={{
          color: colors.primary,
          fontSize: `${reviewFontSize}px`,
          fontWeight: fontWeight,
          fontStyle: fontStyleCss,
          lineHeight: 1.6,
          textShadow: colors.textShadow,
          maxWidth: '640px',
          textAlign: 'left',
          borderLeft: `3px solid ${colors.accent}`,
          paddingLeft: '16px',
          marginBottom: '24px'
        }}>
          "{data.reviewText}"
        </p>
        <div>
          <StarRating rating={data.ratingNumber} size={40} colorTheme={textStyle.colorTheme} />
        </div>
      </div>
    </div>
  );
}

// Template 3: Centered floating card (like screenshot 3)
export function TemplateCentered({ data, fontSizeMultiplier = 1, textStyle = DEFAULT_STYLE, backdropPositionPercent = 50, showPoster = false }: TemplateProps) {
  const autoScale = getAutoScale(data.reviewText.length);
  const scale = fontSizeMultiplier * autoScale;
  const reviewFontSize = Math.round(44 * scale);

  const font = FONTS[textStyle.fontType];
  const colors = COLORS[textStyle.colorTheme];
  const fontWeight = textStyle.isBold ? 700 : 400;
  const fontStyleCss = textStyle.isItalic ? 'italic' : 'normal';

  // Card background varies by color theme
  const cardBg = textStyle.colorTheme === 'neon'
    ? 'rgba(0,20,10,0.9)'
    : textStyle.colorTheme === 'warm'
      ? 'rgba(30,25,20,0.9)'
      : 'rgba(20,20,20,0.85)';

  const cardBorder = textStyle.colorTheme === 'neon'
    ? '1px solid rgba(0,224,84,0.3)'
    : textStyle.colorTheme === 'warm'
      ? '1px solid rgba(212,165,116,0.2)'
      : '1px solid rgba(255,255,255,0.1)';

  return (
    <div style={{
      position: 'relative',
      width: '1080px',
      height: '1920px',
      backgroundColor: '#000000',
      overflow: 'hidden',
      backgroundImage: data.backdropUrl ? `url(${proxyUrl(data.backdropUrl)})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: `${backdropPositionPercent}% center`,
      backgroundRepeat: 'no-repeat',
      fontFamily: font,
    }}>
      {/* Overlay with blur effect simulation */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.55)',
      }} />
      {/* Vignette edges for focus */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(70% 60% at 50% 45%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.5) 100%)',
        pointerEvents: 'none'
      }} />

      {/* Centered card */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          backgroundColor: cardBg,
          backdropFilter: 'blur(14px)',
          borderRadius: '24px',
          padding: '72px',
          margin: '0 64px',
          textAlign: 'center',
          maxWidth: '920px',
          boxShadow: textStyle.colorTheme === 'neon'
            ? '0 40px 80px rgba(0,0,0,0.5), 0 0 60px rgba(0,224,84,0.15)'
            : '0 40px 80px rgba(0,0,0,0.5)',
          border: cardBorder,
        }}>
          {/* Poster thumbnail */}
          {showPoster && data.posterUrl && (
            <img
              src={proxyUrl(data.posterUrl)}
              alt=""
              crossOrigin="anonymous"
              style={{
                width: '200px',
                height: '300px',
                objectFit: 'cover',
                borderRadius: '16px',
                boxShadow: textStyle.colorTheme === 'neon'
                  ? '0 20px 40px rgba(0,0,0,0.4), 0 0 30px rgba(0,224,84,0.2)'
                  : '0 20px 40px rgba(0,0,0,0.4)',
                margin: '0 auto 40px auto',
                display: 'block',
              }}
            />
          )}

          {/* Title and year */}
          <h2 style={{
            color: colors.primary,
            fontSize: '52px',
            fontWeight: textStyle.isBold ? 800 : 700,
            marginBottom: '8px',
            textShadow: colors.titleShadow,
          }}>
            {data.movieTitle}
          </h2>
          <p style={{ color: colors.accent, fontSize: '36px', fontWeight: 300, marginBottom: '16px' }}>
             {data.year}
           </p>

          {data.director && (
             <p style={{ color: '#888888', fontSize: '30px', fontWeight: 300, marginBottom: '24px' }}>
               Directed by {data.director}
             </p>
           )}


          {/* Review text */}
          <p style={{
            color: colors.primary,
            fontSize: `${reviewFontSize}px`,
            fontWeight: fontWeight,
            fontStyle: fontStyleCss,
            lineHeight: 1.6,
            margin: '0 auto 24px auto',
            maxWidth: '720px',
            textShadow: textStyle.colorTheme === 'neon' ? '0 0 10px rgba(255,255,255,0.3)' : 'none',
          }}>
            "{data.reviewText}"
          </p>

          {/* Rating under quote */}
          <div style={{ marginBottom: '32px' }}>
            <StarRating rating={data.ratingNumber} size={44} colorTheme={textStyle.colorTheme} />
          </div>

          {/* Username */}
          <p style={{ color: '#666666', fontSize: '32px' }}>
            Review by <span style={{ color: colors.accent }}>{data.username}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

