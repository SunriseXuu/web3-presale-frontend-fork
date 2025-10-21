import ProductCard from "@/components/ProductCard";

const products = [
  { id: 1, name: "Shampoo", price: 9.99, img: "/shampoo.png" },
  { id: 2, name: "Conditioner", price: 12.5, img: "/conditioner.png" },
  { id: 3, name: "Lotion", price: 15.0, img: "/lotion.png" },
  { id: 4, name: "Sunscreen", price: 20.0, img: "/sunscreen.png" },
  { id: 5, name: "Cleanser", price: 8.0, img: "/cleanser.png" },
  { id: 6, name: "Face Mask", price: 5.5, img: "/facemask.png" },
  { id: 7, name: "Lip Balm", price: 3.0, img: "/lipbalm.png" },
  { id: 8, name: "Body Lotion", price: 18.0, img: "/bodylotion.png" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Web3 Presale on Solana</h1>

      <div className="grid grid-cols-2 gap-3">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </main>
  );
}
