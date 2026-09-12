import Link from "next/link";

import AdminLogoutButton from "@/components/admin/auth/AdminLogoutButton";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#050607] text-white">
      <header className="border-b border-white/10 bg-[#090b0d]">
        <div className="site-shell flex min-h-20 items-center justify-between gap-8">
          <div>
            <Link
              href="/admin"
              className="text-xl font-black uppercase tracking-[-0.04em]"
            >
              The Movie{" "}
              <span className="text-[#f21f2b]">
                Trailer
              </span>
            </Link>

            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
              Editorial Admin
            </p>
          </div>

          <nav className="flex flex-wrap items-center justify-end gap-5 text-xs font-black uppercase tracking-[0.12em]">
            <Link
              href="/admin"
              className="text-white/60 transition hover:text-white"
            >
              Dashboard
            </Link>

            <Link
              href="/admin/homepage"
              className="text-white/60 transition hover:text-white"
            >
              Homepage
            </Link>

            <Link
              href="/admin/news"
              className="text-white/60 transition hover:text-white"
            >
              News
            </Link>
            <Link
  href="/admin/news-radar"
  className="text-white/60 transition hover:text-white"
>
  Radar
</Link>

            <Link
              href="/admin/trailers"
              className="text-white/60 transition hover:text-white"
            >
              Trailers
            </Link>

            <Link
              href="/admin/movies"
              className="text-white/60 transition hover:text-white"
            >
              Movies
            </Link>
            <Link
  href="/admin/reviews"
  className="text-white/60 transition hover:text-white"
>
  Reviews
</Link>

<Link
  href="/admin/features"
  className="text-white/60 transition hover:text-white"
>
  Features
</Link>

<Link
  href="/admin/people"
  className="text-white/60 transition hover:text-white"
>
  People
</Link>

            <Link
              href="/"
              className="text-[#f21f2b] transition hover:text-white"
            >
              View Site
            </Link>
            <AdminLogoutButton />
          </nav>
        </div>
      </header>

      <main className="site-shell py-10">
        {children}
      </main>
    </div>
  );
}