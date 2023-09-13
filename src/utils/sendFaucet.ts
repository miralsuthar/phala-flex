import dUSD from "@/contract/Dusd.json";
import {
  Address,
  createPublicClient,
  createWalletClient,
  http,
  parseEther,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { polygonMumbai } from "viem/chains";
import { dUSDAddress } from "./config";

export const sendFaucet = async (address: string, amount: string) => {
  const account = privateKeyToAccount(
    process.env.NEXT_PUBLIC_PRIVATE_KEY_DUSD_FAUCET as Address
  );

  const client = createPublicClient({
    chain: polygonMumbai,
    transport: http(),
  });

  const walletClient = createWalletClient({
    account,
    chain: polygonMumbai,
    transport: http(),
  });

  const { request } = await client.simulateContract({
    account,
    address: dUSDAddress,
    abi: dUSD,
    functionName: "transfer",
    args: [address, parseEther(amount)],
  });

  const tx = await walletClient.writeContract(request);

  //   const transaction = await client.waitForTransactionReceipt({
  //     hash: tx,
  //   });

  return tx;
};
