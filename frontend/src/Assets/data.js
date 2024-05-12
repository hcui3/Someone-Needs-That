import { IoTicketOutline } from "react-icons/io5";
import { FiTag, FiPlusSquare, FiHeart, FiFileText } from "react-icons/fi";
import { BiCar, BiJoystick, BiBaseball, BiHomeSmile, BiBook, BiCabinet, BiCloset, BiDotsHorizontalRounded } from "react-icons/bi";

export const sidebarData = [
  { path: "/all", icon: BiHomeSmile, label: "Everything " },
  { path: "/electronics", icon: BiJoystick, label: "Electronics" },
  { path: "/vehicles", icon: BiCar, label: "Vehicles" },
  { path: "/furnitures", icon: BiCabinet, label: "Furnitures" },
  { path: "/books", icon: BiBook, label: "Books" },
  { path: "/clothing", icon: BiCloset, label: "Clothing" },
  { path: "/tickets", icon: IoTicketOutline, label: "Tickets" },
  { path: "/sports", icon: BiBaseball, label: "Sports" },
  { path: "/other", icon: BiDotsHorizontalRounded, label: "Other" },
];

export const navbarData = [
  { path: "/post", icon: FiPlusSquare },
  { path: "/selllist", icon: FiTag },
  { path: "/wishlist", icon: FiHeart },
  { path: "/orders", icon: FiFileText },
];

export const categories = [
  {
    path: "/all",
    banner: "All Categories",
    description: "Explore a universe of pre-loved goods across all categories—your ultimate destination for sustainable finds.",
    category: "",
  },
  {
    path: "/electronics",
    banner: "Electronics",
    description: "Upgrade your tech game with quality pre-owned electronics at a fraction of the cost.",
    category: "electronics",
  },
  {
    path: "/vehicles",
    banner: "Vehicles",
    description: "Find your next ride in our selection of used vehicles, where value meets convenience.",
    category: "vehicles",
  },
  {
    path: "/furnitures",
    banner: "Furnitures",
    description: "Revamp your space with affordable, pre-loved furniture that adds character and comfort.",
    category: "furnitures",
  },
  {
    path: "/books",
    banner: "Books",
    description: "Dive into a world of books, where every genre awaits at prices that love your wallet.",
    category: "books",
  },
  {
    path: "/tickets",
    banner: "Tickets",
    description: "Score deals on tickets to your favorite events—from concerts to sports, all for less.",
    category: "tickets",
  },
  {
    path: "/clothing",
    banner: "Clothing",
    description: "Refresh your wardrobe with fashion-forward, pre-loved clothing at unbeatable prices.",
    category: "clothing",
  },
  {
    path: "/sports",
    banner: "Sports",
    description: "Get the gear for your next adventure with our range of used sports equipment and apparel.",
    category: "sports",
  },
  {
    path: "/other",
    banner: "Other",
    description: "It's your go-to for everything unconventional and intriguing. Discover the delight in the rare and the one-of-a-kind!",
    category: "other",
  },
];

export const filters = {
  price: [
    { value: "0-25", label: "$0 - $25" },
    { value: "25-50", label: "$25 - $50" },
    { value: "50-100", label: "$50 - $100" },
    { value: "100-200", label: "$100 - $200" },
    { value: "200+", label: "$200+" },
  ],
};
