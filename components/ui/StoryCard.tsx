type StoryCardProps = {
  title: string;
  meta?: string;
  compact?: boolean;
  imageUrl?: string | null;
};

export default function StoryCard({
  title,
  meta = "Latest update",
  compact = false,
  imageUrl = null,
}: StoryCardProps) {
  return (
    <article
      className={
        compact
          ? "grid grid-cols-[90px_1fr] gap-4"
          : "grid grid-cols-[120px_1fr] gap-4"
      }
    >
      <div className="movie-card-image relative aspect-video overflow-hidden border border-white/[0.08]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : null}
      </div>

      <div>
        <h3 className="text-sm font-black leading-tight transition group-hover:text-[#f21f2b]">
          {title}
        </h3>

        <p className="mt-2 text-[10px] text-white/35">
          {meta}
        </p>
      </div>
    </article>
  );
}