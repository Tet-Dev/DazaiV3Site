"use client";
import { useEffect, useRef } from "react";
import { DiscordAuthData } from "./api/authorize";
import { clientID } from "../utils/constants";
import { DiscordOauthBundle } from "../utils/types";
import { useRouter } from "next/router";

export const BlankPage = () => {
  const router = useRouter();
  const debounce = useRef(0);
  useEffect(() => {
    if (!router.query || !router.query.code || debounce.current) {
      return;
    }
    debounce.current = 1;
    fetch("/api/authorize", {
      headers: {},
      body: JSON.stringify({
        code: router.query.code,
        uri: window.location.href.match(/(.+)?\?/)![1],
      }),
      method: "POST",
    })
      .then((res) => res.json())
      .then((data: DiscordAuthData) => {
        const requiredScopes = ["identify", "guilds", "email", "connections"];
        if (!data || requiredScopes.find((s) => !data.scope.includes(s))) {
          window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${clientID}&redirect_uri=${encodeURIComponent(
            window.location.origin
          )}%2Fauth&response_type=code&scope=identify%20email%20connections%20guilds`;
          console.info("DATA", data);
          return;
        }
        localStorage.setItem("token", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("expiresAt", `${data.expiresAt}`);
        localStorage.setItem("scope", data.scope);
        router.push(localStorage.getItem("redirect") || "/app");
        localStorage.removeItem("redirect");
      });

    // const data =
  }, [router.query]);
  return <div className={`w-full h-full bg-black`} />;
};
export default BlankPage;
