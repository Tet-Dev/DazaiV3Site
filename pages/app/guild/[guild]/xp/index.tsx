"use client";

import { GetServerSideProps, NextPage } from "next";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { GuildMusicQueue } from "../../../../../components/Music/Queue";
import { useAllGuilds } from "../../../../../utils/hooks/useAllGuilds";
import { useDiscordGuild } from "../../../../../utils/hooks/useDiscordGuildData";
import { useGuildData } from "../../../../../utils/hooks/useGuildData";
import { msToFormat } from "../../../../../utils/parseTime";
import { getGuildShardURL, ShardMap } from "../../../../../utils/ShardLib";
import {
  BotGuildData,
  GuildLeaderboardEntry,
  GuildMemeberXP,
  MusicTrack,
} from "../../../../../utils/types";
import {
  PauseIcon,
  ForwardIcon,
  BackwardIcon,
  PlayIcon,
  StopIcon,
  PhoneXMarkIcon,
} from "@heroicons/react/24/solid";
import { fetcher } from "../../../../../utils/discordFetcher";
import { GuildMusicNowPlaying } from "../../../../../components/Music/NowPlaying";
import { useDiscordUser } from "../../../../../utils/hooks/useDiscordUser";
import {
  JoinableChannelsPayload,
  MusicChannelSelect,
} from "../../../../../components/Music/MusicSelectChannel";
import { GuildLeaderboard } from "../../../../../components/Levelling/Leaderboard";
const GuildXP = (props: {
  guildID: string;
  guild: BotGuildData;
  leaderboard: GuildLeaderboardEntry[];
}) => {
  const { leaderboard, guild, guildID } = props;
  const router = useRouter();
  const user = useDiscordUser();

  return (
    <>
      <div className={`absolute top-0 left-0 w-full h-full bg-opacity-50 z-10`}>
        <div className={`relative w-full h-full`}>
          <div
            className={`absolute top-0 left-0 w-full h-full bg-gradient-to-t from-gray-850 via-gray-850/90 to-gray-850/30 z-10`}
          ></div>
          {(guild.background ?? guild.banner ?? guild.icon) && (
            <img
              src={guild.background ?? guild.banner ?? guild.icon!}
              className={`w-full h-full blur-2xl opacity-50 object-cover`}
            />
          )}
        </div>
      </div>
      <div
        className={`flex-grow h-screen flex flex-row justify-center relative z-20`}
      >
        <div
          className={`grid grid-cols-12 flex-grow h-full xl:grid-cols-8 xl:mx-2 ${
            user ? `2xl:ml-2 ml-[10%] gap-8 2xl:gap-0 ` : `2xl:ml-[5%] gap-8`
          } relative`}
        >
          <GuildLeaderboard
            guildID={guildID}
            leaderboardData={leaderboard}
            guild={guild}
          />
        </div>
      </div>
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { guild: gid } = ctx.query;
  if (!gid) {
    return {
      redirect: {
        destination: "/app",
        permanent: false,
      },
    };
  }
  // guild lookup shard
  const shardURL = getGuildShardURL(gid as string);
  const leaderboardTop = await fetch(`${shardURL}/guilds/${gid}/levels/top`);
  const leaderboardTopJSON = await leaderboardTop.json().catch((e) => {
    return { error: true };
  });
  const guild = await fetch(`${shardURL}/guilds/${gid}`).then((res) =>
    res.json()
  );
  // sleep for 20 seconds
  
  return {
    props: {
      guildid: gid,
      guild,
      leaderboard: leaderboardTopJSON,
    },
  };
};

export default GuildXP;
