import { APIGuild } from "discord-api-types/v10";
import { useEffect, useState } from "react";
import { GuildDataManager } from "../classes/GuildDataManager";
import { BotGuildData } from "../types";

export const useDiscordGuild = (guildID?: string) => {
  const [guild, setGuilds] = useState(
    undefined as Partial<APIGuild> | null | undefined
  );
  useEffect(() => {
    if (!guildID) return setGuilds(undefined);
    if (GuildDataManager.getInstance().guildMap?.has(guildID))
      setGuilds(GuildDataManager.getInstance().guildMap?.get(guildID));

    const guildUpdate = (guildData: Partial<BotGuildData>) => {
      if (guildData.id === guildID) setGuilds(guildData);
    };
    GuildDataManager.getInstance().on("guildRegistrationUpdate", guildUpdate);
    return () => {
      GuildDataManager.getInstance().off(
        "guildRegistrationUpdate",
        guildUpdate
      );
    };
  }, [guildID]);
  return guild;
};
