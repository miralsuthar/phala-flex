import { Inter } from "next/font/google";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import QRCode from "react-qr-code";
import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { supabase } from "@/utils/db";
import { cn } from "@/utils/helpers";

const inter = Inter({ subsets: ["latin"] });

const serviceId = process.env.NEXT_PUBLIC_SERVICE_ID as string;
const AccountSID = process.env.NEXT_PUBLIC_ACCOUNT_SID as string;
const AuthToken = process.env.NEXT_PUBLIC_AUTH_TOKEN as string;

export default function Home() {
  const [qruri, setQrui] = useState("");
  const [factor, setFactor] = useState("");
  const [isverified, setIsVerified] = useState(false);

  const [account, setAccount] = useState();

  const [isScanningComplete, setIsScanningComplete] = useState(false);
  const [payload, setPayload] = useState("");

  const [step, setStep] = useState<number>(1);
  const [userType, setUserType] = useState<"owner" | "beneficiery">();
  const [activeField, setActiveField] = useState("deposit");

  const { address } = useAccount();

  const getUri = useCallback(() => {
    fetch(
      `https://verify.twilio.com/v2/Services/${serviceId}/Entities/${address}/Factors`,
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
      `https://verify.twilio.com/v2/Services/${serviceId}/Entities/${address}/Factors/${factor}`,
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
            address: address as string,
            factor: factor,
            factor_hash: factor,
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
        .eq("address", address);
      if (address && data?.length === 0 && !isScanningComplete) {
        getUri();
      } else {
        setAccount(data?.[0]);
      }
    })();
  }, [address, getUri, isScanningComplete]);

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
          <>
            <span className="text-center text-green-500 text-2xl">
              Verification Successful!
            </span>
          </>
        )}
        {account && step === 1 && (
          <div className="flex flex-col justify-center items-center gap-5">
            <span>Select the type of account</span>
            <div className="flex gap-10">
              <div
                onClick={() => setUserType("owner")}
                className={cn(
                  "h-20 w-28 bg-gray-200 rounded-lg cursor-pointer hover:bg-blue-100 hover:border hover:border-blue-300 transition-all flex justify-center items-center",
                  userType === "owner" && "bg-blue-300"
                )}
              >
                Owner
              </div>
              <div
                onClick={() => setUserType("beneficiery")}
                className={cn(
                  "h-20 w-28 bg-gray-200 rounded-lg cursor-pointer hover:bg-blue-100 hover:border hover:border-blue-300 transition-all flex justify-center items-center",
                  userType === "beneficiery" && "bg-blue-300"
                )}
              >
                beneficiery
              </div>
            </div>
            <button
              onClick={() => setStep(2)}
              className="bg-blue-500 text-white px-3 py-1 rounded-lg text-xl hover:scale-105 transition-all"
            >
              continue
            </button>
          </div>
        )}
        {account && step === 2 && (
          <div className="flex flex-col justify-center items-center gap-5">
            <div className="flex bg-gray-100 rounded-lg relative">
              <span
                className="w-28 text-center p-2 cursor-pointer"
                onClick={() => setActiveField("deposit")}
              >
                Deposit
              </span>
              <span
                className="w-28 text-center p-2 cursor-pointer"
                onClick={() => setActiveField("reedem")}
              >
                reedem
              </span>
              <div
                className={cn(
                  "w-28 h-full absolute left-0 top-0 bg-blue-400 rounded-lg opacity-10 border-2 border-blue-800 transition-all",
                  activeField === "reedem" && "left-28"
                )}
              ></div>
            </div>

            <div className="space-x-4">
              <input
                className="p-2 border-2 border-gray-300 rounded-lg"
                placeholder="value"
                type="text"
              />
              <select
                defaultValue="matic"
                className="p-2 border-2 border-gray-300 rounded-lg cursor-pointer"
              >
                <option value="usdc">USDC</option>
                <option value="usdt">USDT</option>
                <option value="matic">MATIC</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
