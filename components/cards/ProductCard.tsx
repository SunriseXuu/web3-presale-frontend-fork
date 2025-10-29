"use client";

import { useState } from "react";

import ProductDrawer from "@/components/drawers/ProductDrawer";
import { ProductType } from "@/lib/types";

export default function ProductCard(productProps: ProductType) {
  const [isProductDrawerOpen, setIsProductDrawerOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col items-center bg-neutral rounded-xl shadow-md overflow-hidden gap-2">
      <img
        className={`w-full aspect-[1] object-cover cursor-pointer ${
          !productProps.images[0] ? " object-contain! p-16!" : ""
        }`}
        src={productProps.images[0] || "/no-img.svg"}
        alt={productProps.name}
        onClick={() => setIsProductDrawerOpen(true)}
        onError={(e) => {
          const img = e.currentTarget as HTMLImageElement;
          img.src = "/no-img.svg";
          img.style.objectFit = "contain";
          img.style.padding = "64px";
        }}
      />

      <div className="flex flex-col items-center px-2 pb-3 gap-3">
        <h3 className="text-sm font-medium cursor-pointer line-clamp-1" onClick={() => setIsProductDrawerOpen(true)}>
          {productProps.name}
        </h3>

        {/* 外层条件用于不要让产品卡片加载完成的时候注册调用一大堆抽屉里的钩子 */}
        {isProductDrawerOpen && (
          <ProductDrawer
            {...productProps}
            isProductDrawerOpen={isProductDrawerOpen} // 内层条件用于开关抽屉本身
            getIsProductDrawerOpen={setIsProductDrawerOpen}
          />
        )}
      </div>
    </div>
  );
}
