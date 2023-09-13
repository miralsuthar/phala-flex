import { Inter } from "next/font/google";

export const inter = Inter({ subsets: ["latin"] });

export const serviceId = process.env.NEXT_PUBLIC_SERVICE_ID as string;
export const AccountSID = process.env.NEXT_PUBLIC_ACCOUNT_SID as string;
export const AuthToken = process.env.NEXT_PUBLIC_AUTH_TOKEN as string;

export const tokens = [
  {
    id: 1,
    value: "0x0000000000000000000001",
    name: "matic",
  },
  {
    id: 2,
    value: "0x2882CE9eC73cd80AB6c048C030BDa65fd3A0263A",
    name: "dusd",
  },
  {
    id: 3,
    value: "0x0000000000000000000001",
    name: "usdt",
  },
];
