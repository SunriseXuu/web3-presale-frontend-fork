import bs58 from "bs58";
import { Connection, SystemProgram, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";
import { Program, AnchorProvider, utils, BN, setProvider } from "@coral-xyz/anchor";

import { getUserNonce, loginUser, logoutUser } from "@/action/users.action";

import { PLATFORM_WALLET, USD_DECIMALS } from "@/lib/constants";
import idl from "@/lib/idl/presale_contract.json";

// 核心登录流程
export const loginWithSolana = async () => {
  const { solana } = window as any;
  if (!solana?.isPhantom) throw new Error("Please install the Phantom wallet extension.");

  // 1. 连接钱包
  const { publicKey } = await solana.connect();
  const walletAddress = publicKey.toString();

  // 2. 获取 nonce 和 message
  const { data: nonceRes, success: nonceSuccess } = await getUserNonce({
    wallet_address: walletAddress,
  });
  if (!nonceSuccess) throw new Error("Failed to get nonce.");
  const message = nonceRes.message;

  // 3. 签名消息
  const encoded = new TextEncoder().encode(message);
  const signed = await solana.signMessage(encoded, "utf8");
  const signature = bs58.encode(signed.signature); // 使用 base58 编码签名
  // const signature = Buffer.from(signed.signature).toString("base64"); // 使用 base64 编码签名

  // 4. 登录
  const { data, success: loginSuccess } = await loginUser({ wallet_address: walletAddress, signature });
  if (!loginSuccess) throw new Error("Failed to log in.");

  return data.user;
};

// 使用 Solana 钱包支付订单
export const payWithSolana = async ({
  orderId,
  productId,
  price,
  quantity,
}: {
  orderId: string;
  productId: string;
  price: number;
  quantity: number;
}) => {
  const { solana } = window as any;
  if (!solana?.isPhantom) throw new Error("Please install the Phantom wallet extension.");

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

  // 3. 派生 PDA for config
  const [configPda] = PublicKey.findProgramAddressSync([Buffer.from("config")], programId);

  // TODO: 临时硬编码 usdc 和平台钱包
  const usdc = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";

  // 4. 账户准备
  const tokenMint = new PublicKey(usdc);
  const platformAuthority = new PublicKey(PLATFORM_WALLET);
  const buyerTokenAccount = await getAssociatedTokenAddress(tokenMint, buyer);
  const platformTokenAccount = await getAssociatedTokenAddress(tokenMint, platformAuthority);

  // 检查买家 token 账户是否存在
  const buyerTokenAccountInfoRaw = await connection.getAccountInfo(buyerTokenAccount);
  if (!buyerTokenAccountInfoRaw) throw new Error("Buyer USDC token account does not exist.");

  // 检查买家 USDC/USDT 余额是否足够
  const buyerTokenAccountInfo = await connection.getTokenAccountBalance(buyerTokenAccount);
  const totalPrice = price * quantity;
  const buyerUsdcBalance = buyerTokenAccountInfo.value.uiAmount * USD_DECIMALS;
  if (buyerUsdcBalance < totalPrice) throw new Error("Insufficient USDC balance.");

  // 5. 调用 purchase 指令
  const txHash = await program.methods
    .purchase(orderId, productId, new BN(price), new BN(quantity))
    .accounts({
      buyer: buyer,
      config: configPda,
      buyerTokenAccount: buyerTokenAccount,
      mint: tokenMint,
      platformAuthority: platformAuthority,
      platformTokenAccount: platformTokenAccount,
      tokenProgram: utils.token.TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  return txHash;
};

// 登出
export const logout = () => {
  logoutUser();
  (window as any).solana?.disconnect();
};
