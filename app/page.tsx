import Image from "next/image";

import ProductCard from "@/components/cards/ProductCard";
import { getProducts } from "@/action/products.action";
import { USD_DECIMALS } from "@/lib/constants";

export default async function page() {
  const { data: productsData } = await getProducts({ status: "active" });
  const products = ((productsData.products as any[]) || []).map((product) => ({
    ...product,
    price: product.price / USD_DECIMALS,
  }));

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
