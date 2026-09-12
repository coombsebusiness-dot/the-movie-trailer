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
      "Corrections Policy",
    description:
      "The Movie Trailer corrections policy explains how we handle factual errors, article updates, clarifications and correction requests.",
  
  
  alternates: {
    canonical:
      "/corrections",
  }}

export default function CorrectionsPage() {
  return (
    <main className="min-h-screen bg-[#050607] text-white">
      <SiteHeader />

      <BreakingBar />

      <section className="site-shell py-12 sm:py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <aside>
            <div className="lg:sticky lg:top-28">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#f21f2b]">
                Accuracy
              </p>

              <h1 className="mt-4 max-w-lg text-5xl font-black leading-[0.9] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                CORRECTIONS
                <br />
                <span className="text-[#f21f2b]">
                  POLICY.
                </span>
              </h1>

              <div className="mt-8 h-px w-20 bg-[#f21f2b]" />

              <p className="mt-8 max-w-sm text-sm font-bold uppercase leading-6 tracking-[0.08em] text-white/45">
                Errors · Updates ·
                Clarifications ·
                Accountability
              </p>

              <p className="mt-6 text-xs font-bold uppercase tracking-[0.08em] text-white/30">
                Last updated:
                September 2026
              </p>
            </div>
          </aside>

          <div className="max-w-3xl">
            <p className="text-xl font-bold leading-9 text-white/85 sm:text-2xl sm:leading-10">
              Accuracy matters at The
              Movie Trailer. When we
              publish something that is
              materially wrong, we aim
              to correct it quickly and
              transparently.
            </p>

            <div className="my-10 border-t border-white/10" />

            <div className="space-y-10">
              <CorrectionSection
                eyebrow="01 · Our Standard"
                title="GET IT RIGHT. FIX IT WHEN WE DON'T."
              >
                <p>
                  The Movie Trailer
                  covers an industry
                  where stories can
                  develop quickly.
                  Casting negotiations,
                  release dates,
                  production plans and
                  other details can
                  change after a story
                  has been published.
                </p>

                <p>
                  We distinguish between
                  information that was
                  accurate when
                  published but later
                  changed and a factual
                  error in our original
                  reporting.
                </p>
              </CorrectionSection>

              <CorrectionSection
                eyebrow="02 · Factual Errors"
                title="CORRECTING MISTAKES"
              >
                <p>
                  If we identify a
                  material factual
                  error, we aim to
                  correct the relevant
                  article as soon as
                  reasonably possible.
                </p>

                <p>
                  Depending on the
                  nature of the error,
                  we may also add a
                  correction or editor&apos;s
                  note explaining what
                  was changed.
                </p>
              </CorrectionSection>

              <CorrectionSection
                eyebrow="03 · Developing Stories"
                title="WHEN THE STORY CHANGES"
              >
                <p>
                  Breaking news can
                  develop after
                  publication. New
                  information does not
                  necessarily mean the
                  original article was
                  inaccurate.
                </p>

                <p>
                  Where appropriate, we
                  may update an existing
                  article with newly
                  confirmed information,
                  additional context or
                  subsequent
                  developments.
                </p>
              </CorrectionSection>

              <CorrectionSection
                eyebrow="04 · Clarifications"
                title="MAKING THE MEANING CLEAR"
              >
                <p>
                  Sometimes an article
                  may be factually
                  correct but benefit
                  from additional
                  context or clearer
                  wording.
                </p>

                <p>
                  In those cases we may
                  clarify the article
                  without treating the
                  change as a factual
                  correction.
                </p>
              </CorrectionSection>

              <CorrectionSection
                eyebrow="05 · Headlines"
                title="THE HEADLINE COUNTS TOO"
              >
                <p>
                  Our standards apply to
                  headlines as well as
                  article copy.
                </p>

                <p>
                  If a headline
                  materially
                  misrepresents the
                  information supported
                  by the story, we may
                  amend it to reflect
                  the reporting more
                  accurately.
                </p>
              </CorrectionSection>

              <CorrectionSection
                eyebrow="06 · Reviews & Opinion"
                title="OPINION IS DIFFERENT"
              >
                <p>
                  Reviews and clearly
                  identified commentary
                  contain subjective
                  opinion. Disagreement
                  with a review score or
                  an editorial opinion
                  is not, by itself, a
                  factual error.
                </p>

                <p>
                  However, factual
                  statements contained
                  within reviews and
                  opinion pieces remain
                  subject to our
                  corrections policy.
                </p>
              </CorrectionSection>

              <CorrectionSection
                eyebrow="07 · Sources"
                title="ORIGINAL REPORTING & ATTRIBUTION"
              >
                <p>
                  If an attribution is
                  incorrect or an
                  original source has
                  not been properly
                  credited, we may
                  amend the article to
                  correct the
                  attribution and
                  provide the
                  appropriate source.
                </p>
              </CorrectionSection>

              <CorrectionSection
                eyebrow="08 · Removal"
                title="ARTICLE REMOVAL"
              >
                <p>
                  We do not normally
                  remove an article
                  simply because a
                  person or organisation
                  dislikes accurate
                  coverage.
                </p>

                <p>
                  Removal may be
                  considered in
                  exceptional
                  circumstances,
                  including serious
                  legal, privacy,
                  safety or accuracy
                  concerns where
                  correction alone
                  would not adequately
                  address the issue.
                </p>
              </CorrectionSection>

              <CorrectionSection
                eyebrow="09 · Requests"
                title="REQUEST A CORRECTION"
              >
                <p>
                  Readers, publicists,
                  studios, companies
                  and people mentioned
                  in our coverage are
                  welcome to alert us
                  to potential factual
                  errors.
                </p>

                <p>
                  To help us review a
                  request, please
                  provide the URL of
                  the article, identify
                  the specific
                  information you
                  believe is incorrect
                  and explain the
                  proposed correction.
                </p>

                <p>
                  Where possible,
                  include a reliable
                  source, official
                  statement or other
                  supporting evidence.
                </p>
              </CorrectionSection>

              <CorrectionSection
                eyebrow="10 · Review"
                title="WHAT HAPPENS NEXT"
              >
                <p>
                  Correction requests
                  are assessed against
                  the available
                  evidence and the
                  sourcing behind the
                  original article.
                </p>

                <p>
                  If a correction is
                  warranted, we aim to
                  update the article
                  appropriately. If the
                  available evidence
                  supports the original
                  reporting, the
                  article may remain
                  unchanged.
                </p>
              </CorrectionSection>

              <section className="border-t border-white/10 pt-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f21f2b]">
                  Corrections
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-[-0.04em]">
                  FOUND SOMETHING WRONG?
                </h2>

                <p className="mt-5 max-w-2xl text-base leading-8 text-white/60">
                  Send us the article
                  URL, the information
                  you believe needs
                  correcting and any
                  supporting source or
                  evidence.
                </p>

                <a
                  href="/contact"
                  className="mt-7 inline-flex border border-[#f21f2b] bg-[#f21f2b] px-6 py-3 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-transparent"
                >
                  Request a Correction →
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

function CorrectionSection({
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