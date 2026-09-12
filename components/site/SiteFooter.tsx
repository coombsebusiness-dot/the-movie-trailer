import Link from "next/link";

const footerLinks = [
  {
    href: "/about",
    label: "About",
  },
  {
    href: "/contact",
    label: "Contact",
  },
  {
    href: "/editorial-policy",
    label: "Editorial Policy",
  },
  {
    href: "/corrections",
    label: "Corrections",
  },
  {
    href: "/privacy",
    label: "Privacy",
  },
  {
    href: "/cookies",
    label: "Cookies",
  },
  {
    href: "/terms",
    label: "Terms",
  },
  {
    href: "/affiliate-disclosure",
    label: "Affiliate Disclosure",
  },
];

export default function SiteFooter() {
  return (
    <footer className="mt-6 border-t border-white/10 bg-[#070809]">
      <div className="site-shell py-10">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.4fr_0.8fr] lg:items-end">
          <div>
            <p className="text-lg font-black leading-none">
              THE MOVIE
            </p>

            <p className="text-4xl font-black leading-none tracking-[-0.07em] text-[#f21f2b]">
              TRAILER
            </p>

            <p className="mt-3 text-[9px] font-bold uppercase tracking-[0.15em] text-white/40">
              Movie & TV News · Trailers ·
              Casting · Release Dates
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="flex flex-wrap gap-x-5 gap-y-3 lg:justify-center"
          >
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[10px] font-bold text-white/45 transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <p className="max-w-[230px] text-xs font-bold uppercase leading-5 tracking-[0.12em] text-white/50 lg:ml-auto lg:text-right">
            Good movies bring people
            together.
          </p>
        </div>

        <div className="mt-9 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/25">
            © {new Date().getFullYear()} The Movie
            Trailer. All rights reserved.
          </p>

          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/25">
            Independent Movie & TV
            Entertainment
          </p>
        </div>
      </div>
    </footer>
  );
}