export type ProductType = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
};

export type OrderType = {
  order_id: string;
  product_id: string;
  product_snapshot: {
    name: string;
    images: string[];
    price: number;
    payment_address: string;
  };
  quantity: number;
  total_price: number;
  status: string;
  created_at: string;
  updated_at: string;
  cancelled_at?: string;
};

export type ShippingAddressType = {
  id: string;
  name: string;
  phone: string;
  address: string;
  is_default?: boolean;
};
