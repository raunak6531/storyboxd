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

export function TemplateGradient({
    data,
    fontSizeMultiplier = 1,
    textStyle = DEFAULT_STYLE,
    backdropPositionPercent = 50,
    backdropPositionYPercent = 50,
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
    const reviewFontSize = Math.round(48 * scale);
    const font = FONTS[textStyle.fontType] || textStyle.fontType;
    const fontWeight = textStyle.isBold ? 700 : 400;
    const fontStyleCss = textStyle.isItalic ? 'italic' : 'normal';

    // Create gradient from accent color
    const gradientStart = accentColor;
    const gradientEnd = '#1a1a2e';

    return (
        <div style={{
            width: '1080px',
            height: '1920px',
            position: 'relative',
            fontFamily: font,
            overflow: 'hidden',
        }}>
            {/* Full backdrop */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: getBackgroundImage(data, customBackdropUrl, processedBackdropUrl),
                backgroundSize: 'cover',
                backgroundPosition: `${backdropPositionPercent}% ${backdropPositionYPercent}%`,
                filter: processedBackdropUrl ? 'none' : `blur(${backdropBlur}px) brightness(${backdropBrightness}%) saturate(${backdropSaturation}%)`,
            }} />

            {/* Gradient overlay for text readability */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: `linear-gradient(135deg,
                    ${hexToRgba(accentColor, 0.5)} 0%,
                    rgba(0,0,0,0.4) 30%,
                    rgba(0,0,0,0.3) 50%,
                    rgba(0,0,0,0.7) 75%,
                    rgba(0,0,0,0.9) 100%)`,
            }} />

            {/* Accent color glow effects */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: `
                    radial-gradient(circle at 0% 0%, ${hexToRgba(accentColor, 0.25)} 0%, transparent 40%),
                    radial-gradient(circle at 100% 100%, ${hexToRgba(accentColor, 0.15)} 0%, transparent 40%)
                `,
            }} />

            {/* Content container */}
            <div style={{
                position: 'absolute',
                top: '80px', left: '64px', right: '64px', bottom: '80px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
            }}>
                {/* Top section - Title */}
                <div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '40px',
                    }}>
                        {showPoster && data.posterUrl && (
                            <img
                                src={proxyUrl(data.posterUrl)}
                                alt=""
                                style={{
                                    width: '200px',
                                    height: '300px',
                                    objectFit: 'cover',
                                    borderRadius: '20px',
                                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                }}
                            />
                        )}
                        <div style={{ flex: 1 }}>
                            <h1 style={{
                                color: '#ffffff',
                                fontSize: showPoster ? '72px' : '96px',
                                fontWeight: 800,
                                lineHeight: 1.0,
                                marginBottom: '24px',
                                textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                            }}>
                                {data.movieTitle}
                            </h1>
                            <p style={{
                                color: 'rgba(255,255,255,0.7)',
                                fontSize: '32px',
                                fontWeight: 400,
                                textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                            }}>
                                {data.year} {data.director && `• Directed by ${data.director}`}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Middle section - Review text */}
                <div style={{
                    padding: '0 32px',
                    textAlign: 'center',
                }}>
                    <div style={{
                        marginBottom: '40px',
                        display: 'flex',
                        justifyContent: 'center',
                    }}>
                        <StarRating rating={data.ratingNumber} size={56} color={accentColor} />
                    </div>
                    <p style={{
                        color: '#ffffff',
                        fontSize: `${reviewFontSize}px`,
                        fontWeight: fontWeight,
                        fontStyle: fontStyleCss,
                        letterSpacing: `${textStyle.letterSpacing}px`,
                        lineHeight: textStyle.lineHeight,
                        textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.6)',
                        textAlign: textStyle.textAlign,
                    }}>
                        {getQuoteWrapped(data.reviewText, textStyle.quoteStyle)}
                    </p>
                </div>

                {/* Bottom section - Username */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '16px',
                }}>
                    <div style={{
                        width: '48px',
                        height: '2px',
                        background: 'rgba(255,255,255,0.3)',
                    }} />
                    <p style={{
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: '28px',
                        fontWeight: 500,
                        letterSpacing: '2px',
                    }}>
                        @{data.username}
                    </p>
                    <div style={{
                        width: '48px',
                        height: '2px',
                        background: 'rgba(255,255,255,0.3)',
                    }} />
                </div>
            </div>
        </div>
    );
}
