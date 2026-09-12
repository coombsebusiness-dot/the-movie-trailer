import type {
  Metadata,
} from "next";

import BreakingBar from "@/components/site/BreakingBar";
import NewsletterSignup from "@/components/home/NewsletterSignup";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";

export const metadata:
  Metadata = {
    title:
      "Terms & Conditions",
    description:
      "Terms and conditions governing the use of The Movie Trailer website, content, links, intellectual property and services.",
  
  alternates: {
    canonical:
      "/terms",
  },
  };

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#050607] text-white">
      <SiteHeader />

      <BreakingBar />

      <section className="site-shell py-12 sm:py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <aside>
            <div className="lg:sticky lg:top-28">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#f21f2b]">
                Website Terms
              </p>

              <h1 className="mt-4 max-w-lg text-5xl font-black leading-[0.9] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                TERMS &
                <br />
                <span className="text-[#f21f2b]">
                  CONDITIONS.
                </span>
              </h1>

              <div className="mt-8 h-px w-20 bg-[#f21f2b]" />

              <p className="mt-8 max-w-sm text-sm font-bold uppercase leading-6 tracking-[0.08em] text-white/45">
                Access · Content ·
                Copyright · Liability
              </p>

              <p className="mt-6 text-xs font-bold uppercase tracking-[0.08em] text-white/30">
                Last updated:
                September 2026
              </p>
            </div>
          </aside>

          <div className="max-w-3xl">
            <p className="text-xl font-bold leading-9 text-white/85 sm:text-2xl sm:leading-10">
              These Terms & Conditions
              govern your use of The
              Movie Trailer website.
              By using the site, you
              agree to use it lawfully
              and in accordance with
              these terms.
            </p>

            <div className="my-10 border-t border-white/10" />

            <div className="space-y-10">
              <TermsSection
                eyebrow="01 · The Website"
                title="ABOUT THESE TERMS"
              >
                <p>
                  The Movie Trailer is
                  an independent
                  entertainment
                  publication providing
                  movie and television
                  news, trailers,
                  reviews, features,
                  release information
                  and related editorial
                  content.
                </p>

                <p>
                  These terms apply when
                  you access or use the
                  website and its
                  content.
                </p>
              </TermsSection>

              <TermsSection
                eyebrow="02 · Editorial Content"
                title="INFORMATION & OPINION"
              >
                <p>
                  We aim to keep factual
                  information accurate
                  and current, but the
                  entertainment industry
                  changes rapidly.
                  Release dates,
                  production plans,
                  casting information
                  and other details may
                  change after an article
                  has been published.
                </p>

                <p>
                  Reviews, commentary
                  and other opinion
                  material represent
                  editorial opinions and
                  should not be treated
                  as statements of
                  objective fact.
                </p>
              </TermsSection>

              <TermsSection
                eyebrow="03 · No Guarantee"
                title="AVAILABILITY & ACCURACY"
              >
                <p>
                  The website and its
                  content are provided
                  on an as-available
                  basis.
                </p>

                <p>
                  While we make
                  reasonable efforts to
                  provide reliable
                  information, we cannot
                  guarantee that every
                  page will always be
                  complete, error-free,
                  continuously available
                  or up to date.
                </p>
              </TermsSection>

              <TermsSection
                eyebrow="04 · Copyright"
                title="OUR CONTENT"
              >
                <p>
                  Unless otherwise
                  stated, original text,
                  branding, site design
                  and other original
                  material created for
                  The Movie Trailer may
                  be protected by
                  copyright and other
                  intellectual property
                  rights.
                </p>

                <p>
                  You may link to our
                  publicly available
                  articles and share
                  reasonable excerpts
                  for legitimate
                  commentary or
                  reference, provided
                  The Movie Trailer is
                  appropriately
                  credited.
                </p>

                <p>
                  You may not reproduce,
                  republish, scrape,
                  systematically copy or
                  commercially
                  redistribute
                  substantial portions
                  of our original
                  content without
                  permission, except
                  where permitted by
                  law.
                </p>
              </TermsSection>

              <TermsSection
                eyebrow="05 · Third-Party Material"
                title="MOVIES, TRAILERS & IMAGES"
              >
                <p>
                  Film and television
                  titles, characters,
                  trademarks, posters,
                  stills, trailers and
                  other third-party
                  materials remain the
                  property of their
                  respective rights
                  holders.
                </p>

                <p>
                  Their appearance on
                  The Movie Trailer does
                  not imply ownership by
                  us or endorsement by
                  the relevant rights
                  holder unless
                  explicitly stated.
                </p>
              </TermsSection>

              <TermsSection
                eyebrow="06 · External Links"
                title="OTHER WEBSITES"
              >
                <p>
                  The Movie Trailer may
                  link to external
                  websites for sourcing,
                  attribution, further
                  information,
                  streaming services,
                  products or other
                  useful resources.
                </p>

                <p>
                  We do not control
                  third-party websites
                  and are not responsible
                  for their content,
                  availability, security
                  or privacy practices.
                </p>
              </TermsSection>

              <TermsSection
                eyebrow="07 · Trailers & Embeds"
                title="THIRD-PARTY SERVICES"
              >
                <p>
                  Some pages may include
                  video players, social
                  media posts or other
                  content embedded from
                  third-party platforms.
                </p>

                <p>
                  Your interaction with
                  those services may be
                  governed by the terms
                  and privacy policies
                  of the relevant
                  provider.
                </p>
              </TermsSection>

              <TermsSection
                eyebrow="08 · Acceptable Use"
                title="USE THE SITE LAWFULLY"
              >
                <p>
                  You must not attempt
                  to interfere with the
                  operation or security
                  of the website, gain
                  unauthorised access to
                  systems or data, use
                  the site to distribute
                  malicious software, or
                  use automated methods
                  in a way that
                  materially disrupts
                  the service.
                </p>
              </TermsSection>

              <TermsSection
                eyebrow="09 · Commercial Links"
                title="AFFILIATE & SPONSORED CONTENT"
              >
                <p>
                  Some content may
                  contain affiliate
                  links or other
                  commercial
                  relationships. Where
                  appropriate, these
                  relationships will be
                  disclosed.
                </p>

                <p>
                  Editorial opinions are
                  not determined by
                  affiliate partners,
                  advertisers, studios
                  or other commercial
                  organisations.
                </p>
              </TermsSection>

              <TermsSection
                eyebrow="10 · Liability"
                title="USE OF THE WEBSITE"
              >
                <p>
                  Nothing in these terms
                  excludes or limits
                  liability where doing
                  so would be unlawful.
                </p>

                <p>
                  To the extent
                  permitted by law, The
                  Movie Trailer is not
                  responsible for losses
                  arising solely from
                  reliance on general
                  entertainment
                  information, changes
                  made by third parties,
                  external websites or
                  interruptions outside
                  our reasonable
                  control.
                </p>
              </TermsSection>

              <TermsSection
                eyebrow="11 · Changes"
                title="UPDATES TO THESE TERMS"
              >
                <p>
                  We may update these
                  Terms & Conditions as
                  the website, its
                  services or applicable
                  requirements change.
                </p>

                <p>
                  The current version
                  will be published on
                  this page.
                </p>
              </TermsSection>

              <TermsSection
                eyebrow="12 · Law"
                title="GOVERNING LAW"
              >
                <p>
                  These terms are
                  governed by the laws
                  of England and Wales,
                  subject to any
                  mandatory rights you
                  may have under
                  applicable consumer
                  or other law.
                </p>
              </TermsSection>

              <section className="border-t border-white/10 pt-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f21f2b]">
                  Questions
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-[-0.04em]">
                  CONTACT US
                </h2>

                <p className="mt-5 text-base leading-8 text-white/60">
                  If you have a question
                  about these terms or
                  the use of content
                  published by The Movie
                  Trailer, please
                  contact us.
                </p>

                <a
                  href="/contact"
                  className="mt-7 inline-flex border border-[#f21f2b] bg-[#f21f2b] px-6 py-3 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-transparent"
                >
                  Contact Us →
                </a>
              </section>
            </div>
          </div>
        </div>
      </section>

      <NewsletterSignup />

      <SiteFooter />
    </main>
  );
}

function TermsSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children:
    React.ReactNode;
}) {
  return (
    <section className="border-t border-white/10 pt-10 first:border-t-0 first:pt-0">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f21f2b]">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-3xl font-black tracking-[-0.04em]">
        {title}
      </h2>

      <div className="mt-5 space-y-5 text-base leading-8 text-white/60">
        {children}
      </div>
    </section>
  );
}