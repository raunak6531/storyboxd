import { NextRequest, NextResponse } from 'next/server';

// Use TMDB API to get movie details (poster + director)
// Letterboxd uses TMDB data, so this is reliable
async function fetchFromTMDB(title: string, year: string): Promise<{ director: string; posterUrl: string }> {
  const TMDB_API_KEY = process.env.TMDB_API_KEY;

  if (!TMDB_API_KEY) {
    console.log('[TMDB] No API key configured');
    return { director: '', posterUrl: '' };
  }

  try {
    // Search for the movie
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}&year=${year}`;
    console.log('[TMDB] Searching for:', title, year);

    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (!searchData.results || searchData.results.length === 0) {
      console.log('[TMDB] No results found');
      return { director: '', posterUrl: '' };
    }

    const movie = searchData.results[0];
    const posterUrl = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : '';

    // Get credits to find director
    const creditsUrl = `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${TMDB_API_KEY}`;
    const creditsRes = await fetch(creditsUrl);
    const creditsData = await creditsRes.json();

    const directorInfo = creditsData.crew?.find((c: { job: string }) => c.job === 'Director');
    const director = directorInfo?.name || '';

    console.log('[TMDB] Found - Director:', director, 'Poster:', posterUrl);
    return { director, posterUrl };

  } catch (error) {
    console.error('[TMDB] Error:', error);
    return { director: '', posterUrl: '' };
  }
}

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug');
  const title = request.nextUrl.searchParams.get('title');
  const year = request.nextUrl.searchParams.get('year');
  const backdropUrl = request.nextUrl.searchParams.get('backdrop');

  if (!slug && !title) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  let director = '';
  let posterUrl = '';

  // Method 1: Try TMDB if we have title + year
  if (title && year) {
    const tmdbResult = await fetchFromTMDB(title, year);
    director = tmdbResult.director;
    posterUrl = tmdbResult.posterUrl;
  }

  // Method 2: Try to derive poster URL from backdrop URL
  // Letterboxd backdrop: https://a.ltrbxd.com/resized/alternative-backdrop/7/2/9/.../image.jpg
  // We can try to find the film-poster version
  if (!posterUrl && backdropUrl) {
    try {
      // Extract TMDB ID from backdrop URL path (the numbers like 7/2/9/1/1/3 = 729113)
      const pathMatch = backdropUrl.match(/alternative-backdrop\/(\d+\/\d+\/\d+\/\d+\/\d+\/\d+)/);
      if (pathMatch) {
        const tmdbId = pathMatch[1].replace(/\//g, '');
        console.log('[Movie Details] Extracted TMDB ID:', tmdbId);

        // Try to get poster from TMDB using the ID
        const TMDB_API_KEY = process.env.TMDB_API_KEY;
        if (TMDB_API_KEY) {
          const movieUrl = `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_API_KEY}&append_to_response=credits`;
          const res = await fetch(movieUrl);
          if (res.ok) {
            const data = await res.json();
            if (data.poster_path) {
              posterUrl = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
            }
            if (!director && data.credits?.crew) {
              const d = data.credits.crew.find((c: { job: string }) => c.job === 'Director');
              if (d) director = d.name;
            }
          }
        }
      }
    } catch (e) {
      console.warn('[Movie Details] Failed to extract from backdrop URL');
    }
  }

  console.log('[Movie Details] Final result - Director:', director, 'Poster:', posterUrl);
  return NextResponse.json({ director, posterUrl });
}

