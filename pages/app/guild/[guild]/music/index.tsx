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
import { MusicTrack } from "../../../../../utils/types";
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
const GuildDashboard = (props: {
  guild: string;
  musicData: {
    track?: MusicTrack;
    status?: "playing" | "paused" | "stopped";
    position?: number;
    queue?: MusicTrack[];
    error?: string;
  };
}) => {
  const { musicData: md } = props;
  const router = useRouter();
  const guildID = router.query.guild as string;
  const [musicData, setMusicData] = useState(md);
  const [position, setPosition] = useState(md.position!);
  const user = useDiscordUser();

  useEffect(() => {
    if (musicData.status !== "playing") return;
    console.log("setting position", musicData.position);
    setPosition(musicData.position!);
    const second = setInterval(() => {
      setPosition((p) => p + 50);
    }, 50);
    return () => {
      clearInterval(second);
    };
  }, [musicData.position, musicData.status]);

  useEffect(() => {
    console.log("polling", router);
    const poll = async () => {
      const res = await fetch(
        `${getGuildShardURL(guildID)}/guilds/${guildID}/music/status`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      setMusicData(data);
    };
    const interval = setInterval(poll, 1000);
    return () => clearInterval(interval);
  }, [guildID]);
  const guild = useDiscordGuild(guildID);
  const guildData = useGuildData(guildID);
  return (
    <div className={`flex-grow h-screen flex flex-row justify-center`}>
      <div
        className={`grid grid-cols-12 flex-grow h-full  ${
          user ? `xl:ml-2 ml-[10%] gap-8 xl:gap-0` : `ml-[5%] gap-8`
        } relative`}
      >
        <GuildMusicQueue queue={musicData.queue!} />
        <GuildMusicNowPlaying
          musicData={musicData}
          position={position}
          guildID={guildID}
        />
      </div>
    </div>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { guild } = ctx.query;
  if (!guild) {
    return {
      redirect: {
        destination: "/app",
        permanent: false,
      },
    };
  }
  // guild lookup shard
  const shardURL = getGuildShardURL(guild as string);
  const musicData = await fetch(`${shardURL}/guilds/${guild}/music/status`);
  const musicDataJSON = await musicData.json();

  return {
    props: {
      guild,
      musicData: musicDataJSON,
    },
  };
};

export default GuildDashboard;