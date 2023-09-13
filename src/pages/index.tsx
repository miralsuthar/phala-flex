import { supabase } from "@/utils/db";
import { cn, hash } from "@/utils/helpers";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { useAccount, useContractRead, useContractWrite } from "wagmi";

import IERC20ABI from "@/contract/IERC20.json";
import dUSD from "@/contract/Dusd.json";
import PhalaFlex from "@/contract/PhalaFlex.json";

import {
  inter,
  AccountSID,
  AuthToken,
  serviceId,
  tokens,
} from "@/utils/consts";
import React from "react";
import { Input } from "@/components/Input";
import OtpModal from "@/components/OtpModal";

export default function Home() {
  const [qruri, setQrui] = useState("");
  const [factor, setFactor] = useState("");
  const [isverified, setIsVerified] = useState(false);

  const [account, setAccount] = useState();

  const [isScanningComplete, setIsScanningComplete] = useState(false);
  const [payload, setPayload] = useState("");

  const [userType, setUserType] = useState<"owner" | "beneficiery">();
  const [beneficiery, setBeneficiery] = useState<string>("");

  const [depositAmount, setDepositAmount] = useState<number | undefined>();

  const [isOtpModalOpen, setIsOtpModalOpen] = useState(true);

  const [otp, setOtp] = useState<string>("");

  const { address } = useAccount();
  const router = useRouter();

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

  const addBenefeciery = async () => {
    const { error } = await supabase
      .from("user")
      .update({
        beneficiery: beneficiery,
      })
      .eq("address", address);
  };

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

  const verifyToken = (otp: string, factor: string) => {
    fetch(
      `https://verify.twilio.com/v2/Services/${serviceId}/Entities/${address}/Challenges`,
      {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa(`${AccountSID}:${AuthToken}`),
        },
        body: new URLSearchParams({
          AuthPayload: otp,
          FactorSid: factor,
        }),
      }
    );
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

  // useEffect(() => {
  //   (async () => {
  //     const { data } = await supabase
  //       .from("user")
  //       .select("beneficiery")
  //       .eq("address", address);
  //     if (data?.[0]?.beneficiery !== null) {
  //       setIsBeneficiery(true);
  //     }
  //   })();
  // }, [address]);

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
              Verification Successful!
            </span>
            <button
              onClick={() => router.reload()}
              className="bg-blue-500 text-white px-3 py-1 rounded-md text-lg w-max hover:scale-105 transition-all"
            >
              Complete
            </button>
          </div>
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
                onClick={() => setUserType("beneficiery")}
              >
                Beneficiery
              </span>
              <div
                className={cn(
                  "w-40 h-full absolute left-0 top-0 bg-blue-400 rounded-lg opacity-10 border-2 border-blue-800 transition-all",
                  userType === "beneficiery" && "left-40"
                )}
              ></div>
            </div>
            <div className="space-y-5">
              {userType !== "beneficiery" && (
                <Input
                  amount={depositAmount}
                  setAmount={setDepositAmount}
                  disabled={false}
                  title="Deposit"
                  placeholder="1"
                />
              )}
              <Input
                amount={depositAmount}
                setAmount={setDepositAmount}
                disabled={false}
                title="Widhdraw"
                placeholder="1"
              />
            </div>
          </div>
        )}
        <OtpModal
          isOpen={isOtpModalOpen}
          closeModal={() => setIsOtpModalOpen(false)}
          otp={otp}
          setOtp={setOtp}
          verifyOtp={() => {}}
        />
      </div>
    </main>
  );
}
