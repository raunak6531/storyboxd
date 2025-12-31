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

// Helper to render star rating with inline styles
function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;

  return (
    <span style={{ color: '#00e054', fontSize: '18px', fontWeight: 'bold', letterSpacing: '-0.5px' }}>
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
    }}>

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to top, #000000 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
      }} />

      {/* Content at bottom */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '48px',
        textAlign: 'center',
      }}>
        {/* Review text */}
        <p style={{
          color: '#ffffff',
          fontSize: '30px',
          fontWeight: 300,
          marginBottom: '32px',
          lineHeight: 1.6,
          maxWidth: '900px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          {data.reviewText}
        </p>

        {/* Rating */}
        <div style={{ marginBottom: '8px' }}>
          <StarRating rating={data.ratingNumber} />
        </div>

        {/* Movie title and year */}
        <h2 style={{ color: '#ffffff', fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
          {data.movieTitle}
        </h2>
        <p style={{ color: '#9ca3af', fontSize: '20px', marginBottom: '24px' }}>{data.year}</p>

        {/* Username */}
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          Review by <span style={{ color: '#9ca3af' }}>{data.username}</span>
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
    }}>
      {/* Subtle overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
      }} />

      {/* Top-left card */}
      <div style={{
        position: 'absolute',
        top: '64px',
        left: '32px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px',
      }}>
        {/* Poster thumbnail */}
        {data.posterUrl && (
          <img
            src={proxyUrl(data.posterUrl)}
            alt=""
            crossOrigin="anonymous"
            style={{
              width: '80px',
              height: '112px',
              objectFit: 'cover',
              borderRadius: '4px',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
            }}
          />
        )}

        <div style={{ textAlign: 'left' }}>
          {/* Title and year */}
          <h2 style={{ color: '#ffffff', fontSize: '20px', fontWeight: 'bold' }}>
            {data.movieTitle}<span style={{ color: '#9ca3af' }}>, {data.year}</span>
          </h2>

          {/* Rating */}
          <div style={{ marginTop: '4px' }}>
            <StarRating rating={data.ratingNumber} />
          </div>

          {/* Username */}
          <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '4px' }}>
            Review by <span style={{ color: '#ffffff' }}>{data.username}</span>
          </p>
        </div>
      </div>

      {/* Review text below the card */}
      <div style={{
        position: 'absolute',
        top: '224px',
        left: '32px',
        right: '32px',
      }}>
        <p style={{
          color: '#ffffff',
          fontSize: '24px',
          fontWeight: 300,
          lineHeight: 1.6,
        }}>
          {data.reviewText}
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
    }}>
      {/* Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
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
          backgroundColor: 'rgba(0,0,0,0.6)',
          borderRadius: '16px',
          padding: '32px',
          margin: '0 32px',
          textAlign: 'center',
          maxWidth: '800px',
        }}>
          {/* Poster thumbnail */}
          {data.posterUrl && (
            <img
              src={proxyUrl(data.posterUrl)}
              alt=""
              crossOrigin="anonymous"
              style={{
                width: '96px',
                height: '144px',
                objectFit: 'cover',
                borderRadius: '4px',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                margin: '0 auto 16px auto',
                display: 'block',
              }}
            />
          )}

          {/* Title and year */}
          <h2 style={{ color: '#ffffff', fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
            {data.movieTitle}<span style={{ color: '#9ca3af' }}>, {data.year}</span>
          </h2>

          {/* Rating */}
          <div style={{ marginBottom: '16px' }}>
            <StarRating rating={data.ratingNumber} />
          </div>

          {/* Review text */}
          <p style={{
            color: '#ffffff',
            fontSize: '20px',
            fontWeight: 300,
            lineHeight: 1.6,
            marginBottom: '24px',
          }}>
            {data.reviewText}
          </p>

          {/* Username */}
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>
            Review by <span style={{ color: '#ffffff' }}>{data.username}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

