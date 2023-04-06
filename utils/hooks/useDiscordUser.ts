import { APIUser } from "discord-api-types/v10";
import { useState, useEffect } from "react";
import { UserDataManager } from "../classes/UserDataManager";
import { UserData } from "../types";

export const useDiscordUser = () => {
  const [user, setUser] = useState(undefined as UserData | null | undefined);
  useEffect(() => {
    if (UserDataManager.getInstance().discordSelf)
      setUser(UserDataManager.getInstance().discordSelf);

    const listener = (user: UserData) => {
      setUser(JSON.parse(JSON.stringify(user)));
    };
    UserDataManager.getInstance().on("selfUpdate", listener);
    return () => {
      UserDataManager.getInstance().off("selfUpdate", listener);
    };
  }, []);
  if (!user)
    return {
      user: user,
    };
  return user;
};
