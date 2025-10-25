"use client";

import { useEffect, useRef, useState } from "react";
// // import Image from "next/image";

import ProductCard, { ProductType } from "@/components/cards/ProductCard";
import AppPlaceholder from "@/components/shared/AppPlaceholder";

import { getProducts } from "@/action/products.action";

export default function HomePage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [currPage, setCurrPage] = useState<number>(1);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const totalPageRef = useRef<number>(1); // 防止拉取超过总页数的页面
  const fetchedLatestPageRef = useRef<number>(0); // 防止重复拉取已经拉取过的页面

  // 获取产品列表
  const fetchProducts = async () => {
    if (currPage > totalPageRef.current || currPage <= fetchedLatestPageRef.current || isFetching) return;
    fetchedLatestPageRef.current = currPage; // 立即标记为已拉取过该页

    setIsFetching(true);

    const { data: productsData } = await getProducts({ status: "active", page: currPage, limit: 8 });

    const prods: ProductType[] = (productsData.products as ProductType[]) || [];
    totalPageRef.current = productsData.pagination?.total_pages || 1;

    setIsFetching(false);

    setProducts((prev) => [...prev, ...prods]);
    setCurrPage((prev) => prev + 1);
  };

  // 组件加载时获取初始产品列表
  useEffect(() => {
    fetchProducts();
  }, []);

  // 监听页面触底，加载下一页
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 70) fetchProducts();
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [currPage]);

  return (
    <div className="min-h-screen flex flex-col pb-6 gap-6">
      <section className="relative h-48 overflow-hidden">
        <img
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-auto object-cover z-0"
          src="/cover.png"
          alt="Cover"
          width={450}
          height={300}
        />
        <div className="absolute inset-x-0 top-1/3 bottom-0 bg-linear-to-t from-black to-transparent" />

        <div className="absolute inset-x-4 bottom-4 flex flex-col gap-2">
          <h1 className="text-2xl font-bold leading-tight drop-shadow">
            MyShop - The Only Web3 Presale Platform You Need
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

        <AppPlaceholder text="Loading more products..." mode="loading" isShow={isFetching} />
        <AppPlaceholder
          text="No more products to load"
          mode="normal"
          isShow={products.length === 0 && currPage > totalPageRef.current && !isFetching}
        />
        <AppPlaceholder text="No products found" mode="normal" isShow={products.length === 0 && !isFetching} />
      </section>
    </div>
  );
}
