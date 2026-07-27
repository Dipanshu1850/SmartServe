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
  // Indian Cuisine Additions
  {
    id: "m_ind1",
    name: "Tandoori Paneer Tikka",
    description: "Clay oven roasted cottage cheese, spices, bell peppers, mint chutney.",
    price: 320,
    category: "Starters",
    image: "https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=1200&q=80",
    tags: ["Veg", "GF", "Spicy"],
    available: 15,
    chefsChoice: true,
  },
  {
    id: "m_ind2",
    name: "Classic Butter Chicken",
    description: "Tandoori chicken shreds, rich tomato-butter cream gravy, dry fenugreek.",
    price: 550,
    category: "Mains",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1200&q=80",
    tags: ["Signature", "Non-Veg"],
    available: 10,
    chefsChoice: true,
  },
  {
    id: "m_ind3",
    name: "Peshawari Naan & Dal Makhani",
    description: "Garlic clay oven bread paired with 24-hour slow-cooked black lentils.",
    price: 380,
    category: "Mains",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80",
    tags: ["Veg", "Popular"],
    available: 25,
  },
  {
    id: "m_ind4",
    name: "Mango Lassi",
    description: "Traditional yogurt smoothie with Alphonso mango pulp and cardamom.",
    price: 180,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=1200&q=80",
    tags: ["Veg", "Cold"],
    available: 50,
  },
  {
    id: "m_ind5",
    name: "Saffron Kulfi Falooda",
    description: "Clotted milk frozen dessert, saffron, pistachio, vermicelli.",
    price: 220,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80",
    tags: ["Veg", "Sweet"],
    available: 12,
  },

  // Existing Classics scaled to INR
  {
    id: "m1",
    name: "Hand-Cut Tagliatelle",
    description: "Wild mushroom, truffle butter, aged pecorino.",
    price: 480,
    category: "Mains",
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=80",
    tags: ["Veg", "Signature"],
    available: 8,
  },
  {
    id: "m2",
    name: "Grilled Sea Bass",
    description: "Charred lemon, salsa verde, fennel.",
    price: 750,
    category: "Mains",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=80",
    tags: ["GF"],
    available: 5,
  },
  {
    id: "m3",
    name: "Wagyu Ribeye",
    description: "Aged 45 days, rosemary jus, Maldon salt.",
    price: 1450,
    category: "Mains",
    image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=1200&q=80",
    tags: ["Signature"],
    available: 0,
  },
  {
    id: "m4",
    name: "Heirloom Burrata",
    description: "Sun-gold tomatoes, basil oil, sourdough.",
    price: 380,
    category: "Starters",
    image: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=1200&q=80",
    tags: ["Veg", "GF"],
    available: 12,
  },
  {
    id: "m5",
    name: "Molten Chocolate",
    description: "Warm dark chocolate, vanilla bean gelato, berries.",
    price: 280,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=1200&q=80",
    tags: ["Veg"],
    available: 15,
  },
  {
    id: "m6",
    name: "Amber Sour",
    description: "Bourbon, honey, lemon, aromatic bitters.",
    price: 350,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80",
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
  { id: "ORD-1042", table: "T-12", items: [{ name: "Tandoori Paneer Tikka", qty: 2 }, { name: "Classic Butter Chicken", qty: 1 }], status: "preparing", minutes: 4, total: 1190 },
  { id: "ORD-1045", table: "T-04", items: [{ name: "Mango Lassi", qty: 4 }], status: "queued", minutes: 1, total: 720 },
  { id: "ORD-1046", table: "T-08", items: [{ name: "Classic Butter Chicken", qty: 2 }, { name: "Peshawari Naan & Dal Makhani", qty: 1 }], status: "preparing", minutes: 8, total: 1480 },
  { id: "ORD-1047", table: "T-02", items: [{ name: "Saffron Kulfi Falooda", qty: 2 }], status: "ready", minutes: 12, total: 440 },
  { id: "ORD-1048", table: "T-15", items: [{ name: "Tandoori Paneer Tikka", qty: 1 }, { name: "Mango Lassi", qty: 1 }], status: "queued", minutes: 0, total: 500 },
  { id: "ORD-1039", table: "T-06", items: [{ name: "Classic Butter Chicken", qty: 1 }], status: "served", minutes: 34, total: 550 },
  { id: "ORD-1040", table: "T-11", items: [{ name: "Wagyu Ribeye", qty: 1 }, { name: "Mango Lassi", qty: 2 }], status: "served", minutes: 42, total: 1810 },
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
  { id: "i1", name: "Paneer (Cottage Cheese)", unit: "kg", qty: 2.4, reorderAt: 5, supplier: "Amul Dairy" },
  { id: "i2", name: "Chicken Breasts", unit: "kg", qty: 8.2, reorderAt: 10, supplier: "Venkys Poultry" },
  { id: "i3", name: "Black Lentils (Urad)", unit: "kg", qty: 12.5, reorderAt: 5, supplier: "Kirana Mart" },
  { id: "i4", name: "Burrata", unit: "pcs", qty: 22, reorderAt: 10, supplier: "Latteria Bella" },
  { id: "i5", name: "Truffle Butter", unit: "kg", qty: 1.1, reorderAt: 1.5, supplier: "Umbria Imports" },
  { id: "i6", name: "Alphonso Mango Pulp", unit: "kg", qty: 18, reorderAt: 8, supplier: "Ratnagiri Farms" },
];

export const SALES_BY_DAY = [
  { day: "Mon", revenue: 42000, covers: 84 },
  { day: "Tue", revenue: 38000, covers: 76 },
  { day: "Wed", revenue: 49000, covers: 98 },
  { day: "Thu", revenue: 58000, covers: 118 },
  { day: "Fri", revenue: 86000, covers: 172 },
  { day: "Sat", revenue: 99000, covers: 198 },
  { day: "Sun", revenue: 74000, covers: 142 },
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
  { name: "Butter Chicken", sold: 112 },
  { name: "Paneer Tikka", sold: 94 },
  { name: "Peshawari Naan & Dal Makhani", sold: 88 },
  { name: "Mango Lassi", sold: 154 },
  { name: "Saffron Kulfi", sold: 62 },
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
  { id: "r1", name: "The Nook", city: "Bengaluru, KA", occupancy: 94, status: "live", monthly: 1480000 },
  { id: "r2", name: "Terra Cotta", city: "Mumbai, MH", occupancy: 82, status: "busy", monthly: 960000 },
  { id: "r3", name: "Salt & Iron", city: "New Delhi, DL", occupancy: 12, status: "idle", monthly: 720000 },
  { id: "r4", name: "Avenue Bistro", city: "Hyderabad, TS", occupancy: 0, status: "off", monthly: 0 },
  { id: "r5", name: "Olive & Ember", city: "Goa, GA", occupancy: 68, status: "busy", monthly: 1120000 },
  { id: "r6", name: "The Pass", city: "Chennai, TN", occupancy: 45, status: "live", monthly: 880000 },
];

export type Reservation = {
  id: string;
  name: string;
  party: number;
  time: string;
  status: "Pending" | "Arrived" | "Seated" | "Cancelled";
  phone?: string;
  notes?: string;
};

export const RESERVATIONS: Reservation[] = [
  { id: "res-001", name: "Jae Min", party: 2, time: "6:30 PM", status: "Arrived", phone: "+91-98XXX-XX001", notes: "Anniversary dinner" },
  { id: "res-002", name: "Priya Sharma", party: 4, time: "7:00 PM", status: "Seated", phone: "+91-98XXX-XX002" },
  { id: "res-003", name: "Mark Gupta", party: 5, time: "7:30 PM", status: "Pending", phone: "+91-98XXX-XX003", notes: "Window seat preferred" },
  { id: "res-004", name: "Devon Rao", party: 3, time: "8:00 PM", status: "Pending", phone: "+91-98XXX-XX004" },
  { id: "res-005", name: "Ananya Iyer", party: 6, time: "8:30 PM", status: "Pending", phone: "+91-98XXX-XX005", notes: "Birthday celebration" },
];
