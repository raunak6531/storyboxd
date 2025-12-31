import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export interface ReviewData {
  movieTitle: string;
  year: string;
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
  let movieTitle = '';
  let year = '';

  // Parse title like "'Dhurandhar' review by Raunak Sadana"
  const titleMatch = ogTitle.match(/'([^']+)'/);
  if (titleMatch) {
    movieTitle = titleMatch[1];
  } else {
    movieTitle = $('h1.headline-1 a').text() ||
                 $('span[itemprop="name"]').text() ||
                 ogTitle.split('review')[0]?.trim() || '';
  }

  // Get year
  year = $('small.number a').text() ||
         $('.film-header-lockup .number').text() || '';

  // Try to extract year from HTML
  const yearFromHtml = html.match(/(\d{4})\s*<\/a>\s*<\/small>/)?.[1] ||
                       html.match(/"releaseYear":\s*"?(\d{4})"?/)?.[1] || '';
  if (!year && yearFromHtml) {
    year = yearFromHtml;
  }

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

  // Fetch movie page for images
  let posterUrl = '';
  let backdropUrl = '';

  if (movieUrl) {
    const movieResponse = await fetch(movieUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (movieResponse.ok) {
      const movieHtml = await movieResponse.text();
      const $movie = cheerio.load(movieHtml);

      // Get poster - look for film poster image
      posterUrl = $movie('meta[property="og:image"]').attr('content') || '';

      // Look for higher res poster in image srcset or data attributes
      const posterImg = $movie('.film-poster img').attr('src') ||
                       $movie('.poster img').attr('src') ||
                       $movie('img.image').attr('src') || '';
      if (posterImg && !posterImg.includes('empty-poster')) {
        posterUrl = posterImg;
      }

      // Try to find poster in the HTML - look for TMDB image URLs
      if (!posterUrl || posterUrl.includes('empty-poster')) {
        const posterMatch = movieHtml.match(/https:\/\/image\.tmdb\.org\/t\/p\/[^"'\s<>]+/);
        if (posterMatch) {
          posterUrl = posterMatch[0];
        }
      }

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

      // Get year from movie page if not found
      if (!year) {
        year = $movie('small.number a').text() ||
               $movie('.releaseyear a').text() || '';
      }
    }
  }

  // Clean up the review text - remove prefix patterns
  const cleanReviewText = reviewText
    .replace(/^.*?published on Letterboxd:\s*/i, '')
    .replace(/^.*?'s review.*?:\s*/i, '')
    .trim();

  return {
    movieTitle: movieTitle.trim(),
    year: year.trim(),
    rating,
    ratingNumber,
    reviewText: cleanReviewText,
    username: usernameFromUrl,
    displayName: displayName.trim(),
    posterUrl,
    backdropUrl,
    movieUrl
  };
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

