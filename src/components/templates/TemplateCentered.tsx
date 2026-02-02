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

export function TemplateCentered({
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
                        letterSpacing: `${textStyle.letterSpacing}px`,
                        lineHeight: textStyle.lineHeight,
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
