import { APIGuild } from "discord-api-types/v10";
import { useEffect, useState } from "react";
import { GuildDataManager } from "../classes/GuildDataManager";
import { DiscordGuildData } from "../types";

export const useAllBotGuilds = () => {
  const [guilds, setGuilds] = useState(
    undefined as DiscordGuildData[] | null | undefined
  );
  useEffect(() => {
    if (GuildDataManager.getInstance().guildMap?.values())
      setGuilds(
        Array.from(GuildDataManager.getInstance().guildMap?.values() ?? [])
      );
    const listener = (guildData: Partial<APIGuild>) => {
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
