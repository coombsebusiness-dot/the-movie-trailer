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
      "Privacy Policy",

    description:
      "The Movie Trailer privacy policy explaining how information is collected, used and protected when you visit our website or subscribe to our newsletter.",

    alternates: {
      canonical:
        "/privacy",
    },
  };

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#050607] text-white">
      <SiteHeader />

      <BreakingBar />

      <section className="site-shell py-12 sm:py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <aside>
            <div className="lg:sticky lg:top-28">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#f21f2b]">
                Your Data
              </p>

              <h1 className="mt-4 max-w-lg text-5xl font-black leading-[0.9] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                PRIVACY
                <br />
                <span className="text-[#f21f2b]">
                  POLICY.
                </span>
              </h1>

              <div className="mt-8 h-px w-20 bg-[#f21f2b]" />

              <p className="mt-8 max-w-sm text-sm font-bold uppercase leading-6 tracking-[0.08em] text-white/45">
                Privacy · Data ·
                Cookies · Your Rights
              </p>

              <p className="mt-6 text-xs font-bold uppercase tracking-[0.08em] text-white/30">
                Last updated:
                September 2026
              </p>
            </div>
          </aside>

          <div className="max-w-3xl">
            <p className="text-xl font-bold leading-9 text-white/85 sm:text-2xl sm:leading-10">
              This Privacy Policy
              explains how The Movie
              Trailer collects, uses
              and handles information
              when you visit our
              website, contact us or
              subscribe to our
              newsletter.
            </p>

            <div className="my-10 border-t border-white/10" />

            <div className="space-y-10">
              <PrivacySection
                eyebrow="01 · Information"
                title="WHAT WE MAY COLLECT"
              >
                <p>
                  The information we
                  collect depends on how
                  you use The Movie
                  Trailer.
                </p>

                <p>
                  If you subscribe to a
                  newsletter or contact
                  us directly, we may
                  receive information
                  such as your email
                  address and any
                  information you choose
                  to include in your
                  message.
                </p>

                <p>
                  Technical information
                  may also be collected
                  automatically when you
                  visit the site. This
                  can include information
                  about your browser,
                  device, pages visited,
                  referring page,
                  approximate location
                  derived from technical
                  data and the date and
                  time of your visit.
                </p>
              </PrivacySection>

              <PrivacySection
                eyebrow="02 · Use"
                title="HOW INFORMATION IS USED"
              >
                <p>
                  Information may be used
                  to operate and improve
                  The Movie Trailer,
                  understand how the
                  website is being used,
                  respond to enquiries,
                  provide requested
                  communications and
                  protect the security
                  and reliability of the
                  service.
                </p>

                <p>
                  We do not sell your
                  personal information.
                </p>
              </PrivacySection>

              <PrivacySection
                eyebrow="03 · Newsletter"
                title="EMAIL SUBSCRIPTIONS"
              >
                <p>
                  If you voluntarily
                  subscribe to The Movie
                  Trailer newsletter, we
                  may store your email
                  address for the purpose
                  of sending the
                  communications you
                  requested.
                </p>

                <p>
                  You can unsubscribe
                  from marketing or
                  newsletter emails using
                  the unsubscribe option
                  provided in those
                  communications where
                  available, or by
                  contacting us.
                </p>
              </PrivacySection>

              <PrivacySection
                eyebrow="04 · Analytics"
                title="UNDERSTANDING OUR AUDIENCE"
              >
                <p>
                  We may use analytics
                  services to understand
                  how visitors find and
                  use The Movie Trailer.
                  These services can
                  collect technical and
                  usage information such
                  as pages viewed,
                  session information,
                  device type and general
                  geographic information.
                </p>

                <p>
                  Analytics information
                  helps us understand
                  which parts of the site
                  are useful and how the
                  website can be
                  improved.
                </p>
              </PrivacySection>

              <PrivacySection
                eyebrow="05 · Cookies"
                title="COOKIES & SIMILAR TECHNOLOGIES"
              >
                <p>
                  The Movie Trailer and
                  services used by the
                  website may use cookies
                  or similar technologies
                  to provide site
                  functionality,
                  remember preferences,
                  measure website usage
                  or support other
                  features.
                </p>

                <p>
                  Where required by
                  applicable law, consent
                  will be requested
                  before non-essential
                  cookies are used.
                </p>
              </PrivacySection>

              <PrivacySection
                eyebrow="06 · Third Parties"
                title="EXTERNAL SERVICES"
              >
                <p>
                  The Movie Trailer may
                  use third-party
                  providers for services
                  such as website
                  hosting, analytics,
                  database
                  infrastructure,
                  email delivery and
                  embedded media.
                </p>

                <p>
                  These providers may
                  process information as
                  necessary to provide
                  their services and may
                  have their own privacy
                  policies governing
                  their handling of
                  information.
                </p>
              </PrivacySection>

              <PrivacySection
                eyebrow="07 · Embedded Content"
                title="TRAILERS & EXTERNAL MEDIA"
              >
                <p>
                  Articles may contain
                  embedded videos,
                  social media posts or
                  other content supplied
                  by third-party
                  platforms.
                </p>

                <p>
                  Loading or interacting
                  with embedded content
                  may allow the relevant
                  third party to collect
                  information about your
                  interaction according
                  to its own privacy
                  practices.
                </p>
              </PrivacySection>

              <PrivacySection
                eyebrow="08 · Links"
                title="OTHER WEBSITES"
              >
                <p>
                  Our articles frequently
                  link to studios,
                  publications,
                  streaming services and
                  other external
                  websites.
                </p>

                <p>
                  We are not responsible
                  for the privacy
                  practices or content
                  of websites operated
                  by third parties.
                </p>
              </PrivacySection>

              <PrivacySection
                eyebrow="09 · Retention"
                title="HOW LONG DATA IS KEPT"
              >
                <p>
                  Personal information is
                  retained only for as
                  long as reasonably
                  necessary for the
                  purpose for which it
                  was collected,
                  including satisfying
                  legal, security and
                  operational
                  requirements.
                </p>
              </PrivacySection>

              <PrivacySection
                eyebrow="10 · Security"
                title="PROTECTING INFORMATION"
              >
                <p>
                  Reasonable technical
                  and organisational
                  measures are used to
                  protect information
                  handled through The
                  Movie Trailer.
                </p>

                <p>
                  No internet service can
                  guarantee absolute
                  security, but we aim
                  to use appropriate
                  safeguards for the
                  information we hold.
                </p>
              </PrivacySection>

              <PrivacySection
                eyebrow="11 · Your Rights"
                title="YOUR PRIVACY RIGHTS"
              >
                <p>
                  Depending on where you
                  live, privacy law may
                  give you rights over
                  your personal
                  information. These can
                  include rights to
                  request access,
                  correction, deletion
                  or restriction of
                  certain processing.
                </p>

                <p>
                  UK users may have
                  rights under the UK
                  General Data
                  Protection Regulation
                  and the Data
                  Protection Act 2018.
                </p>

                <p>
                  Where processing relies
                  on consent, you may
                  also have the right to
                  withdraw that consent.
                </p>
              </PrivacySection>

              <PrivacySection
                eyebrow="12 · Children"
                title="CHILDREN'S PRIVACY"
              >
                <p>
                  The Movie Trailer is a
                  general-audience
                  entertainment
                  publication and is not
                  designed to knowingly
                  collect personal
                  information from young
                  children.
                </p>
              </PrivacySection>

              <PrivacySection
                eyebrow="13 · Changes"
                title="POLICY UPDATES"
              >
                <p>
                  This Privacy Policy may
                  be updated when our
                  services, technology
                  or legal obligations
                  change.
                </p>

                <p>
                  The latest version will
                  be published on this
                  page with an updated
                  revision date where
                  appropriate.
                </p>
              </PrivacySection>

              <section className="border-t border-white/10 pt-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f21f2b]">
                  Privacy Enquiries
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-[-0.04em]">
                  CONTACT US
                </h2>

                <p className="mt-5 text-base leading-8 text-white/60">
                  To ask a question
                  about this Privacy
                  Policy or make a
                  request relating to
                  personal information,
                  please contact The
                  Movie Trailer.
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

function PrivacySection({
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