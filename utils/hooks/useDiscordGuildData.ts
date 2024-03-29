import { APIGuild } from "discord-api-types/v10";
import { useEffect, useLayoutEffect, useState } from "react";
import { GuildDataManager } from "../classes/GuildDataManager";
import { BotGuildData } from "../types";

export const useDiscordGuild = (guildID?: string) => {
  const [guild, setGuilds] = useState(
    undefined as Partial<APIGuild> | null | undefined
  );
  useLayoutEffect(() => {
    if (!guildID) return setGuilds(undefined);
    if (GuildDataManager.getInstance().guildMap?.has(guildID))
      setGuilds(GuildDataManager.getInstance().guildMap?.get(guildID));

    const guildUpdate = (guildData: Partial<BotGuildData>) => {
      if (guildData.id === guildID) setGuilds(guildData);
    };
    const guildCacheLoad = () => {
      if (GuildDataManager.getInstance().guildMap?.has(guildID))
        setGuilds(GuildDataManager.getInstance().guildMap?.get(guildID));
    };
    GuildDataManager.getInstance().on("guildRegistrationUpdate", guildUpdate);
    GuildDataManager.getInstance().on("guildDataBulkUpdate", guildCacheLoad);
    return () => {
      GuildDataManager.getInstance().off(
        "guildRegistrationUpdate",
        guildUpdate
      );
      GuildDataManager.getInstance().off("guildDataBulkUpdate", guildCacheLoad);
    };
  }, [guildID]);
  return guild;
};
