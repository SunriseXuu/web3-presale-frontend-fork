export default function AppPlaceholder({
  text,
  mode,
  isShow,
}: {
  text: string;
  mode: "loading" | "normal";
  isShow: boolean;
}) {
  if (!isShow) return null;

  return (
    <div className="w-full flex justify-center items-center py-4 gap-2">
      {mode === "loading" && <img className="animate-spin" src="/loading.svg" alt="Loading" width={16} height={16} />}
      <span className="text-zinc-400">{text}</span>
    </div>
  );
}
