import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { notificationService, type NotificationItem } from "../services/notification.service";
import { toast } from "sonner";

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const prevCountRef = useRef(0);

  useEffect(() => {
    return notificationService.subscribe((list) => {
      const filtered = user
        ? list.filter((n) => n.roles.includes(user.role))
        : [];

      setNotifications(filtered);

      if (list.length > prevCountRef.current && prevCountRef.current !== 0) {
        const newest = list[0];
        if (user && newest.roles.includes(user.role)) {
          const type = newest.type === "error" ? "error" : newest.type === "warning" ? "warning" : newest.type === "success" ? "success" : "info";

          if (type === "success") {
            toast.success(newest.title, { description: newest.message });
          } else if (type === "error") {
            toast.error(newest.title, { description: newest.message });
          } else {
            toast(newest.title, { description: newest.message });
          }
        }
      }
      prevCountRef.current = list.length;
    });
  }, [user]);

  const send = (title: string, message: string, type: NotificationItem["type"] = "info", roles?: NotificationItem["roles"]) => {
    notificationService.sendNotification(title, message, type, roles);
  };

  const markAsRead = (id: string) => {
    notificationService.markAsRead(id);
  };

  const markAllAsRead = () => {
    notificationService.markAllAsRead();
  };

  const clearAll = () => {
    notificationService.clearAll();
  };

  return {
    notifications,
    unreadCount: notifications.filter((n) => !n.read).length,
    send,
    markAsRead,
    markAllAsRead,
    clearAll,
  };
}
export type { NotificationItem };
