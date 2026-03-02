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

export function TemplateLetterboxd({
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
        : `blur(${backdropBlur}px) brightness(${backdropBrightness}%) saturate(${backdropSaturation}%)`;

    const lbGreen = '#00e054';
    const lbDark = '#14181c';
    const lbMid = '#1c2228';
    const lbBorder = '#2c3440';

    return (
        <div style={{
            position: 'relative',
            width: '1080px',
            height: '1920px',
            backgroundColor: lbDark,
            overflow: 'hidden',
            fontFamily: font,
        }}>
            {/* Backdrop - top portion */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: '720px',
                backgroundImage: getBackgroundImage(data, customBackdropUrl, processedBackdropUrl),
                backgroundSize: 'cover',
                backgroundPosition: `${backdropPositionPercent}% center`,
                filter: cssFilter,
            }} />

            {/* Gradient fade from backdrop to dark */}
            <div style={{
                position: 'absolute',
                top: '480px', left: 0, right: 0,
                height: '280px',
                background: `linear-gradient(to bottom, transparent 0%, ${lbDark} 100%)`,
            }} />

            {/* Letterboxd-style nav bar at top */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: '72px',
                background: 'rgba(20,24,28,0.85)',
                borderBottom: `1px solid ${lbBorder}`,
                display: 'flex',
                alignItems: 'center',
                padding: '0 48px',
                zIndex: 10,
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                }}>
                    <div style={{
                        display: 'flex',
                        gap: '4px',
                    }}>
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#ff8000' }} />
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: lbGreen }} />
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#40bcf4' }} />
                    </div>
                    <span style={{
                        color: '#fff',
                        fontSize: '26px',
                        fontWeight: 700,
                        letterSpacing: '1px',
                    }}>Letterboxd</span>
                </div>
            </div>

            {/* Content card area */}
            <div style={{
                position: 'absolute',
                top: '580px', left: '48px', right: '48px', bottom: '48px',
                display: 'flex',
                flexDirection: 'row',
                gap: '40px',
                zIndex: 5,
            }}>
                {/* Poster column */}
                <div style={{ flexShrink: 0 }}>
                    <img
                        src={proxyUrl(data.posterUrl)}
                        alt=""
                        style={{
                            width: '260px',
                            height: '390px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: `1px solid ${lbBorder}`,
                            boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                        }}
                    />
                </div>

                {/* Info column */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    {/* Title + year */}
                    <h1 style={{
                        color: '#ffffff',
                        fontSize: '68px',
                        fontWeight: 700,
                        lineHeight: 1.0,
                        marginBottom: '8px',
                    }}>
                        {data.movieTitle}
                    </h1>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '24px',
                    }}>
                        <span style={{ color: '#9ab', fontSize: '28px' }}>{data.year}</span>
                        {data.director && (
                            <>
                                <span style={{ color: '#456', fontSize: '24px' }}>•</span>
                                <span style={{ color: '#9ab', fontSize: '26px' }}>
                                    Directed by <span style={{ color: '#fff' }}>{data.director}</span>
                                </span>
                            </>
                        )}
                    </div>

                    {/* Stars row */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        marginBottom: '32px',
                    }}>
                        <StarRating rating={data.ratingNumber} size={44} color={lbGreen} />
                        <span style={{
                            color: '#678',
                            fontSize: '24px',
                        }}>
                            Reviewed by <span style={{ color: lbGreen }}>@{data.username}</span>
                        </span>
                    </div>

                    {/* Divider */}
                    <div style={{
                        height: '1px',
                        backgroundColor: lbBorder,
                        marginBottom: '32px',
                    }} />

                    {/* Review text */}
                    <p style={{
                        color: '#9ab',
                        fontSize: `${reviewFontSize}px`,
                        fontWeight: fontWeight,
                        fontStyle: fontStyleCss,
                        letterSpacing: `${textStyle.letterSpacing}px`,
                        lineHeight: textStyle.lineHeight,
                        textAlign: textStyle.textAlign,
                    }}>
                        {getQuoteWrapped(data.reviewText, textStyle.quoteStyle)}
                    </p>
                </div>
            </div>

            {/* Bottom bar - Letterboxd style */}
            <div style={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                height: '56px',
                background: lbMid,
                borderTop: `1px solid ${lbBorder}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                zIndex: 10,
            }}>
                <span style={{
                    color: '#678',
                    fontSize: '20px',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                }}>letterboxd.com</span>
            </div>
        </div>
    );
}

