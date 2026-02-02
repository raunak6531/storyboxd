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

export function TemplateBottom({
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
                    letterSpacing: `${textStyle.letterSpacing}px`,
                    lineHeight: textStyle.lineHeight,
                    marginBottom: '48px',
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
