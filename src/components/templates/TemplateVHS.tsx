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
    StarRating,
    getQuoteWrapped
} from './shared';

export function TemplateVHS({
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
    accentColor = '#00e054',
}: TemplateProps) {
    const autoScale = getAutoScale(data.reviewText.length);
    const scale = fontSizeMultiplier * autoScale;
    const reviewFontSize = Math.round(40 * scale);

    const font = FONTS[textStyle.fontType] || textStyle.fontType;
    const fontWeight = textStyle.isBold ? 700 : 400;
    const fontStyleCss = textStyle.isItalic ? 'italic' : 'normal';

    const cssFilter = processedBackdropUrl
        ? 'saturate(130%) contrast(110%)'
        : `blur(${backdropBlur}px) brightness(${backdropBrightness}%) saturate(${Math.max(backdropSaturation, 130)}%) contrast(110%)`;

    return (
        <div style={{
            position: 'relative',
            width: '1080px',
            height: '1920px',
            backgroundColor: '#0a0a0a',
            overflow: 'hidden',
            fontFamily: '"Courier New", Courier, monospace',
        }}>
            {/* Backdrop */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: getBackgroundImage(data, customBackdropUrl, processedBackdropUrl),
                backgroundSize: 'cover',
                backgroundPosition: `${backdropPositionPercent}% center`,
                filter: cssFilter,
                transform: 'scale(1.05)',
            }} />

            {/* VHS scanline overlay */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
                zIndex: 2,
                pointerEvents: 'none',
            }} />

            {/* VHS chromatic aberration tint */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(180deg, rgba(255,0,100,0.03) 0%, rgba(0,100,255,0.03) 50%, rgba(0,255,100,0.03) 100%)',
                zIndex: 2,
                pointerEvents: 'none',
            }} />

            {/* Dark vignette */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
                zIndex: 2,
                pointerEvents: 'none',
            }} />

            {/* Bottom gradient for text */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 35%, transparent 60%)',
                zIndex: 3,
            }} />

            {/* VHS top-left REC indicator */}
            <div style={{
                position: 'absolute',
                top: '56px',
                left: '56px',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
            }}>
                <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: '#ff0033',
                    boxShadow: '0 0 8px rgba(255,0,51,0.6)',
                }} />
                <span style={{
                    color: '#ffffff',
                    fontSize: '28px',
                    fontWeight: 700,
                    fontFamily: '"Courier New", monospace',
                    textShadow: '2px 2px 0 rgba(0,0,0,0.8)',
                    letterSpacing: '4px',
                }}>REC</span>
            </div>

            {/* VHS top-right timestamp */}
            <div style={{
                position: 'absolute',
                top: '56px',
                right: '56px',
                zIndex: 10,
            }}>
                <span style={{
                    color: '#ffffff',
                    fontSize: '24px',
                    fontFamily: '"Courier New", monospace',
                    textShadow: '2px 2px 0 rgba(0,0,0,0.8)',
                    letterSpacing: '2px',
                    opacity: 0.8,
                }}>
                    {data.year || '2024'} // 00:00
                </span>
            </div>

            {/* Content - bottom section */}
            <div style={{
                position: 'absolute',
                bottom: '64px', left: '64px', right: '64px',
                zIndex: 5,
            }}>
                {/* Poster inline */}
                {showPoster && data.posterUrl && (
                    <div style={{ marginBottom: '32px' }}>
                        <img
                            src={proxyUrl(data.posterUrl)}
                            alt=""
                            style={{
                                width: '180px',
                                height: '270px',
                                objectFit: 'cover',
                                borderRadius: '4px',
                                border: '2px solid rgba(255,255,255,0.2)',
                                boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
                            }}
                        />
                    </div>
                )}

                {/* Title */}
                <h1 style={{
                    color: '#ffffff',
                    fontSize: '76px',
                    fontWeight: 900,
                    lineHeight: 0.95,
                    marginBottom: '24px',
                    fontFamily: font,
                    textShadow: '3px 3px 0 rgba(0,0,0,0.8), -1px -1px 0 rgba(255,0,100,0.2), 1px 1px 0 rgba(0,100,255,0.2)',
                    textTransform: 'uppercase',
                }}>
                    {data.movieTitle}
                </h1>

                {/* Director */}
                {data.director && (
                    <p style={{
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: '26px',
                        marginBottom: '24px',
                        fontFamily: '"Courier New", monospace',
                        textShadow: '2px 2px 0 rgba(0,0,0,0.8)',
                    }}>
                        DIR: {data.director.toUpperCase()}
                    </p>
                )}

                {/* Rating + username */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    marginBottom: '28px',
                }}>
                    <StarRating rating={data.ratingNumber} size={42} color={accentColor} shadow="2px 2px 0 rgba(0,0,0,0.8)" />
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '24px' }}>|</span>
                    <span style={{
                        color: 'rgba(255,255,255,0.5)',
                        fontSize: '24px',
                        fontFamily: '"Courier New", monospace',
                        textShadow: '2px 2px 0 rgba(0,0,0,0.8)',
                    }}>
                        @{data.username}
                    </span>
                </div>

                {/* Review text */}
                <p style={{
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: `${reviewFontSize}px`,
                    fontWeight: fontWeight,
                    fontStyle: fontStyleCss,
                    fontFamily: font,
                    letterSpacing: `${textStyle.letterSpacing}px`,
                    lineHeight: textStyle.lineHeight,
                    textAlign: textStyle.textAlign,
                    textShadow: '1px 1px 0 rgba(0,0,0,0.6)',
                }}>
                    {getQuoteWrapped(data.reviewText, textStyle.quoteStyle)}
                </p>
            </div>

            {/* VHS bottom bar - PLAY indicator */}
            <div style={{
                position: 'absolute',
                bottom: '16px',
                left: '56px',
                zIndex: 10,
            }}>
                <span style={{
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: '18px',
                    fontFamily: '"Courier New", monospace',
                    letterSpacing: '3px',
                }}>▶ PLAY  SP</span>
            </div>
        </div>
    );
}

