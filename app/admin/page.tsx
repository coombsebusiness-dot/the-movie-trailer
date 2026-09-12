import Link from "next/link";

const adminSections = [
  {
    eyebrow: "News",
    title: "Manage Stories",
    description:
      "Create, edit and publish movie and television entertainment news.",
    href: "/admin/news",
  },
  {
    eyebrow: "Trailers",
    title: "Trailer Library",
    description:
      "Add, edit and publish trailers from the trailer library.",
    href: "/admin/trailers",
  },
  {
    eyebrow: "Movies",
    title: "Movie Database",
    description:
      "Build and manage movie pages, cast details, sections and release information.",
    href: "/admin/movies",
  },
  {
  eyebrow: "Reviews",
  title: "Movie Reviews",
  description:
    "Write, edit and publish movie reviews, ratings and verdicts.",
  href: "/admin/reviews",
},

{
  eyebrow: "Features",
  title: "Feature Stories",
  description:
    "Create, edit and publish long-form features, big reads and editorial deep dives.",
  href: "/admin/features",
},

{
  eyebrow: "People",
  title: "Current People",
  description:
    "Curate actors and filmmakers, choose homepage features and manage the people connected to current coverage.",
  href: "/admin/people",
},
  {
    eyebrow: "Radar",
    title: "News Radar",
    description:
      "Scan entertainment sources, review breaking stories and generate article drafts.",
    href: "/admin/news-radar",
  },
  {
    eyebrow: "Homepage",
    title: "Homepage Manager",
    description:
      "Choose and manage the stories featured across The Movie Trailer homepage.",
    href: "/admin/homepage",
  },
];

export default function AdminPage() {
  return (
    <div>
      <div className="mb-10">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f21f2b]">
          Dashboard
        </p>

        <h1 className="mt-3 text-4xl font-black uppercase tracking-[-0.05em]">
          Editorial Control Room
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/50">
          Manage news, trailers, movies, reviews, features and the wider editorial workflow for The Movie Trailer.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {adminSections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group border border-white/10 bg-[#0b0d0f] p-6 transition hover:border-[#f21f2b]/70 hover:bg-[#0e1012]"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f21f2b]">
                  {section.eyebrow}
                </p>

                <h2 className="mt-3 text-xl font-black transition group-hover:text-white">
                  {section.title}
                </h2>
              </div>

              <span className="text-xl font-black text-white/20 transition group-hover:translate-x-1 group-hover:text-[#f21f2b]">
                →
              </span>
            </div>

            <p className="mt-3 max-w-sm text-sm leading-6 text-white/45">
              {section.description}
            </p>

            <p className="mt-6 text-[10px] font-black uppercase tracking-[0.16em] text-white/25 transition group-hover:text-[#f21f2b]">
              Open Section
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}