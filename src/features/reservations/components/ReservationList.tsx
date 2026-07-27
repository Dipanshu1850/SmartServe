interface QueueItem {
  name: string;
  party: number;
  wait: number;
  self?: boolean;
}

interface ReservationListProps {
  queue: QueueItem[];
}

export function ReservationList({ queue }: ReservationListProps) {
  return (
    <div className="bg-surface text-surface-foreground rounded-2xl p-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
        <span className="text-[10px] font-mono uppercase tracking-widest opacity-60">
          Live Queue
        </span>
        <span className="text-[10px] font-mono text-primary">{queue.length} waiting</span>
      </div>
      <ol className="space-y-3">
        {queue.map((q, i) => (
          <li
            key={q.name}
            className={
              "flex items-center justify-between p-3 rounded-lg border " +
              (q.self
                ? "bg-primary/10 border-primary/30"
                : "bg-white/5 border-white/10")
            }
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] opacity-60 w-4">{i + 1}</span>
              <div>
                <div className="text-sm font-medium">{q.name}</div>
                <div className="text-[10px] font-mono opacity-60 uppercase">
                  Party of {q.party}
                </div>
              </div>
            </div>
            <span className="text-[10px] font-mono text-primary">~{q.wait}m</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
