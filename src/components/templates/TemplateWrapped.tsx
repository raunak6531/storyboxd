'use client';

import {
    TemplateProps,
    DEFAULT_STYLE,
    FONTS,
    getAutoScale,
    getBackgroundImage,
    proxyUrl,
} from './shared';

export function TemplateWrapped({
    data,
    showPoster,
    fontSizeMultiplier = 1,
    textStyle = DEFAULT_STYLE,
    backdropPositionPercent = 50,
    backdropPositionYPercent = 50,
    customBackdropUrl,
    processedBackdropUrl,
    backdropBlur = 0,
    backdropBrightness = 100,
    backdropSaturation = 100,
    accentColor = '#00e054',
}: TemplateProps) {
    const autoScale = getAutoScale(data.reviewText.length);
    const scale = fontSizeMultiplier * autoScale;

    // Smarter title sizing: aggressively scale down for longer titles
    const titleLen = data.movieTitle.length;
    let titleFontSize: number;
    if (titleLen <= 8) titleFontSize = 160;
    else if (titleLen <= 14) titleFontSize = 120;
    else if (titleLen <= 20) titleFontSize = 100;
    else if (titleLen <= 30) titleFontSize = 80;
    else titleFontSize = 64;
    titleFontSize = Math.round(titleFontSize * fontSizeMultiplier);

    const reviewFontSize = Math.round(36 * scale);

    const font = FONTS[textStyle.fontType] || textStyle.fontType;
    const fontWeight = textStyle.isBold ? 800 : 700;
    const fontStyleCss = textStyle.isItalic ? 'italic' : 'normal';

    const dominantColor = accentColor;

    // Rating ring math (circumference of r=80 circle = 2*PI*80 ≈ 503)
    const maxScore = 5;
    const currentScore = data.ratingNumber;
    const circumference = 503;
    const dashOffset = circumference - (circumference * (currentScore / maxScore));

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
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* ===== BACKGROUND LAYERS ===== */}
            {/* Backdrop image */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: getBackgroundImage(data, customBackdropUrl, processedBackdropUrl),
                backgroundSize: 'cover',
                backgroundPosition: `${backdropPositionPercent}% ${backdropPositionYPercent}%`,
                filter: cssFilter,
                opacity: 0.7,
            }} />

            {/* Colored gradient overlay */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: `linear-gradient(160deg, ${dominantColor}88 0%, transparent 50%, #0a0a0a 100%)`,
            }} />

            {/* Bottom darkening gradient */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.85) 70%, rgba(0,0,0,0.98) 100%)',
            }} />

            {/* ===== CONTENT LAYER ===== */}
            <div style={{
                position: 'relative',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                padding: '70px 70px 60px 70px',
            }}>

                {/* --- TOP BAR: Year/Director + Username --- */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexShrink: 0,
                }}>
                    {/* Left: Year + Director */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{
                            color: dominantColor,
                            fontSize: '34px',
                            fontWeight: 900,
                            letterSpacing: '8px',
                            textTransform: 'uppercase',
                            textShadow: '0 2px 12px rgba(0,0,0,0.5)',
                        }}>
                            {data.year}
                        </span>
                        {data.director && (
                            <span style={{
                                color: 'rgba(255,255,255,0.85)',
                                fontSize: '28px',
                                fontWeight: 600,
                            }}>
                                Dir. {data.director}
                            </span>
                        )}
                    </div>

                    {/* Right: Username pill */}
                    <div style={{
                        padding: '14px 30px',
                        border: `3px solid ${dominantColor}`,
                        borderRadius: '100px',
                        backgroundColor: 'rgba(0,0,0,0.25)',
                        backdropFilter: 'blur(12px)',
                        whiteSpace: 'nowrap',
                    }}>
                        <span style={{
                            color: '#ffffff',
                            fontSize: '26px',
                            fontWeight: 700,
                            letterSpacing: '1px',
                        }}>
                            @{data.username}
                        </span>
                    </div>
                </div>

                {/* --- MIDDLE: Poster (optional) + Title --- */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: '40px',
                    minHeight: 0,
                }}>
                    {/* Poster */}
                    {showPoster && data.posterUrl && (
                        <div style={{
                            width: '260px',
                            height: '390px',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                            border: '2px solid rgba(255,255,255,0.1)',
                            flexShrink: 0,
                        }}>
                            <img
                                src={proxyUrl(data.posterUrl)}
                                alt="poster"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                    )}

                    {/* MASSIVE Title */}
                    <h1 style={{
                        color: '#ffffff',
                        fontSize: `${titleFontSize}px`,
                        fontWeight: 900,
                        lineHeight: 0.95,
                        letterSpacing: '-2px',
                        margin: 0,
                        textTransform: 'uppercase',
                        textShadow: '0 8px 40px rgba(0,0,0,0.5)',
                        maxHeight: showPoster && data.posterUrl ? '300px' : '500px',
                        overflow: 'hidden',
                    }}>
                        {data.movieTitle}
                    </h1>
                </div>

                {/* --- BOTTOM: Review Text + Score Ring --- */}
                <div style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: '40px',
                    flexShrink: 0,
                }}>
                    {/* Review text */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Decorative quote mark */}
                        <div style={{
                            color: dominantColor,
                            fontSize: '80px',
                            fontWeight: 900,
                            lineHeight: 0.6,
                            marginBottom: '24px',
                            opacity: 0.9,
                        }}>
                            ❝
                        </div>
                        <p style={{
                            color: '#ffffff',
                            fontSize: `${reviewFontSize}px`,
                            fontWeight: fontWeight,
                            fontStyle: fontStyleCss,
                            letterSpacing: `${textStyle.letterSpacing}px`,
                            lineHeight: Math.max(1.3, textStyle.lineHeight),
                            textAlign: 'left',
                            margin: 0,
                            textShadow: '0 2px 12px rgba(0,0,0,0.4)',
                            maxHeight: '400px',
                            overflow: 'hidden',
                        }}>
                            {data.reviewText}
                        </p>
                    </div>

                    {/* Score Ring */}
                    <div style={{
                        width: '200px',
                        height: '200px',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        borderRadius: '50%',
                    }}>
                        {/* Background ring */}
                        <svg width="200" height="200" style={{ position: 'absolute', top: 0, left: 0 }}>
                            <circle cx="100" cy="100" r="80" stroke="rgba(255,255,255,0.12)" strokeWidth="10" fill="none" />
                        </svg>
                        {/* Progress ring */}
                        <svg width="200" height="200" style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
                            <circle
                                cx="100" cy="100" r="80"
                                stroke={dominantColor}
                                strokeWidth="10"
                                fill="none"
                                strokeDasharray={circumference}
                                strokeDashoffset={dashOffset}
                                strokeLinecap="round"
                            />
                        </svg>
                        {/* Score text */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            zIndex: 2,
                        }}>
                            <span style={{
                                color: '#ffffff',
                                fontSize: '56px',
                                fontWeight: 900,
                                lineHeight: 1,
                                letterSpacing: '-2px',
                            }}>
                                {currentScore.toFixed(1)}
                            </span>
                            <span style={{
                                color: dominantColor,
                                fontSize: '14px',
                                fontWeight: 800,
                                letterSpacing: '3px',
                                textTransform: 'uppercase',
                                marginTop: '4px',
                            }}>
                                SCORE
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
