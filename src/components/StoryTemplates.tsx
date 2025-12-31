'use client';

import { ReviewData } from '@/app/api/scrape/route';

interface TemplateProps {
  data: ReviewData;
}

// Helper to proxy image URLs to avoid CORS issues
function proxyUrl(url: string): string {
  if (!url) return '';
  return `/api/proxy-image?url=${encodeURIComponent(url)}`;
}

// Common font family for all templates
const fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

// Helper to render star rating with inline styles
function StarRating({ rating, size = 48 }: { rating: number; size?: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;

  return (
    <span style={{
      color: '#00e054',
      fontSize: `${size}px`,
      fontWeight: 'bold',
      letterSpacing: '2px',
      fontFamily,
    }}>
      {'★'.repeat(fullStars)}
      {hasHalf && '½'}
    </span>
  );
}

// Template 1: Info at bottom (like screenshot 1)
export function TemplateBottom({ data }: TemplateProps) {
  return (
    <div style={{
      position: 'relative',
      width: '1080px',
      height: '1920px',
      backgroundColor: '#000000',
      overflow: 'hidden',
      backgroundImage: data.backdropUrl ? `url(${proxyUrl(data.backdropUrl)})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      fontFamily,
    }}>

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.2) 70%, transparent 100%)',
      }} />

      {/* Content at bottom */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '80px 64px',
        textAlign: 'center',
      }}>
        {/* Review text */}
        <p style={{
          color: '#ffffff',
          fontSize: '52px',
          fontWeight: 400,
          marginBottom: '48px',
          lineHeight: 1.5,
          maxWidth: '950px',
          marginLeft: 'auto',
          marginRight: 'auto',
          textShadow: '0 2px 20px rgba(0,0,0,0.5)',
        }}>
          "{data.reviewText}"
        </p>

        {/* Rating */}
        <div style={{ marginBottom: '24px' }}>
          <StarRating rating={data.ratingNumber} size={56} />
        </div>

        {/* Movie title and year */}
        <h2 style={{
          color: '#ffffff',
          fontSize: '56px',
          fontWeight: 700,
          marginBottom: '8px',
          textShadow: '0 2px 10px rgba(0,0,0,0.5)',
        }}>
          {data.movieTitle}
        </h2>
        <p style={{ color: '#a0a0a0', fontSize: '40px', marginBottom: '40px', fontWeight: 300 }}>{data.year}</p>

        {/* Username */}
        <p style={{ color: '#666666', fontSize: '32px', fontWeight: 400 }}>
          Review by <span style={{ color: '#999999' }}>{data.username}</span>
        </p>
      </div>
    </div>
  );
}

// Template 2: Info card at top-left (like screenshot 2)
export function TemplateTopLeft({ data }: TemplateProps) {
  return (
    <div style={{
      position: 'relative',
      width: '1080px',
      height: '1920px',
      backgroundColor: '#000000',
      overflow: 'hidden',
      backgroundImage: data.backdropUrl ? `url(${proxyUrl(data.backdropUrl)})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      fontFamily,
    }}>
      {/* Gradient overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.7) 100%)',
      }} />

      {/* Top-left card */}
      <div style={{
        position: 'absolute',
        top: '100px',
        left: '64px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '32px',
      }}>
        {/* Poster thumbnail */}
        {data.posterUrl && (
          <img
            src={proxyUrl(data.posterUrl)}
            alt=""
            crossOrigin="anonymous"
            style={{
              width: '180px',
              height: '270px',
              objectFit: 'cover',
              borderRadius: '12px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            }}
          />
        )}

        <div style={{ textAlign: 'left', paddingTop: '8px' }}>
          {/* Title and year */}
          <h2 style={{
            color: '#ffffff',
            fontSize: '52px',
            fontWeight: 700,
            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            marginBottom: '8px',
          }}>
            {data.movieTitle}
          </h2>
          <p style={{ color: '#a0a0a0', fontSize: '36px', fontWeight: 300, marginBottom: '16px' }}>
            {data.year}
          </p>

          {/* Rating */}
          <div style={{ marginBottom: '16px' }}>
            <StarRating rating={data.ratingNumber} size={48} />
          </div>

          {/* Username */}
          <p style={{ color: '#888888', fontSize: '28px' }}>
            Review by <span style={{ color: '#cccccc' }}>{data.username}</span>
          </p>
        </div>
      </div>

      {/* Review text below the card */}
      <div style={{
        position: 'absolute',
        top: '480px',
        left: '64px',
        right: '64px',
      }}>
        <p style={{
          color: '#ffffff',
          fontSize: '48px',
          fontWeight: 400,
          lineHeight: 1.5,
          textShadow: '0 2px 20px rgba(0,0,0,0.5)',
        }}>
          "{data.reviewText}"
        </p>
      </div>
    </div>
  );
}

// Template 3: Centered floating card (like screenshot 3)
export function TemplateCentered({ data }: TemplateProps) {
  return (
    <div style={{
      position: 'relative',
      width: '1080px',
      height: '1920px',
      backgroundColor: '#000000',
      overflow: 'hidden',
      backgroundImage: data.backdropUrl ? `url(${proxyUrl(data.backdropUrl)})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      fontFamily,
    }}>
      {/* Overlay with blur effect simulation */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.55)',
      }} />

      {/* Centered card */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          backgroundColor: 'rgba(20,20,20,0.85)',
          borderRadius: '32px',
          padding: '64px',
          margin: '0 64px',
          textAlign: 'center',
          maxWidth: '920px',
          boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          {/* Poster thumbnail */}
          {data.posterUrl && (
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
                margin: '0 auto 40px auto',
                display: 'block',
              }}
            />
          )}

          {/* Title and year */}
          <h2 style={{
            color: '#ffffff',
            fontSize: '52px',
            fontWeight: 700,
            marginBottom: '8px',
          }}>
            {data.movieTitle}
          </h2>
          <p style={{ color: '#888888', fontSize: '36px', fontWeight: 300, marginBottom: '24px' }}>
            {data.year}
          </p>

          {/* Rating */}
          <div style={{ marginBottom: '40px' }}>
            <StarRating rating={data.ratingNumber} size={52} />
          </div>

          {/* Review text */}
          <p style={{
            color: '#ffffff',
            fontSize: '44px',
            fontWeight: 400,
            lineHeight: 1.5,
            marginBottom: '48px',
          }}>
            "{data.reviewText}"
          </p>

          {/* Username */}
          <p style={{ color: '#666666', fontSize: '32px' }}>
            Review by <span style={{ color: '#aaaaaa' }}>{data.username}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

