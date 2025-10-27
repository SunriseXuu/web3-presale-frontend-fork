"use client";

import { useEffect, useRef, useState } from "react";
// import Image from "next/image";
import Link from "next/link";

import ShippingCard, { ShippingAddressType } from "@/components/cards/ShippingCard";
import AddShippingForm from "@/components/forms/AddShippingForm";
import AppPlaceholder from "@/components/shared/AppPlaceholder";

import { getShippingAddresses } from "@/action/shipping.action";

export default function page() {
  const [defaultAddress, setDefaultAddress] = useState<ShippingAddressType | null>(null);
  const [otherAddresses, setOtherAddresses] = useState<ShippingAddressType[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  // 获取收货地址列表
  const fetchShippingAddresses = async () => {
    if (isFetching) return;
    setIsFetching(true);

    const { data: shippinAddressesData } = await getShippingAddresses();
    const shAddrs = (shippinAddressesData as unknown as ShippingAddressType[]) || [];

    // 分离出默认地址
    const defaultAddr = shAddrs.find((addr) => addr.is_default);
    if (defaultAddr) setDefaultAddress(defaultAddr);

    // 分离出其他地址
    const otherAddrs = shAddrs.filter((addr) => !addr.is_default);
    setOtherAddresses((prev) => [...prev, ...otherAddrs]);

    setIsFetching(false);
  };

  // 组件加载时获取初始收货地址列表
  useEffect(() => {
    fetchShippingAddresses();
  }, []);

  return (
    <div className="min-h-screen flex flex-col pb-12 gap-6">
      <section className="h-16 flex justify-between items-end bg-primary px-4 pb-2">
        <div className="w-12">
          <Link href="/me">
            <img
              className="w-6 h-6 cursor-pointer rotate-180"
              src="/chevron-r.svg"
              alt="ChevronR"
              width={24}
              height={24}
            />
          </Link>
        </div>
        <p className="font-bold">Shipping Addresses</p>
        <AddShippingForm />
      </section>

      <section className="flex flex-col px-4 gap-4">
        <h1 className="text-2xl font-bold">Default</h1>

        {defaultAddress && <ShippingCard {...defaultAddress} />}

        <AppPlaceholder
          text="Loading default shipping address..."
          mode="loading"
          isShow={!defaultAddress && isFetching}
        />
        <AppPlaceholder
          text="No default shipping address found"
          mode="normal"
          isShow={!defaultAddress && !isFetching}
        />
      </section>

      <section className="flex flex-col px-4 gap-4">
        <h1 className="text-2xl font-bold">Others</h1>

        {otherAddresses.map((addr) => (
          <ShippingCard key={addr.id} {...addr} />
        ))}

        <AppPlaceholder
          text={otherAddresses.length > 0 ? "Loading more shipping addresses..." : "Loading shipping addresses..."}
          mode="loading"
          isShow={isFetching}
        />
        <AppPlaceholder
          text="No shipping addresses found"
          mode="normal"
          isShow={otherAddresses.length === 0 && !isFetching}
        />
      </section>
    </div>
  );
}
