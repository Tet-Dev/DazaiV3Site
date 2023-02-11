import { useEffect, useState } from "react";
import { BotGuildData, GuildLeaderboardEntry } from "../../utils/types";
import { LeaderboardEntry } from "./LeaderboardEntry";

export const GuildLeaderboard = (props: {
  guildID: string;
  guild: BotGuildData;
  leaderboardData: GuildLeaderboardEntry[];
}) => {
  const { guildID, leaderboardData, guild } = props;
  const [leaderboard, setLeaderboard] = useState(leaderboardData);
  useEffect(() => {
    setLeaderboard(leaderboardData);
  }, [leaderboardData]);
  return (
    <div
      className={`col-span-8 h-screen flex flex-col items-center py-6 overflow-auto px-2`}
    >
      <div className={`relative flex flex-col gap-6 max-w-prose w-full py-6`}>
        <h1 className={`text-xl font-poppins font-bold text-gray-100 md:text-center`}>
          {guild.name} Leaderboard
        </h1>
        {[...leaderboardData].map((entry, index) => (
          <LeaderboardEntry
            key={index}
            entry={entry}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};
