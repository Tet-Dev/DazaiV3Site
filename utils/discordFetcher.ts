import { DiscordAuthData } from "../pages/api/authorize";
let refreshing = false;
export const fetcher = async (
  input: RequestInfo,
  init?: RequestInit | undefined,
  withAuth = true
) => {
  //   console.log('[fetcher]', input, init, btype))
  let token = localStorage.getItem("token");
  let expiresAt = parseInt(localStorage.getItem("expiresAt") || "0")!;
  if (
    token &&
    expiresAt <= Date.now() &&
    localStorage.getItem("refreshToken")
  ) {
    if (refreshing) {
      while (refreshing) {
        await new Promise((r) => setTimeout(r, 100));
      }
      token = localStorage.getItem("token");
      expiresAt = parseInt(localStorage.getItem("expiresAt") || "0")!;
    } else {
      refreshing = true;
      console.log(
        "refreshing token",
        token,
        expiresAt,
        localStorage.getItem("refreshToken")
      );
      const data = (await fetch(`/api/refresh`, {
        method: "POST",
        body: JSON.stringify({
          refreshToken: localStorage.getItem("refreshToken"),
        }),
      }).then((res) => res.json())) as DiscordAuthData;
      if (data) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("expiresAt", `${data.expiresAt}`);
        localStorage.setItem("scope", data.scope);
        token = data.token;
        expiresAt = data.expiresAt;
      } else {
        token = null;
        expiresAt = 0;
      }
      refreshing = false;
    }
  }

  console.log({ token, expiresAt });
  let res = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
      ...(withAuth && token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    },
  });
  return res;
  //   console.log('Requesting', input, btype, requestBuckets))
};
