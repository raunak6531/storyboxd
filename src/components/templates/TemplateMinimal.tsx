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

export function TemplateMinimal({
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
    const fontWeight = textStyle.isBold ? 700 : 400;
    const fontStyleCss = textStyle.isItalic ? 'italic' : 'normal';

    const cssFilter = processedBackdropUrl
        ? 'none'
        : `blur(${backdropBlur}px) brightness(${backdropBrightness}%) saturate(${backdropSaturation}%)`;

    return (
        <div style={{
            position: 'relative',
            width: '1080px',
            height: '1920px',
            backgroundColor: '#0a0a0a',
            overflow: 'hidden',
            fontFamily: font,
        }}>
            {/* Backdrop - user controls blur/brightness */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: getBackgroundImage(data, customBackdropUrl, processedBackdropUrl),
                backgroundSize: 'cover',
                backgroundPosition: `${backdropPositionPercent}% center`,
                filter: cssFilter,
                transform: 'scale(1.05)',
            }} />

            {/* Dark overlay for text readability */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
            }} />

            {/* Content */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '80px',
                textAlign: 'center',
            }}>
                {/* Accent line */}
                <div style={{
                    width: '60px',
                    height: '4px',
                    backgroundColor: accentColor,
                    marginBottom: '40px',
                    borderRadius: '2px',
                }} />

                {/* Poster (optional) */}
                {showPoster && data.posterUrl && (
                    <img
                        src={proxyUrl(data.posterUrl)}
                        alt=""
                        style={{
                            width: '200px',
                            height: '300px',
                            objectFit: 'cover',
                            borderRadius: '16px',
                            marginBottom: '32px',
                            boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
                            border: '1px solid rgba(255,255,255,0.1)',
                        }}
                    />
                )}

                {/* Movie title */}
                <h2 style={{
                    color: '#ffffff',
                    fontSize: '48px',
                    fontWeight: 600,
                    marginBottom: '8px',
                    letterSpacing: '1px',
                }}>
                    {data.movieTitle}
                </h2>

                {/* Director & Year */}
                <p style={{ color: '#888888', fontSize: '30px', marginBottom: '24px' }}>
                    {data.director ? `${data.director} • ` : ''}{data.year}
                </p>

                {/* Rating */}
                <div style={{ marginBottom: '32px' }}>
                    <StarRating rating={data.ratingNumber} size={48} color={accentColor} />
                </div>

                {/* Review text */}
                <p style={{
                    color: '#ffffff',
                    fontSize: `${reviewFontSize}px`,
                    fontWeight: fontWeight,
                    fontStyle: fontStyleCss,
                    letterSpacing: `${textStyle.letterSpacing}px`,
                    lineHeight: textStyle.lineHeight,
                    maxWidth: '900px',
                    marginBottom: '40px',
                }}>
                    "{data.reviewText}"
                </p>

                {/* Username */}
                <p style={{ color: '#666666', fontSize: '28px' }}>
                    Review by <span style={{ color: accentColor }}>@{data.username}</span>
                </p>
            </div>
        </div>
    );
}
