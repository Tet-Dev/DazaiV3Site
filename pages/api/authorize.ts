import type { NextApiRequest, NextApiResponse } from "next";
import { clientID, discordAPI } from "../../utils/constants";
import nfetch from "../../utils/nFetch";
import { DiscordOauthBundle } from "../../utils/types";

export type DiscordAuthData = {
  token: string;
  refreshToken: string;
  expiresAt: number;
  scope: string;
} | null;

export default async (
  req: NextApiRequest,
  res: NextApiResponse<DiscordAuthData>
) => {
  const { code, uri } = JSON.parse(req.body);
  const data = (await nfetch(`${discordAPI}/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientID,
      client_secret: process.env.CLIENT_SECRET!,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: uri,
    }).toString(),
  }).then((data) => (data.ok ? data.json() : null))) as DiscordOauthBundle;
  res.status(200).json(
    !data
      ? null
      : {
          token: data.access_token,
          refreshToken: data.refresh_token,
          expiresAt: Date.now() + data.expires_in,
          scope: data.scope,
        }
  );
};
