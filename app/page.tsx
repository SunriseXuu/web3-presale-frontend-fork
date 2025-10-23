import Image from "next/image";

import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/action/products.action";

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

export default async function page() {
  const { data: productsData } = await getProducts();
  console.log("Products Data:", productsData);

  return (
    <div className="min-h-screen flex flex-col pb-6 gap-6">
      <section className="relative h-48 overflow-hidden">
        <Image
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-auto object-cover z-0"
          src="/cover.png"
          alt="Cover"
          width={450}
          height={300}
        />
        <div className="absolute inset-x-0 top-1/3 bottom-0 bg-linear-to-t from-black to-transparent" />

        <div className="absolute inset-x-4 bottom-4 flex flex-col gap-2">
          <h1 className="text-2xl font-bold leading-tight drop-shadow">
            The Only Web3 Presale Platform You&apos;ll Ever Need
          </h1>
        </div>
      </section>

      <section className="flex flex-col px-4 gap-4">
        <h1 className="text-2xl font-bold">Products Gallery</h1>

        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>
    </div>
  );
}
