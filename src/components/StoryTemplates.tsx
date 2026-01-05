'use client';

import { ReviewData } from '@/app/api/scrape/route';

export type TemplateType = 'bottom' | 'topLeft' | 'centered';

// Updated Font Types
export type FontType = 'sans' | 'serif' | 'mono' | 'courier' | 'marker' | 'anton';

export type ColorTheme = 'neutral' | 'warm' | 'neon';

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
  backdropPositionPercent?: number;
  showPoster?: boolean;
  customBackdropUrl?: string | null;
  backdropBlur?: number;
  backdropBrightness?: number;
  backdropSaturation?: number;
  accentColor?: string;
}

function proxyUrl(url: string): string {
  if (!url) return '';
  return `/api/proxy-image?url=${encodeURIComponent(url)}`;
}

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getBackgroundImage(data: ReviewData, customUrl?: string | null) {
  if (customUrl) {
    if (customUrl.includes('gradient')) return customUrl;
    return `url(${customUrl})`;
  }
  return data.backdropUrl ? `url(${proxyUrl(data.backdropUrl)})` : 'none';
}

// UPDATE FONTS MAPPING
const FONTS: Record<FontType, string> = {
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

const COLORS: Record<ColorTheme, ColorConfig> = {
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

const DEFAULT_STYLE: TextStyle = {
  fontType: 'sans',
  colorTheme: 'neutral',
  isBold: false,
  isItalic: false,
};

function getAutoScale(textLength: number): number {
  if (textLength <= 80) return 1.1;
  if (textLength <= 150) return 1.0;
  if (textLength <= 250) return 0.85;
  if (textLength <= 400) return 0.7;
  if (textLength <= 600) return 0.55;
  return 0.45;
}

function StarRating({ rating, size = 48, color, shadow }: { rating: number; size?: number; color: string; shadow?: string }) {
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

export function TemplateBottom({ 
  data, 
  fontSizeMultiplier = 1, 
  textStyle = DEFAULT_STYLE, 
  backdropPositionPercent = 50, 
  showPoster = false,
  customBackdropUrl,
  backdropBlur = 0,
  backdropBrightness = 100,
  backdropSaturation = 100,
  accentColor = '#00e054'
}: TemplateProps) {
  const autoScale = getAutoScale(data.reviewText.length);
  const scale = fontSizeMultiplier * autoScale;
  const reviewFontSize = Math.round(52 * scale);

  const font = FONTS[textStyle.fontType];
  
  // 1. Get base colors
  let colors = { ...COLORS[textStyle.colorTheme] };
  let accentShadow = '0 2px 10px rgba(0,0,0,0.3)';

  // 2. If NEON, generate dynamic glow
  if (textStyle.colorTheme === 'neon') {
    const glowColor = hexToRgba(accentColor, 0.6);
    const ambientGlow = hexToRgba(accentColor, 0.2);
    
    colors.titleShadow = `0 0 30px ${glowColor}, 0 0 60px ${ambientGlow}, 0 2px 10px rgba(0,0,0,0.8)`;
    colors.textShadow = `0 0 15px ${ambientGlow}, 0 2px 20px rgba(0,0,0,0.8)`;
    accentShadow = `0 0 20px ${glowColor}, 0 0 10px ${ambientGlow}`; 
  }

  const fontWeight = textStyle.isBold ? 700 : 400;
  const fontStyleCss = textStyle.isItalic ? 'italic' : 'normal';

  return (
    <div style={{
      position: 'relative',
      width: '1080px',
      height: '1920px',
      backgroundColor: '#000000',
      overflow: 'hidden',
      fontFamily: font,
    }}>
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: getBackgroundImage(data, customBackdropUrl),
        backgroundSize: 'cover',
        backgroundPosition: `${backdropPositionPercent}% center`,
        backgroundRepeat: 'no-repeat',
        filter: `blur(${backdropBlur}px) brightness(${backdropBrightness}%) saturate(${backdropSaturation}%)`,
        zIndex: 0,
        transform: 'scale(1.05)',
      }} />

      {!customBackdropUrl?.includes('gradient') && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.2) 70%, transparent 100%)',
          zIndex: 1,
        }} />
      )}

      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        padding: '80px 64px',
        textAlign: 'center',
        zIndex: 2,
      }}>
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

        <div style={{ marginBottom: '24px' }}>
          <StarRating rating={data.ratingNumber} size={56} color={accentColor} shadow={accentShadow} />
        </div>

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
            <p style={{ color: accentColor, textShadow: accentShadow, fontSize: '44px', fontWeight: 300, textAlign: 'center' }}>
              {data.year}
            </p>
          </div>
        </div>

        {data.director && (
          <p style={{ color: '#888888', fontSize: '34px', marginBottom: '40px', fontWeight: 300 }}>
            Directed by {data.director}
          </p>
        )}

        <p style={{ color: '#666666', fontSize: '34px', fontWeight: 400 }}>
          Review by <span style={{ color: accentColor, textShadow: accentShadow }}>{data.username}</span>
        </p>
      </div>
    </div>
  );
}

export function TemplateTopLeft({ 
  data, 
  fontSizeMultiplier = 1, 
  textStyle = DEFAULT_STYLE, 
  backdropPositionPercent = 50, 
  showPoster = false,
  customBackdropUrl,
  backdropBlur = 0,
  backdropBrightness = 100,
  backdropSaturation = 100,
  accentColor = '#00e054'
}: TemplateProps) {
  const autoScale = getAutoScale(data.reviewText.length);
  const scale = fontSizeMultiplier * autoScale;
  const reviewFontSize = Math.round(48 * scale);

  const font = FONTS[textStyle.fontType];
  
  let colors = { ...COLORS[textStyle.colorTheme] };
  let accentShadow = '0 2px 10px rgba(0,0,0,0.3)';

  if (textStyle.colorTheme === 'neon') {
    const glowColor = hexToRgba(accentColor, 0.6);
    const ambientGlow = hexToRgba(accentColor, 0.2);
    
    colors.titleShadow = `0 0 30px ${glowColor}, 0 0 60px ${ambientGlow}, 0 2px 10px rgba(0,0,0,0.8)`;
    colors.textShadow = `0 0 15px ${ambientGlow}, 0 2px 20px rgba(0,0,0,0.8)`;
    accentShadow = `0 0 20px ${glowColor}, 0 0 10px ${ambientGlow}`; 
  }

  const fontWeight = textStyle.isBold ? 700 : 400;
  const fontStyleCss = textStyle.isItalic ? 'italic' : 'normal';

  return (
    <div style={{
      position: 'relative',
      width: '1080px',
      height: '1920px',
      backgroundColor: '#000000',
      overflow: 'hidden',
      fontFamily: font,
    }}>
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: getBackgroundImage(data, customBackdropUrl),
        backgroundSize: 'cover',
        backgroundPosition: `${backdropPositionPercent}% center`,
        backgroundRepeat: 'no-repeat',
        filter: `blur(${backdropBlur}px) brightness(${backdropBrightness}%) saturate(${backdropSaturation}%)`,
        zIndex: 0,
        transform: 'scale(1.05)',
      }} />

      {!customBackdropUrl?.includes('gradient') && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.7) 100%)',
          zIndex: 1,
        }} />
      )}
      
      <div style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '560px',
        height: '420px',
        background: 'linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0) 70%)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{
          position: 'absolute',
          top: '100px',
          left: '64px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '32px',
        }}>
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
            <h2 style={{
              color: colors.primary,
              fontSize: '52px',
              fontWeight: textStyle.isBold ? 800 : 700,
              textShadow: colors.titleShadow,
              marginBottom: '8px',
            }}>
              {data.movieTitle}
            </h2>
            <p style={{ color: accentColor, textShadow: accentShadow, fontSize: '44px', fontWeight: 300, marginBottom: '12px' }}>
              {data.year}
            </p>
            {data.director && (
              <p style={{ color: '#888888', fontSize: '34px', fontWeight: 300, marginBottom: '16px' }}>
                Directed by {data.director}
              </p>
            )}
            <div style={{ height: '1px', width: '100%', background: 'rgba(255,255,255,0.12)', margin: '8px 0 12px 0' }} />
            <p style={{ color: '#888888', fontSize: '34px' }}>
              Review by <span style={{ color: accentColor, textShadow: accentShadow }}>{data.username}</span>
            </p>
          </div>
        </div>

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
            borderLeft: `3px solid ${accentColor}`,
            paddingLeft: '16px',
            marginBottom: '24px'
          }}>
            "{data.reviewText}"
          </p>
          <div>
            <StarRating rating={data.ratingNumber} size={56} color={accentColor} shadow={accentShadow} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TemplateCentered({ 
  data, 
  fontSizeMultiplier = 1, 
  textStyle = DEFAULT_STYLE, 
  backdropPositionPercent = 50, 
  showPoster = false,
  customBackdropUrl,
  backdropBlur = 0,
  backdropBrightness = 100,
  backdropSaturation = 100,
  accentColor = '#00e054'
}: TemplateProps) {
  const autoScale = getAutoScale(data.reviewText.length);
  const scale = fontSizeMultiplier * autoScale;
  const reviewFontSize = Math.round(44 * scale);

  const font = FONTS[textStyle.fontType];
  
  let colors = { ...COLORS[textStyle.colorTheme] };
  let accentShadow = '0 2px 10px rgba(0,0,0,0.3)';

  if (textStyle.colorTheme === 'neon') {
    const glowColor = hexToRgba(accentColor, 0.6);
    const ambientGlow = hexToRgba(accentColor, 0.2);
    
    colors.titleShadow = `0 0 30px ${glowColor}, 0 0 60px ${ambientGlow}, 0 2px 10px rgba(0,0,0,0.8)`;
    colors.textShadow = `0 0 15px ${ambientGlow}, 0 2px 20px rgba(0,0,0,0.8)`;
    accentShadow = `0 0 20px ${glowColor}, 0 0 10px ${ambientGlow}`; 
  }

  const fontWeight = textStyle.isBold ? 700 : 400;
  const fontStyleCss = textStyle.isItalic ? 'italic' : 'normal';

  const cardBg = textStyle.colorTheme === 'neon'
    ? 'rgba(18,24,27,0.9)'
    : textStyle.colorTheme === 'warm'
      ? 'rgba(30,25,20,0.9)'
      : 'rgba(20,20,20,0.85)';

  const cardBorder = `1px solid ${accentColor}40`;

  return (
    <div style={{
      position: 'relative',
      width: '1080px',
      height: '1920px',
      backgroundColor: '#000000',
      overflow: 'hidden',
      fontFamily: font,
    }}>
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: getBackgroundImage(data, customBackdropUrl),
        backgroundSize: 'cover',
        backgroundPosition: `${backdropPositionPercent}% center`,
        backgroundRepeat: 'no-repeat',
        filter: `blur(${backdropBlur}px) brightness(${backdropBrightness}%) saturate(${backdropSaturation}%)`,
        zIndex: 0,
        transform: 'scale(1.05)',
      }} />

      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.55)',
        zIndex: 1,
      }} />
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'radial-gradient(70% 60% at 50% 45%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.5) 100%)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
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
            ? '0 40px 80px rgba(0,0,0,0.5), 0 0 60px rgba(79,209,197,0.12)'
            : '0 40px 80px rgba(0,0,0,0.5)',
          border: cardBorder,
        }}>
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
                  ? '0 20px 40px rgba(0,0,0,0.4), 0 0 30px rgba(79,209,197,0.18)'
                  : '0 20px 40px rgba(0,0,0,0.4)',
                margin: '0 auto 40px auto',
                display: 'block',
              }}
            />
          )}

          <h2 style={{
            color: colors.primary,
            fontSize: '52px',
            fontWeight: textStyle.isBold ? 800 : 700,
            marginBottom: '8px',
            textShadow: colors.titleShadow,
          }}>
            {data.movieTitle}
          </h2>
          <p style={{ color: accentColor, textShadow: accentShadow, fontSize: '44px', fontWeight: 300, marginBottom: '16px' }}>
             {data.year}
           </p>

          {data.director && (
             <p style={{ color: '#888888', fontSize: '34px', fontWeight: 300, marginBottom: '24px' }}>
               Directed by {data.director}
             </p>
           )}

          <p style={{
            color: colors.primary,
            fontSize: `${reviewFontSize}px`,
            fontWeight: fontWeight,
            fontStyle: fontStyleCss,
            lineHeight: 1.6,
            margin: '0 auto 24px auto',
            maxWidth: '720px',
            textShadow: textStyle.colorTheme === 'neon' ? '0 0 10px rgba(79,209,197,0.18)' : 'none',
          }}>
            "{data.reviewText}"
          </p>

          <div style={{ marginBottom: '32px' }}>
            <StarRating rating={data.ratingNumber} size={56} color={accentColor} shadow={accentShadow} />
          </div>

          <p style={{ color: '#666666', fontSize: '34px' }}>
            Review by <span style={{ color: accentColor, textShadow: accentShadow }}>{data.username}</span>
          </p>
        </div>
      </div>
    </div>
  );
}