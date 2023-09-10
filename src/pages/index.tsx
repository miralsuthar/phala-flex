import { Inter } from "next/font/google";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import QRCode from "react-qr-code";
import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { supabase } from "@/utils/api";

const inter = Inter({ subsets: ["latin"] });

const serviceId = process.env.NEXT_PUBLIC_SERVICE_ID as string;
const AccountSID = process.env.NEXT_PUBLIC_ACCOUNT_SID as string;
const AuthToken = process.env.NEXT_PUBLIC_AUTH_TOKEN as string;

export default function Home() {
  const [qruri, setQrui] = useState("");
  const [factor, setFactor] = useState("");
  const [isverified, setIsVerified] = useState(false);

  const [isScanningComplete, setIsScanningComplete] = useState(false);
  const [payload, setPayload] = useState("");

  const [authOtp, setAuthOtp] = useState("");

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
            authy_id: 1,
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
            <div className="flex flex-col items-center gap-10">
              <p>
                Enter the code displaying on your authenticator app.(Ex. 467
                890)
              </p>
              <input
                value={authOtp}
                onChange={(e) => setAuthOtp(e.target.value)}
                placeholder="otp"
                className="text-black text-center text-2xl rounded-md border p-1 border-gray-500"
              />
              <button
                onClick={() => verifyToken(authOtp, factor)}
                className="bg-blue-500 text-white px-3 py-1 rounded-md text-lg w-max hover:scale-105 transition-all"
              >
                Check
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
