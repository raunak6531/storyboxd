import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const title = request.nextUrl.searchParams.get('title');
  const year = request.nextUrl.searchParams.get('year');

  if (!title) {
    return NextResponse.json({ error: 'Missing title parameter' }, { status: 400 });
  }

  const TMDB_API_KEY = process.env.TMDB_API_KEY;
  if (!TMDB_API_KEY) {
    return NextResponse.json({ backdrops: [] });
  }

  try {
    // Search for the movie
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}${year ? `&year=${year}` : ''}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (!searchData.results || searchData.results.length === 0) {
      return NextResponse.json({ backdrops: [] });
    }

    const movie = searchData.results[0];

    // Fetch all images for this movie
    const imagesUrl = `https://api.themoviedb.org/3/movie/${movie.id}/images?api_key=${TMDB_API_KEY}&include_image_language=en,null`;
    const imagesRes = await fetch(imagesUrl);
    const imagesData = await imagesRes.json();

    const backdrops = (imagesData.backdrops || [])
      .slice(0, 12) // Limit to 12 backdrops
      .map((img: { file_path: string; width: number; height: number; vote_average: number }) => ({
        url: `https://image.tmdb.org/t/p/original${img.file_path}`,
        thumbnail: `https://image.tmdb.org/t/p/w300${img.file_path}`,
        width: img.width,
        height: img.height,
      }));

    return NextResponse.json({ backdrops });
  } catch (error) {
    console.error('[TMDB Backdrops] Error:', error);
    return NextResponse.json({ backdrops: [] });
  }
}

