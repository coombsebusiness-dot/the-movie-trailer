import Link from "next/link";

import {
  notFound,
} from "next/navigation";

import FeatureEditor, {
  type FeatureEditorInitialData,
} from "@/components/admin/features/FeatureEditor";

import {
  getCuratedPeople,
} from "@/lib/people/getCuratedPeople";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

type EditFeaturePageProps = {
  params: Promise<{
    id: string;
  }>;
};

type FeatureSection = {
  eyebrow: string;
  headline: string;
  body: string;
  imageUrl: string;
  youtubeUrl: string;
};

type FeatureSource = {
  name: string;
  url: string;
};

export default async function EditFeaturePage({
  params,
}: EditFeaturePageProps) {
  const {
    id,
  } =
    await params;

  const supabase =
    createAdminClient();

  const curatedPeople =
    await getCuratedPeople();

  const {
    data: feature,
    error:
      featureError,
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
      intro,
      sections,
      sources,
      seo_title,
      meta_description,
      status
    `)
    .eq(
      "id",
      id,
    )
    .maybeSingle();

  if (
    featureError
  ) {
    throw new Error(
      `Failed to load feature: ${featureError.message}`,
    );
  }

  if (
    !feature
  ) {
    notFound();
  }

  const {
    data:
      featurePeople,
    error:
      featurePeopleError,
  } = await supabase
    .from(
      "feature_people",
    )
    .select(
      "person_id",
    )
    .eq(
      "feature_id",
      id,
    );

  if (
    featurePeopleError
  ) {
    throw new Error(
      `Failed to load feature people: ${featurePeopleError.message}`,
    );
  }

  const initialPersonIds =
    (
      featurePeople ??
      []
    ).map(
      (
        relationship,
      ) =>
        relationship.person_id,
    );

  const sections =
    Array.isArray(
      feature.sections,
    )
      ? (
          feature.sections as FeatureSection[]
        )
      : [];

  const sources =
    Array.isArray(
      feature.sources,
    )
      ? (
          feature.sources as FeatureSource[]
        )
      : [];

  const initialData:
    FeatureEditorInitialData =
    {
      id:
        feature.id,

      slug:
        feature.slug,

      title:
        feature.title,

      excerpt:
        feature.excerpt,

      hero_image_url:
        feature.hero_image_url,

      intro:
        feature.intro,

      sections,

      sources,

      seo_title:
        feature.seo_title,

      meta_description:
        feature.meta_description,

      status:
        feature.status,
    };

  return (
    <main className="mx-auto w-full max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5 border-b border-white/10 pb-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#f21f2b]">
            Features
          </p>

          <h1 className="mt-2 text-3xl font-black uppercase tracking-[-0.04em] text-white sm:text-4xl">
            Edit Feature
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45">
            Edit the feature, artwork, sources, attached People and search metadata.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {feature.status ===
          "published" ? (
            <Link
              href={`/features/${feature.slug}`}
              className="border border-white/15 px-4 py-3 text-[10px] font-black uppercase tracking-[0.14em] text-white transition hover:border-white"
            >
              View Feature
            </Link>
          ) : null}

          <Link
            href="/admin/features"
            className="border border-white/15 px-4 py-3 text-[10px] font-black uppercase tracking-[0.14em] text-white transition hover:border-[#f21f2b] hover:text-[#f21f2b]"
          >
            ← All Features
          </Link>
        </div>
      </div>

      <FeatureEditor
        initialData={
          initialData
        }
        curatedPeople={
          curatedPeople
        }
        initialPersonIds={
          initialPersonIds
        }
      />
    </main>
  );
}