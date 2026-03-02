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

export function TemplateNeon({
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
    const reviewFontSize = Math.round(42 * scale);

    const font = FONTS[textStyle.fontType] || textStyle.fontType;
    const fontWeight = textStyle.isBold ? 700 : 400;
    const fontStyleCss = textStyle.isItalic ? 'italic' : 'normal';

    const cssFilter = processedBackdropUrl
        ? 'none'
        : `blur(${backdropBlur + 4}px) brightness(${Math.min(backdropBrightness, 40)}%) saturate(${backdropSaturation}%)`;

    const neonGlow = `0 0 10px ${accentColor}, 0 0 40px ${hexToRgba(accentColor, 0.5)}, 0 0 80px ${hexToRgba(accentColor, 0.2)}`;
    const neonGlowSmall = `0 0 8px ${hexToRgba(accentColor, 0.6)}, 0 0 30px ${hexToRgba(accentColor, 0.2)}`;

    return (
        <div style={{
            position: 'relative',
            width: '1080px',
            height: '1920px',
            backgroundColor: '#050510',
            overflow: 'hidden',
            fontFamily: font,
        }}>
            {/* Backdrop - very dark and blurry */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: getBackgroundImage(data, customBackdropUrl, processedBackdropUrl),
                backgroundSize: 'cover',
                backgroundPosition: `${backdropPositionPercent}% center`,
                filter: cssFilter,
                transform: 'scale(1.1)',
                opacity: 0.5,
            }} />

            {/* Dark overlay */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'radial-gradient(ellipse at center, rgba(5,5,16,0.3) 0%, rgba(5,5,16,0.8) 100%)',
            }} />

            {/* Neon border frame */}
            <div style={{
                position: 'absolute',
                top: '48px', left: '48px', right: '48px', bottom: '48px',
                border: `2px solid ${hexToRgba(accentColor, 0.6)}`,
                borderRadius: '24px',
                boxShadow: `inset 0 0 30px ${hexToRgba(accentColor, 0.05)}, ${neonGlowSmall}`,
                zIndex: 2,
            }} />

            {/* Content */}
            <div style={{
                position: 'absolute',
                top: '100px', left: '80px', right: '80px', bottom: '100px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                zIndex: 3,
            }}>
                {/* Title with neon glow */}
                <h1 style={{
                    color: '#ffffff',
                    fontSize: '90px',
                    fontWeight: 900,
                    lineHeight: 0.95,
                    marginBottom: '28px',
                    textShadow: neonGlow,
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                }}>
                    {data.movieTitle}
                </h1>

                {/* Year + Director */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    marginBottom: '48px',
                }}>
                    <span style={{
                        color: accentColor,
                        fontSize: '28px',
                        fontWeight: 600,
                        textShadow: neonGlowSmall,
                    }}>
                        {data.year}
                    </span>
                    {data.director && (
                        <>
                            <span style={{ color: hexToRgba(accentColor, 0.4), fontSize: '24px' }}>◆</span>
                            <span style={{
                                color: 'rgba(255,255,255,0.6)',
                                fontSize: '26px',
                            }}>
                                {data.director}
                            </span>
                        </>
                    )}
                </div>

                {/* Poster */}
                {showPoster && data.posterUrl && (
                    <div style={{ marginBottom: '48px' }}>
                        <img
                            src={proxyUrl(data.posterUrl)}
                            alt=""
                            style={{
                                width: '240px',
                                height: '360px',
                                objectFit: 'cover',
                                borderRadius: '16px',
                                boxShadow: `0 0 30px ${hexToRgba(accentColor, 0.3)}, 0 20px 60px rgba(0,0,0,0.6)`,
                                border: `1px solid ${hexToRgba(accentColor, 0.3)}`,
                            }}
                        />
                    </div>
                )}

                {/* Stars */}
                <div style={{ marginBottom: '40px' }}>
                    <StarRating rating={data.ratingNumber} size={52} color={accentColor} shadow={neonGlowSmall} />
                </div>

                {/* Neon divider line */}
                <div style={{
                    width: '200px',
                    height: '2px',
                    background: accentColor,
                    boxShadow: neonGlowSmall,
                    marginBottom: '40px',
                    opacity: 0.8,
                }} />

                {/* Review text */}
                <p style={{
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: `${reviewFontSize}px`,
                    fontWeight: fontWeight,
                    fontStyle: fontStyleCss,
                    letterSpacing: `${textStyle.letterSpacing}px`,
                    lineHeight: textStyle.lineHeight,
                    textAlign: textStyle.textAlign,
                    maxWidth: '900px',
                }}>
                    {getQuoteWrapped(data.reviewText, textStyle.quoteStyle)}
                </p>

                {/* Username */}
                <div style={{
                    marginTop: '40px',
                    color: hexToRgba(accentColor, 0.6),
                    fontSize: '24px',
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                }}>
                    @{data.username}
                </div>
            </div>
        </div>
    );
}

