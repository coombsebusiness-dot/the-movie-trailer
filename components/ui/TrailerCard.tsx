import PlayButton from "./PlayButton";

type TrailerCardProps = {
  title: string;
  type?: string;
  index?: number;
};

export default function TrailerCard({
  title,
  type = "Official Trailer",
  index = 0,
}: TrailerCardProps) {
  const gradient =
    index % 3 === 0
      ? "bg-[radial-gradient(circle_at_40%_40%,rgba(242,31,43,0.26),transparent_45%)]"
      : index % 3 === 1
        ? "bg-[radial-gradient(circle_at_70%_25%,rgba(85,105,140,0.28),transparent_48%)]"
        : "bg-[radial-gradient(circle_at_50%_50%,rgba(170,170,170,0.16),transparent_50%)]";

  return (
    <article className="group">
      <div className="movie-card-image flex aspect-video items-center justify-center border border-white/10 transition duration-300 group-hover:border-[#f21f2b]/70">
        <div
          className={`absolute inset-0 ${gradient}`}
        />

        <PlayButton />
      </div>

      <h3 className="mt-3 text-sm font-black leading-tight">
        {title}
      </h3>

      <p className="mt-1 text-[10px] text-white/45">
        {type}
      </p>
    </article>
  );
}