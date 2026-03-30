export default function LogoMark({ imgClass = "h-7 w-auto", textClass = "text-xl" }: { imgClass?: string; textClass?: string }) {
  return (
    <div className="flex items-center gap-2">
      <img src="/logo.svg" alt="Greater Agents" className={imgClass} />
      <span className={`font-bold tracking-tight ${textClass}`}>
        <span style={{ color: "#4e8565" }}>Greater</span>
        <span className="text-(--color-text)"> Agents</span>
      </span>
    </div>
  );
}
