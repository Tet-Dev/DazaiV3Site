import { APIGuild } from "discord-api-types/v10";
import { useEffect, useState } from "react";
import { GuildDataManager } from "../classes/GuildDataManager";
import { BotGuildData } from "../types";

export const useGuildData = (guildID?: string) => {
  const [guild, setGuilds] = useState(
    undefined as Partial<BotGuildData> | null | undefined
  );
  useEffect(() => {
    if (!guildID) return setGuilds(undefined);
    if (GuildDataManager.getInstance().guildMap?.has(guildID))
      setGuilds(
        GuildDataManager.getInstance().guildMap?.get(guildID)
      );
    else GuildDataManager.getInstance().getGuildData(guildID);
    const guildUpdate = (guildData: Partial<BotGuildData>) => {
      if (guildData.id === guildID) setGuilds(guildData);
    };
    GuildDataManager.getInstance().on("guildDataUpdate", guildUpdate);
    return () => {
      GuildDataManager.getInstance().off(
        "guildDataUpdate",
        guildUpdate
      );
    };
  }, [guildID]);
  return guild;
};
