"use client";

export default function ProductCard({ product }: { product: any }) {
  return (
    <div className="bg-white p-3 rounded-xl shadow-sm flex flex-col items-center">
      <img src={product.img} alt={product.name} className="w-24 h-24 rounded-md object-cover" />
      <div className="text-sm mt-2 text-center font-medium">{product.name}</div>
      <div className="text-gray-600 text-xs">{product.price}</div>
      <button className="mt-2 bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm">立即预定</button>
    </div>
  );
}
