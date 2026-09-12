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
      "Cookie Policy",
    description:
      "The Movie Trailer cookie policy explaining how cookies and similar technologies may be used on our website.",
  
  alternates: {
    canonical:
      "/cookies",
  },
  };


export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-[#050607] text-white">
      <SiteHeader />

      <BreakingBar />

      <section className="site-shell py-12 sm:py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <aside>
            <div className="lg:sticky lg:top-28">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#f21f2b]">
                Website Data
              </p>

              <h1 className="mt-4 max-w-lg text-5xl font-black leading-[0.9] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                COOKIE
                <br />
                <span className="text-[#f21f2b]">
                  POLICY.
                </span>
              </h1>

              <div className="mt-8 h-px w-20 bg-[#f21f2b]" />

              <p className="mt-8 max-w-sm text-sm font-bold uppercase leading-6 tracking-[0.08em] text-white/45">
                Cookies · Analytics ·
                Preferences · Consent
              </p>

              <p className="mt-6 text-xs font-bold uppercase tracking-[0.08em] text-white/30">
                Last updated:
                September 2026
              </p>
            </div>
          </aside>

          <div className="max-w-3xl">
            <p className="text-xl font-bold leading-9 text-white/85 sm:text-2xl sm:leading-10">
              This Cookie Policy
              explains how The Movie
              Trailer may use cookies
              and similar technologies
              when you visit our
              website.
            </p>

            <div className="my-10 border-t border-white/10" />

            <div className="space-y-10">
              <CookieSection
                eyebrow="01 · Cookies"
                title="WHAT IS A COOKIE?"
              >
                <p>
                  Cookies are small
                  pieces of information
                  that websites can
                  store on your device
                  when you visit them.
                </p>

                <p>
                  They can be used for
                  purposes such as
                  making websites work,
                  remembering
                  preferences,
                  understanding how a
                  site is used and
                  supporting services
                  provided by third
                  parties.
                </p>
              </CookieSection>

              <CookieSection
                eyebrow="02 · Essential"
                title="STRICTLY NECESSARY COOKIES"
              >
                <p>
                  Some cookies or
                  similar technologies
                  may be necessary for
                  the website to
                  function correctly,
                  maintain security or
                  remember choices
                  required to provide
                  a service you have
                  requested.
                </p>

                <p>
                  These technologies
                  are generally used
                  only where necessary
                  for the operation of
                  the website.
                </p>
              </CookieSection>

              <CookieSection
                eyebrow="03 · Analytics"
                title="MEASURING WEBSITE USE"
              >
                <p>
                  The Movie Trailer may
                  use analytics
                  technologies to help
                  us understand how
                  visitors use the
                  website.
                </p>

                <p>
                  This can include
                  information such as
                  which pages are
                  visited, how visitors
                  reached the site,
                  general device
                  information and how
                  people interact with
                  different parts of
                  the website.
                </p>

                <p>
                  We use this
                  information to
                  understand our
                  audience and improve
                  the site.
                </p>
              </CookieSection>

              <CookieSection
                eyebrow="04 · Preferences"
                title="REMEMBERING YOUR CHOICES"
              >
                <p>
                  Preference
                  technologies may be
                  used to remember
                  choices you make on
                  the website, such as
                  cookie preferences or
                  other settings.
                </p>
              </CookieSection>

              <CookieSection
                eyebrow="05 · Embedded Content"
                title="TRAILERS & THIRD-PARTY MEDIA"
              >
                <p>
                  The Movie Trailer may
                  embed content from
                  third-party services,
                  including video
                  platforms and social
                  media services.
                </p>

                <p>
                  These providers may
                  place or access
                  cookies when their
                  content is loaded or
                  when you interact
                  with it. Any such
                  cookies are
                  controlled by the
                  relevant third party
                  and are subject to
                  its own policies.
                </p>
              </CookieSection>

              <CookieSection
                eyebrow="06 · Advertising"
                title="ADVERTISING TECHNOLOGIES"
              >
                <p>
                  The Movie Trailer may
                  use advertising
                  services in the
                  future. Advertising
                  providers may use
                  cookies or similar
                  technologies to
                  measure advertising,
                  prevent fraud and,
                  where permitted,
                  provide advertising
                  relevant to users.
                </p>

                <p>
                  Where applicable,
                  non-essential
                  advertising
                  technologies will be
                  subject to consent
                  requirements under
                  relevant law.
                </p>
              </CookieSection>

              <CookieSection
                eyebrow="07 · Affiliate Links"
                title="COMMERCIAL LINKS"
              >
                <p>
                  Some pages may contain
                  affiliate links.
                  Clicking an affiliate
                  link can allow the
                  relevant retailer or
                  affiliate network to
                  recognise that a
                  visitor arrived from
                  The Movie Trailer.
                </p>

                <p>
                  Third-party affiliate
                  services may use their
                  own cookies or
                  tracking technologies
                  in accordance with
                  their own policies.
                </p>
              </CookieSection>

              <CookieSection
                eyebrow="08 · Consent"
                title="YOUR CHOICES"
              >
                <p>
                  Where consent is
                  required by applicable
                  law, non-essential
                  cookies should not be
                  used until the
                  required permission
                  has been obtained.
                </p>

                <p>
                  You may also be able
                  to control or delete
                  cookies using your
                  browser settings.
                  Blocking some
                  technologies can
                  affect the way
                  certain website
                  features operate.
                </p>
              </CookieSection>

              <CookieSection
                eyebrow="09 · Third Parties"
                title="SERVICES WE DO NOT CONTROL"
              >
                <p>
                  Third-party websites
                  and services linked
                  from The Movie
                  Trailer may use
                  cookies independently
                  of us.
                </p>

                <p>
                  We do not control the
                  cookies placed
                  directly by external
                  websites after you
                  leave The Movie
                  Trailer.
                </p>
              </CookieSection>

              <CookieSection
                eyebrow="10 · Changes"
                title="UPDATES TO THIS POLICY"
              >
                <p>
                  We may update this
                  Cookie Policy when
                  the technologies or
                  services used by The
                  Movie Trailer change,
                  or when legal
                  requirements change.
                </p>

                <p>
                  The current version
                  will be published on
                  this page.
                </p>
              </CookieSection>

              <section className="border-t border-white/10 pt-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f21f2b]">
                  Questions
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-[-0.04em]">
                  COOKIE & PRIVACY
                  ENQUIRIES
                </h2>

                <p className="mt-5 text-base leading-8 text-white/60">
                  If you have questions
                  about cookies,
                  tracking technologies
                  or privacy on The
                  Movie Trailer, please
                  contact us.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <a
                    href="/contact"
                    className="inline-flex border border-[#f21f2b] bg-[#f21f2b] px-6 py-3 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-transparent"
                  >
                    Contact Us →
                  </a>

                  <a
                    href="/privacy"
                    className="inline-flex border border-white/15 px-6 py-3 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:border-white/40"
                  >
                    Privacy Policy →
                  </a>
                </div>
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

function CookieSection({
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