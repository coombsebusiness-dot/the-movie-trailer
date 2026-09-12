type BreadcrumbItem = {
  name: string;
  url: string;
};

type BreadcrumbJsonLdProps = {
  items: BreadcrumbItem[];
};

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://the-movie-trailer.com";

export default function BreadcrumbJsonLd({
  items,
}: BreadcrumbJsonLdProps) {
  const breadcrumbJsonLd = {
    "@context":
      "https://schema.org",

    "@type":
      "BreadcrumbList",

    itemListElement:
      items.map(
        (
          item,
          index,
        ) => ({
          "@type":
            "ListItem",

          position:
            index + 1,

          name:
            item.name,

          item:
            new URL(
              item.url,
              siteUrl,
            ).toString(),
        }),
      ),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html:
          JSON.stringify(
            breadcrumbJsonLd,
          ),
      }}
    />
  );
}