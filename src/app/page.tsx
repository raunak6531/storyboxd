import type { Metadata } from 'next';
import Link from 'next/link';
import { DynamicIslandNav } from '@/components/landing/DynamicIslandNav';
import { HeroStoryCard } from '@/components/landing/HeroStoryCard';
import { TemplateGalleryLazy } from '@/components/landing/TemplateGalleryLazy';
import { FAQS } from '@/lib/faqData';

export const metadata: Metadata = {
  title: 'StoryBoxd: Turn Letterboxd reviews into Instagram Stories',
  description:
    'Paste a Letterboxd review link and get a styled Instagram Story with the poster, rating and your words. 12 templates, custom fonts, no account needed.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'StoryBoxd: Turn Letterboxd reviews into Instagram Stories',
    description:
      'Paste a Letterboxd review link and get a styled Instagram Story with the poster, rating and your words. 12 templates, custom fonts, no account needed.',
    url: '/',
    siteName: 'StoryBoxd',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StoryBoxd: Turn Letterboxd reviews into Instagram Stories',
    description:
      'Paste a Letterboxd review link and get a styled Instagram Story with the poster, rating and your words. 12 templates, custom fonts, no account needed.',
  },
};

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'StoryBoxd',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Any',
        offers: {
          '@type': 'Offer',
          price: 0,
          priceCurrency: 'USD',
        },
        description:
          'Paste a Letterboxd review link and get a styled Instagram Story with the poster, rating and your words. 12 templates, custom fonts, no account needed.',
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQS.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#f2f2f2] relative selection:bg-[#00e054] selection:text-[#00200c]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Atmospheric Background Glows & Film Grain */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(40% 35% at 0% 25%, rgba(0, 224, 84, 0.14), transparent 70%), radial-gradient(35% 30% at 100% 85%, rgba(255, 128, 0, 0.12), transparent 70%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Dynamic Island Header */}
      <DynamicIslandNav />

      <div className="relative z-10 max-w-[1120px] mx-auto px-6">
        <main>
          {/* Hero: Phone moved up, comma removed from heading */}
          <section className="grid grid-cols-1 md:grid-cols-[1.12fr_0.88fr] gap-10 lg:gap-14 items-start pt-20 pb-16 sm:pt-24 md:pt-28 md:pb-20">
            <div className="pt-2 md:pt-4">
              <h1 className="font-anton text-[clamp(48px,7.5vw,98px)] leading-[0.92] uppercase tracking-[0.005em] mb-6">
                Your Letterboxd review ready for <span className="text-[#00e054]">Instagram</span> Stories
              </h1>
              <p className="text-[18px] md:text-[19px] leading-[1.6] text-[#9b9b9b] max-w-[30em] mb-8">
                Paste a review link. StoryBoxd pulls in the poster, your rating and your words, then lets you restyle the story and download it in seconds.
              </p>

              {/* URL Form with Letterboxd 3-dot visual indicator */}
              <form
                action="/studio"
                method="get"
                className="flex items-center gap-2 bg-[#101010] border border-[#242424] hover:border-[#383838] rounded-2xl p-2 max-w-[540px] focus-within:border-[#00e054] focus-within:shadow-[0_0_0_4px_rgba(0,224,84,0.12)] transition-all duration-200"
              >
                <div className="flex items-center pl-3 pr-1 gap-1 flex-shrink-0" title="Letterboxd" aria-hidden="true">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff8000]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00e054]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#40bcf4]" />
                </div>
                <input
                  type="url"
                  name="url"
                  placeholder="Paste your Letterboxd review URL…"
                  aria-label="Letterboxd review URL"
                  required
                  className="flex-1 min-w-0 bg-transparent border-0 text-[#f2f2f2] px-2 py-2.5 text-sm md:text-base focus:outline-none placeholder:text-[#666]"
                />
                <button
                  type="submit"
                  className="bg-[#00e054] text-[#00200c] font-semibold text-sm md:text-base px-5 py-2.5 rounded-xl cursor-pointer whitespace-nowrap transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,224,84,0.3)] active:translate-y-0"
                >
                  Create story
                </button>
              </form>

              <p className="text-[#9b9b9b] text-sm mt-4 leading-relaxed">
                No account needed. No review link yet?{' '}
                <Link href="/studio" className="underline underline-offset-2 hover:text-[#f2f2f2]">
                  Start from scratch
                </Link>
                {', '}
                <a
                  href="/studio?url=https://letterboxd.com/filmfan/film/last-train-to-jaipur/"
                  className="text-[#00e054] hover:underline underline-offset-2 font-medium"
                >
                  try demo review
                </a>
                {', or '}
                <a href="#how" className="underline underline-offset-2 hover:text-[#f2f2f2]">
                  see how it works
                </a>
                .
              </p>
            </div>

            {/* Right: Phone elevated to sit neatly with the headline */}
            <div className="flex justify-center md:justify-end md:sticky md:top-24 md:-mt-2 lg:-mt-4">
              <HeroStoryCard />
            </div>
          </section>

          {/* How It Works */}
          <section id="how" className="py-20 border-t border-[#242424]">
            <h2 className="font-anton text-[clamp(34px,5vw,56px)] leading-[1] uppercase tracking-[0.01em] mb-10 max-w-[14em]">
              From review to story in three steps
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#101010]/50 border border-[#242424] rounded-2xl p-7 hover:border-[#333] transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#00e054] text-[#00200c] font-bold grid place-items-center mb-5 text-lg shadow-[0_0_16px_rgba(0,224,84,0.3)]">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2 text-[#f2f2f2]">Paste your review link</h3>
                <p className="text-[#9b9b9b] leading-relaxed text-sm">
                  Copy the address of any Letterboxd review, like{' '}
                  <code className="bg-[#181818] border border-[#2a2a2a] px-1.5 py-0.5 rounded text-xs text-[#00e054] break-all">
                    letterboxd.com/username/film/film-name/
                  </code>
                  .
                </p>
              </div>

              <div className="bg-[#101010]/50 border border-[#242424] rounded-2xl p-7 hover:border-[#333] transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#00e054] text-[#00200c] font-bold grid place-items-center mb-5 text-lg shadow-[0_0_16px_rgba(0,224,84,0.3)]">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2 text-[#f2f2f2]">Pick a look</h3>
                <p className="text-[#9b9b9b] leading-relaxed text-sm">
                  Choose one of 12 templates, then change the font, colors, backdrop and text alignment.
                </p>
              </div>

              <div className="bg-[#101010]/50 border border-[#242424] rounded-2xl p-7 hover:border-[#333] transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#00e054] text-[#00200c] font-bold grid place-items-center mb-5 text-lg shadow-[0_0_16px_rgba(0,224,84,0.3)]">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2 text-[#f2f2f2]">Download or share</h3>
                <p className="text-[#9b9b9b] leading-relaxed text-sm">
                  Save the image or share it straight from your phone to Instagram.
                </p>
              </div>
            </div>
          </section>

          {/* Template Gallery */}
          <section id="templates" className="py-20 border-t border-[#242424]">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="font-anton text-[clamp(34px,5vw,56px)] leading-[1] uppercase tracking-[0.01em] mb-2">
                  Every template, one click
                </h2>
                <p className="text-[#9b9b9b] text-base">
                  Handcrafted 1080×1920 layouts inspired by cinema posters, broadsheets, and editorial magazines.
                </p>
              </div>
            </div>
            <TemplateGalleryLazy />
          </section>

          {/* Features and Formats */}
          <section id="features" className="py-20 border-t border-[#242424]">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-12 md:gap-16">
              <div>
                <h2 className="font-anton text-[clamp(34px,5vw,56px)] leading-[1] uppercase tracking-[0.01em] mb-4">
                  Made for people who log every film
                </h2>
                <p className="text-[18px] text-[#9b9b9b] mb-8">
                  Every size you post in, with the details cinephiles care about.
                </p>

                <div className="flex gap-4 items-end" aria-label="Supported formats">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className="border-2 border-[#00e054] bg-[#00e054]/5 text-[#00e054] rounded-lg grid place-items-center text-xs font-bold shadow-[0_0_16px_rgba(0,224,84,0.2)]"
                      style={{ width: '54px', height: '96px' }}
                    >
                      9:16
                    </div>
                    <span className="text-[11px] font-semibold text-[#00e054]">Story</span>
                  </div>

                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className="border-2 border-[#444] hover:border-[#666] text-[#9b9b9b] rounded-lg grid place-items-center text-xs font-medium transition-colors"
                      style={{ width: '72px', height: '90px' }}
                    >
                      4:5
                    </div>
                    <span className="text-[11px] text-[#666]">Portrait</span>
                  </div>

                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className="border-2 border-[#444] hover:border-[#666] text-[#9b9b9b] rounded-lg grid place-items-center text-xs font-medium transition-colors"
                      style={{ width: '80px', height: '80px' }}
                    >
                      1:1
                    </div>
                    <span className="text-[11px] text-[#666]">Square</span>
                  </div>

                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className="border-2 border-[#444] hover:border-[#666] text-[#9b9b9b] rounded-lg grid place-items-center text-xs font-medium transition-colors"
                      style={{ width: '112px', height: '63px' }}
                    >
                      16:9
                    </div>
                    <span className="text-[11px] text-[#666]">Cinema</span>
                  </div>
                </div>
              </div>

              <ul className="list-none m-0 p-0">
                <li className="py-5 border-t border-[#242424] flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-[#141414] border border-[#2a2a2a] text-[#00e054] grid place-items-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </div>
                  <div>
                    <strong className="block text-lg font-semibold mb-0.5 text-[#f2f2f2]">
                      Four formats
                    </strong>
                    <span className="text-[#9b9b9b] text-sm">
                      Story, portrait, square and landscape, exported at full 1080 px width.
                    </span>
                  </div>
                </li>

                <li className="py-5 border-t border-[#242424] flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-[#141414] border border-[#2a2a2a] text-[#00e054] grid place-items-center flex-shrink-0 mt-1">
                    <span className="font-bold text-sm font-serif">Ag</span>
                  </div>
                  <div>
                    <strong className="block text-lg font-semibold mb-0.5 text-[#f2f2f2]">
                      Any Google Font
                    </strong>
                    <span className="text-[#9b9b9b] text-sm">
                      Search the library and set your review in the typeface that fits the film.
                    </span>
                  </div>
                </li>

                <li className="py-5 border-t border-[#242424] flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-[#141414] border border-[#2a2a2a] text-[#00e054] grid place-items-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <strong className="block text-lg font-semibold mb-0.5 text-[#f2f2f2]">
                      Backdrops from the film
                    </strong>
                    <span className="text-[#9b9b9b] text-sm">
                      Choose from the movie’s own backdrops and adjust how they sit behind your text.
                    </span>
                  </div>
                </li>

                <li className="py-5 border-t border-[#242424] flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-[#141414] border border-[#2a2a2a] text-[#00e054] grid place-items-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div>
                    <strong className="block text-lg font-semibold mb-0.5 text-[#f2f2f2]">
                      Write without a link
                    </strong>
                    <span className="text-[#9b9b9b] text-sm">
                      Switch to Custom mode to make a story for a film you haven’t reviewed yet.
                    </span>
                  </div>
                </li>

                <li className="py-5 border-t border-b border-[#242424] flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-[#141414] border border-[#2a2a2a] text-[#00e054] grid place-items-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <strong className="block text-lg font-semibold mb-0.5 text-[#f2f2f2]">
                      Drafts saved on your device
                    </strong>
                    <span className="text-[#9b9b9b] text-sm">
                      Come back later and keep editing. Nothing is uploaded to an account.
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="py-20 border-t border-[#242424]">
            <h2 className="font-anton text-[clamp(34px,5vw,56px)] leading-[1] uppercase tracking-[0.01em] mb-10">
              Questions
            </h2>

            <div className="divide-y divide-[#242424] border-t border-b border-[#242424]">
              {FAQS.map((faq, index) => (
                <details
                  key={faq.question}
                  open={index === 0}
                  className="group py-5"
                >
                  <summary className="cursor-pointer font-semibold text-lg list-none flex justify-between items-center gap-4 text-[#f2f2f2] hover:text-[#00e054] transition-colors">
                    <span>{faq.question}</span>
                    <span className="text-[#00e054] text-2xl font-normal leading-none transition-transform group-open:hidden">
                      +
                    </span>
                    <span className="text-[#00e054] text-2xl font-normal leading-none hidden group-open:inline">
                      –
                    </span>
                  </summary>
                  <p className="text-[#9b9b9b] mt-3 max-w-[42em] leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-24 border-t border-[#242424] text-center relative overflow-hidden">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 bg-[#00e054]/10 rounded-full blur-[100px] pointer-events-none"
              aria-hidden="true"
            />
            <div className="relative z-10">
              <span className="text-xs font-semibold tracking-widest uppercase text-[#00e054] mb-3 block">
                Editorial Film Cards • Zero Watermarks
              </span>
              <h2 className="font-anton text-[clamp(36px,5.5vw,64px)] leading-[1] uppercase tracking-[0.01em] mx-auto mb-8 max-w-xl">
                Logged a film tonight? Make it a story.
              </h2>
              <Link
                href="/studio"
                className="inline-flex items-center gap-2.5 bg-[#00e054] text-[#00200c] font-bold text-lg px-9 py-4 rounded-xl transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,224,84,0.4)] active:translate-y-0"
              >
                <span>Create a story</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="py-8 pb-12 border-t border-[#242424] text-[#9b9b9b] text-sm flex justify-between items-center gap-4 flex-wrap">
          <span>© 2026 StoryBoxd. Not affiliated with Letterboxd.</span>
          <div className="flex items-center gap-6">
            <Link
              href="/guide/letterboxd-review-to-instagram-story"
              className="hover:text-[#f2f2f2] transition-colors"
            >
              How-to Guide
            </Link>
            <span>Built by a cinephile, for cinephiles.</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
