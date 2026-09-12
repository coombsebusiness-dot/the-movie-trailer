import type {
  Metadata,
} from "next";

import BreakingBar from "@/components/site/BreakingBar";

import SiteFooter from "@/components/site/SiteFooter";

import SiteHeader from "@/components/site/SiteHeader";

import CategoryGrid from "@/components/home/CategoryGrid";

import ComingSoon from "@/components/home/ComingSoon";

import FeaturedStory from "@/components/home/FeaturedStory";

import HeroNewsGrid from "@/components/home/HeroNewsGrid";

import LatestFeature from "@/components/home/LatestFeature";

import LatestNews from "@/components/home/LatestNews";

import LatestTrailers from "@/components/home/LatestTrailers";

import LatestMovieReviews from "@/components/home/LatestMovieReviews";

import NewsletterSignup from "@/components/home/NewsletterSignup";

import TrendingPeople from "@/components/home/TrendingPeople";

export const metadata:
  Metadata = {
    alternates: {
      canonical: "/",
    },

    openGraph: {
      url: "/",
    },
  };

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050607] text-white">
      <SiteHeader />

      <BreakingBar />

      <HeroNewsGrid />

      <LatestTrailers />

      <section className="site-shell section-rule grid gap-8 py-9 lg:grid-cols-[1fr_1.2fr_0.9fr]">
        <LatestNews />

        <FeaturedStory />

        <ComingSoon />
      </section>

      <LatestFeature />

      <TrendingPeople />

      <LatestMovieReviews />

      <CategoryGrid />

      <NewsletterSignup />

      <SiteFooter />
    </main>
  );
}