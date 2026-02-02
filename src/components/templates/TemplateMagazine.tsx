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

export function TemplateMagazine({
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
            position: 'relative',
            width: '1080px',
            height: '1920px',
            backgroundColor: '#000000',
            overflow: 'hidden',
            fontFamily: font,
        }}>
            {/* Full bleed backdrop - full height */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: getBackgroundImage(data, customBackdropUrl, processedBackdropUrl),
                backgroundSize: 'cover',
                backgroundPosition: `${backdropPositionPercent}% center`,
                filter: cssFilter,
            }} />

            {/* Gradient overlay for text readability */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.6) 55%, rgba(0,0,0,0.9) 75%, rgba(0,0,0,0.95) 100%)',
            }} />

            {/* Magazine header bar */}
            <div style={{
                position: 'absolute',
                top: '48px',
                left: '48px',
                right: '48px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 10,
            }}>
                <div style={{
                    backgroundColor: accentColor,
                    color: '#000000',
                    padding: '12px 24px',
                    fontSize: '24px',
                    fontWeight: 800,
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                }}>
                    REVIEW
                </div>
                <div style={{
                    color: '#ffffff',
                    fontSize: '24px',
                    fontWeight: 600,
                    letterSpacing: '2px',
                }}>
                    {data.year}
                </div>
            </div>

            {/* Content - bottom section */}
            <div style={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                padding: '64px',
                paddingTop: '0',
                display: 'flex',
                flexDirection: 'row',
                gap: showPoster ? '40px' : '0',
                alignItems: 'flex-end',
            }}>
                <div style={{ flex: 1 }}>
                    {/* Title row with poster on right */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '32px',
                        alignItems: 'flex-start',
                        marginBottom: '8px',
                    }}>
                        {/* Title and director */}
                        <div style={{ flex: 1 }}>
                            <h1 style={{
                                color: '#ffffff',
                                fontSize: showPoster ? '72px' : '96px',
                                fontWeight: 900,
                                lineHeight: 1.0,
                                marginBottom: '20px',
                                textTransform: 'uppercase',
                                letterSpacing: '-2px',
                            }}>
                                {data.movieTitle}
                            </h1>

                            {data.director && (
                                <p style={{
                                    color: accentColor,
                                    fontSize: '30px',
                                    fontWeight: 600,
                                    marginBottom: '0',
                                    letterSpacing: '1px',
                                }}>
                                    Directed by {data.director}
                                </p>
                            )}
                        </div>

                        {/* Poster (optional) - on the right of title */}
                        {showPoster && data.posterUrl && (
                            <img
                                src={proxyUrl(data.posterUrl)}
                                alt=""
                                style={{
                                    width: '180px',
                                    height: '270px',
                                    objectFit: 'cover',
                                    borderRadius: '12px',
                                    boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    flexShrink: 0,
                                }}
                            />
                        )}
                    </div>

                    {/* Rating bar */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        marginBottom: '24px',
                        paddingBottom: '24px',
                        borderBottom: '2px solid #333333',
                    }}>
                        <StarRating rating={data.ratingNumber} size={44} color={accentColor} />
                        <span style={{ color: '#666666', fontSize: '26px' }}>|</span>
                        <span style={{ color: '#888888', fontSize: '26px' }}>@{data.username}</span>
                    </div>

                    {/* Review text */}
                    <p style={{
                        color: '#cccccc',
                        fontSize: `${reviewFontSize}px`,
                        fontWeight: fontWeight,
                        fontStyle: fontStyleCss,
                        letterSpacing: `${textStyle.letterSpacing}px`,
                        lineHeight: textStyle.lineHeight,
                        maxWidth: '100%',
                    }}>
                        "{data.reviewText}"
                    </p>
                </div>
            </div>
        </div>
    );
}
