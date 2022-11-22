"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { DiscordAuthData } from "../../../pages/api/authorize";
import { DiscordOauthBundle } from "../../../utils/types";

export const blankPage = () => {
  const router = useRouter();
  const query = useSearchParams();
  const debounce = useRef(0);
  useEffect(() => {
    if (!query.get("code") || debounce.current) {
      return;
    }
    debounce.current = 1;
    fetch("/api/authorize", {
      headers: {},
      body: JSON.stringify({
        code: query.get("code"),
        uri: window.location.href.match(/(.+)?\?/)![1],
      }),
      method: "POST",
    })
      .then((res) => res.json())
      .then((data: DiscordAuthData) => {
        const requiredScopes = [
          "identify",
          "guilds",
          "guilds.join",
          "rpc",
          "email",
          "gdm.join",
          "connections",
        ];
        if (!data || requiredScopes.find((s) => !data.scope.includes(s))) {
          window.location.href = `https://discord.com/api/oauth2/authorize?client_id=747901310749245561&redirect_uri=${encodeURIComponent(
            window.location.origin
          )}%2Fauth&response_type=code&scope=identify%20email%20connections%20guilds`;
          console.info("DATA", data);
          return;
        }
        localStorage.setItem("token", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("expiresAt", `${data.expiresAt}`);
        localStorage.setItem("scope", data.scope);
        router.push("/dashboard");
      });

    // const data =
  }, [query]);
  return <div className={`w-full h-full bg-black`} />;
};
export default blankPage;
