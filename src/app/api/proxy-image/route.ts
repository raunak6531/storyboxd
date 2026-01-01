import { NextRequest, NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  let imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400, headers: corsHeaders });
  }

  // Normalize protocol-relative URLs
  if (imageUrl.startsWith('//')) {
    imageUrl = `https:${imageUrl}`;
  }

  let referer: string | undefined;
  try {
    const host = new URL(imageUrl).hostname;
    if (host.endsWith('ltrbxd.com') || host === 'image.tmdb.org') {
      referer = 'https://letterboxd.com/';
    }
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400, headers: corsHeaders });
  }

  try {
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        ...(referer ? { Referer: referer } : {}),
        'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
      },
      redirect: 'follow',
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch image' }, { status: response.status, headers: corsHeaders });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
        'Cross-Origin-Resource-Policy': 'cross-origin',
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy image' },
      { status: 500, headers: corsHeaders }
    );
  }
}

