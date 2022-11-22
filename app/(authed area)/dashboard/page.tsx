"use client";

import { useMemo, useState } from "react";
import { GuildDataManager } from "../../../utils/classes/GuildDataManager";
import { useAllBotGuilds } from "../../../utils/hooks/useAllBotGuilds";
import { useAllGuilds } from "../../../utils/hooks/useAllGuilds";
import { DashboardCard } from "./components/DashboardCard";

export const DashboardIndex = () => {
  const guilds = useAllGuilds();
  const botGuilds = useAllBotGuilds();
  const botGuildSet = useMemo(
    () => botGuilds && new Set(botGuilds?.map((g) => g.id)),
    [botGuilds]
  );
  const [refreshing, setRefreshing] = useState(false);
  const sortedGuilds = useMemo(
    () =>
      !!guilds &&
      !!botGuildSet &&
      [...guilds].sort((a, b) => {
        if (botGuildSet.has(a.id!) && !botGuildSet.has(b.id!)) return -1;
        if (!botGuildSet.has(a.id!) && botGuildSet.has(b.id!)) return 1;
        return a.name!.localeCompare(b.name!);
      }),
    [guilds, botGuildSet]
  );
  return (
    <div
      className={`w-full h-full bg-gray-900 flex flex-col gap-16 py-16 overflow-auto`}
    >
      <button
        className={`px-6 py-3 bg-black hover:bg-purple-800 disabled:opacity-50 disabled:backdrop-blur-2xl bottom-4 left-4 w-fit absolute z-10 rounded-2xl text-gray-50/80 cursor-pointer transition-all`}
        disabled={refreshing}
        onClick={() => {
          setRefreshing(true);
          GuildDataManager.getInstance()
            .getGuildRegistrations(true)
            .then(() => setRefreshing(false));
        }}
      >
        {refreshing ? "Refreshing..." : "Refresh Serverlist"}
      </button>
      <div className={`flex flex-row gap-4 relative`}>
        <span
          className={`text-3xl font-poppins font-bold text-white text-center w-full`}
        >
          Your Servers
        </span>
      </div>
      <div
        className={`w-full flex-grow text-white flex flex-row items-start justify-center`}
      >
        <div
          className={`flex flex-row gap-8 flex-wrap justify-center max-w-[90%]`}
        >
          {sortedGuilds
            ? sortedGuilds?.map((guild) => (
                <DashboardCard
                  guild={guild}
                  key={`dashboard-guild-card-${guild.id}`}
                  botSetup={botGuildSet?.has(guild.id!)}
                />
              ))
            : Array.from({ length: 12 }).map((_, i) => (
                <DashboardCard
                  key={`dashboard-guild-card-skeleton${i}`}
                  skeleton
                />
              ))}
        </div>
      </div>
    </div>
  );
};
export default DashboardIndex;
