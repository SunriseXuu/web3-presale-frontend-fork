import { SystemProgram, PublicKey } from "@solana/web3.js";
import { ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";
import { Program, AnchorProvider, utils, BN, setProvider } from "@coral-xyz/anchor";

import { DEVNET_USDC, PLATFORM_WALLET, USD_DECIMALS } from "@/lib/constants";
import idl from "@/lib/idl/presale_contract.json";

export const payWithSolana = async ({
  orderId,
  productId,
  price,
  quantity,
  buyerWallet,
  buyer,
  connection,
}: {
  orderId: string;
  productId: string;
  price: number;
  quantity: number;
  buyerWallet: any;
  buyer: any;
  connection: any;
}) => {
  if (!buyerWallet || !buyer || !connection) throw new Error("Wallet not connected.");

  // 1. 创建 provider
  const provider = new AnchorProvider(connection, buyerWallet, {});
  setProvider(provider);

  // 2. 创建 Program 客户端
  const programId = new PublicKey(idl.address);
  const program = new Program(idl, provider);

  // 3. 派生 PDA for config
  const [configPda] = PublicKey.findProgramAddressSync([Buffer.from("config")], programId);

  // 4. 账户准备
  const tokenMint = new PublicKey(DEVNET_USDC);
  const platformAuthority = new PublicKey(PLATFORM_WALLET);
  const buyerTokenAccount = await getAssociatedTokenAddress(tokenMint, buyer);
  const platformTokenAccount = await getAssociatedTokenAddress(tokenMint, platformAuthority);

  // 检查买家 token 账户是否存在
  const buyerTokenAccountInfoRaw = await connection.getAccountInfo(buyerTokenAccount);
  if (!buyerTokenAccountInfoRaw) throw new Error("Buyer token account does not exist.");

  // 检查买家 USDC/USDT 余额是否足够
  const buyerTokenAccountInfo = await connection.getTokenAccountBalance(buyerTokenAccount);
  const totalPrice = price * quantity;
  const buyerUsdcBalance = buyerTokenAccountInfo.value.uiAmount * USD_DECIMALS;
  if (buyerUsdcBalance < totalPrice) throw new Error("Insufficient balance.");

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
