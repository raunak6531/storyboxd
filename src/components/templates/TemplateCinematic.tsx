'use client';

import {
    TemplateProps,
    DEFAULT_STYLE,
    FONTS,
    COLORS,
    getAutoScale,
    getBackgroundImage,
    hexToRgba,
    proxyUrl,
    StarRating
} from './shared';

export function TemplateCinematic({
    data,
    fontSizeMultiplier = 1,
    textStyle = DEFAULT_STYLE,
    backdropPositionPercent = 50,
    showPoster = false,
    customBackdropUrl,
    processedBackdropUrl,
    backdropBlur = 0,
    backdropBrightness = 100,
    backdropSaturation = 100,
    accentColor = '#00e054'
}: TemplateProps) {
    const autoScale = getAutoScale(data.reviewText.length);
    const scale = fontSizeMultiplier * autoScale;
    const reviewFontSize = Math.round(42 * scale);
    const font = FONTS[textStyle.fontType] || textStyle.fontType;
    const fontWeight = textStyle.isBold ? 700 : 400;
    const fontStyleCss = textStyle.isItalic ? 'italic' : 'normal';

    const cssFilter = processedBackdropUrl
        ? 'none'
        : `blur(${backdropBlur}px) brightness(${backdropBrightness}%) saturate(${backdropSaturation}%)`;

    return (
        <div style={{
            width: '1080px',
            height: '1920px',
            position: 'relative',
            background: '#000000',
            fontFamily: font,
            overflow: 'hidden',
        }}>
            {/* Full backdrop */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: getBackgroundImage(data, customBackdropUrl, processedBackdropUrl),
                backgroundSize: 'cover',
                backgroundPosition: `${backdropPositionPercent}% center`,
                filter: cssFilter,
            }} />

            {/* Dramatic cinematic gradient - dark at top and bottom */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: `linear-gradient(to bottom,
          rgba(0,0,0,0.85) 0%,
          rgba(0,0,0,0.3) 20%,
          rgba(0,0,0,0.1) 40%,
          rgba(0,0,0,0.1) 55%,
          rgba(0,0,0,0.5) 70%,
          rgba(0,0,0,0.9) 85%,
          rgba(0,0,0,0.95) 100%)`,
                zIndex: 1,
            }} />

            {/* Vignette effect */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
                zIndex: 1,
            }} />

            {/* Top content - Title & Director */}
            <div style={{
                position: 'absolute',
                top: '64px', left: '64px', right: '64px',
                zIndex: 2,
            }}>
                <h1 style={{
                    color: '#ffffff',
                    fontSize: '80px',
                    fontWeight: 900,
                    lineHeight: 0.95,
                    textTransform: 'uppercase',
                    letterSpacing: '-1px',
                    textShadow: '0 4px 30px rgba(0,0,0,0.8)',
                    marginBottom: '16px',
                }}>
                    {data.movieTitle}
                </h1>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                }}>
                    <span style={{
                        color: accentColor,
                        fontSize: '32px',
                        fontWeight: 700,
                        textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                    }}>
                        {data.year}
                    </span>
                    {data.director && (
                        <>
                            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '28px' }}>•</span>
                            <span style={{
                                color: 'rgba(255,255,255,0.8)',
                                fontSize: '28px',
                                fontWeight: 500,
                                textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                            }}>
                                Directed by {data.director}
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Center - Poster (optional) */}
            {showPoster && data.posterUrl && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 2,
                }}>
                    <img
                        src={proxyUrl(data.posterUrl)}
                        alt=""
                        style={{
                            width: '320px',
                            height: '480px',
                            objectFit: 'cover',
                            borderRadius: '12px',
                            boxShadow: '0 40px 100px rgba(0,0,0,0.8)',
                            border: '3px solid rgba(255,255,255,0.15)',
                        }}
                    />
                </div>
            )}

            {/* Bottom content - Rating, Review, Username */}
            <div style={{
                position: 'absolute',
                bottom: '64px', left: '64px', right: '64px',
                zIndex: 2,
            }}>
                {/* Rating */}
                <div style={{
                    marginBottom: '24px',
                }}>
                    <StarRating rating={data.ratingNumber} size={52} color={accentColor} />
                </div>

                {/* Review text */}
                <p style={{
                    color: 'rgba(255,255,255,0.95)',
                    fontSize: `${reviewFontSize}px`,
                    fontWeight: fontWeight,
                    fontStyle: fontStyleCss,
                    letterSpacing: `${textStyle.letterSpacing}px`,
                    lineHeight: textStyle.lineHeight,
                    textShadow: '0 2px 20px rgba(0,0,0,0.8)',
                    marginBottom: '24px',
                }}>
                    "{data.reviewText}"
                </p>

                {/* Username */}
                <p style={{
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '26px',
                    fontWeight: 400,
                }}>
                    — @{data.username}
                </p>
            </div>
        </div>
    );
}
