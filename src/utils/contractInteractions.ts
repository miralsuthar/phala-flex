import PhalaFlex from "@/contract/PhalaFlex.json";
import dUSDABI from "@/contract/Dusd.json";
import { parseEther } from "viem";
import {
  Address,
  useContractEvent,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { contractAddress, dUSDAddress } from "./config";

export const useCheckIfLocked = (address: Address) => {
  const { data, error, isLoading, isSuccess, refetch } = useContractRead({
    address: contractAddress,
    abi: PhalaFlex,
    functionName: "checkLock",
    args: [address],
  });

  return { data, error, isLoading, isSuccess, refetch };
};

export const useGetBeneficiary = (address: Address) => {
  const { data, error, isLoading, isSuccess } = useContractRead({
    address: contractAddress,
    abi: PhalaFlex,
    functionName: "getBeneficiary",
    args: [address],
  });

  return { data, error, isLoading, isSuccess };
};

export const useTokenBalanceOf = (address: Address, token: Number) => {
  const { data, error, isLoading, isSuccess, refetch } = useContractRead({
    address: contractAddress,
    abi: PhalaFlex,
    functionName: "tokenBalanceOf",
    args: [address, token],
  });

  return { data, error, isLoading, isSuccess, refetch };
};

export const useNativeBalanceOf = (address: Address) => {
  const { data, error, isLoading, isSuccess, refetch } = useContractRead({
    address: contractAddress,
    abi: PhalaFlex,
    functionName: "nativeBalanceOf",
    args: [address],
  });

  return { data, error, isLoading, isSuccess, refetch };
};

export const useGetTokenContractAddress = (token: Number) => {
  const { data, error, isLoading, isSuccess } = useContractRead({
    address: contractAddress,
    abi: PhalaFlex,
    functionName: "getTokenContractAddress",
    args: [token],
  });

  return { data, error, isLoading, isSuccess };
};

export const useGetbeneficiaryOwnerAddress = (address: Address) => {
  const { data, error, isLoading, isSuccess } = useContractRead({
    address: contractAddress,
    abi: PhalaFlex,
    functionName: "getBeneficiarysOwner",
    args: [address],
  });

  return { data, error, isLoading, isSuccess };
};

export const useRequest = (otp: Number, isBeneficiary: Boolean) => {
  const { config, error: configError } = usePrepareContractWrite({
    address: contractAddress,
    abi: PhalaFlex,
    functionName: "request",
    args: [otp, isBeneficiary],
  });

  const { write } = useContractWrite({
    ...config,
    onSuccess: (data) => {
      console.log("data: ", data);
    }, // do whatever you want on Success
  });

  return { write, configError };
};

export const useSetup = (authyHash: string, beneficiary: Address) => {
  const { config, error: configError } = usePrepareContractWrite({
    address: contractAddress,
    abi: PhalaFlex,
    functionName: "setup",
    args: [authyHash, beneficiary],
  });

  const { write } = useContractWrite({
    ...config,
    onSuccess: () => {}, // do whatever you want on Success
  });

  return { write, configError };
};

export const useStakeNative = (userAddress: Address, amount: string) => {
  const { config, error: configError } = usePrepareContractWrite({
    address: contractAddress,
    abi: PhalaFlex,
    functionName: "stakeNative",
    args: [userAddress],
    value: parseEther(amount),
  });

  const { write } = useContractWrite({
    ...config,
    onSuccess: () => {}, // do whatever you want on Success
  });

  return { write, configError };
};

export const useStakeToken = (
  userAddress: Address,
  token: Number,
  amount: string
) => {
  const { config, error: configError } = usePrepareContractWrite({
    address: contractAddress,
    abi: PhalaFlex,
    functionName: "stakeToken",
    args: [userAddress, token, parseEther(amount)],
  });

  const { write } = useContractWrite({
    ...config,
    onSuccess: () => {}, // do whatever you want on Success
  });

  return { write, configError };
};

export const useUpdateBeneficiary = (userAddress: Address) => {
  const { config, error: configError } = usePrepareContractWrite({
    address: contractAddress,
    abi: PhalaFlex,
    functionName: "updateBeneficiary",
    args: [userAddress],
  });

  const { write } = useContractWrite({
    ...config,
    onSuccess: () => {}, // do whatever you want on Success
  });

  return { write, configError };
};

export const useWithdrawNative = (
  userAddress: Address,
  amount: string,
  isBeneficiary: Boolean
) => {
  const { config, error: configError } = usePrepareContractWrite({
    address: contractAddress,
    abi: PhalaFlex,
    functionName: "withdrawNative",
    args: [userAddress, parseEther(amount), isBeneficiary],
  });

  const { write } = useContractWrite({
    ...config,
    onSuccess: () => {}, // do whatever you want on Success
  });

  return { write, configError };
};

export const useAttestor = (attestor: string) => {
  const { config, error: configError } = usePrepareContractWrite({
    address: contractAddress,
    abi: PhalaFlex,
    functionName: "setAttestor",
    args: [attestor],
  });

  const { write } = useContractWrite({
    ...config,
    onSuccess: () => {}, // do whatever you want on Success
  });

  return { write, configError };
};

export const useWithdrawToken = (
  userAddress: Address,
  token: Number,
  amount: string,
  isBeneficiary: Boolean
) => {
  const { config, error: configError } = usePrepareContractWrite({
    address: contractAddress,
    abi: PhalaFlex,
    functionName: "withdrawToken",
    args: [userAddress, token, parseEther(amount), isBeneficiary],
  });

  const { write } = useContractWrite({
    ...config,
    onSuccess: () => {}, // do whatever you want on Success
  });

  return { write, configError };
};

export enum Event {
  ResponseReceived = "ResponseReceived",
  ErrorReceived = "ErrorReceived",
  InvalidOTP = "InvalidOTP",
  SuccessOTP = "SuccessOTP",
  AccountCreated = "AccountCreated",
  TokenStaked = "TokenStaked",
  NativeStaked = "NativeStaked",
  TokenWithdrawn = "TokenWithdrawn",
  NativeWithdrawn = "NativeWithdrawn",
  AuthyHashUpdated = "AuthyHashUpdated",
  BeneficiaryUpdated = "BeneficiaryUpdated",
  LockedCannotAccess = "LockedCannotAccess",
}

export const useApproveDusd = (contractAddr: Address, amount: string) => {
  const { config, error: configError } = usePrepareContractWrite({
    address: dUSDAddress,
    abi: dUSDABI,
    functionName: "approve",
    args: [contractAddr, parseEther(amount)],
  });

  const { write, data } = useContractWrite({
    ...config,
    onSuccess: (data) => {
      console.log("data: ", data);
    }, // do whatever you want on Success
  });

  return { write, configError, data };
};

/*
function Component() {
  const { data } = useContractEvent({
    address: contractAddress, 
    abi: PhalaFlex,
    eventName: Event.SuccessOTP,
    listener(log) {
      console.log(log);
      whatever you want here 
    }
  });

  return <div>{data}</div>
}
*/
