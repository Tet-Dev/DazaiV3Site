"use client";

import { useEffect, useMemo, useState } from "react";
import { GuildDataManager } from "../../utils/classes/GuildDataManager";
import { useAllBotGuilds } from "../../utils/hooks/useAllBotGuilds";
import { useAllGuilds } from "../../utils/hooks/useAllGuilds";
import { DashboardCard } from "../../components/Dashboard/DashboardCard";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { clientID } from "../../utils/constants";
import { useDiscordUser } from "../../utils/hooks/useDiscordUser";
import Link from "next/link";

const DashboardIndex = () => {
  const guilds = useAllGuilds();
  const botGuilds = useAllBotGuilds();
  const botGuildSet = useMemo(
    () => botGuilds && new Set(botGuilds?.map((g) => g.id)),
    [botGuilds]
  );
  const [refreshing, setRefreshing] = useState(false);
  const user = useDiscordUser();
  const router = useRouter();
  const sortedGuilds = useMemo(
    () =>
      !!guilds &&
      !!botGuildSet &&
      [...guilds]
        .filter((g) => botGuildSet?.has(g.id!) || parseInt(g.permissions!) & 8)
        .sort((a, b) => {
          if (botGuildSet.has(a.id!) && !botGuildSet.has(b.id!)) return -1;
          if (!botGuildSet.has(a.id!) && botGuildSet.has(b.id!)) return 1;
          return a.name!.localeCompare(b.name!);
        }),
    [guilds, botGuildSet]
  );
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      localStorage.setItem("redirect", globalThis?.location?.href);
      router.push(
        `https://discord.com/api/oauth2/authorize?client_id=${clientID}&redirect_uri=${encodeURIComponent(
          globalThis?.location?.href
        )}%2Fauth&response_type=code&scope=identify%20email%20connections%20guilds`
      );
    }
  }, []);
  return (
    <div
      className={`w-full h-screen bg-gray-900 flex flex-col gap-16 py-16 px-8 overflow-auto`}
    >
      <button
        className={`px-6 py-3 bg-black hover:bg-indigo-800 disabled:opacity-50 disabled:backdrop-blur-2xl bottom-4 left-4 w-fit absolute z-30 rounded-2xl text-gray-50/80 cursor-pointer transition-all`}
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
      <div
        className={`w-full flex-grow text-white flex flex-row items-start justify-center`}
      >
        <div
          className={`flex flex-row gap-8 flex-wrap justify-center max-w-[90%] h-full w-[192ch]`}
        >
          <div
            className={`w-full h-48 lg:h-32 md:h-16 rounded-3xl relative group top-0 z-50  bg-gray-900 pointer-events-none`}
          >
            <div
              className={`w-full h-48 lg:h-32 md:h-16 rounded-3xl  absolute`}
            >
              <img
                src={"/images/landing/landingbgsmall.png"}
                className={`w-full h-full object-center object-cover blur-xl rounded-3xl group-hover:opacity-50 brightness-50 transition-all opacity-0`}
              />
            </div>
            <div
              className={`w-full h-48 lg:h-32 md:h-16 rounded-3xl overflow-hidden absolute`}
            >
              <img
                src={"/images/landing/landingbgsmall.png"}
                className={`w-full h-full object-center object-cover blur-lg brightness-50 grayscale group-hover:grayscale-[0.7] group-hover:brightness-75 transition-all`}
              />
            </div>
            <div
              className={`w-full h-48 lg:h-32 md:h-16 rounded-3xl overflow-hidden flex flex-row gap-12 p-8 px-12 lg:p-4 absolute items-center`}
            >
              <div
                className={`flex flex-col w-32 h-32 lg:w-20 lg:h-20 p-1 rounded-full bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 md:hidden`}
              >
                <div
                  className={`rounded-full flex-shrink-0 w-full h-full bg-gray-900/90 transition-all duration-500 bg-center bg-cover relative group ${
                    !user && `pointer-events-none`
                  }`}
                  style={{
                    backgroundImage: `url(${
                      user?.avatar &&
                      `https://cdn.discordapp.com/avatars/${user?.id}/${
                        user?.avatar
                      }${
                        user?.avatar.startsWith("a_") ? ".gif" : ".png"
                      }?size=128`
                    })`,
                  }}
                />
              </div>
              <div className={`flex flex-col gap-4 lg:gap-1 md:hidden`}>
                <span
                  className={`text-2xl lg:text-lg font-poppins font-medium text-indigo-500/30 w-full`}
                >
                  Welcome back,
                </span>
                <div className={`flex flex-row gap-1 items-baseline`}>
                  <span
                    className={`text-4xl lg:text-xl font-poppins font-bold text-gray-50 text-center`}
                  >
                    {user?.username}
                  </span>
                  <span
                    className={`text-base font-poppins font-medium text-gray-400 text-center`}
                  >
                    #{user?.discriminator}
                  </span>
                </div>
              </div>
              <div
                className={`flex flex-row gap-4 grow justify-end sm:justify-evenly`}
              >
                <Link href={"/app/@global"}>
                  <button
                    className={`py-3 px-6 lg:px-4 w-fit lg:py-2 lg:text-base rounded-full font-bold text-lg text-white bg-indigo-500 hover:bg-indigo-900 transition-all shadow-lg pointer-events-auto`}
                  >
                    Global Dashboard
                  </button>
                </Link>
                <button
                  className={`py-3 px-6 lg:px-4 w-fit lg:py-2 lg:text-base rounded-full font-bold text-lg text-white bg-gray-800 hover:bg-indigo-900 transition-all shadow-lg pointer-events-auto`}
                  onClick={() => {
                    window.open(
                      `https://top.gg/bot/${clientID}/vote`,
                      "_blank",
                      "noopener,noreferrer,width=625,height=970"
                    );
                  }}
                >
                  Vote for Dazai
                </button>
              </div>
            </div>
          </div>
          <span
            className={`text-3xl font-poppins font-bold text-white text-center w-full`}
          >
            Your Servers
          </span>
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
