import Link from "next/link";

import MainNav from "./MainNav";

export default function SiteHeader() {
  return (
    <header className="border-b border-white/10 bg-[#070809]">

      <div className="site-shell flex items-center justify-between gap-8 py-7">

        <div>

          <Link
            href="/"
            className="inline-block"
          >

            <span className="block text-[22px] font-black leading-none tracking-[-0.05em] text-white md:text-[30px]">
              THE MOVIE
            </span>

            <span className="mt-1 flex items-center text-[39px] font-black leading-[0.78] tracking-[-0.07em] text-[#f21f2b] md:text-[58px]">

              TRA

              <span className="mx-[2px] inline-flex h-[0.68em] w-[0.68em] items-center justify-center bg-[#f21f2b] text-[0.38em] text-white">
                ▶
              </span>

              ILER

            </span>

          </Link>

          <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white/60 md:text-xs">
            Movie & TV News · Trailers · Casting · Release Dates
          </p>

        </div>

        <div className="hidden max-w-[420px] flex-1 lg:block">

          <p className="mb-3 text-right text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
            All the latest. All in one place.
          </p>

          <div className="flex border border-white/10 bg-white/[0.04]">

            <input
              aria-label="Search"
              placeholder="Search movies, TV shows, trailers..."
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
            />

            <button
              type="button"
              aria-label="Search"
              className="border-l border-white/10 px-5 text-lg hover:bg-white/5"
            >
              ⌕
            </button>

          </div>

        </div>

      </div>

      <MainNav />

    </header>
  );
}