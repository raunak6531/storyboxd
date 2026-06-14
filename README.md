<div align="center">

<br />

# ✦ StoryBoxd

**Transform your Letterboxd reviews into stunning Instagram Stories**

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

<br />

*Paste a Letterboxd review URL. Pick a template. Download. Share.*

</div>

---

## 🎬 What is StoryBoxd?

StoryBoxd is a PWA that bridges your **Letterboxd** movie diary and your **Instagram** feed. Paste a Letterboxd review link and the app instantly scrapes the review data, fetches movie backdrops and poster art from TMDB, and renders it as a pixel-perfect **1080 × 1920 Instagram Story** — ready to download or share in seconds.

No account. No backend login. No watermarks.

---

## ✨ Features

### 📥 Import from Letterboxd
- Paste any public Letterboxd review URL (supports `boxd.it` short links too)
- Client-side scraping with a smart proxy rotator (AllOrigins → CorsProxy → CodeTabs → ThingProxy)
- Falls back to the [Microlink API](https://microlink.io) for maximum reliability
- Auto-fetches movie **director, poster, and backdrop** from TMDB

### ✍️ Custom Story Builder
- Manually enter any movie title, year, director, rating, review, and username
- Integrated **TMDB search** to auto-fill all movie details from a single query
- Interactive half-star rating picker

### 🎨 12 Story Templates
| Template | Vibe |
|---|---|
| **Bottom** | Classic caption-at-bottom layout |
| **Top Left** | Editorial, headline-first |
| **Centered** | Balanced, symmetrical |
| **Minimal** | Clean, typographic focus |
| **Polaroid** | Retro photo-frame look |
| **Magazine** | Bold, print-magazine feel |
| **Cinematic** | Wide letterbox bars |
| **Gradient** | Vibrant color wash |
| **Duotone** | Two-tone artistic effect |
| **Newspaper** | Old-school broadsheet grid |
| **Letterboxd** | Faithful to the LBD aesthetic |
| **Wrapped** | Spotify Wrapped–style recap card |

### 🎛️ Deep Customization
- **Font picker** — 100+ Google Fonts with live preview
- **Accent color** — full hex color picker
- **Text controls** — size, bold, italic, letter-spacing, line height, alignment, quote style
- **Backdrop controls** — blur, brightness, saturation sliders
- **Backdrop position** — drag X/Y to frame exactly the right part of the image
- **Multiple backdrops** — choose from all available TMDB images for the film
- **Custom backdrop upload** — use your own image as the background
- **Poster toggle** — show or hide the movie poster overlay
- **🎲 Randomize** — instantly generate a random template + font + accent color combo

### 💾 Export
- **Download** as a full-resolution 1080 × 1920 PNG via `html2canvas`
- **Share** via the Web Share API (mobile) or copy to clipboard (desktop)
- **Recent Reviews** gallery — your last 12 generated stories saved locally for one-click re-edit

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- A [TMDB API key](https://www.themoviedb.org/settings/api) (free)

### Installation

```bash
# Clone the repo
git clone https://github.com/raunak6531/storyboxd.git
cd storyboxd

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the root:

```env
TMDB_API_KEY=your_tmdb_api_key_here
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main application page & all state management
│   ├── layout.tsx            # Root layout, fonts, PWA metadata
│   ├── globals.css           # Global styles
│   └── api/
│       ├── movie-details/    # TMDB director + poster lookup
│       ├── movie-backdrops/  # TMDB backdrop images for a film
│       ├── tmdb-search/      # TMDB movie search
│       ├── proxy-image/      # Server-side image proxy (CORS bypass)
│       └── scrape/           # (Legacy) server-side scrape route
│
├── components/
│   ├── StoryControls.tsx     # Full customization sidebar
│   ├── FontPicker.tsx        # Google Fonts selector with live preview
│   ├── StoryTemplates.tsx    # Template type exports & shared types
│   ├── templates/            # 12 individual story template components
│   └── overlays/             # Shared overlay and badge components
│
└── lib/
    ├── clientScraper.ts      # Client-side Letterboxd scraper (proxy + Microlink)
    ├── processImage.ts       # Canvas-based image filter processing
    ├── useProcessedBackdrop.ts # React hook for live backdrop processing
    └── googleFontsList.ts    # Curated list of 100+ Google Fonts
```

---

## 🔧 How the Scraper Works

StoryBoxd scrapes entirely **client-side** — no server stores your data.

1. **Microlink API** is tried first. It reliably expands short URLs and returns structured OG metadata including the title, description (review text), and image.
2. If Microlink fails, a **proxy rotator** tries four public CORS proxies to fetch the raw Letterboxd HTML.
3. The HTML is parsed with `DOMParser`. Review data is extracted from **JSON-LD structured data** first, then falls back to meta tags and DOM selectors.
4. After scraping, a **TMDB API call** enriches the data with the director's name, a high-quality poster, and all available backdrop images.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Image export | `html2canvas` |
| Fonts | `next/font/google` |
| Movie data | TMDB API |
| Scraping | Microlink API + CORS proxies |
| PWA | `@ducanh2912/next-pwa` |

---

## 📱 PWA Support

StoryBoxd is a **Progressive Web App**. On mobile, tap *Add to Home Screen* from your browser menu to install it as a native-feeling app — no App Store required.

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-template`)
3. Commit your changes (`git commit -m 'Add AmazingTemplate'`)
4. Push to the branch (`git push origin feature/amazing-template`)
5. Open a Pull Request

---

## 📄 License

This project is for personal and educational use. Movie data is sourced from [TMDB](https://www.themoviedb.org) and review content belongs to respective Letterboxd users.

---

<div align="center">

Made with ♥ for film lovers

**[Letterboxd](https://letterboxd.com)** → **StoryBoxd** → **Instagram**

</div>
