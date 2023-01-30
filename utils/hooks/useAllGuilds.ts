import { APIGuild } from "discord-api-types/v10";
import { useEffect, useState } from "react";
import { GuildDataManager } from "../classes/GuildDataManager";

export const useAllGuilds = (filterPerms: boolean = true) => {
  const [guilds, setGuilds] = useState(
    undefined as Partial<APIGuild>[] | null | undefined
  );
  useEffect(() => {
    if (GuildDataManager.getInstance().guildRegistrations?.values())
      setGuilds(
        Array.from(
          GuildDataManager.getInstance().guildRegistrations!.values() ?? []
        ).filter((g) => parseInt(g.permissions!) || !filterPerms)
      );
    const listener = (guildData: Partial<APIGuild>) => {
      if (GuildDataManager.getInstance().guildRegistrations?.values())
        setGuilds(
          Array.from(
            GuildDataManager.getInstance().guildRegistrations!.values() ?? []
          ).filter((g) => parseInt(g.permissions!)|| !filterPerms)
        );
    };
    GuildDataManager.getInstance().on("guildRegistrationsUpdate", listener);
    return () => {
      GuildDataManager.getInstance().off("guildRegistrationsUpdate", listener);
    };
  }, []);
  return guilds;
};
