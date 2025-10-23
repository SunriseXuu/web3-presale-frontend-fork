"use client";

import { clusterApiUrl, PublicKey, Connection } from "@solana/web3.js";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { Program, AnchorProvider, utils, BN, setProvider } from "@coral-xyz/anchor";

import idl from "@/lib/idl/presale_contract.json";
import { USD_DECIMALS } from "@/lib/constants";

export default async function payWithSolana({
  productId,
  price,
  quantity,
  paymentAddress,
  paymentMint,
}: {
  productId: string;
  price: number; // 单价（单位USDC）
  quantity: number;
  paymentAddress: string; // 平台方收款钱包地址（公钥字符串）
  paymentMint: string; // USDC/USDT 的 mint 地址（公钥字符串）
}) {
  const { solana } = window as any;
  if (!solana?.isPhantom) throw new Error("Please install the Phantom wallet extension");

  // 请求连接钱包
  const resp = await solana.connect();
  const buyer = new PublicKey(resp.publicKey.toString());

  // 1. 创建连接和 provider
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const provider = new AnchorProvider(connection, solana, {});
  setProvider(provider);

  // 2. 创建 Program 客户端
  const programId = new PublicKey(idl.address);
  const program = new Program(idl, provider);

  // 3. Derive PDA for config
  const [configPda] = PublicKey.findProgramAddressSync([Buffer.from("config")], programId);

  // 4. 准备 token 相关账户
  const tokenMint = new PublicKey(paymentMint);
  const buyerTokenAccount = await getAssociatedTokenAddress(tokenMint, buyer);
  const platformTokenAccount = await getAssociatedTokenAddress(tokenMint, new PublicKey(paymentAddress));

  // 5. 计算 price 和 quantity 的 BN 值（按 USDC 6位小数假设）
  const priceBn = new BN(price * USD_DECIMALS);
  const qtyBn = new BN(quantity);

  // 6. 调用 purchase 指令
  const res = await program.methods
    .purchase(productId, priceBn, qtyBn)
    .accounts({
      buyer,
      config: configPda,
      buyerTokenAccount,
      platformTokenAccount,
      tokenProgram: utils.token.TOKEN_PROGRAM_ID,
    })
    .rpc();

  console.log("✅ Transaction signature:", res);
}
