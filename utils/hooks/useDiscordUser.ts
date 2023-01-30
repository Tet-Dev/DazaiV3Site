import { APIUser } from "discord-api-types/v10";
import { useState, useEffect } from "react";
import { UserDataManager } from "../classes/UserDataManager";

export const useDiscordUser = () => {
  const [user, setUser] = useState(undefined as APIUser | null | undefined);
  useEffect(() => {
    if (UserDataManager.getInstance().discordSelf)
      setUser(UserDataManager.getInstance().discordSelf);
    
    const listener = (user: APIUser) => {
      setUser(user);
    };
    UserDataManager.getInstance().on("selfUpdate", listener);
    return () => {
      UserDataManager.getInstance().off("selfUpdate", listener);
    };
  }, []);
  return user;
};
