import React, { useState, useMemo } from "react";
import { SiteNav } from "@/components/SiteNav";
import { DashboardLayout } from "@/features/shared/components/DashboardLayout";
import { useCustomer, CATEGORIES } from "../hooks/useCustomer";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import { ReserveForm } from "@/features/reservations/components/ReserveForm";
import { ReservationList } from "@/features/reservations/components/ReservationList";
import { ReservationService } from "@/features/reservations/services/reservation.service";
import { OpsCopilot } from "@/features/ai/components/OpsCopilot";
import {
  Home,
  Calendar,
  UtensilsCrossed,
  Clock,
  Heart,
  MessageSquare,
  Bell,
  User as UserIcon,
  History,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { MENU } from "@/lib/mock-data";
import { ProfileService } from "@/features/auth/services/auth.service";
import { loadStored, saveStored } from "@/lib/browser-storage";

const TABS = [
  { id: "home", label: "Home", icon: Home },
  { id: "reservations", label: "Reservations", icon: Calendar },
  { id: "menu", label: "Menu", icon: UtensilsCrossed },
  { id: "tracking", label: "Order Tracking", icon: Clock },
  { id: "favorites", label: "Favorites", icon: Heart },
  { id: "feedback", label: "Feedback", icon: MessageSquare },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "profile", label: "Profile", icon: UserIcon },
  { id: "recent", label: "Recent Orders", icon: History },
  { id: "ai", label: "AI Sommelier", icon: Sparkles },
];

export function CustomerPortalPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("home");

  // Customer hooks state
  const {
    category,
    setCategory,
    activeOrders,
    items,
    cartLines,
    total,
    add,
    place,
  } = useCustomer();
  const activeOrder = activeOrders[0];

  // Reservations state
  const [resMode, setResMode] = useState<"reserve" | "queue">("reserve");
  const [party, setParty] = useState(2);
  const [resConfirmed, setResConfirmed] = useState(false);
  const queue = useMemo(() => ReservationService.getLiveQueue(party), [party]);

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(["m1", "m4"]);
  function toggleFav(id: string) {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((x) => x !== id));
      toast.success("Removed from favorites");
    } else {
      setFavorites([...favorites, id]);
      toast.success("Added to favorites");
    }
  }

  // Feedback state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);
  function sendFeedback(e: React.FormEvent) {
    e.preventDefault();
    const feedback = loadStored<{ rating: number; comment: string; createdAt: string }[]>("smartserve:feedback", []);
    saveStored("smartserve:feedback", [
      { rating, comment, createdAt: new Date().toISOString() },
      ...feedback,
    ]);
    setFeedbackSent(true);
    toast.success("Thank you for your feedback!", { description: "We appreciate your rating." });
    setComment("");
  }

  // Profile Form state
  const [fullName, setFullName] = useState(user?.name || "Emily Johnson");
  const [phone, setPhone] = useState("+1 (555) 342-9904");
  const [avatar, setAvatar] = useState("");
  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to update your profile.");
      return;
    }

    try {
      await ProfileService.updateProfile(user.id, {
        full_name: fullName,
        phone,
        avatar_url: avatar || null,
      });
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Profile could not be updated.");
    }
  }

  // Central alerts state
  const { notifications, markAsRead } = useNotifications();

  return (
    <DashboardLayout
      role="customer"
      activeTab={activeTab}
      onTabChange={setActiveTab}
      tabs={TABS}
    >
      {/* 1. HOME TAB */}
      {activeTab === "home" && (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-primary/10 to-[#121214] border border-[#1e1e24] rounded-3xl p-8 relative overflow-hidden">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#a1a1aa] mb-2 block">
              Tonight at The Nook
            </span>
            <h2 className="font-display text-4xl md:text-5xl italic text-white">
              Welcome back, {user?.name || "Guest"}.
            </h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-lg leading-relaxed">
              Order directly to your table, summon our AI Sommelier, or split the check with ease.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#121214] border border-[#1e1e24] rounded-2xl p-5 text-left">
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#a1a1aa]">
                Reservations
              </span>
              <div className="font-display italic text-2xl text-white mt-2">
                {resConfirmed ? "Table for " + party : "No active bookings"}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                {resConfirmed ? "Confirmed at 7:30 PM" : "Join the live waitlist queue"}
              </p>
            </div>
            <div className="bg-[#121214] border border-[#1e1e24] rounded-2xl p-5 text-left">
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#a1a1aa]">
                Order Status
              </span>
              <div className="font-display italic text-2xl text-white mt-2">
                {activeOrder ? activeOrder.status.replace(/^./, (letter) => letter.toUpperCase()) : "No active order"}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                {activeOrder ? `${activeOrder.id} · Table ${activeOrder.table}` : "Add items from the menu to begin an order"}
              </p>
            </div>
            <div className="bg-[#121214] border border-[#1e1e24] rounded-2xl p-5 text-left">
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#a1a1aa]">
                Favorites
              </span>
              <div className="font-display italic text-2xl text-white mt-2">
                {favorites.length} saved dishes
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                Quick add items from favorites
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. RESERVATIONS TAB */}
      {activeTab === "reservations" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <ReserveForm
              mode={resMode}
              setMode={setResMode}
              party={party}
              setParty={setParty}
              confirmed={resConfirmed}
              setConfirmed={setResConfirmed}
            />
          </div>
          <div className="lg:col-span-5">
            <ReservationList queue={queue} />
          </div>
        </div>
      )}

      {/* 3. MENU TAB */}
      {activeTab === "menu" && (
        <div className="space-y-6">
          <div className="flex justify-between items-end border-b border-[#1e1e24] pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                Live catalog
              </span>
              <h2 className="font-display text-3xl italic text-white mt-1">Tonight's selection.</h2>
            </div>
            <div className="flex gap-1 overflow-x-auto pb-1 max-w-[50%]">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={
                    "px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest whitespace-nowrap transition-colors cursor-pointer " +
                    (c === category
                      ? "bg-foreground text-background"
                      : "border border-[#1e1e24] text-muted-foreground hover:text-white")
                  }
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-20">
            {items.map((item) => (
              <article
                key={item.id}
                className={
                  "bg-[#121214] border border-[#1e1e24] rounded-2xl overflow-hidden flex flex-col " +
                  (item.available === 0 ? "opacity-50" : "")
                }
              >
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full aspect-[4/3] object-cover"
                  />
                  <button
                    onClick={() => toggleFav(item.id)}
                    className="absolute top-3 right-3 size-8 rounded-full bg-black/60 flex items-center justify-center border border-white/10 hover:bg-black/90 transition-colors cursor-pointer"
                    aria-label="Save to favorites"
                  >
                    <Heart
                      className={
                        "size-4 transition-colors " +
                        (favorites.includes(item.id)
                          ? "fill-primary text-primary"
                          : "text-white")
                      }
                    />
                  </button>
                  {item.chefsChoice && (
                    <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[9px] font-mono uppercase tracking-widest px-2 py-1 rounded">
                      Chef's Choice
                    </span>
                  )}
                  {item.available === 0 && (
                    <div className="absolute inset-0 grid place-items-center bg-black/70 backdrop-blur-[1px]">
                      <span className="font-display italic text-2xl text-white">86'd tonight</span>
                    </div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col gap-3">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-semibold text-white text-sm">{item.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                    </div>
                    <span className="font-mono text-primary text-sm shrink-0">
                      ₹{item.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {item.available > 0 ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-accent/5 border border-accent/20 rounded-full">
                        <span className="size-1.5 rounded-full bg-accent pulse-status" />
                        <span className="text-[10px] font-bold text-accent uppercase tracking-tighter">
                          {item.available} left
                        </span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 bg-destructive/5 border border-destructive/20 rounded-full text-[10px] font-bold text-destructive uppercase tracking-tighter">
                        Unavailable
                      </span>
                    )}
                    {item.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-mono uppercase tracking-tighter text-muted-foreground border border-[#1e1e24] px-2 py-0.5 rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <button
                    disabled={item.available === 0}
                    onClick={() => add(item)}
                    className="mt-2 py-2 rounded-full text-[11px] font-mono uppercase tracking-widest bg-foreground text-background disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    Add to order
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Sticky cart bar inside menu tab */}
          {cartLines.length > 0 && (
            <div className="fixed bottom-6 right-6 left-6 md:left-[270px] z-20 bg-[#121214]/90 border border-[#1e1e24] rounded-2xl p-4 shadow-2xl flex items-center justify-between backdrop-blur">
              <div>
                <span className="text-[9px] font-mono text-muted-foreground uppercase">
                  {cartLines.length} Items Selected
                </span>
                <div className="font-display italic text-2xl text-white">₹{total.toFixed(2)}</div>
              </div>
              <button
                onClick={place}
                className="px-6 py-3 rounded-full bg-primary text-primary-foreground text-[11px] font-mono uppercase tracking-widest hover:opacity-90 cursor-pointer"
              >
                Send to kitchen →
              </button>
            </div>
          )}
        </div>
      )}

      {/* 4. ORDER TRACKING TAB */}
      {activeTab === "tracking" && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-[#121214] border border-[#1e1e24] rounded-2xl p-6">
            <span className="text-[9px] font-mono uppercase tracking-widest text-[#a1a1aa] mb-2 block">
              Order Tracking
            </span>
            <div className="font-display italic text-3xl text-white">
              {activeOrders.length > 0 ? `${activeOrders.length} active order${activeOrders.length === 1 ? "" : "s"}.` : "No active orders."}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {activeOrders.length > 0 ? "Each order remains here until it is served." : "Submit an order in the menu tab to track progress live."}
            </p>
          </div>

          {activeOrders.map((order) => (
            <div key={order.id} className="bg-[#121214] border border-[#1e1e24] rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-display italic text-2xl text-white">{order.id}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Table {order.table} · {order.items.map((item) => `${item.qty}× ${item.name}`).join(", ")}
                  </p>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-primary">{order.status}</span>
              </div>
              <ol className="space-y-3">
                {[
                  ["Order placed", true],
                  ["Preparing in kitchen", order.status !== "queued"],
                  ["Passed to server", order.status === "ready" || order.status === "served"],
                  [`Served at Table ${order.table}`, order.status === "served"],
                ].map(([label, active], idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-white">
                    <span className={"size-2 rounded-full " + (active ? "bg-accent pulse-status" : "bg-[#1e1e24]")} />
                    <span className={active ? "font-semibold" : "text-muted-foreground"}>{label}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      )}

      {/* 5. FAVORITES TAB */}
      {activeTab === "favorites" && (
        <div className="space-y-6">
          <h2 className="font-display text-3xl italic text-white">Your favorites.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {MENU.filter((m) => favorites.includes(m.id)).map((item) => (
              <article
                key={item.id}
                className="bg-[#121214] border border-[#1e1e24] rounded-2xl overflow-hidden flex"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover shrink-0"
                />
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="text-xs font-semibold text-white">{item.name}</h4>
                      <span className="font-mono text-[10px] text-primary mt-1 block">
                        ₹{item.price.toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleFav(item.id)}
                      className="size-6 text-primary hover:text-white"
                      aria-label="Remove favorite"
                    >
                      <Heart className="size-4 fill-primary text-primary" />
                    </button>
                  </div>
                  <button
                    onClick={() => add(item)}
                    className="w-full mt-2 py-1 bg-white text-black text-[9px] font-mono uppercase tracking-widest rounded-lg cursor-pointer"
                  >
                    Quick Add
                  </button>
                </div>
              </article>
            ))}
            {favorites.length === 0 && (
              <p className="text-xs text-muted-foreground italic col-span-2 py-6 text-center">
                Dishes you favorite will display here.
              </p>
            )}
          </div>
        </div>
      )}

      {/* 6. FEEDBACK TAB */}
      {activeTab === "feedback" && (
        <div className="max-w-md mx-auto">
          <form
            onSubmit={sendFeedback}
            className="bg-[#121214] border border-[#1e1e24] rounded-2xl p-6 space-y-4 text-left"
          >
            <div className="text-center">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#a1a1aa]">
                Customer voice
              </span>
              <h3 className="font-display italic text-2xl text-white mt-1">Rate your shift.</h3>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                Rating
              </label>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className={
                      "size-10 rounded-lg text-sm font-mono border transition-colors cursor-pointer " +
                      (s <= rating ? "bg-primary/20 border-primary text-primary" : "border-[#1e1e24] text-muted")
                    }
                  >
                    {s} ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                Comments
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us what you liked..."
                required
                className="mt-1 w-full bg-background border border-[#1e1e24] rounded-lg p-3 text-sm text-white placeholder:text-muted focus:outline-none focus:border-primary min-h-[100px]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary text-primary-foreground text-[11px] font-mono uppercase tracking-widest rounded-full hover:opacity-90 transition-opacity cursor-pointer"
            >
              Submit Review
            </button>
          </form>
        </div>
      )}

      {/* 7. NOTIFICATIONS TAB */}
      {activeTab === "notifications" && (
        <div className="max-w-xl mx-auto space-y-4">
          <h2 className="font-display text-3xl italic text-white mb-6">Recent Alerts</h2>
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={
                "p-4 rounded-xl border flex items-start gap-4 transition-colors cursor-pointer " +
                (n.read ? "bg-[#121214]/50 border-[#1e1e24]/70 opacity-60" : "bg-[#181822]/80 border-primary/20")
              }
            >
              <span className="size-2 rounded-full bg-primary mt-2" />
              <div className="flex-1 text-left">
                <h4 className="text-sm font-semibold text-white">{n.title}</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{n.message}</p>
                <span className="text-[9px] font-mono text-muted/40 block mt-2">
                  {new Date(n.createdAt).toLocaleDateString()} ·{" "}
                  {new Date(n.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          {notifications.length === 0 && (
            <p className="text-xs text-muted-foreground italic py-10 text-center">
              No new alerts.
            </p>
          )}
        </div>
      )}

      {/* 8. PROFILE TAB */}
      {activeTab === "profile" && (
        <div className="max-w-md mx-auto">
          <form
            onSubmit={saveProfile}
            className="bg-[#121214] border border-[#1e1e24] rounded-2xl p-6 space-y-4 text-left"
          >
            <div className="text-center">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#a1a1aa]">
                Customer Card
              </span>
              <h3 className="font-display italic text-2xl text-white mt-1">Profile Details.</h3>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                Full Name
              </label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="mt-1 w-full bg-background border border-[#1e1e24] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                Email
              </label>
              <input
                value={user?.email || ""}
                disabled
                className="mt-1 w-full bg-[#18181b]/50 border border-[#1e1e24] rounded-lg px-3 py-2 text-sm text-muted-foreground"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                Phone Number
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full bg-background border border-[#1e1e24] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary text-primary-foreground text-[11px] font-mono uppercase tracking-widest rounded-full hover:opacity-90 transition-opacity cursor-pointer"
            >
              Save Profile
            </button>
          </form>
        </div>
      )}

      {/* 9. RECENT ORDERS TAB */}
      {activeTab === "recent" && (
        <div className="max-w-xl mx-auto space-y-6">
          <h2 className="font-display text-3xl italic text-white mb-6">Recent Receipts</h2>
          {[
            { id: "ORD-1032", date: "2026-07-20", items: "1× Tagliatelle, 1× Burrata", total: 860.0 },
            { id: "ORD-1025", date: "2026-07-12", items: "2× Amber Sour, 1× Sea Bass", total: 1100.0 },
            { id: "ORD-1011", date: "2026-06-28", items: "1× Molten Chocolate", total: 280.0 },
          ].map((o) => (
            <div
              key={o.id}
              className="bg-[#121214] border border-[#1e1e24] rounded-xl p-4 flex justify-between items-center text-left"
            >
              <div>
                <span className="text-[9px] font-mono text-primary uppercase">{o.id}</span>
                <h4 className="text-sm font-semibold text-white mt-1">{o.items}</h4>
                <span className="text-[10px] text-muted-foreground block mt-1">
                  Ordered on {o.date}
                </span>
              </div>
              <span className="font-mono text-white text-base">₹{o.total.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}

      {/* 10. AI FOOD ASSISTANT */}
      {activeTab === "ai" && (
        <div className="space-y-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#a1a1aa]">
              Smart Sommelier
            </span>
            <h2 className="font-display text-3xl italic text-white mt-1">AI Food Advisor.</h2>
          </div>
          <OpsCopilot />
        </div>
      )}
    </DashboardLayout>
  );
}
export default CustomerPortalPage;
