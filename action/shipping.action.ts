import requestHandler from "@/lib/tools/request";

// 获取所有 shipping addresses 列表
export const getShippingAddresses = async () =>
  await requestHandler({
    endPoint: "/shipping-addresses",
    method: "GET",
  });

// 创建新 shipping address
export const createShippingAddress = async (reqBody: {
  name: string;
  phone: string;
  address: string;
  is_default: boolean;
}) =>
  await requestHandler({
    endPoint: "/shipping-addresses",
    method: "POST",
    reqBody,
  });

// 更新 shipping address
export const updateShippingAddress = async (
  id: string,
  reqBody: {
    name?: string;
    phone?: string;
    address?: string;
    is_default?: boolean;
  }
) =>
  await requestHandler({
    endPoint: "/shipping-addresses/:id",
    method: "PUT",
    params: { id },
    reqBody,
  });

// 删除 shipping address
export const deleteShippingAddress = async (id: string) =>
  await requestHandler({
    endPoint: "/shipping-addresses/:id",
    method: "DELETE",
    params: { id },
  });
