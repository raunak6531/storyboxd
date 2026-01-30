// src/lib/clientScraper.ts

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

// --- HELPER FUNCTIONS ---

function getHighResImage(url: string): string {
  if (!url) return '';
  if (url.startsWith('//')) url = `https:${url}`;
  // Remove query params to get highest quality
  return url.split('?')[0]; 
}

function parseRating(ratingText: string): { rating: string; ratingNumber: number } {
  const stars = (ratingText.match(/★/g) || []).length;
  const hasHalf = ratingText.includes('½');
  const ratingNumber = stars + (hasHalf ? 0.5 : 0);
  return { rating: ratingText.trim(), ratingNumber };
}

// Force-Clean the title to remove "Review of", Stars, Year, etc.
function cleanMovieTitle(rawTitle: string): { title: string, year: string } {
  let title = rawTitle || '';
  let year = '';

  // Handle format: "A ★★★★½ review of Movie Title (2025)"
  // Or: "★★★★ review of Movie Title (2025)"
  // Or: "'Movie Title' review by username"

  // Pattern 1: "A ★★★★½ review of TITLE (YEAR)" or "★★★★ review of TITLE (YEAR)"
  const reviewOfMatch = title.match(/^(?:A\s+)?[★½\s]*review\s+of\s+(.+)$/i);
  if (reviewOfMatch) {
    title = reviewOfMatch[1];
  }

  // Pattern 2: "'TITLE' review by USERNAME" (single quotes around title)
  const quotedMatch = title.match(/^['"](.+?)['"]\s+review\s+by/i);
  if (quotedMatch) {
    title = quotedMatch[1];
  }

  // Pattern 3: "TITLE (YEAR) review by USERNAME"
  const titleReviewByMatch = title.match(/^(.+?)\s+review\s+by/i);
  if (titleReviewByMatch && !reviewOfMatch && !quotedMatch) {
    title = titleReviewByMatch[1];
  }

  // Remove any remaining stars at start or end
  title = title.replace(/^[★½\s]+/, '').replace(/[★½\s]+$/, '');

  // Remove "on Letterboxd"
  title = title.replace(/\s+on\s+Letterboxd$/i, '');

  // Extract and remove Year (2025)
  const yearMatch = title.match(/\((\d{4})\)$/);
  if (yearMatch) {
    year = yearMatch[1];
    title = title.replace(/\s*\(\d{4}\)$/, '');
  }

  return { title: title.trim(), year };
}

// --- PROXY ROTATOR ---
async function fetchHtml(targetUrl: string): Promise<string> {
  const encodedUrl = encodeURIComponent(targetUrl);
  
  // Priority list of proxies
  const proxies = [
    { name: 'AllOrigins', url: `https://api.allorigins.win/get?url=${encodedUrl}`, type: 'json' },
    { name: 'CorsProxy', url: `https://corsproxy.io/?${encodedUrl}`, type: 'text' },
    { name: 'CodeTabs', url: `https://api.codetabs.com/v1/proxy?quest=${encodedUrl}`, type: 'text' },
    { name: 'ThingProxy', url: `https://thingproxy.freeboard.io/fetch/${targetUrl}`, type: 'text' }
  ];

  for (const proxy of proxies) {
    try {
      console.log(`[Scraper] Trying ${proxy.name}...`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(proxy.url, { 
        signal: controller.signal,
        cache: 'no-store' 
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) continue;
      
      let html = '';
      if (proxy.type === 'json') {
        const data = await response.json();
        html = data.contents;
      } else {
        html = await response.text();
      }
      
      if (!html || html.length < 500) continue;
      if (html.includes('Security Check') || html.includes('Just a moment...')) continue;

      return html;
    } catch (e) {
      console.warn(`[Scraper] ${proxy.name} failed.`);
    }
  }

  throw new Error('All proxies failed.');
}

// --- MICROLINK FALLBACK ---
// Fetch movie details via server-side API (uses TMDB)
async function fetchMovieDetails(
  movieSlug: string,
  title: string,
  year: string,
  backdropUrl: string
): Promise<{ director: string; posterUrl: string }> {
  console.log('[Scraper] Fetching movie details:', { movieSlug, title, year });

  try {
    // Use our server-side API which calls TMDB
    const params = new URLSearchParams({
      slug: movieSlug,
      title,
      year,
      backdrop: backdropUrl
    });
    const response = await fetch(`/api/movie-details?${params}`);

    if (!response.ok) {
      console.warn('[Scraper] Movie details API failed');
      return { director: '', posterUrl: '' };
    }

    const data = await response.json();
    console.log('[Scraper] Movie details from API:', data);

    return {
      director: data.director || '',
      posterUrl: data.posterUrl || ''
    };
  } catch (e) {
    console.warn('[Scraper] Failed to fetch movie details:', e);
    return { director: '', posterUrl: '' };
  }
}

async function fetchMicrolink(targetUrl: string): Promise<ReviewData> {
  console.log('[Scraper] Switching to Microlink Fallback...');
  console.log('[Scraper] URL:', targetUrl);
  const response = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(targetUrl)}&palette=true&audio=false&video=false`);
  const json = await response.json();
  const data = json.data;

  console.log('[Scraper] Microlink data:', JSON.stringify(data, null, 2));

  if (!data) throw new Error('Microlink failed');

  // Clean the title - Microlink often returns "A ★★★★½ review of Movie (2024)"
  const rawTitle = data.title || 'Unknown Title';
  const cleaned = cleanMovieTitle(rawTitle);

  // Try to extract rating from title
  let ratingNumber = 0;
  const starsMatch = rawTitle.match(/★+½?/);
  if (starsMatch) {
    const stars = (starsMatch[0].match(/★/g) || []).length;
    const hasHalf = starsMatch[0].includes('½');
    ratingNumber = stars + (hasHalf ? 0.5 : 0);
  }
  const full = Math.floor(ratingNumber);
  const hasHalf = ratingNumber % 1 !== 0;
  const rating = '★'.repeat(full) + (hasHalf ? '½' : '');

  // Extract username from the EXPANDED URL that Microlink returns
  // data.url contains the full letterboxd.com URL even when we pass a boxd.it short URL
  let username = 'User';
  const expandedUrl = data.url || targetUrl;
  console.log('[Scraper] Expanded URL:', expandedUrl);

  const urlMatch = expandedUrl.match(/letterboxd\.com\/([^\/]+)\/film/i);
  console.log('[Scraper] URL match for username:', urlMatch);
  if (urlMatch && urlMatch[1]) {
    username = urlMatch[1];
  }
  // Also try from title: "... review by Username"
  if (username === 'User') {
    const userMatch = rawTitle.match(/review\s+by\s+([^\s]+)/i);
    if (userMatch) username = userMatch[1];
  }
  // Clean up microlink author - but prioritize URL-extracted username
  if (username === 'User' && data.author && data.author !== 'Letterboxd') {
    username = data.author;
  }

  console.log('[Scraper] Final username:', username);

  // Extract movie slug from expanded URL and fetch movie details (director + poster)
  let director = '';
  let posterUrl = '';
  const backdropUrl = data.image?.url || '';
  const slugMatch = expandedUrl.match(/\/film\/([^\/]+)/);
  if (slugMatch && slugMatch[1]) {
    const movieDetails = await fetchMovieDetails(slugMatch[1], cleaned.title, cleaned.year, backdropUrl);
    director = movieDetails.director;
    posterUrl = movieDetails.posterUrl;
    console.log('[Scraper] Got movie details - Director:', director, 'Poster:', posterUrl);
  }

  // Clean the review text - remove Microlink's metadata prefix
  let reviewText = data.description || '';
  // Remove patterns like "Username's review published on Letterboxd: actual review"
  reviewText = reviewText
    .replace(/^[^']+?'s review published on Letterboxd:\s*/i, '')
    .replace(/^.*?published on Letterboxd:\s*/i, '')
    .replace(/^Review by .*?:\s*/i, '')
    .trim();

  const result = {
    movieTitle: cleaned.title || 'Unknown Title',
    year: cleaned.year || '',
    director,
    rating,
    ratingNumber,
    reviewText,
    username,
    displayName: username,
    posterUrl: getHighResImage(posterUrl || data.image?.url || ''),
    backdropUrl: getHighResImage(data.image?.url || ''),
    movieUrl: targetUrl
  };

  console.log('[Scraper] Returning:', JSON.stringify(result, null, 2));
  return result;
}

// --- MAIN FUNCTION ---
export async function scrapeLetterboxd(url: string): Promise<ReviewData> {
  console.log('[Scraper] Starting scrape for:', url);

  // Try Microlink FIRST - it's the most reliable
  try {
    console.log('[Scraper] Trying Microlink first (most reliable)...');
    return await fetchMicrolink(url);
  } catch (microlinkError) {
    console.warn('[Scraper] Microlink failed, trying proxy fallbacks...', microlinkError);
  }

  // Fallback to proxy-based scraping
  try {
    const html = await fetchHtml(url);
    console.log('[Scraper] Got HTML from proxy, length:', html.length);
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // 1. JSON-LD Extraction
    let jsonLd: any = {};
    const scriptTags = doc.querySelectorAll('script[type="application/ld+json"]');
    scriptTags.forEach(script => {
      try {
        const json = JSON.parse(script.textContent || '{}');
        if (json['@type'] === 'Review') jsonLd = json;
      } catch (e) {}
    });

    // 2. Data Parsing
    let movieTitle = jsonLd.itemReviewed?.name || '';
    let year = jsonLd.itemReviewed?.dateCreated?.substring(0, 4) || '';
    let reviewText = jsonLd.reviewBody || '';
    let displayName = jsonLd.author?.name || '';
    let movieUrl = jsonLd.itemReviewed?.sameAs || '';
    
    // Rating
    let ratingNumber = 0;
    if (jsonLd.reviewRating) {
      ratingNumber = parseFloat(jsonLd.reviewRating.ratingValue);
    } else {
      const ratingEl = doc.querySelector('span.rating');
      if (ratingEl && ratingEl.textContent) {
        ratingNumber = parseRating(ratingEl.textContent).ratingNumber;
      }
    }
    const full = Math.floor(ratingNumber);
    const hasHalf = ratingNumber % 1 !== 0;
    const rating = '★'.repeat(full) + (hasHalf ? '½' : '');

    // 3. Fallbacks & Cleaning

    // Title Cleaning (Crucial!)
    const pageTitle = doc.querySelector('title')?.textContent || '';
    const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';

    // Always try to get clean title - check both movieTitle and ogTitle for dirty patterns
    const raw = movieTitle || ogTitle || pageTitle;
    const looksLikeReview = raw.toLowerCase().includes('review') || raw.includes('★') || raw.includes('½');

    if (!movieTitle || looksLikeReview) {
       const cleaned = cleanMovieTitle(raw);
       movieTitle = cleaned.title;
       if (!year) year = cleaned.year;
    }

    // Username Fallback - try multiple sources
    console.log('[Scraper] Initial displayName from JSON-LD:', displayName);

    if (!displayName) {
      // Try meta tag
      displayName = doc.querySelector('meta[name="twitter:data1"]')?.getAttribute('content') || '';
      console.log('[Scraper] From twitter:data1:', displayName);
    }
    if (!displayName) {
      // Try extracting from title: "Movie (2024) review by [User]"
      const userMatch = (ogTitle || pageTitle).match(/review\s+by\s+(.*?)(?:\s+on\s+Letterboxd|$)/i);
      if (userMatch) displayName = userMatch[1].trim();
      console.log('[Scraper] From title match:', displayName, 'ogTitle:', ogTitle);
    }
    if (!displayName) {
      // Try extracting from URL: letterboxd.com/{username}/film/...
      const urlMatch = url.match(/letterboxd\.com\/([^\/]+)\/film/i);
      if (urlMatch && urlMatch[1]) displayName = urlMatch[1];
      console.log('[Scraper] From URL:', displayName);
    }
    if (!displayName) {
      // Try .person-summary or profile name
      displayName = doc.querySelector('.person-summary a.name')?.textContent?.trim() || '';
    }
    if (!displayName) displayName = 'User';

    console.log('[Scraper] Final displayName:', displayName);

    // Text Cleaning
    if (!reviewText) {
      const bodyText = doc.querySelector('.review .body-text');
      reviewText = bodyText ? bodyText.textContent || '' : doc.querySelector('meta[property="og:description"]')?.getAttribute('content') || '';
    }
    reviewText = reviewText
      .replace(/^.*?published on Letterboxd:\s*/i, '')
      .replace(/^.*?'s review.*?:\s*/i, '')
      .replace(/^Review by .*?:\s*/i, '')
      .trim();

    // Images
    let posterUrl = jsonLd.image || '';
    if (!posterUrl) {
      const posterImg = doc.querySelector('.film-poster img');
      if (posterImg) posterUrl = posterImg.getAttribute('src') || '';
    }

    let backdropUrl = '';
    const backdropEl = doc.querySelector('#backdrop') || doc.querySelector('[data-backdrop]');
    if (backdropEl) backdropUrl = backdropEl.getAttribute('data-backdrop') || '';
    
    // Image Fallbacks
    const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';
    if (!backdropUrl && ogImage) backdropUrl = ogImage;
    if (!posterUrl && ogImage) posterUrl = ogImage;
    if (!backdropUrl && posterUrl) backdropUrl = posterUrl;

    // Director - try multiple sources
    let director = '';
    // Try twitter:data2 meta tag
    const directorMeta = doc.querySelector('meta[name="twitter:data2"]');
    if (directorMeta?.getAttribute('content')?.includes('Director')) {
      director = directorMeta.getAttribute('content')?.replace('Director', '').trim() || '';
    }
    // Try the film page director link
    if (!director) {
      const directorEl = doc.querySelector('.film-header-lockup .directorlist a, a[href*="/director/"], .credits a[href*="/director/"]');
      if (directorEl) director = directorEl.textContent?.trim() || '';
    }
    // Try JSON-LD director
    if (!director && jsonLd.itemReviewed?.director) {
      const d = jsonLd.itemReviewed.director;
      if (Array.isArray(d)) director = d[0]?.name || '';
      else if (typeof d === 'object') director = d.name || '';
      else director = d;
    }

    // If director or poster is still missing, try TMDB API
    // Extract movie slug from URL or movieUrl
    const slugMatch = (movieUrl || url).match(/\/film\/([^\/]+)/);
    if ((!director || !posterUrl || posterUrl === backdropUrl) && slugMatch && slugMatch[1]) {
      console.log('[Scraper] Director/Poster missing, fetching from TMDB...');
      const movieDetails = await fetchMovieDetails(slugMatch[1], movieTitle, year, backdropUrl);
      if (!director && movieDetails.director) {
        director = movieDetails.director;
      }
      if ((!posterUrl || posterUrl === backdropUrl) && movieDetails.posterUrl) {
        posterUrl = movieDetails.posterUrl;
      }
      console.log('[Scraper] After TMDB - Director:', director, 'Poster:', posterUrl);
    }

    return {
      movieTitle: movieTitle || 'Unknown Title',
      year,
      director,
      rating,
      ratingNumber,
      reviewText,
      username: displayName,
      displayName,
      posterUrl: getHighResImage(posterUrl),
      backdropUrl: getHighResImage(backdropUrl),
      movieUrl
    };

  } catch (proxyError) {
    console.error('[Scraper] All methods failed:', proxyError);
    throw new Error('Failed to scrape review. Please try again later.');
  }
}