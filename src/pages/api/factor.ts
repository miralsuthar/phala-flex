// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/db";
import { requireAuthentication } from "@/utils/middleware";

export type ResponseType = {
  code: number;
  factor?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  requireAuthentication(req, res, async () => {
    const { factorHash } = req.query;

    const factor = await supabase
      .from("user")
      .select("factor")
      .filter("factor_hash", "eq", factorHash);

    if (factor != undefined) {
      res.status(200).send({
        code: 200,
        factor: factor.data as unknown as string,
      });
    }

    res.status(404).send({
      code: 404,
      error: "Factor Not Found.",
    });
  });
}