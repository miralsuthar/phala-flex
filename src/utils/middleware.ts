import { ResponseType } from "@/pages/api/factor";
import { NextApiRequest, NextApiResponse } from "next";

export function requireAuthentication(
  req: NextApiRequest,
  res: NextApiResponse,
  next: any
) {
  const authToken = req.headers.authorization;

  // Check if the Authorization header is present and contains a valid token/key
  if (!authToken || authToken !== process.env.NEXT_PUBLIC_FLEX_API_AUTH_TOKEN) {
    return res.status(401).json({
      code: 401,
      error: "Unauthorized! Not a valid AUTH Token",
    } as ResponseType);
  }

  // Authentication successful, allow the request to proceed
  next();
}
