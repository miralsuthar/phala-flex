import { supabase } from "@/utils/db";
import { cn, hash } from "@/utils/helpers";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useCallback, useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { Address, useAccount, useContractEvent } from "wagmi";

import { inter, AccountSID, AuthToken, serviceId } from "@/utils/consts";
import React from "react";
import { Input } from "@/components/Input";
import OtpModal from "@/components/OtpModal";
import PhalaFlexABI from "@/contract/PhalaFlex.json";
import DusdABi from "@/contract/Dusd.json";
import {
  useCheckIfLocked,
  useRequest,
  useSetup,
  useStakeNative,
  useWithdrawNative,
  Event,
  useApproveDusd,
  useStakeToken,
  useWithdrawToken,
  useGetbeneficiaryOwnerAddress,
  useNativeBalanceOf,
  useTokenBalanceOf,
  useAttestor,
} from "@/utils/contractInteractions";
import { LockedStatus } from "@/components/LockedStatus";
import { contractAddress, dUSDAddress } from "@/utils/config";
import { sendFaucet } from "@/utils/sendFaucet";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  const [qruri, setQrui] = useState("");
  const [factor, setFactor] = useState("");
  const [isverified, setIsVerified] = useState(false);

  const [account, setAccount] = useState();

  const [isScanningComplete, setIsScanningComplete] = useState(false);
  const [payload, setPayload] = useState("");

  const [userType, setUserType] = useState<"owner" | "beneficiary">();
  const [beneficiary, setbeneficiary] = useState<string>("");

  const [depositAmount, setDepositAmount] = useState<string>("");
  const [depositAmountButton, setDepositAmountButton] =
    useState<boolean>(false);
  const [depositToken, setDepositToken] = useState<string>("matic");

  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [withdrawAmountButton, setWithdrawAmountButton] =
    useState<boolean>(false);
  const [withdrawToken, setWithdrawToken] = useState<string>("matic");

  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

  const [isAccountLocked, setIsAccountLocked] = useState(false);

  const [otp, setOtp] = useState<string>("");

  const [isApproved, setIsApproved] = useState<boolean>(false);

  const [attestor, setAttestor] = useState<string>("");

  const { address } = useAccount();

  // Contract Interaction

  const { write: setupWrite } = useSetup(hash(factor), beneficiary as Address);

  const { write: stakeNativeWrite } = useStakeNative(
    address as Address,
    depositAmount
  );

  const { write: stakeTokenWrite } = useStakeToken(
    address as Address,
    0,
    depositAmount
  );

  const { write: withdrawNativeWrite } = useWithdrawNative(
    address as Address,
    withdrawAmount,
    false
  );

  const { write: withdrawNativebeneficiaryWrite } = useWithdrawNative(
    address as Address,
    withdrawAmount,
    true
  );

  const { write: withdrawTokenWrite } = useWithdrawToken(
    address as Address,
    0,
    withdrawAmount,
    false
  );

  const { write: setAttestorWrite } = useAttestor(attestor);

  const { data: maticBalance, refetch: refetchMaticBalance } =
    useNativeBalanceOf(address as Address);

  console.log("matic: ", Number(maticBalance) / 10 ** 18);

  const { data: tokenBalance, refetch: refetchTokenBalance } =
    useTokenBalanceOf(address as Address, 0);

  const { write: verifyOtpWrite } = useRequest(Number(otp), false);

  const { write: verifyOtpbeneficiaryWrite } = useRequest(Number(otp), true);

  const { data: beneficiaryOwnerAddress } = useGetbeneficiaryOwnerAddress(
    address?.toLocaleLowerCase() as Address
  );

  const { data: isOtpLocked, refetch: otpRefetch } = useCheckIfLocked(
    userType === "beneficiary"
      ? (beneficiaryOwnerAddress as Address)
      : (address as Address)
  );

  const { write: approveWrite, data } = useApproveDusd(
    contractAddress,
    depositAmount
  );

  // Tost
  const notifySucess = (message: string) =>
    toast(message, {
      position: "top-center",
      className: "bg-green-400",
    });

  const notifyError = (message: string) =>
    toast(message, {
      position: "top-center",
      className: "bg-red-400",
    });

  useContractEvent({
    address: dUSDAddress,
    abi: DusdABi,
    eventName: "Approval",
    listener(logs: any) {
      if (
        logs[0].args.spender.toLocaleLowerCase() ===
        contractAddress.toLocaleLowerCase()
      ) {
        setIsApproved(true);
      }
    },
  });

  useContractEvent({
    address: contractAddress,
    abi: PhalaFlexABI,
    eventName: Event.SuccessOTP,
    listener(logs: any) {
      if (logs[0]?.args.user === address) {
        otpRefetch();
      }
    },
  });

  useContractEvent({
    address: contractAddress,
    abi: PhalaFlexABI,
    eventName: Event.NativeStaked,
    listener(logs: any) {
      if (logs[0]?.args.user === address) {
        setDepositAmountButton(false);
        notifySucess("Matic deposited successfully");
        refetchMaticBalance();
        setDepositAmount("");
      }
    },
  });

  useContractEvent({
    address: contractAddress,
    abi: PhalaFlexABI,
    eventName: Event.NativeWithdrawn,
    listener(logs: any) {
      if (logs[0]?.args.user === address) {
        setWithdrawAmountButton(false);
        notifySucess("Matic withdraw successfully");
        setWithdrawAmount("");
        refetchMaticBalance();
        otpRefetch();
      }
    },
  });

  useContractEvent({
    address: contractAddress,
    abi: PhalaFlexABI,
    eventName: Event.TokenStaked,
    listener(logs: any) {
      if (logs[0].args.user === address) {
        refetchTokenBalance();
      }
    },
  });

  useContractEvent({
    address: contractAddress,
    abi: PhalaFlexABI,
    eventName: Event.TokenWithdrawn,
    listener(logs: any) {
      if (logs[0].args.user === address) {
        setWithdrawAmountButton(false);
        refetchTokenBalance();
        otpRefetch();
      }
    },
  });

  // get uri
  const getUri = useCallback(() => {
    fetch(
      `https://verify.twilio.com/v2/Services/${serviceId}/Entities/${address?.toLocaleLowerCase()}/Factors`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Basic " + btoa(`${AccountSID}:${AuthToken}`),
        },
        body: "FriendlyName=Phala flex&FactorType=totp",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("data: ", data);
        setQrui(data.binding.uri);
        setFactor(data.sid);
      });
  }, [address]);

  const verifyUser = (otp: string) => {
    fetch(
      `https://verify.twilio.com/v2/Services/${serviceId}/Entities/${address?.toLocaleLowerCase()}/Factors/${factor}`,
      {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa(`${AccountSID}:${AuthToken}`),
        },
        body: new URLSearchParams({
          AuthPayload: otp,
        }),
      }
    )
      .then((res) => res.json())
      .then(async (data) => {
        if (data.status === "verified") {
          setIsVerified(true);
          console.log("this is working");
          const { error } = await supabase.from("user").insert({
            address: address?.toLocaleLowerCase() as string,
            factor: factor,
            factor_hash: hash(factor),
          });
        }
      });
  };

  const depositAmountHandler = () => {
    if (depositToken === "matic") {
      stakeNativeWrite?.();
      setDepositAmountButton(true);
    } else if (isApproved) {
      setDepositAmountButton(true);
      stakeTokenWrite?.();
      setDepositAmountButton(false);
    } else {
      setDepositAmountButton(true);
      approveWrite?.();
      setDepositAmountButton(false);
    }
  };

  const withdrawAmountHandler = () => {
    if (withdrawToken === "matic") {
      if (userType === "beneficiary") {
        withdrawNativebeneficiaryWrite?.();
      } else {
        withdrawNativeWrite?.();
      }
      setWithdrawAmountButton(true);
    } else {
      withdrawTokenWrite?.();
      setWithdrawAmountButton(true);
    }
  };

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("user")
        .select("*")
        .eq("address", address?.toLocaleLowerCase());
      if (address && data?.length === 0 && !isScanningComplete) {
        getUri();
      } else {
        setAccount(data?.[0]);
      }
    })();
  }, [address, getUri, isScanningComplete]);

  useEffect(() => {
    setIsAccountLocked(isOtpLocked as boolean);
  }, [isOtpLocked]);

  useEffect(() => {
    console.log("Tokne: ", withdrawToken);
  }, [withdrawToken]);

  return (
    <main
      className={`flex bg-white text-gray-600 min-h-screen flex-col items-center p-24 gap-20 ${inter.className}`}
    >
      <ConnectButton />
      {!isScanningComplete && address && qruri && (
        <div className="flex flex-col items-center gap-10">
          <p>
            Enable 2FA for this deposit contract scan this qr code with your
            choice of authenticator app.
          </p>
          <QRCode value={qruri} />
          <button
            className="bg-blue-500 px-3 py-1 text-white rounded-md text-lg w-max hover:scale-105 transition-all"
            onClick={() => setIsScanningComplete(true)}
          >
            Done
          </button>
        </div>
      )}
      <div>
        {!isverified && isScanningComplete && (
          <div className="flex flex-col items-center gap-10">
            <p>
              Enter the code displaying on your authenticator app.(Ex. 467 890)
            </p>
            <input
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              placeholder="otp"
              className="text-black text-center text-2xl rounded-md border p-1 border-gray-500"
            />
            <button
              onClick={() => verifyUser(payload)}
              className="bg-blue-500 text-white px-3 py-1 rounded-md text-lg w-max hover:scale-105 transition-all"
            >
              Check
            </button>
          </div>
        )}
        {isverified && (
          <div className="flex flex-col justify-center items-center gap-5">
            <span className="text-center text-green-500 text-2xl">
              Otp Verification Successful!
            </span>
            <span>Add your benefeciery for this account</span>
            <input
              type="text"
              className="text-black text-center text-2xl rounded-md border p-1 border-gray-500"
              placeholder="benefeciery"
              value={beneficiary}
              onChange={(e) => setbeneficiary(e.target.value)}
            />

            <button
              onClick={() => {
                setupWrite?.();
                router.reload();
              }}
              className="bg-blue-500 text-white px-3 py-1 rounded-md text-lg w-max hover:scale-105 transition-all"
            >
              create Account
            </button>
          </div>
        )}
        {account && (
          <LockedStatus
            onClick={() => {
              if (isAccountLocked) {
                setIsOtpModalOpen(true);
              }
            }}
            isAccountLocked={isAccountLocked}
          />
        )}
        {account && (
          <button
            onClick={() => {
              sendFaucet(address as Address, "100");
            }}
            className="bg-blue-400 absolute top-0 right-0 m-2 font-medium rounded-md px-2 py-1 text-white"
          >
            Get dUSD
          </button>
        )}
        {account && (
          <div className="flex flex-col items-center gap-16 p-10 rounded-lg shadow-md border-2 border-blue-100 shadow-blue-100">
            <div className="flex bg-gray-100 rounded-lg relative">
              <span
                className="w-40 text-center p-2 cursor-pointer"
                onClick={() => setUserType("owner")}
              >
                Owner
              </span>
              <span
                className="w-40 text-center p-2 cursor-pointer"
                onClick={() => setUserType("beneficiary")}
              >
                beneficiary
              </span>
              <div
                className={cn(
                  "w-40 h-full absolute left-0 top-0 bg-blue-400 rounded-lg opacity-10 border-2 border-blue-800 transition-all",
                  userType === "beneficiary" && "left-40"
                )}
              ></div>
            </div>
            <div className="space-y-5">
              {userType !== "beneficiary" && (
                <Input
                  amount={depositAmount}
                  setAmount={(value) => setDepositAmount(value)}
                  disabled={depositAmountButton || depositAmount === ""}
                  title={
                    depositToken === "dusd"
                      ? isApproved
                        ? "Deposit"
                        : "Approve"
                      : "Deposit"
                  }
                  placeholder="1"
                  token={depositToken}
                  setToken={(value) => setDepositToken(value)}
                  onClick={depositAmountHandler}
                />
              )}
              <Input
                amount={withdrawAmount}
                setAmount={setWithdrawAmount}
                disabled={
                  withdrawAmount === "" ||
                  isAccountLocked ||
                  withdrawAmountButton
                }
                title="withdraw"
                placeholder="1"
                token={withdrawToken}
                setToken={(value) => setWithdrawToken(value)}
                onClick={withdrawAmountHandler}
              />
            </div>
            <div>
              {Number(maticBalance) !== 0 && (
                <div>Matic Deposited: {Number(maticBalance) / 10 ** 18}</div>
              )}
              {Number(tokenBalance) !== 0 && (
                <div>dUSD Deposited: {Number(tokenBalance) / 10 ** 18}</div>
              )}
            </div>
          </div>
        )}
        <OtpModal
          isOpen={isOtpModalOpen}
          closeModal={() => setIsOtpModalOpen(false)}
          otp={otp}
          setOtp={(value) => setOtp(value)}
          verifyOtp={() => {
            if (userType === "beneficiary") {
              verifyOtpbeneficiaryWrite?.();
            } else {
              verifyOtpWrite?.();
            }
          }}
        />
        {/* {address === "0x38D9cFf58D233AF0B9c1434EEDE012009D23c971" && (
          <>
            <input
              value={attestor}
              onChange={(e) => setAttestor(e.target.value)}
            />
            <button
              onClick={() => {
                setAttestorWrite?.();
              }}
            >
              Set Attestor
            </button>
          </>
        )} */}
      </div>
    </main>
  );
}
