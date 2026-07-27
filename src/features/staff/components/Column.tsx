import React from "react";

export function Column({
  title,
  count,
  tint,
  children,
}: {
  title: string;
  count: number;
  tint: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <header className="flex items-baseline justify-between border-b border-white/10 pb-2">
        <span className={`text-[10px] font-mono uppercase tracking-widest ${tint}`}>{title}</span>
        <span className="font-display italic text-2xl">{count}</span>
      </header>
      <div className="space-y-3">{children}</div>
      {count === 0 && (
        <div className="text-[11px] font-mono uppercase tracking-widest text-white/30 py-6 text-center border border-dashed border-white/10 rounded-xl">
          Empty
        </div>
      )}
    </section>
  );
}
