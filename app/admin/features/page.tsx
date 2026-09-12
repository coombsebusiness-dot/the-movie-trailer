import Link from "next/link";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

type FeatureRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  hero_image_url: string | null;
  status: string;
  published_at: string | null;
  updated_at: string;
};

function formatDate(
  value: string | null,
) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(
    new Date(
      value,
    ),
  );
}

export default async function AdminFeaturesPage() {
  const supabase =
    createAdminClient();

  const {
    data,
    error,
  } = await supabase
    .from(
      "features",
    )
    .select(`
      id,
      title,
      slug,
      excerpt,
      hero_image_url,
      status,
      published_at,
      updated_at
    `)
    .order(
      "updated_at",
      {
        ascending:
          false,
      },
    );

  if (
    error
  ) {
    throw new Error(
      `Failed to load features: ${error.message}`,
    );
  }

  const features =
    (data ??
      []) as FeatureRow[];

  const publishedCount =
    features.filter(
      (feature) =>
        feature.status ===
        "published",
    ).length;

  const draftCount =
    features.filter(
      (feature) =>
        feature.status ===
        "draft",
    ).length;

  return (
    <main className="mx-auto w-full max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10">
      <div className="flex flex-wrap items-end justify-between gap-5 border-b border-white/10 pb-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#f21f2b]">
            Editorial
          </p>

          <h1 className="mt-2 text-3xl font-black uppercase tracking-[-0.04em] text-white sm:text-4xl">
            Features
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45">
            Manage long-form features, interviews, explainers and editorial stories.
          </p>
        </div>

        <Link
          href="/admin/features/new"
          className="bg-[#f21f2b] px-5 py-3 text-[10px] font-black uppercase tracking-[0.14em] text-white transition hover:bg-white hover:text-black"
        >
          + New Feature
        </Link>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="border border-white/10 bg-[#090b0d] p-5">
          <div className="text-[9px] font-black uppercase tracking-[0.16em] text-white/35">
            Total Features
          </div>

          <div className="mt-2 text-3xl font-black text-white">
            {
              features.length
            }
          </div>
        </div>

        <div className="border border-white/10 bg-[#090b0d] p-5">
          <div className="text-[9px] font-black uppercase tracking-[0.16em] text-white/35">
            Published
          </div>

          <div className="mt-2 text-3xl font-black text-[#f21f2b]">
            {
              publishedCount
            }
          </div>
        </div>

        <div className="border border-white/10 bg-[#090b0d] p-5">
          <div className="text-[9px] font-black uppercase tracking-[0.16em] text-white/35">
            Drafts
          </div>

          <div className="mt-2 text-3xl font-black text-white">
            {
              draftCount
            }
          </div>
        </div>
      </div>

      {features.length ===
      0 ? (
        <div className="mt-8 border border-dashed border-white/15 bg-[#090b0d] px-6 py-16 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#f21f2b]">
            Features Desk
          </p>

          <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white">
            No Features Yet
          </h2>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-white/40">
            Create the first long-form editorial feature for The Movie Trailer.
          </p>

          <Link
            href="/admin/features/new"
            className="mt-6 inline-block bg-[#f21f2b] px-5 py-3 text-[10px] font-black uppercase tracking-[0.14em] text-white transition hover:bg-white hover:text-black"
          >
            Create First Feature
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {features.map(
            (
              feature,
            ) => (
              <article
                key={
                  feature.id
                }
                className="grid gap-5 border border-white/10 bg-[#090b0d] p-4 transition hover:border-white/20 md:grid-cols-[180px_minmax(0,1fr)_auto] md:items-center"
              >
                <div className="aspect-video overflow-hidden bg-black">
                  {feature.hero_image_url ? (
                    <img
                      src={
                        feature.hero_image_url
                      }
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center border border-white/5 text-[9px] font-black uppercase tracking-[0.14em] text-white/20">
                      No Image
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={
                        feature.status ===
                        "published"
                          ? "text-[9px] font-black uppercase tracking-[0.14em] text-[#f21f2b]"
                          : "text-[9px] font-black uppercase tracking-[0.14em] text-white/35"
                      }
                    >
                      {
                        feature.status
                      }
                    </span>

                    <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/20">
                      Published{" "}
                      {formatDate(
                        feature.published_at,
                      )}
                    </span>
                  </div>

                  <h2 className="mt-2 text-lg font-black leading-tight text-white">
                    {
                      feature.title
                    }
                  </h2>

                  {feature.excerpt ? (
                    <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-white/40">
                      {
                        feature.excerpt
                      }
                    </p>
                  ) : null}

                  <div className="mt-3 text-[9px] font-bold uppercase tracking-[0.1em] text-white/20">
                    /features/
                    {
                      feature.slug
                    }
                  </div>
                </div>

                <div className="flex gap-2 md:flex-col">
                  <Link
                    href={`/admin/features/${feature.id}/edit`}
                    className="border border-white/15 px-4 py-2 text-center text-[9px] font-black uppercase tracking-[0.12em] text-white transition hover:border-[#f21f2b] hover:text-[#f21f2b]"
                  >
                    Edit
                  </Link>

                  {feature.status ===
                  "published" ? (
                    <Link
                      href={`/features/${feature.slug}`}
                      className="border border-white/10 px-4 py-2 text-center text-[9px] font-black uppercase tracking-[0.12em] text-white/40 transition hover:border-white hover:text-white"
                    >
                      View
                    </Link>
                  ) : null}
                </div>
              </article>
            ),
          )}
        </div>
      )}
    </main>
  );
}