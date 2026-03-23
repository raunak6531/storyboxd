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

export function TemplateNewspaper({
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
    const reviewFontSize = Math.round(40 * scale);

    const font = FONTS[textStyle.fontType] || textStyle.fontType;
    const fontWeight = textStyle.isBold ? 700 : 400;
    const fontStyleCss = textStyle.isItalic ? 'italic' : 'normal';

    return (
        <div style={{
            position: 'relative',
            width: '1080px',
            height: '1920px',
            backgroundColor: '#f5f0e8',
            overflow: 'hidden',
            fontFamily: font,
        }}>
            {/* Newspaper texture overlay */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.015) 3px, rgba(0,0,0,0.015) 4px)',
                zIndex: 1,
                pointerEvents: 'none',
            }} />

            {/* Header masthead */}
            <div style={{
                padding: '48px 64px 24px',
                borderBottom: '4px double #222',
                textAlign: 'center',
                position: 'relative',
                zIndex: 2,
            }}>
                <div style={{
                    fontSize: '20px',
                    fontWeight: 400,
                    color: '#666',
                    letterSpacing: '6px',
                    textTransform: 'uppercase',
                    marginBottom: '8px',
                }}>THE</div>
                <div style={{
                    fontSize: '72px',
                    fontWeight: 900,
                    color: '#111',
                    letterSpacing: '4px',
                    textTransform: 'uppercase',
                    lineHeight: 0.9,
                }}>FILM REVIEW</div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '16px',
                    fontSize: '18px',
                    color: '#888',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                }}>
                    <span>{data.year || 'CINEMA'}</span>
                    <span>@{data.username}</span>
                </div>
            </div>

            {/* Headline */}
            <div style={{
                padding: '40px 64px 24px',
                borderBottom: '2px solid #ddd',
                position: 'relative',
                zIndex: 2,
            }}>
                <div style={{ maxWidth: '700px' }}>
                    <h1 style={{
                        color: '#111',
                        fontSize: '88px',
                        fontWeight: 900,
                        lineHeight: 0.95,
                        marginBottom: '20px',
                        textTransform: 'uppercase',
                        letterSpacing: '-1px',
                    }}>
                        {data.movieTitle}
                    </h1>
                    {data.director && (
                        <p style={{
                            color: '#555',
                            fontSize: '28px',
                            fontWeight: 500,
                            fontStyle: 'italic',
                        }}>
                            Directed by {data.director}
                        </p>
                    )}
                </div>

                {/* Verdict Box */}
                <div style={{
                    position: 'absolute',
                    top: '40px',
                    right: '64px',
                    backgroundColor: '#f5f0e8',
                    border: '3px solid #222',
                    padding: '14px 24px',
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    boxShadow: '8px 8px 0px rgba(0,0,0,0.15)',
                    transform: 'rotate(-1.5deg)',
                }}>
                    <span style={{
                        fontSize: '18px',
                        fontWeight: 900,
                        letterSpacing: '3px',
                        color: '#111',
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                        borderBottom: '1px solid #222',
                        width: '100%',
                        textAlign: 'center',
                        paddingBottom: '2px'
                    }}>Verdict</span>
                    <div style={{ marginTop: '0px', transform: 'translateY(-4px)' }}>
                        <StarRating rating={data.ratingNumber} size={40} color="#111" shadow="none" />
                    </div>
                </div>
            </div>

            {/* Image + body section */}
            <div style={{
                padding: '32px 64px',
                display: 'flex',
                flexDirection: 'column',
                gap: '32px',
                position: 'relative',
                zIndex: 2,
            }}>
                {/* Image Section */}
                <div style={{ position: 'relative' }}>
                    {/* Poster or backdrop image */}
                    {showPoster && data.posterUrl ? (
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <img
                                src={proxyUrl(data.posterUrl)}
                                alt=""
                                style={{
                                    width: '400px',
                                    height: '600px',
                                    objectFit: 'cover',
                                    border: '1px solid #ccc',
                                    filter: 'grayscale(60%) contrast(1.1)',
                                }}
                            />
                        </div>
                    ) : (
                        <div style={{
                            width: '100%',
                            height: '450px',
                            backgroundImage: getBackgroundImage(data, customBackdropUrl, processedBackdropUrl),
                            backgroundSize: 'cover',
                            backgroundPosition: `${backdropPositionPercent}% ${backdropPositionYPercent}%`,
                            filter: processedBackdropUrl ? 'grayscale(60%) contrast(1.1)' : `blur(${backdropBlur}px) brightness(${backdropBrightness}%) saturate(${backdropSaturation}%) grayscale(60%) contrast(1.1)`,
                            border: '1px solid #ccc',
                        }} />
                    )}
                </div>

                {/* Review body - newspaper column style */}
                <p style={{
                    color: '#222',
                    fontSize: `${reviewFontSize}px`,
                    fontWeight: fontWeight,
                    fontStyle: fontStyleCss,
                    letterSpacing: `${textStyle.letterSpacing}px`,
                    lineHeight: textStyle.lineHeight,
                    textAlign: textStyle.textAlign === 'center' ? 'justify' : textStyle.textAlign,
                    columnCount: data.reviewText.length > 300 ? 2 : 1,
                    columnGap: '40px',
                    columnRule: '1px solid #ddd',
                }}>
                    {getQuoteWrapped(data.reviewText, textStyle.quoteStyle)}
                </p>
            </div>

            {/* Footer */}
            <div style={{
                position: 'absolute',
                bottom: '48px',
                left: '64px',
                right: '64px',
                borderTop: '2px solid #ccc',
                paddingTop: '16px',
                display: 'flex',
                justifyContent: 'center',
                zIndex: 2,
            }}>
                <span style={{
                    color: '#999',
                    fontSize: '20px',
                    letterSpacing: '4px',
                    textTransform: 'uppercase',
                }}>— Film Critique —</span>
            </div>
        </div>
    );
}

