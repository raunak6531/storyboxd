import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export interface ReviewData {
  movieTitle: string;
  year: string;
  director: string;
  rating: string;
  ratingNumber: number;
  reviewText: string;
  username: string;
  displayName: string;
  posterUrl: string;
  backdropUrl: string;
  movieUrl: string;
}

function parseRating(ratingText: string): { rating: string; ratingNumber: number } {
  const stars = ratingText.match(/★/g)?.length || 0;
  const hasHalf = ratingText.includes('½');
  const ratingNumber = stars + (hasHalf ? 0.5 : 0);
  return { rating: ratingText.trim(), ratingNumber };
}

// Helper to normalize image URLs (handle protocol-relative URLs, etc.)
function normalizeImageUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('//')) return `https:${url}`;
  return url;
}

async function scrapeReview(url: string): Promise<ReviewData> {
  // Normalize URL
  let reviewUrl = url.trim();

  // Handle boxd.it short URLs
  if (reviewUrl.includes('boxd.it')) {
    const response = await fetch(reviewUrl, { redirect: 'follow' });
    reviewUrl = response.url;
  }

  // Ensure it's a letterboxd URL
  if (!reviewUrl.includes('letterboxd.com')) {
    throw new Error('Invalid URL. Please provide a Letterboxd review URL.');
  }

  // Fetch the review page
  const response = await fetch(reviewUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch the review page');
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  // Extract review text - look for the actual review content
  let reviewText = '';
  const ogDescription = $('meta[property="og:description"]').attr('content') || '';

  // Try to get the review text from the body-text div
  const bodyText = $('.review .body-text p').first().text() ||
                   $('.body-text p').first().text() || '';

  // Use og:description but clean it up
  reviewText = ogDescription || bodyText;

  // Extract username
  const usernameFromUrl = reviewUrl.match(/letterboxd\.com\/([^/]+)\//)?.[1] || '';
  const displayName = $('a.name span.name').first().text() ||
                      $('span.name').first().text() ||
                      usernameFromUrl;

  // Extract movie title and year
  const ogTitle = $('meta[property="og:title"]').attr('content') || '';
  console.log('OG Title:', ogTitle);

  let movieTitle = '';
  let year = '';

  // Parse various title formats:
  // - "'Dhurandhar' review by Raunak Sadana"
  // - "Review of 'The Shape of Water' by timtamtitus"
  // - "timtamtitus's review of The Shape of Water"
  // - "★★★★ review of The Shape of Water by timtamtitus"
  // - "A ★★★★ review of The Running Man (2025)"

  // Try quoted title first (single quotes)
  const quotedMatch = ogTitle.match(/'([^']+)'/);
  // Try "review of X" pattern - capture title with optional year in parentheses
  const reviewOfMatch = ogTitle.match(/review of\s+(.+?)(?:\s+by\s|$)/i);
  // Try "X review by" pattern (but not starting with username)
  const reviewByMatch = ogTitle.match(/['"](.+?)['"]\s+review by/i);
  // Try to extract from "'s review of X" pattern
  const reviewOfPattern2 = ogTitle.match(/'s\s+review\s+of\s+(.+?)(?:\s*\(|$)/i);

  if (quotedMatch) {
    movieTitle = quotedMatch[1];
  } else if (reviewOfMatch) {
    // Clean up the extracted title - remove year in parentheses, quotes
    let extractedTitle = reviewOfMatch[1].replace(/['"]/g, '').trim();
    // Extract year if present
    const titleYearMatch = extractedTitle.match(/^(.+?)\s*\((\d{4})\)$/);
    if (titleYearMatch) {
      extractedTitle = titleYearMatch[1].trim();
      if (!year) {
        year = titleYearMatch[2];
      }
    }
    movieTitle = extractedTitle;
  } else if (reviewByMatch) {
    movieTitle = reviewByMatch[1];
  } else if (reviewOfPattern2) {
    movieTitle = reviewOfPattern2[1].trim();
  } else {
    // Fallback: try to get from page elements
    movieTitle = $('h1.headline-1 a').text() ||
                 $('span[itemprop="name"]').text() || '';
  }

  // If still no title, try to get it from the film header or other places
  if (!movieTitle) {
    movieTitle = $('.film-title-wrapper a').text() ||
                 $('h2.headline-2 a').text() ||
                 $('a[href*="/film/"]').filter(function() {
                   const $this = $(this);
                   // Look for film links that have the title text
                   return $this.closest('.film-detail-content, .film-poster').length > 0;
                 }).first().text() || '';
  }

  console.log('Movie Title extracted:', movieTitle);

  // Get year
  year = $('small.number a').text() ||
         $('.film-header-lockup .number').text() || '';

  // Try to extract year from HTML
  const yearFromHtml = html.match(/(\d{4})\s*<\/a>\s*<\/small>/)?.[1] ||
                       html.match(/"releaseYear":\s*"?(\d{4})"?/ )?.[1] || '';
  if (!year && yearFromHtml) {
    year = yearFromHtml;
  }
  console.log('Year extracted:', year);

  // Extract rating
  const ratingElement = $('span.rating').first().text();
  const { rating, ratingNumber } = parseRating(ratingElement);

  // Get the movie URL to fetch poster and backdrop
  let moviePath = $('a[href*="/film/"]').attr('href') || '';

  // Also try extracting from the URL pattern
  const filmSlugMatch = reviewUrl.match(/\/film\/([^/]+)/);
  if (!moviePath && filmSlugMatch) {
    moviePath = `/film/${filmSlugMatch[1]}/`;
  }

  const movieUrl = moviePath ? `https://letterboxd.com${moviePath}` : '';

  // Fetch movie page for images and director
  let posterUrl = '';
  let backdropUrl = '';
  let director = '';

  if (movieUrl) {
    const movieResponse = await fetch(movieUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (movieResponse.ok) {
      const movieHtml = await movieResponse.text();
      const $movie = cheerio.load(movieHtml);

      // Get director - look for director link
      director = $movie('a[href*="/director/"]').first().text() ||
                 $movie('.credits a[href*="/director/"]').text() ||
                 $movie('span.prettify').first().text() || '';

      // Try to get director from meta or structured data
      if (!director) {
        const directorMatch = movieHtml.match(/"director"[^}]*"name"\s*:\s*"([^"]+)"/);
        if (directorMatch) {
          director = directorMatch[1];
        }
      }

      // Get poster - prioritize actual poster images over og:image (which is often a backdrop)
      // Letterboxd poster URLs typically have paths like /film-poster/ or dimensions like 0-230-0-345 (portrait)

      // First look for film-poster URLs in HTML (support jpg, jpeg, png, webp)
      const filmPosterMatch = movieHtml.match(/https:\/\/a\.ltrbxd\.com\/resized\/film-poster\/[^"'\s<>]+\.(?:jpg|jpeg|png|webp)[^"'\s<>]*/i);
      if (filmPosterMatch) {
        posterUrl = filmPosterMatch[0];
      }

      // Try to find TMDB poster (portrait format, has /p/ in path)
      if (!posterUrl) {
        const tmdbPosterMatch = movieHtml.match(/https:\/\/image\.tmdb\.org\/t\/p\/(?:w\d+|original)\/[^"'\s<>]+\.(?:jpg|jpeg|png|webp)/i);
        if (tmdbPosterMatch) {
          posterUrl = tmdbPosterMatch[0];
        }
      }

      // Look for poster in data attributes (Letterboxd stores poster URLs here)
      if (!posterUrl) {
        const filmPoster = $movie('.film-poster');
        const posterData = filmPoster.attr('data-image') ||
                          filmPoster.find('img').attr('src') ||
                          $movie('div[data-film-poster]').attr('data-film-poster') || '';

        if (posterData && !posterData.includes('empty-poster')) {
          posterUrl = posterData;
        }
      }

      // Try to find poster with portrait dimensions in URL (0-230-0-345 or similar)
      if (!posterUrl) {
        const portraitMatch = movieHtml.match(/https:\/\/a\.ltrbxd\.com\/resized\/[^"'\s<>]*?-0-\d{2,3}-0-\d{3}[^"'\s<>]*\.(?:jpg|jpeg|png|webp)[^"'\s<>]*/i);
        if (portraitMatch && !portraitMatch[0].includes('backdrop')) {
          posterUrl = portraitMatch[0];
        }
      }

      // Fallback to og:image if nothing else found
      if (!posterUrl) {
        posterUrl = $movie('meta[property="og:image"]').attr('content') || '';
      }

      // Normalize poster URL
      posterUrl = normalizeImageUrl(posterUrl);

      console.log('Poster URL found:', posterUrl);

      // Get backdrop - look for backdrop in various places
      // First try the backdrop container data attribute
      const backdropData = $movie('#backdrop').attr('data-backdrop') ||
                          $movie('.backdrop-container').attr('data-backdrop') ||
                          $movie('[data-backdrop]').attr('data-backdrop') || '';

      if (backdropData) {
        backdropUrl = backdropData;
      } else {
        // Try to find backdrop URL in the HTML/scripts - look for various patterns
        const backdropPatterns = [
          /backdrop2x?["']?\s*:\s*["']([^"']+)/i,
          /https:\/\/a\.ltrbxd\.com\/resized\/alternative-backdrop\/[^"'\s<>]+/,
          /https:\/\/a\.ltrbxd\.com\/resized\/film-backdrop\/[^"'\s<>]+/,
          /https:\/\/a\.ltrbxd\.com\/resized\/[^"'\s<>]+backdrop[^"'\s<>]*/i
        ];

        for (const pattern of backdropPatterns) {
          const match = movieHtml.match(pattern);
          if (match) {
            backdropUrl = match[1] || match[0];
            break;
          }
        }
      }

      // Fallback: use the og:image which is usually the poster
      if (!backdropUrl) {
        backdropUrl = posterUrl;
      }

      // Normalize backdrop URL
      backdropUrl = normalizeImageUrl(backdropUrl);

      // Get year from movie page if not found
      if (!year) {
        year = $movie('small.number a').text() ||
               $movie('.releaseyear a').text() || '';
      }

      // Get movie title from movie page if not found - this is the most reliable source
      if (!movieTitle) {
        const movieOgTitle = $movie('meta[property="og:title"]').attr('content') || '';
        // Movie page og:title is like "The Shape of Water (2017)"
        const movieTitleMatch = movieOgTitle.match(/^(.+?)\s*\(\d{4}\)/) ||
                                movieOgTitle.match(/^(.+?)(?:\s*-|$)/);
        if (movieTitleMatch) {
          movieTitle = movieTitleMatch[1].trim();
        } else if (movieOgTitle) {
          movieTitle = movieOgTitle;
        }

        // Also try headline
        if (!movieTitle) {
          movieTitle = $movie('h1.headline-1').text() ||
                       $movie('h1.filmtitle').text() ||
                       $movie('.headline-1 a').text() || '';
        }
      }

      // Extract year from og:title if not found
      if (!year) {
        const movieOgTitle = $movie('meta[property="og:title"]').attr('content') || '';
        const yearMatch = movieOgTitle.match(/\((\d{4})\)/);
        if (yearMatch) {
          year = yearMatch[1];
        }
      }
    }
  }

  // Clean up the review text - remove prefix patterns
  const cleanReviewText = reviewText
    .replace(/^.*?published on Letterboxd:\s*/i, '')
    .replace(/^.*?'s review.*?:\s*/i, '')
    .trim();

  const result = {
    movieTitle: movieTitle.trim(),
    year: year.trim(),
    director: director.trim(),
    rating,
    ratingNumber,
    reviewText: cleanReviewText,
    username: usernameFromUrl,
    displayName: displayName.trim(),
    posterUrl,
    backdropUrl,
    movieUrl
  };

  console.log('Final result:', JSON.stringify(result, null, 2));
  return result;
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const data = await scrapeReview(url);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to scrape review' },
      { status: 500 }
    );
  }
}

