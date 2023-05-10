export const discordAPI = "https://discord.com/api/v10";
export const clientID =
  process.env.NEXT_PUBLIC_CLIENT_ID ||
  (process.env.NODE_ENV === "development"
    ? "876635342567006228"
    : "755260934699745441");
export const botOwnerID = "295391243318591490";
