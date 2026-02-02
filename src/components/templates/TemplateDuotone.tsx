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

export function TemplateDuotone({
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
    const reviewFontSize = Math.round(46 * scale);
    const font = FONTS[textStyle.fontType];
    const fontWeight = textStyle.isBold ? 700 : 400;
    const fontStyleCss = textStyle.isItalic ? 'italic' : 'normal';

    return (
        <div style={{
            width: '1080px',
            height: '1920px',
            position: 'relative',
            fontFamily: font,
            overflow: 'hidden',
            background: '#0a0a0a',
        }}>
            {/* Backdrop with duotone effect */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: getBackgroundImage(data, customBackdropUrl, processedBackdropUrl),
                backgroundSize: 'cover',
                backgroundPosition: `${backdropPositionPercent}% center`,
                filter: processedBackdropUrl ? 'grayscale(100%)' : `blur(${backdropBlur}px) brightness(${backdropBrightness}%) saturate(${backdropSaturation}%) grayscale(100%)`,
                opacity: 0.6,
            }} />

            {/* Duotone color overlay */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: `linear-gradient(180deg, ${hexToRgba(accentColor, 0.15)} 0%, ${hexToRgba(accentColor, 0.05)} 100%)`,
                mixBlendMode: 'multiply',
            }} />

            {/* Dark overlay for contrast */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.95) 100%)',
            }} />

            {/* Content */}
            <div style={{
                position: 'absolute',
                top: '120px', left: '64px', right: '64px', bottom: '120px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
            }}>
                {/* Middle - Poster (if enabled) */}
                {showPoster && data.posterUrl && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1,
                        marginBottom: '40px',
                    }}>
                        <img
                            src={proxyUrl(data.posterUrl)}
                            alt=""
                            style={{
                                width: '280px',
                                height: '420px',
                                objectFit: 'cover',
                                borderRadius: '16px',
                                boxShadow: `0 30px 80px rgba(0,0,0,0.6)`,
                            }}
                        />
                    </div>
                )}

                {/* Bottom - Title, Director, Review */}
                <div>
                    <h1 style={{
                        color: '#ffffff',
                        fontSize: '80px',
                        fontWeight: 900,
                        lineHeight: 0.95,
                        marginBottom: '16px',
                        textShadow: `0 4px 20px ${hexToRgba(accentColor, 0.3)}`,
                    }}>
                        {data.movieTitle}
                    </h1>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        marginBottom: '32px',
                    }}>
                        <span style={{
                            color: accentColor,
                            fontSize: '32px',
                            fontWeight: 600,
                        }}>
                            {data.year}
                        </span>
                        {data.director && (
                            <>
                                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '24px' }}>•</span>
                                <span style={{
                                    color: 'rgba(255,255,255,0.7)',
                                    fontSize: '28px',
                                    fontWeight: 400,
                                }}>
                                    {data.director}
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {/* Review text */}
                <div style={{
                    borderTop: `3px solid ${hexToRgba(accentColor, 0.3)}`,
                    paddingTop: '32px',
                    marginBottom: '32px',
                }}>
                    <p style={{
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: `${reviewFontSize}px`,
                        fontWeight: fontWeight,
                        fontStyle: fontStyleCss,
                        letterSpacing: `${textStyle.letterSpacing}px`,
                        lineHeight: textStyle.lineHeight,
                        marginBottom: '32px',
                    }}>
                        "{data.reviewText}"
                    </p>
                </div>

                {/* Rating and Username */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px',
                }}>
                    <StarRating rating={data.ratingNumber} size={52} color={accentColor} />
                    <span style={{
                        color: 'rgba(255,255,255,0.5)',
                        fontSize: '28px',
                        fontWeight: 300,
                    }}>
                        @{data.username}
                    </span>
                </div>
            </div>
        </div>
    );
}
