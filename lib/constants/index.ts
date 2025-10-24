export const API_BASE_URL = "https://api.coinfair.xyz/my-shop/api/v1";
// export const API_BASE_URL = "http://10.242.230.140:8000/my-shop/api/v1";

export const AUTH_STORE = "MY_SHOP_TOKEN";
export const USER_STORE = "MY_SHOP_USER";

export const USD_DECIMALS = 10 ** 6;

// 订单入口常量
export const orderEntry = [
  {
    href: "/orders?status=pending",
    icon: "/pending-payment.svg",
    alt: "PENDING",
    label: "Pending",
  },
  {
    href: "/orders?status=paid",
    icon: "/paid.svg",
    alt: "PAID",
    label: "Paid",
  },
  {
    href: "/orders?status=cancelled",
    icon: "/cancelled.svg",
    alt: "CANCELLED",
    label: "Cancelled",
  },
  {
    href: "/orders?status=refund",
    icon: "/refund.svg",
    alt: "Refund",
    label: "Refund",
  },
];

// 订单状态常量
export const orderStatusMap = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Paid", value: "paid" },
  { label: "Cancelled", value: "cancelled" },
];

// 购买流程步骤常量
export const processSteps = [
  { process: 1, content: "Connect your favorite Solana wallet, such as Phantom." },
  { process: 2, content: "Browse and select products you like from the gallery." },
  { process: 3, content: "Complete your purchase using USDC." },
  { process: 4, content: "Enjoy your products delivered to your doorstep!" },
];

// 常见问题常量
export const faqs = [
  {
    id: 1,
    question: "What payment methods are accepted?",
    answer: "We accept payments in USDC via Solana wallets.",
  },
  {
    id: 2,
    question: "How do I connect my wallet?",
    answer: "Click on the Connect Wallet button in Account page and follow the instructions.",
  },
  {
    id: 3,
    question: "When will I receive my products?",
    answer: "Products will be shipped within 5-7 business days after purchase.",
  },
];
