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
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Delicious%20Tandoori%20Paneer%20Tikka%2C%20grilled%20cottage%20cheese%20cubes%20with%20bell%20peppers%20and%20onions%2C%20served%20on%20a%20platter%20with%20mint%20chutney%2C%20professional%20food%20photography%2C%204k&image_size=landscape_4_3", // Tandoori Paneer Tikka
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
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Authentic%20Indian%20Butter%20Chicken%2C%20creamy%20tomato%20gravy%20with%20tender%20chicken%20pieces%2C%20served%20in%20a%20traditional%20copper%20bowl%2C%20garnished%20with%20cream%20and%20coriander%2C%20professional%20food%20photography%2C%204k&image_size=landscape_4_3", // Classic Butter Chicken
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
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Slow-cooked%20Dal%20Makhani%20in%20a%20black%20bowl%20paired%20with%20buttery%20Peshawari%20Naan%2C%20professional%20food%20photography%2C%204k&image_size=landscape_4_3", // Peshawari Naan & Dal Makhani
    tags: ["Veg", "Popular"],
    available: 25,
  },
  {
    id: "m_ind4",
    name: "Mango Lassi",
    description: "Traditional yogurt smoothie with Alphonso mango pulp and cardamom.",
    price: 180,
    category: "Drinks",
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Refreshing%20Mango%20Lassi%20in%20a%20tall%20glass%2C%20garnished%20with%20saffron%20strands%20and%20pistachio%20bits%2C%20professional%20food%20photography%2C%204k&image_size=landscape_4_3", // Mango Lassi
    tags: ["Veg", "Cold"],
    available: 50,
  },
  {
    id: "m_ind5",
    name: "Saffron Kulfi Falooda",
    description: "Clotted milk frozen dessert, saffron, pistachio, vermicelli.",
    price: 220,
    category: "Desserts",
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Traditional%20Saffron%20Kulfi%20Falooda%20served%20in%20a%20glass%20bowl%2C%20clotted%20milk%20ice%20cream%20with%20vermicelli%2C%20rose%20syrup%20and%20nuts%2C%20professional%20food%20photography%2C%204k&image_size=landscape_4_3", // Saffron Kulfi Falooda
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
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Hand-Cut%20Tagliatelle%20with%20wild%20mushroom%2C%20truffle%20butter%2C%20aged%20pecorino%2C%20professional%20food%20photography%2C%204k&image_size=landscape_4_3", // Hand-Cut Tagliatelle
    tags: ["Veg", "Signature"],
    available: 8,
  },
  {
    id: "m2",
    name: "Grilled Sea Bass",
    description: "Charred lemon, salsa verde, fennel.",
    price: 750,
    category: "Mains",
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Grilled%20Sea%20Bass%20with%20charred%20lemon%2C%20salsa%20verde%2C%20fennel%2C%20professional%20food%20photography%2C%204k&image_size=landscape_4_3", // Grilled Sea Bass
    tags: ["GF"],
    available: 5,
  },
  {
    id: "m3",
    name: "Wagyu Ribeye",
    description: "Aged 45 days, rosemary jus, Maldon salt.",
    price: 1450,
    category: "Mains",
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Wagyu%20Ribeye%20steak%2C%20aged%2045%20days%2C%20rosemary%20jus%2C%20Maldon%20salt%2C%20professional%20food%20photography%2C%204k&image_size=landscape_4_3", // Wagyu Ribeye
    tags: ["Signature"],
    available: 0,
  },
  {
    id: "m4",
    name: "Heirloom Burrata",
    description: "Sun-gold tomatoes, basil oil, sourdough.",
    price: 380,
    category: "Starters",
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Heirloom%20Burrata%20with%20sun-gold%20tomatoes%2C%20basil%20oil%2C%20sourdough%2C%20professional%20food%20photography%2C%204k&image_size=landscape_4_3", // Heirloom Burrata
    tags: ["Veg", "GF"],
    available: 12,
  },
  {
    id: "m5",
    name: "Molten Chocolate",
    description: "Warm dark chocolate, vanilla bean gelato, berries.",
    price: 280,
    category: "Desserts",
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Molten%20Chocolate%20cake%2C%20warm%20dark%20chocolate%2C%20vanilla%20bean%20gelato%2C%20berries%2C%20professional%20food%20photography%2C%204k&image_size=landscape_4_3", // Molten Chocolate
    tags: ["Veg"],
    available: 15,
  },
  {
    id: "m6",
    name: "Amber Sour",
    description: "Bourbon, honey, lemon, aromatic bitters.",
    price: 350,
    category: "Drinks",
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Amber%20Sour%20cocktail%2C%20bourbon%2C%20honey%2C%20lemon%2C%20aromatic%20bitters%2C%20professional%20food%20photography%2C%204k&image_size=landscape_4_3", // Amber Sour
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
