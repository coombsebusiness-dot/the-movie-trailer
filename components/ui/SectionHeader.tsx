import Link from "next/link";

type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  actionHref?: string;
};

export default function SectionHeader({
  title,
  actionLabel,
  actionHref,
}: SectionHeaderProps) {
  return (
    <div className="mb-5 flex items-end justify-between gap-6">
      <h2 className="text-2xl font-black uppercase tracking-[-0.04em] md:text-3xl">
        {title}
      </h2>

      {actionLabel ? (
        actionHref ? (
          <Link
            href={actionHref}
            className="text-[10px] font-black uppercase tracking-[0.12em] text-white/55 transition-colors hover:text-[#f21f2b]"
          >
            {actionLabel}
          </Link>
        ) : (
          <span className="text-[10px] font-black uppercase tracking-[0.12em] text-white/55">
            {actionLabel}
          </span>
        )
      ) : null}
    </div>
  );
}