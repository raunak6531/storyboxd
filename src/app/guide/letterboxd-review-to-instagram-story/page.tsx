import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How to Share a Letterboxd Review on Instagram Stories | StoryBoxd Guide',
  description:
    'A step-by-step guide on how to turn any Letterboxd review into a formatted 1080×1920 Instagram Story with film backdrops, star ratings, and custom fonts.',
  alternates: {
    canonical: '/guide/letterboxd-review-to-instagram-story',
  },
  openGraph: {
    title: 'How to Share a Letterboxd Review on Instagram Stories',
    description:
      'Turn your Letterboxd review into an Instagram Story in seconds using StoryBoxd.',
    url: '/guide/letterboxd-review-to-instagram-story',
    type: 'article',
  },
};

export default function GuidePage() {
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'How to share a Letterboxd review on Instagram Stories',
    description:
      'A complete guide to turning Letterboxd film reviews into high-resolution Instagram Story images.',
    author: {
      '@type': 'Organization',
      name: 'StoryBoxd',
    },
    publisher: {
      '@type': 'Organization',
      name: 'StoryBoxd',
    },
    datePublished: '2026-01-15T00:00:00Z',
    dateModified: '2026-10-28T00:00:00Z',
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#f2f2f2] relative selection:bg-[#00e054] selection:text-[#00200c]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(40% 35% at 0% 25%, rgba(0, 224, 84, 0.12), transparent 70%), radial-gradient(35% 30% at 100% 85%, rgba(255, 128, 0, 0.1), transparent 70%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-[800px] mx-auto px-6 py-12">
        <header className="mb-12">
          <nav className="flex items-center justify-between mb-8 pb-4 border-b border-[#242424]">
            <Link href="/" className="font-bold text-2xl tracking-[-0.04em] text-[#f2f2f2]">
              Story<b className="text-[#00e054]">Boxd</b>
            </Link>
            <Link
              href="/studio"
              className="inline-block bg-[#00e054] text-[#00200c] font-semibold px-4 py-2 rounded-xl text-sm transition-transform duration-150 hover:-translate-y-0.5"
            >
              Open studio
            </Link>
          </nav>

          <h1 className="font-anton text-[clamp(36px,6vw,68px)] uppercase leading-[0.95] tracking-[0.01em] mb-6">
            How to share a Letterboxd review on Instagram Stories
          </h1>
          <p className="text-[#9b9b9b] text-lg leading-relaxed">
            Letterboxd is the gold standard for tracking your cinema diary, but sharing your reviews directly to Instagram often leaves you with an awkward square snippet or a tiny screenshot. Here is how you can transform any Letterboxd log into an editorial vertical story card.
          </p>

          <div className="mt-6 p-4 rounded-xl bg-[#101010] border border-[#242424] flex items-center justify-between flex-wrap gap-4">
            <span className="text-sm text-[#9b9b9b]">Ready to format your review right now?</span>
            <Link
              href="/studio"
              className="text-sm font-semibold text-[#00e054] hover:underline"
            >
              Go straight to StoryBoxd Studio →
            </Link>
          </div>
        </header>

        <main className="space-y-10 text-[#f2f2f2] text-base leading-relaxed">
          <section className="space-y-4">
            <h2 className="font-anton text-2xl uppercase tracking-wide text-[#f2f2f2]">
              Why vertical cards matter for cinephiles
            </h2>
            <p className="text-[#9b9b9b]">
              Instagram Stories dominate how friends and film communities discuss recent watches. A standard mobile screenshot crops the film poster, truncates long reflections, and lacks high-resolution cinematic backdrops. Using dedicated 9:16 vertical styling ensures your star rating, review text, and visual artwork appear exactly as intended on full mobile screens.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="font-anton text-2xl uppercase tracking-wide text-[#f2f2f2]">
              Step-by-step instructions
            </h2>

            <ol className="space-y-6 list-decimal pl-6 text-[#9b9b9b]">
              <li className="pl-2">
                <strong className="text-[#f2f2f2] block mb-1">Copy your review URL from Letterboxd</strong>
                Open Letterboxd in your browser or mobile app. Navigate to the review you want to share, tap the share icon, and select <span className="text-[#f2f2f2]">Copy Link</span>. The address will look like <code className="text-xs bg-[#101010] px-2 py-1 rounded border border-[#242424] text-[#f2f2f2]">letterboxd.com/username/film/movie-title/</code>.
              </li>

              <li className="pl-2">
                <strong className="text-[#f2f2f2] block mb-1">Open StoryBoxd Studio and paste your link</strong>
                Head to <Link href="/studio" className="text-[#00e054] underline underline-offset-4">StoryBoxd Studio</Link>. Paste your copied link into the input field and press <span className="text-[#f2f2f2]">Create Story</span>. StoryBoxd automatically parses the official film title, release year, star rating, your written words, and fetches high-resolution posters and stills.
              </li>

              <li className="pl-2">
                <strong className="text-[#f2f2f2] block mb-1">Select an editorial template</strong>
                Browse the 12 handcrafted layouts. For quiet indie films, the <span className="text-[#f2f2f2]">Minimal</span> template gives maximum space to your thoughts. For 35mm classics, try <span className="text-[#f2f2f2]">Polaroid</span> or <span className="text-[#f2f2f2]">Newspaper</span>. For blockbusters, <span className="text-[#f2f2f2]">Cinematic</span> offers letterboxed stills with bold title typography.
              </li>

              <li className="pl-2">
                <strong className="text-[#f2f2f2] block mb-1">Fine-tune backdrops and typography</strong>
                Choose from alternative official movie backdrops pulled directly from TMDB, or upload your own favorite still. You can adjust background blur, dimming brightness, and font pairings to give your card a bespoke look that matches the mood of the film.
              </li>

              <li className="pl-2">
                <strong className="text-[#f2f2f2] block mb-1">Download and share to Instagram</strong>
                Tap <span className="text-[#f2f2f2]">Download</span> to save the crisp 1080×1920 PNG to your camera roll, or tap <span className="text-[#f2f2f2]">Share</span> on your phone to open Instagram Stories directly.
              </li>
            </ol>
          </section>

          <section className="space-y-4 pt-4 border-t border-[#242424]">
            <h2 className="font-anton text-2xl uppercase tracking-wide text-[#f2f2f2]">
              Can you write a story without a published review?
            </h2>
            <p className="text-[#9b9b9b]">
              Yes. If you walked out of the theater and want to post thoughts immediately before writing a full diary entry on Letterboxd, switch to <span className="text-[#f2f2f2]">Custom</span> mode in StoryBoxd. Search the film title to fetch authentic artwork, type your instant reaction, and export your image in seconds.
            </p>
          </section>

          <section className="p-8 rounded-2xl bg-[#101010] border border-[#242424] text-center space-y-4">
            <h2 className="font-anton text-3xl uppercase tracking-wide text-[#f2f2f2]">
              Ready to create your story?
            </h2>
            <p className="text-[#9b9b9b] max-w-md mx-auto">
              No account required and no watermarks added. Your drafts stay privately on your device.
            </p>
            <div>
              <Link
                href="/studio"
                className="inline-block bg-[#00e054] text-[#00200c] font-bold px-6 py-3 rounded-xl transition-transform duration-150 hover:-translate-y-0.5 shadow-lg shadow-[#00e054]/20"
              >
                Open StoryBoxd Studio
              </Link>
            </div>
          </section>
        </main>

        <footer className="mt-16 pt-8 border-t border-[#242424] flex items-center justify-between text-sm text-[#9b9b9b] flex-wrap gap-4">
          <Link href="/" className="hover:text-[#f2f2f2]">← Back to home</Link>
          <span>© 2026 StoryBoxd. Not affiliated with Letterboxd.</span>
        </footer>
      </div>
    </div>
  );
}

