import Link from "next/link";

const categories = [
  {
    title: "Movies",
    description:
      "Movie hubs, trailers, release dates and updates",
    href: "/movies",
  },
  {
    title: "TV & Streaming",
    description:
      "The latest television and streaming stories",
    href: "/tv",
  },
  {
    title: "Horror",
    description:
      "News, trailers and updates from the darker side",
    href: "/horror",
  },
  {
    title: "Features",
    description:
      "Deep dives, lists and stories worth reading",
    href: "/features",
  },
];

export default function CategoryGrid() {
  return (
    <section className="site-shell section-rule py-10">
      <div className="mb-7">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f21f2b]">
          Explore
        </p>

        <h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.045em]">
          More From The Movie Trailer
        </h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {categories.map(
          (
            item,
            index,
          ) => (
            <Link
              key={item.title}
              href={item.href}
              className="group block"
            >
              <article className="movie-card-image relative flex min-h-[210px] items-end overflow-hidden border border-white/10 p-6 transition duration-300 group-hover:border-[#f21f2b]/60">
                <div
                  className={`absolute inset-0 transition duration-500 group-hover:scale-105 ${
                    index === 0
                      ? "bg-[radial-gradient(circle_at_25%_30%,rgba(255,255,255,0.08),transparent_45%)]"
                      : index === 1
                        ? "bg-[radial-gradient(circle_at_75%_30%,rgba(255,255,255,0.07),transparent_45%)]"
                        : index === 2
                          ? "bg-[radial-gradient(circle_at_70%_40%,rgba(242,31,43,0.25),transparent_45%)]"
                          : "bg-[radial-gradient(circle_at_30%_70%,rgba(242,31,43,0.12),transparent_50%)]"
                  }`}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                <div className="relative z-10">
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#f21f2b]">
                    Explore
                  </p>

                  <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.04em] transition group-hover:text-[#f21f2b]">
                    {item.title}
                  </h2>

                  <p className="mt-2 max-w-[240px] text-xs leading-5 text-white/50">
                    {item.description}
                  </p>

                  <div className="mt-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-sm transition group-hover:border-[#f21f2b] group-hover:bg-[#f21f2b]">
                    →
                  </div>
                </div>
              </article>
            </Link>
          ),
        )}
      </div>
    </section>
  );
}