import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'StoryBoxd — Turn Letterboxd reviews into Instagram Stories';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          backgroundColor: '#000000',
          padding: '64px',
          color: '#f2f2f2',
          backgroundImage:
            'radial-gradient(40% 35% at 0% 25%, rgba(0, 224, 84, 0.22), transparent 70%), radial-gradient(35% 30% at 100% 85%, rgba(255, 128, 0, 0.18), transparent 70%)',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            maxWidth: '680px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.04em' }}>Story</span>
            <span style={{ fontSize: 36, fontWeight: 700, color: '#00e054', letterSpacing: '-0.04em' }}>Boxd</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                fontSize: 60,
                fontWeight: 900,
                lineHeight: 0.95,
                textTransform: 'uppercase',
                letterSpacing: '0.01em',
              }}
            >
              Your Letterboxd review, ready for Instagram Stories
            </div>
            <div style={{ fontSize: 20, color: '#9b9b9b', lineHeight: 1.5 }}>
              Paste a review link. StoryBoxd pulls in the poster, your rating and your words, then lets you restyle the story and download it in seconds.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                backgroundColor: '#00e054',
                color: '#00200c',
                fontSize: 18,
                fontWeight: 700,
                padding: '12px 24px',
                borderRadius: '12px',
              }}
            >
              Open studio
            </div>
            <span style={{ fontSize: 16, color: '#9b9b9b' }}>12 templates • No account needed</span>
          </div>
        </div>

        {/* Story Card Mockup */}
        <div
          style={{
            width: '270px',
            height: '480px',
            borderRadius: '24px',
            backgroundColor: '#101010',
            border: '8px solid #1a1a1a',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '24px 20px',
            backgroundImage:
              'linear-gradient(180deg, rgba(6,13,26,0.3) 0%, rgba(20,40,69,0.85) 60%, rgba(0,0,0,0.95) 100%)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 80px rgba(0,224,84,0.15)',
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: '6px' }}>Last Train to Jaipur</div>
          <div style={{ fontSize: 16, color: '#00e054', letterSpacing: '2px', marginBottom: '8px' }}>★★★★½</div>
          <div style={{ fontSize: 12, color: '#e8e8e8', lineHeight: 1.4, marginBottom: '10px' }}>
            “Quiet, patient and gorgeous. The final ten minutes rewired how I felt about everything before them.”
          </div>
          <div style={{ fontSize: 10, color: '#888' }}>Review by @filmfan</div>
        </div>
      </div>
    ),
    { ...size }
  );
}

