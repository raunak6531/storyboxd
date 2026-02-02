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

export function TemplateTopLeft({
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
    const reviewFontSize = Math.round(48 * scale);

    const font = FONTS[textStyle.fontType] || textStyle.fontType;

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

    // If we have a processed URL, filters are already applied - don't use CSS filters
    const cssFilter = processedBackdropUrl
        ? 'none'
        : `blur(${backdropBlur}px) brightness(${backdropBrightness}%) saturate(${backdropSaturation}%)`;

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
                backgroundImage: getBackgroundImage(data, customBackdropUrl, processedBackdropUrl),
                backgroundSize: 'cover',
                backgroundPosition: `${backdropPositionPercent}% center`,
                backgroundRepeat: 'no-repeat',
                filter: cssFilter,
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
                                width: '200px',
                                height: '300px',
                                objectFit: 'cover',
                                borderRadius: '16px',
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
                        letterSpacing: `${textStyle.letterSpacing}px`,
                        lineHeight: textStyle.lineHeight,
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
