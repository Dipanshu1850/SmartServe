import { realtimeService } from "@/features/services/realtime.service";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  createdAt: string;
  roles: ("customer" | "staff" | "manager" | "owner")[];
  read: boolean;
}

type NotificationListener = (items: NotificationItem[]) => void;

class NotificationService {
  private notifications: NotificationItem[] = [];
  private listeners = new Set<NotificationListener>();

  constructor() {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("smartserve.notifications");
      if (stored) {
        try {
          this.notifications = JSON.parse(stored);
        } catch {
          this.notifications = [];
        }
      }

      // Listen to realtime broadcast
      realtimeService.subscribe((eventType, data) => {
        if (eventType === "notification:new") {
          this.addLocalNotification(data);
        }
      });
    }
  }

  private save() {
    if (typeof window !== "undefined") {
      localStorage.setItem("smartserve.notifications", JSON.stringify(this.notifications));
      this.listeners.forEach((cb) => cb([...this.notifications]));
    }
  }

  private addLocalNotification(item: NotificationItem) {
    if (this.notifications.some((n) => n.id === item.id)) return;
    this.notifications = [item, ...this.notifications];
    this.save();
  }

  public sendNotification(
    title: string,
    message: string,
    type: NotificationItem["type"] = "info",
    roles: NotificationItem["roles"] = ["customer", "staff", "manager", "owner"]
  ) {
    const item: NotificationItem = {
      id: `NOT-${Math.floor(1000 + Math.random() * 9000)}`,
      title,
      message,
      type,
      createdAt: new Date().toISOString(),
      roles,
      read: false,
    };

    this.addLocalNotification(item);
    realtimeService.publish("notification:new", item);
  }

  public getNotifications(): NotificationItem[] {
    return [...this.notifications];
  }

  public markAsRead(id: string) {
    this.notifications = this.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    this.save();
  }

  public markAllAsRead() {
    this.notifications = this.notifications.map((n) => ({ ...n, read: true }));
    this.save();
  }

  public clearAll() {
    this.notifications = [];
    this.save();
  }

  public subscribe(cb: NotificationListener): () => void {
    this.listeners.add(cb);
    cb([...this.notifications]);
    return () => {
      this.listeners.delete(cb);
    };
  }
}

export const notificationService = new NotificationService();
