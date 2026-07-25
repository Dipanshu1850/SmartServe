import tagliatelle from "@/assets/dish-tagliatelle.jpg";
import seabass from "@/assets/dish-seabass.jpg";
import ribeye from "@/assets/dish-ribeye.jpg";
import burrata from "@/assets/dish-burrata.jpg";
import lava from "@/assets/dish-lava.jpg";
import cocktail from "@/assets/dish-cocktail.jpg";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "Starters" | "Mains" | "Desserts" | "Drinks";
  image: string;
  tags: string[];
  available: number; // remaining today; 0 = 86'd
  chefsChoice?: boolean;
};

export const MENU: MenuItem[] = [
  {
    id: "m1",
    name: "Hand-Cut Tagliatelle",
    description: "Wild mushroom, truffle butter, aged pecorino.",
    price: 24,
    category: "Mains",
    image: tagliatelle,
    tags: ["Veg", "Signature"],
    available: 8,
    chefsChoice: true,
  },
  {
    id: "m2",
    name: "Grilled Sea Bass",
    description: "Charred lemon, salsa verde, fennel.",
    price: 32,
    category: "Mains",
    image: seabass,
    tags: ["GF"],
    available: 5,
  },
  {
    id: "m3",
    name: "Wagyu Ribeye",
    description: "Aged 45 days, rosemary jus, Maldon salt.",
    price: 48,
    category: "Mains",
    image: ribeye,
    tags: ["Signature"],
    available: 0,
  },
  {
    id: "m4",
    name: "Heirloom Burrata",
    description: "Sun-gold tomatoes, basil oil, sourdough.",
    price: 18,
    category: "Starters",
    image: burrata,
    tags: ["Veg", "GF"],
    available: 12,
    chefsChoice: true,
  },
  {
    id: "m5",
    name: "Molten Chocolate",
    description: "Warm dark chocolate, vanilla bean gelato, berries.",
    price: 14,
    category: "Desserts",
    image: lava,
    tags: ["Veg"],
    available: 15,
  },
  {
    id: "m6",
    name: "Amber Sour",
    description: "Bourbon, honey, lemon, aromatic bitters.",
    price: 16,
    category: "Drinks",
    image: cocktail,
    tags: ["21+"],
    available: 40,
  },
];

export type OrderStatus = "queued" | "preparing" | "ready" | "served";
export type Order = {
  id: string;
  table: string;
  items: { name: string; qty: number }[];
  status: OrderStatus;
  minutes: number;
  total: number;
};

export const ORDERS: Order[] = [
  { id: "ORD-1042", table: "T-12", items: [{ name: "Ribeye", qty: 2 }, { name: "Sea Bass", qty: 1 }], status: "preparing", minutes: 4, total: 128 },
  { id: "ORD-1045", table: "T-04", items: [{ name: "Amber Sour", qty: 4 }], status: "queued", minutes: 1, total: 64 },
  { id: "ORD-1046", table: "T-08", items: [{ name: "Tagliatelle", qty: 2 }, { name: "Burrata", qty: 1 }], status: "preparing", minutes: 8, total: 66 },
  { id: "ORD-1047", table: "T-02", items: [{ name: "Molten Chocolate", qty: 2 }], status: "ready", minutes: 12, total: 28 },
  { id: "ORD-1048", table: "T-15", items: [{ name: "Burrata", qty: 1 }, { name: "Sea Bass", qty: 1 }], status: "queued", minutes: 0, total: 50 },
  { id: "ORD-1039", table: "T-06", items: [{ name: "Tagliatelle", qty: 1 }], status: "served", minutes: 34, total: 24 },
  { id: "ORD-1040", table: "T-11", items: [{ name: "Ribeye", qty: 1 }, { name: "Amber Sour", qty: 2 }], status: "served", minutes: 42, total: 80 },
];

export type Table = {
  id: string;
  seats: number;
  status: "free" | "occupied" | "reserved" | "cleaning";
  x: number;
  y: number;
};

export const TABLES: Table[] = [
  { id: "T-01", seats: 2, status: "free", x: 10, y: 15 },
  { id: "T-02", seats: 2, status: "occupied", x: 30, y: 15 },
  { id: "T-03", seats: 4, status: "reserved", x: 55, y: 15 },
  { id: "T-04", seats: 4, status: "occupied", x: 80, y: 15 },
  { id: "T-06", seats: 6, status: "free", x: 15, y: 45 },
  { id: "T-08", seats: 4, status: "occupied", x: 45, y: 45 },
  { id: "T-11", seats: 2, status: "cleaning", x: 70, y: 45 },
  { id: "T-12", seats: 8, status: "occupied", x: 25, y: 75 },
  { id: "T-14", seats: 4, status: "reserved", x: 55, y: 75 },
  { id: "T-15", seats: 2, status: "occupied", x: 82, y: 75 },
];

export type InventoryItem = {
  id: string;
  name: string;
  unit: string;
  qty: number;
  reorderAt: number;
  supplier: string;
};

export const INVENTORY: InventoryItem[] = [
  { id: "i1", name: "Wagyu Ribeye", unit: "kg", qty: 0.4, reorderAt: 5, supplier: "Prime Cuts Co." },
  { id: "i2", name: "Sea Bass Fillet", unit: "kg", qty: 3.2, reorderAt: 4, supplier: "Coastal Harvest" },
  { id: "i3", name: "Wild Mushrooms", unit: "kg", qty: 6.5, reorderAt: 3, supplier: "Forager's Market" },
  { id: "i4", name: "Burrata", unit: "pcs", qty: 22, reorderAt: 10, supplier: "Latteria Bella" },
  { id: "i5", name: "Truffle Butter", unit: "kg", qty: 1.1, reorderAt: 1.5, supplier: "Umbria Imports" },
  { id: "i6", name: "Bourbon (Amber)", unit: "btl", qty: 8, reorderAt: 6, supplier: "House Spirits" },
];

export const SALES_BY_DAY = [
  { day: "Mon", revenue: 3200, covers: 84 },
  { day: "Tue", revenue: 2900, covers: 76 },
  { day: "Wed", revenue: 3800, covers: 98 },
  { day: "Thu", revenue: 4600, covers: 118 },
  { day: "Fri", revenue: 6800, covers: 172 },
  { day: "Sat", revenue: 7900, covers: 198 },
  { day: "Sun", revenue: 5400, covers: 142 },
];

export const HOURLY = [
  { hr: "5p", covers: 12 },
  { hr: "6p", covers: 28 },
  { hr: "7p", covers: 52 },
  { hr: "8p", covers: 61 },
  { hr: "9p", covers: 44 },
  { hr: "10p", covers: 22 },
];

export const TOP_ITEMS = [
  { name: "Tagliatelle", sold: 84 },
  { name: "Burrata", sold: 62 },
  { name: "Sea Bass", sold: 48 },
  { name: "Ribeye", sold: 31 },
  { name: "Amber Sour", sold: 118 },
];

export type Restaurant = {
  id: string;
  name: string;
  city: string;
  occupancy: number;
  status: "live" | "busy" | "idle" | "off";
  monthly: number;
};

export const RESTAURANTS: Restaurant[] = [
  { id: "r1", name: "The Nook", city: "Brooklyn, NY", occupancy: 94, status: "live", monthly: 148000 },
  { id: "r2", name: "Terra Cotta", city: "Austin, TX", occupancy: 82, status: "busy", monthly: 96000 },
  { id: "r3", name: "Salt & Iron", city: "Portland, OR", occupancy: 12, status: "idle", monthly: 72000 },
  { id: "r4", name: "Avenue Bistro", city: "Chicago, IL", occupancy: 0, status: "off", monthly: 0 },
  { id: "r5", name: "Olive & Ember", city: "Los Angeles, CA", occupancy: 68, status: "busy", monthly: 112000 },
  { id: "r6", name: "The Pass", city: "Seattle, WA", occupancy: 45, status: "live", monthly: 88000 },
];
