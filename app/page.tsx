import ProductCard from "@/components/ProductCard";

const products = [
  { id: 1, name: "去屑洗发水", price: "9.99 USDC", img: "/shampoo.jpg" },
  { id: 2, name: "护发素", price: "12.5 USDC", img: "/conditioner.jpg" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen p-4">
      <h1 className="text-lg font-bold mb-4">🔥 限时预售</h1>
      <div className="grid grid-cols-2 gap-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </main>
  );
}
