import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('query');
  
  if (!query) {
    return NextResponse.json({ results: [] });
  }

  const TMDB_API_KEY = process.env.TMDB_API_KEY;
  
  if (!TMDB_API_KEY) {
    console.log('[TMDB Search] No API key configured');
    return NextResponse.json({ results: [] });
  }

  try {
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`;
    const res = await fetch(searchUrl);
    const data = await res.json();
    
    if (!data.results) {
      return NextResponse.json({ results: [] });
    }

    // Transform results to our format
    const results = data.results.slice(0, 8).map((movie: { 
      id: number; 
      title: string; 
      release_date?: string; 
      poster_path?: string 
    }) => ({
      id: movie.id,
      title: movie.title,
      year: movie.release_date?.substring(0, 4) || '',
      poster: movie.poster_path 
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : ''
    }));

    return NextResponse.json({ results });
    
  } catch (error) {
    console.error('[TMDB Search] Error:', error);
    return NextResponse.json({ results: [] });
  }
}

