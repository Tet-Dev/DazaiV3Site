import { clientID } from "../constants";

export const promptLogin = async () => {
  localStorage.setItem("redirect", globalThis?.location?.href);
  //   push to link:
  const url = `https://discord.com/api/oauth2/authorize?client_id=${clientID}&redirect_uri=${encodeURIComponent(
    globalThis.location.origin
  )}%2Fauth&response_type=code&scope=identify%20email%20connections%20guilds`;
  globalThis.window.location.href = url;
};
