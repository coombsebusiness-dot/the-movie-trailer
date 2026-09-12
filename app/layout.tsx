import type {
  Metadata,
} from "next";

import {
  Geist,
  Geist_Mono,
} from "next/font/google";

import "./globals.css";

const geistSans =
  Geist({
    variable:
      "--font-geist-sans",
    subsets: [
      "latin",
    ],
  });

const geistMono =
  Geist_Mono({
    variable:
      "--font-geist-mono",
    subsets: [
      "latin",
    ],
  });

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://the-movie-trailer.com";

export const metadata:
  Metadata = {
    metadataBase:
      new URL(siteUrl),

    title: {
      default:
        "The Movie Trailer | Movie & TV News, Trailers & Release Dates",
      template:
        "%s | The Movie Trailer",
    },

    description:
      "The latest movie and TV news, trailers, casting updates, release dates and entertainment stories.",

    applicationName:
      "The Movie Trailer",

    openGraph: {
      type:
        "website",
      siteName:
        "The Movie Trailer",
      title:
        "The Movie Trailer | Movie & TV News, Trailers & Release Dates",
      description:
        "The latest movie and TV news, trailers, casting updates, release dates and entertainment stories.",
    },

    twitter: {
      card:
        "summary_large_image",
      title:
        "The Movie Trailer | Movie & TV News, Trailers & Release Dates",
      description:
        "The latest movie and TV news, trailers, casting updates, release dates and entertainment stories.",
    },
  };

  const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: "The Movie Trailer",
  url: siteUrl,
  description:
    "An independent movie and TV entertainment site covering news, trailers, casting, release dates, reviews and features.",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: "The Movie Trailer",
  description:
    "The latest movie and TV news, trailers, casting updates, release dates and entertainment stories.",
  publisher: {
    "@id": `${siteUrl}/#organization`,
  },
  inLanguage: "en-GB",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
     <body>
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html:
        JSON.stringify(
          organizationJsonLd,
        ),
    }}
  />

  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html:
        JSON.stringify(
          websiteJsonLd,
        ),
    }}
  />

  {
    children
  }
</body>
    </html>
  );
}