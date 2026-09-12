import Link from "next/link";

import {
  createClient,
} from "@/lib/supabase/server";

export default async function LatestFeature() {
  const supabase =
    await createClient();

  const now =
    new Date().toISOString();

  const {
    data: feature,
    error,
  } = await supabase
    .from(
      "features",
    )
    .select(`
      id,
      slug,
      title,
      excerpt,
      hero_image_url,
      published_at
    `)
    .eq(
      "status",
      "published",
    )
    .lte(
      "published_at",
      now,
    )
    .order(
      "published_at",
      {
        ascending: false,
      },
    )
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error(
      "[TMT HOME] Failed to load latest feature:",
      error.message,
    );

    return null;
  }

  if (!feature) {
    return null;
  }

  const publishedDate =
    feature.published_at
      ? new Intl.DateTimeFormat(
          "en-GB",
          {
            day:
              "numeric",
            month:
              "short",
            year:
              "numeric",
          },
        ).format(
          new Date(
            feature.published_at,
          ),
        )
      : null;

  return (
    <section className="site-shell section-rule py-10 md:py-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f21f2b]">
            Go Deeper
          </p>

          <h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.045em] text-white sm:text-4xl">
            Latest Feature
          </h2>
        </div>

        <Link
          href="/features"
          className="text-[10px] font-black uppercase tracking-[0.14em] text-white/35 transition hover:text-[#f21f2b]"
        >
          All Features →
        </Link>
      </div>

      <Link
        href={`/features/${feature.slug}`}
        className="group grid overflow-hidden border border-white/10 bg-[#090b0d] lg:grid-cols-[1.45fr_0.8fr]"
      >
        <div className="relative min-h-[300px] overflow-hidden bg-[#0b0d0f] sm:min-h-[380px] lg:min-h-[430px]">
          {feature.hero_image_url ? (
            <img
              src={
                feature.hero_image_url
              }
              alt={
                feature.title
              }
              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]"
            />
          ) : (
            <div className="movie-card-image absolute inset-0" />
          )}

          <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/35" />

          <div className="absolute left-5 top-5 border border-white/15 bg-black/70 px-3 py-2 backdrop-blur-sm">
            <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[#f21f2b]">
              Feature
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-center p-7 sm:p-9 lg:p-11">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[9px] font-black uppercase tracking-[0.17em] text-[#f21f2b]">
              The Big Read
            </span>

            {publishedDate ? (
              <>
                <span className="h-1 w-1 rounded-full bg-white/20" />

                <span className="text-[9px] font-black uppercase tracking-[0.12em] text-white/25">
                  {
                    publishedDate
                  }
                </span>
              </>
            ) : null}
          </div>

          <h3 className="mt-4 text-3xl font-black leading-[0.98] tracking-[-0.05em] text-white transition group-hover:text-[#f21f2b] sm:text-4xl xl:text-5xl">
            {
              feature.title
            }
          </h3>

          {feature.excerpt ? (
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/50">
              {
                feature.excerpt
              }
            </p>
          ) : null}

          <div className="mt-7 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-sm font-black text-white transition group-hover:border-[#f21f2b] group-hover:bg-[#f21f2b]">
              →
            </span>

            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white/50 transition group-hover:text-white">
              Read Feature
            </span>
          </div>
        </div>
      </Link>
    </section>
  );
}