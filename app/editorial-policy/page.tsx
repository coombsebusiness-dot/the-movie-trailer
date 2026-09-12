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
      "Editorial Policy",
    description:
      "The Movie Trailer editorial policy covering accuracy, sourcing, breaking news, corrections, reviews, rumours, independence and AI-assisted editorial tools.",
 
   alternates: {
      canonical:
        "/editorial-policy",
    },
  };

export default function EditorialPolicyPage() {
  return (
    <main className="min-h-screen bg-[#050607] text-white">
      <SiteHeader />

      <BreakingBar />

      <section className="site-shell py-12 sm:py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <aside>
            <div className="lg:sticky lg:top-28">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#f21f2b]">
                Standards
              </p>

              <h1 className="mt-4 max-w-lg text-5xl font-black leading-[0.9] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                EDITORIAL
                <br />
                <span className="text-[#f21f2b]">
                  POLICY.
                </span>
              </h1>

              <div className="mt-8 h-px w-20 bg-[#f21f2b]" />

              <p className="mt-8 max-w-sm text-sm font-bold uppercase leading-6 tracking-[0.08em] text-white/45">
                Accuracy · Sourcing ·
                Independence ·
                Corrections
              </p>
            </div>
          </aside>

          <div className="max-w-3xl">
            <p className="text-xl font-bold leading-9 text-white/85 sm:text-2xl sm:leading-10">
              The Movie Trailer aims to
              publish fast, useful and
              accurate entertainment
              journalism while being
              transparent about where
              information comes from.
            </p>

            <div className="my-10 border-t border-white/10" />

            <div className="space-y-10">
              <PolicySection
                eyebrow="01 · Accuracy"
                title="GET IT RIGHT"
              >
                <p>
                  Accuracy takes priority
                  over being first. We
                  make reasonable efforts
                  to verify factual
                  information before
                  publication and aim to
                  represent sources,
                  statements and
                  announcements
                  accurately.
                </p>

                <p>
                  Entertainment stories
                  can develop quickly.
                  When new information
                  materially changes a
                  story, we may update
                  the article to reflect
                  the latest confirmed
                  details.
                </p>
              </PolicySection>

              <PolicySection
                eyebrow="02 · Sources"
                title="CREDIT THE REPORTING"
              >
                <p>
                  Where information comes
                  from another
                  publication, reporter,
                  interview, official
                  announcement or other
                  identifiable source,
                  we aim to make that
                  origin clear.
                </p>

                <p>
                  When another outlet
                  breaks a story, we
                  believe the original
                  reporting should be
                  credited and, where
                  appropriate, linked.
                  We do not present
                  another publication&apos;s
                  original reporting as
                  our own.
                </p>
              </PolicySection>

              <PolicySection
                eyebrow="03 · Breaking News"
                title="SPEED WITHOUT GUESSWORK"
              >
                <p>
                  Breaking entertainment
                  news often changes
                  rapidly. Early reports
                  may contain incomplete
                  information, so we
                  distinguish between
                  confirmed facts and
                  developing details.
                </p>

                <p>
                  Headlines should
                  reflect what the
                  available reporting
                  supports at the time of
                  publication. We do not
                  knowingly exaggerate
                  an unconfirmed claim
                  simply to make a story
                  appear more dramatic.
                </p>
              </PolicySection>

              <PolicySection
                eyebrow="04 · Rumours"
                title="RUMOUR IS NOT FACT"
              >
                <p>
                  The film and television
                  industries generate
                  constant speculation,
                  particularly around
                  casting, franchises and
                  future projects.
                </p>

                <p>
                  If we cover a credible
                  but unconfirmed report,
                  the article should make
                  its status clear.
                  Rumours, speculation
                  and reports should not
                  be presented as
                  officially confirmed
                  information.
                </p>
              </PolicySection>

              <PolicySection
                eyebrow="05 · Reviews"
                title="OPINIONS BELONG TO THE WRITER"
              >
                <p>
                  Reviews and other
                  clearly identified
                  opinion pieces reflect
                  the judgement of the
                  individual writer.
                  Studios, distributors
                  and publicists do not
                  receive editorial
                  control over our
                  reviews.
                </p>

                <p>
                  Receiving a screener,
                  ticket, preview access
                  or other promotional
                  access does not
                  guarantee coverage or
                  influence the score or
                  opinion expressed in a
                  review.
                </p>
              </PolicySection>

              <PolicySection
                eyebrow="06 · Corrections"
                title="WHEN WE GET IT WRONG"
              >
                <p>
                  If we discover a
                  material factual error,
                  we aim to correct it as
                  soon as reasonably
                  possible. Significant
                  corrections may be
                  identified within the
                  article where
                  appropriate.
                </p>

                <p>
                  Readers, publicists and
                  subjects of our
                  coverage can contact
                  us if they believe an
                  article contains an
                  error. Please provide
                  the article URL, the
                  disputed information
                  and supporting evidence
                  where available.
                </p>
              </PolicySection>

              <PolicySection
                eyebrow="07 · Independence"
                title="EDITORIAL COMES FIRST"
              >
                <p>
                  The Movie Trailer is
                  independently operated.
                  Advertisers, affiliate
                  partners, film studios,
                  streaming platforms,
                  distributors and other
                  commercial partners do
                  not determine our
                  editorial conclusions.
                </p>

                <p>
                  Sponsored or paid
                  material will be
                  identified as such
                  where applicable.
                </p>
              </PolicySection>

              <PolicySection
                eyebrow="08 · AI & Technology"
                title="TOOLS ASSIST. PEOPLE PUBLISH."
              >
                <p>
                  The Movie Trailer may
                  use software,
                  automation and
                  artificial
                  intelligence tools to
                  assist parts of the
                  editorial workflow,
                  including research
                  organisation, story
                  discovery, data
                  processing and draft
                  preparation.
                </p>

                <p>
                  These tools do not
                  replace editorial
                  responsibility.
                  Material selected for
                  publication is subject
                  to human editorial
                  judgement, and we
                  remain responsible for
                  the content published
                  on the site.
                </p>
              </PolicySection>

              <PolicySection
                eyebrow="09 · Images & Media"
                title="VISUAL MATERIAL"
              >
                <p>
                  Images, trailers,
                  posters and other
                  promotional materials
                  may be supplied by
                  studios, distributors,
                  publicists or other
                  rights holders, or
                  used where permitted
                  for editorial and
                  reporting purposes.
                </p>

                <p>
                  Copyright in
                  third-party material
                  remains with its
                  respective owners.
                </p>
              </PolicySection>

              <section className="border-t border-white/10 pt-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f21f2b]">
                  Questions & Corrections
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-[-0.04em]">
                  TALK TO THE EDITOR
                </h2>

                <p className="mt-5 text-base leading-8 text-white/60">
                  Questions about these
                  standards or requests
                  for a correction can
                  be sent through our
                  contact page.
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

function PolicySection({
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