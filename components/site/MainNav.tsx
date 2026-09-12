"use client";

import Link from "next/link";
import {
  usePathname,
} from "next/navigation";

const navItems = [
  {
    label: "News",
    href: "/news",
  },
  {
    label: "Trailers",
    href: "/trailers",
  },
  {
  label: "Movies",
  href: "/movies",
},
{
  label: "People",
  href: "/people",
},
{
  label: "TV",
  href: "/tv",
},
  {
    label: "Horror",
    href: "/horror",
  },
  {
    label: "Coming Soon",
    href: "/coming-soon",
  },
  {
    label: "Features",
    href: "/features",
  },
];

export default function MainNav() {
  const pathname =
    usePathname();

  return (
    <nav className="border-t border-white/[0.06]">
      <div className="site-shell flex min-h-14 items-center gap-1 overflow-x-auto">

        {navItems.map(
          (
            item,
          ) => {
            const isActive =
              pathname ===
                item.href ||
              pathname.startsWith(
                `${item.href}/`,
              );

            return (
              <Link
                key={
                  item.label
                }
                href={
                  item.href
                }
                className={`whitespace-nowrap border-r border-white/[0.06] px-5 py-5 text-[11px] font-black uppercase tracking-[0.08em] transition-colors hover:bg-white/5 hover:text-[#f21f2b] ${
                  isActive
                    ? "border-b-2 border-b-[#f21f2b] bg-[#f21f2b]/5 text-white"
                    : "text-white/75"
                }`}
              >
                {
                  item.label
                }
              </Link>
            );
          },
        )}

        <div className="ml-auto hidden gap-6 text-[10px] font-bold uppercase tracking-[0.12em] text-white/55 xl:flex">

          <Link
            href="/about"
            className="hover:text-white"
          >
            About
          </Link>

          <Link
            href="/contact"
            className="hover:text-white"
          >
            Contact
          </Link>

        </div>

      </div>
    </nav>
  );
}