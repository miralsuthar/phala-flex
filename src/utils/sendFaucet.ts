import { privateKeyToAccount } from "viem/accounts";
import { createPublicClient, createWalletClient, http } from "viem";
import { mainnet, polygonMumbai } from "viem/chains";
import dUSD from "@/contract/Dusd.json";

export const sendFaucet = async (address: string, amount: number) => {
  const account = privateKeyToAccount(
    process.env.NEXT_PUBLIC_PRIVATE_KEY_DUSD_FAUCET as `0x${string}`
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
    address: "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2",
    abi: dUSD,
    functionName: "transfer",
    args: [],
  });

  await walletClient.writeContract(request);
};
