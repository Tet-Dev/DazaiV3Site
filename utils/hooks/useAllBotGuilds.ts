import { APIGuild } from "discord-api-types/v10";
import { useEffect, useState } from "react";
import { GuildDataManager } from "../classes/GuildDataManager";
import { BotGuildData } from "../types";

export const useAllBotGuilds = () => {
  const [guilds, setGuilds] = useState(
    undefined as BotGuildData[] | null | undefined
  );
  useEffect(() => {
    if (GuildDataManager.getInstance().guildMap?.values())
      setGuilds(
        Array.from(GuildDataManager.getInstance().guildMap?.values() ?? [])
      );
    const listener = (
      guildData: Partial<BotGuildData>,
      bulked?: boolean
    ) => {
      if (bulked) return;
      if (GuildDataManager.getInstance().guildMap?.values())
        setGuilds(
          Array.from(GuildDataManager.getInstance().guildMap?.values() ?? [])
        );
    };
    GuildDataManager.getInstance().on("guildDataUpdate", listener);
    GuildDataManager.getInstance().on("guildDataBulkUpdate", listener);
    return () => {
      GuildDataManager.getInstance().off("guildDataUpdate", listener);
      GuildDataManager.getInstance().off("guildDataBulkUpdate", listener);
    };
  }, []);
  return guilds;
};
