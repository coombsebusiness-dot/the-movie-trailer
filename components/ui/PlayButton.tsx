type PlayButtonProps = {
  size?: "small" | "medium";
};

export default function PlayButton({
  size = "medium",
}: PlayButtonProps) {
  const sizeClasses =
    size === "small"
      ? "h-9 w-9 text-xs"
      : "h-11 w-11 text-sm";

  return (
    <span
      className={`relative z-10 flex items-center justify-center rounded-full border-2 border-white bg-black/60 pl-[2px] transition-transform group-hover:scale-110 ${sizeClasses}`}
      aria-hidden="true"
    >
      ▶
    </span>
  );
}