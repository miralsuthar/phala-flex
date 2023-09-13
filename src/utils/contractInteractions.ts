import PhalaFlex from "@/contract/PhalaFlex.json";
import { parseEther } from "viem";
import {
	Address,
	useContractEvent,
	useContractRead,
	useContractWrite,
	usePrepareContractWrite,
} from "wagmi";

const contractAddress = "0x3c7e2216df4dcde8b74e4a014e18e517831baa31";

export const useCheckIfLocked = (address: Address) => {
	const { data, error, isLoading, isSuccess } = useContractRead({
		address: contractAddress,
		abi: PhalaFlex,
		functionName: "checkLock",
		args: [address],
	});

	return { data, error, isLoading, isSuccess };
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
	const { data, error, isLoading, isSuccess } = useContractRead({
		address: contractAddress,
		abi: PhalaFlex,
		functionName: "tokenBalanceOf",
		args: [address, token],
	});

	return { data, error, isLoading, isSuccess };
};

export const useNativeBalanceOf = (address: Address) => {
	const { data, error, isLoading, isSuccess } = useContractRead({
		address: contractAddress,
		abi: PhalaFlex,
		functionName: "nativeBalanceOf",
		args: [address],
	});

	return { data, error, isLoading, isSuccess };
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

export const useRequest = (otp: Number, isBeneficiary: Boolean) => {
	const { config, error: configError } = usePrepareContractWrite({
		address: contractAddress,
		abi: PhalaFlex,
		functionName: "request",
		args: [otp, isBeneficiary],
	});

	const { write } = useContractWrite({
		...config,
		onSuccess: () => {}, // do whatever you want on Success
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

export const useStakeNative = (userAddress: Address, amount: Number) => {
	const { config, error: configError } = usePrepareContractWrite({
		address: contractAddress,
		abi: PhalaFlex,
		functionName: "setup",
		args: [userAddress],
		value: parseEther(String(amount)),
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
	amount: Number
) => {
	const { config, error: configError } = usePrepareContractWrite({
		address: contractAddress,
		abi: PhalaFlex,
		functionName: "setup",
		args: [userAddress, token, parseEther(String(amount))],
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
	amount: Number,
	isBeneficiary: Boolean
) => {
	const { config, error: configError } = usePrepareContractWrite({
		address: contractAddress,
		abi: PhalaFlex,
		functionName: "withdrawNative",
		args: [userAddress, isBeneficiary],
		value: parseEther(String(amount)),
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
	amount: Number,
	isBeneficiary: Boolean
) => {
	const { config, error: configError } = usePrepareContractWrite({
		address: contractAddress,
		abi: PhalaFlex,
		functionName: "withdrawNative",
		args: [userAddress, token, parseEther(String(amount)), isBeneficiary],
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
