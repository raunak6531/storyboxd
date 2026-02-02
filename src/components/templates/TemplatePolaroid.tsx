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

export function TemplatePolaroid({
    data,
    fontSizeMultiplier = 1,
    textStyle = DEFAULT_STYLE,
    backdropPositionPercent = 50,
    customBackdropUrl,
    processedBackdropUrl,
    backdropBlur = 0,
    backdropBrightness = 100,
    backdropSaturation = 100,
    accentColor = '#00e054'
}: TemplateProps) {
    const autoScale = getAutoScale(data.reviewText.length);
    const scale = fontSizeMultiplier * autoScale;
    const reviewFontSize = Math.round(40 * scale);

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
            backgroundColor: '#0d0d0d',
            overflow: 'hidden',
            fontFamily: font,
        }}>
            {/* Backdrop */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: getBackgroundImage(data, customBackdropUrl, processedBackdropUrl),
                backgroundSize: 'cover',
                backgroundPosition: `${backdropPositionPercent}% center`,
                filter: cssFilter,
            }} />

            {/* Main content */}
            <div style={{
                position: 'relative',
                zIndex: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '80px 64px',
                gap: '64px',
            }}>
                {/* Left side - Poster */}
                <div style={{
                    flex: '0 0 auto',
                    position: 'relative',
                }}>
                    <img
                        src={proxyUrl(data.posterUrl || data.backdropUrl)}
                        alt=""
                        style={{
                            width: '420px',
                            height: '630px',
                            objectFit: 'cover',
                            borderRadius: '12px',
                            boxShadow: '0 30px 80px rgba(0,0,0,0.8)',
                            position: 'relative',
                        }}
                    />
                </div>

                {/* Right side - Content */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: '32px',
                }}>
                    {/* Title section */}
                    <div>
                        {/* Accent line */}
                        <div style={{
                            width: '80px',
                            height: '5px',
                            backgroundColor: accentColor,
                            marginBottom: '24px',
                            borderRadius: '3px',
                        }} />

                        <h1 style={{
                            color: '#ffffff',
                            fontSize: '72px',
                            fontWeight: 900,
                            lineHeight: 1,
                            marginBottom: '16px',
                            letterSpacing: '-1px',
                            textShadow: '0 4px 20px rgba(0,0,0,0.8)',
                        }}>
                            {data.movieTitle}
                        </h1>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            marginBottom: '8px',
                        }}>
                            <span style={{
                                color: accentColor,
                                fontSize: '32px',
                                fontWeight: 700,
                            }}>
                                {data.year}
                            </span>
                            {data.director && (
                                <>
                                    <span style={{ color: '#444444', fontSize: '32px' }}>•</span>
                                    <span style={{
                                        color: '#999999',
                                        fontSize: '28px',
                                    }}>
                                        {data.director}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Rating */}
                    <div style={{
                        padding: '24px 0',
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                    }}>
                        <StarRating rating={data.ratingNumber} size={56} color={accentColor} />
                    </div>

                    {/* Review */}
                    <p style={{
                        color: '#d0d0d0',
                        fontSize: `${reviewFontSize}px`,
                        fontWeight: fontWeight,
                        fontStyle: fontStyleCss,
                        letterSpacing: `${textStyle.letterSpacing}px`,
                        lineHeight: textStyle.lineHeight,
                        textShadow: '0 2px 12px rgba(0,0,0,0.8)',
                        marginBottom: '8px',
                    }}>
                        "{data.reviewText}"
                    </p>

                    {/* Username */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                    }}>
                        <div style={{
                            width: '40px',
                            height: '2px',
                            backgroundColor: accentColor,
                            opacity: 0.5,
                        }} />
                        <span style={{
                            color: '#888888',
                            fontSize: '26px',
                        }}>
                            @{data.username}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
