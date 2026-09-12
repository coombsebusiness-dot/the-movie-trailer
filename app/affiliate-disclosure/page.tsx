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
      "Affiliate Disclosure",
    description:
      "The Movie Trailer affiliate disclosure explains how affiliate links, commercial relationships and sponsored content are handled.",
  };

export default function AffiliateDisclosurePage() {
  return (
    <main className="min-h-screen bg-[#050607] text-white">
      <SiteHeader />

      <BreakingBar />

      <section className="site-shell py-12 sm:py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <aside>
            <div className="lg:sticky lg:top-28">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#f21f2b]">
                Transparency
              </p>

              <h1 className="mt-4 max-w-lg text-5xl font-black leading-[0.9] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                AFFILIATE
                <br />
                <span className="text-[#f21f2b]">
                  DISCLOSURE.
                </span>
              </h1>

              <div className="mt-8 h-px w-20 bg-[#f21f2b]" />

              <p className="mt-8 max-w-sm text-sm font-bold uppercase leading-6 tracking-[0.08em] text-white/45">
                Affiliate Links ·
                Commercial Content ·
                Independence
              </p>

              <p className="mt-6 text-xs font-bold uppercase tracking-[0.08em] text-white/30">
                Last updated:
                September 2026
              </p>
            </div>
          </aside>

          <div className="max-w-3xl">
            <p className="text-xl font-bold leading-9 text-white/85 sm:text-2xl sm:leading-10">
              The Movie Trailer believes
              readers should know when a
              commercial relationship
              could generate revenue for
              the site.
            </p>

            <div className="my-10 border-t border-white/10" />

            <div className="space-y-10">
              <DisclosureSection
                eyebrow="01 · Affiliate Links"
                title="HOW AFFILIATE LINKS WORK"
              >
                <p>
                  Some pages on The Movie
                  Trailer may contain
                  affiliate links to
                  products, services,
                  retailers, streaming
                  platforms or other
                  third-party websites.
                </p>

                <p>
                  If you follow an
                  affiliate link and
                  subsequently make a
                  qualifying purchase or
                  complete another
                  qualifying action, The
                  Movie Trailer may
                  receive a commission
                  or referral fee.
                </p>

                <p>
                  Where applicable, this
                  does not normally
                  increase the price you
                  pay.
                </p>
              </DisclosureSection>

              <DisclosureSection
                eyebrow="02 · Editorial Independence"
                title="MONEY DOESN'T WRITE THE REVIEW"
              >
                <p>
                  The existence of an
                  affiliate relationship
                  does not determine our
                  editorial opinion.
                </p>

                <p>
                  Reviews, features,
                  recommendations and
                  editorial coverage are
                  not required to be
                  positive because an
                  affiliate relationship
                  exists.
                </p>

                <p>
                  Our editorial team
                  retains control over
                  the conclusions and
                  opinions published on
                  The Movie Trailer.
                </p>
              </DisclosureSection>

              <DisclosureSection
                eyebrow="03 · Recommendations"
                title="WHY WE LINK"
              >
                <p>
                  Commercial links may
                  be included when they
                  provide readers with a
                  useful way to find a
                  product, service,
                  movie, television
                  series or other item
                  discussed in our
                  coverage.
                </p>

                <p>
                  The presence of an
                  affiliate programme
                  should not be treated
                  as a guarantee or
                  endorsement of every
                  product or service
                  offered by the
                  relevant third party.
                </p>
              </DisclosureSection>

              <DisclosureSection
                eyebrow="04 · Sponsored Content"
                title="PAID MEANS LABELLED"
              >
                <p>
                  If The Movie Trailer
                  publishes content
                  created as part of a
                  paid sponsorship or
                  other commercial
                  arrangement, we aim to
                  identify that
                  relationship clearly
                  where required.
                </p>

                <p>
                  Sponsored material
                  should not be presented
                  to readers as
                  independent editorial
                  reporting when it is
                  not.
                </p>
              </DisclosureSection>

              <DisclosureSection
                eyebrow="05 · Screeners & Access"
                title="ACCESS IS NOT PAYMENT"
              >
                <p>
                  The Movie Trailer may
                  receive access to
                  screeners, press
                  screenings, premieres,
                  interviews, press
                  materials or other
                  promotional resources
                  from studios,
                  distributors,
                  publicists and
                  streaming services.
                </p>

                <p>
                  Providing editorial
                  access does not
                  guarantee coverage,
                  determine a review
                  score or require a
                  positive opinion.
                </p>
              </DisclosureSection>

              <DisclosureSection
                eyebrow="06 · Advertising"
                title="ADS & EDITORIAL"
              >
                <p>
                  The Movie Trailer may
                  display advertising or
                  work with advertising
                  partners.
                </p>

                <p>
                  Advertising
                  relationships do not
                  give advertisers
                  control over our
                  independent editorial
                  conclusions.
                </p>
              </DisclosureSection>

              <DisclosureSection
                eyebrow="07 · Third Parties"
                title="EXTERNAL WEBSITES"
              >
                <p>
                  Affiliate links and
                  other commercial links
                  can take you to
                  websites operated by
                  third parties.
                </p>

                <p>
                  Purchases,
                  subscriptions,
                  transactions and
                  services provided by
                  those websites are
                  governed by the terms
                  and policies of the
                  relevant third party.
                </p>
              </DisclosureSection>

              <DisclosureSection
                eyebrow="08 · Disclosure"
                title="TRANSPARENCY FOR READERS"
              >
                <p>
                  Where an article
                  contains affiliate
                  links or forms part of
                  a material commercial
                  relationship, we aim
                  to provide an
                  appropriate disclosure
                  so readers can make an
                  informed decision.
                </p>
              </DisclosureSection>

              <section className="border-t border-white/10 pt-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f21f2b]">
                  Questions
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-[-0.04em]">
                  COMMERCIAL ENQUIRIES
                </h2>

                <p className="mt-5 text-base leading-8 text-white/60">
                  If you have a question
                  about an affiliate
                  disclosure,
                  sponsorship or
                  commercial
                  relationship on The
                  Movie Trailer, please
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

function DisclosureSection({
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