import { supabase } from "@/lib/supabase";

export type RealtimeCallback = (eventType: string, data: any) => void;

class RealtimeService {
  private channel = supabase.channel("restaurant-realtime", {
    config: {
      broadcast: { self: true },
    },
  });
  private listeners = new Set<RealtimeCallback>();

  constructor() {
    if (typeof window !== "undefined") {
      this.channel
        .on("broadcast", { event: "sync" }, ({ payload }) => {
          if (payload) {
            const { eventType, data } = payload;
            this.listeners.forEach((cb) => cb(eventType, data));
          }
        })
        .subscribe();
    }
  }

  public publish(eventType: string, data: any) {
    if (typeof window !== "undefined") {
      this.channel.send({
        type: "broadcast",
        event: "sync",
        payload: { eventType, data },
      });
    }
  }

  public subscribe(cb: RealtimeCallback): () => void {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }
}

export const realtimeService = new RealtimeService();
