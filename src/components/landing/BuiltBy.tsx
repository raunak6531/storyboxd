import { SITE } from '@/lib/site';
import { ContactLink } from './ContactLink';

export function BuiltBy() {
  const hasEmail = Boolean(SITE.email);
  const hasInstagram = Boolean(SITE.instagram);
  const hasGithub = Boolean(SITE.github);
  const hasLinkedin = Boolean(SITE.linkedin);
  const hasIssues = Boolean(SITE.issues);

  return (
    <section id="contact" className="py-24 border-t border-[#242424] scroll-mt-20">
      <div className="max-w-3xl">
        <span className="text-xs font-semibold tracking-widest uppercase text-[#00e054] mb-3 block">
          The Maker
        </span>
        <h2 className="font-anton text-[clamp(34px,5vw,56px)] leading-[1] uppercase tracking-[0.01em] mb-6 text-[#f2f2f2]">
          Built by a cinephile,<br />for cinephiles
        </h2>
        <div className="space-y-3 text-[#9b9b9b] text-base md:text-lg leading-relaxed mb-8">
          <p>
            I&apos;m {SITE.name}, a B.Tech student who logs every film I watch and built StoryBoxd because I wanted better stories.
          </p>
          <p>
            Got an idea, found a bug, or want to work together? Say hi.
          </p>
        </div>

        {/* Social link buttons row */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {hasEmail && (
            <ContactLink
              href={`mailto:${SITE.email}?subject=StoryBoxd`}
              channel="email"
              className="inline-flex items-center gap-2.5 min-h-[44px] px-4 py-2.5 rounded-xl border border-[#242424] bg-[#101010]/60 hover:bg-[#181818] hover:border-[#444] text-[#f2f2f2] text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00e054] focus-visible:outline-offset-2 active:scale-[0.98]"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <span>Email</span>
            </ContactLink>
          )}

          {hasInstagram && (
            <ContactLink
              href={SITE.instagram}
              channel="instagram"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 min-h-[44px] px-4 py-2.5 rounded-xl border border-[#242424] bg-[#101010]/60 hover:bg-[#181818] hover:border-[#444] text-[#f2f2f2] text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00e054] focus-visible:outline-offset-2 active:scale-[0.98]"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="4" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
              </svg>
              <span>Instagram</span>
            </ContactLink>
          )}

          {hasGithub && (
            <ContactLink
              href={SITE.github}
              channel="github"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 min-h-[44px] px-4 py-2.5 rounded-xl border border-[#242424] bg-[#101010]/60 hover:bg-[#181818] hover:border-[#444] text-[#f2f2f2] text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00e054] focus-visible:outline-offset-2 active:scale-[0.98]"
            >
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              <span>GitHub</span>
            </ContactLink>
          )}

          {hasLinkedin && (
            <ContactLink
              href={SITE.linkedin}
              channel="linkedin"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 min-h-[44px] px-4 py-2.5 rounded-xl border border-[#242424] bg-[#101010]/60 hover:bg-[#181818] hover:border-[#444] text-[#f2f2f2] text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00e054] focus-visible:outline-offset-2 active:scale-[0.98]"
            >
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <span>LinkedIn</span>
            </ContactLink>
          )}
        </div>

        {/* Primary green issue/feedback button */}
        {hasIssues && (
          <div>
            <ContactLink
              href={SITE.issues}
              channel="issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 min-h-[44px] px-6 py-3 rounded-xl bg-[#00e054] text-[#00200c] font-bold text-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,224,84,0.4)] active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00e054] focus-visible:outline-offset-2"
            >
              <span>Suggest a feature or report a bug</span>
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </ContactLink>
          </div>
        )}
      </div>
    </section>
  );
}

