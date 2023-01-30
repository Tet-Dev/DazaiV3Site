"use client";

import { GetServerSideProps, NextPage } from "next";
import { AppProps } from "next/app";
import { useMemo, useState } from "react";
import { useAllGuilds } from "../../../../utils/hooks/useAllGuilds";
import { useDiscordGuild } from "../../../../utils/hooks/useDiscordGuildData";
import { useGuildData } from "../../../../utils/hooks/useGuildData";
import { TopModuleBar } from "../../../../components/Dashboard/ModuleBar/TopModuleBar";
import {
  PaintBrushIcon,
  ShieldCheckIcon,
  StarIcon,
} from "@heroicons/react/20/solid";
import { FaCompass } from "react-icons/fa";
import { useRouter } from "next/router";
const GuildDashboard = () => {
  const router = useRouter();
  const guildID = router.query.guild as string;
  const guild = useDiscordGuild(guildID);
  const guildData = useGuildData(guildID);
  return (
    <div
      className={`flex flex-row flex-grow container w-full h-full justify-center`}
    >
      <div
        className={`grid grid-cols-10 w-[65rem] max-w-[90%] h-max pt-16 gap-8 bg-gray-600`}
      >
        <div className={`col-span-7 2xl:col-span-5 br80 flex flex-col`}>
          <TopModuleBar guildID={guildID} guildData={guildData} guild={guild} />
          {/* <MusicCard guildID={guildID} guildData={guildData} guild={guild} /> */}
        </div>
        <div className={`col-span-3 2xl:col-span-4`}>
          <div
            className={`flex flex-col gap-2 p-4 py-4 w-full rounded-2xl bg-gray-900/50`}
          >
            <span
              className={`text-xl font-semibold px-2 text-gray-600 font-poppins`}
            >
              Reccomended Actions
            </span>

            <div
              className={`flex flex-row gap-4 rounded-2xl p-2 hover:bg-gray-800/40 cursor-pointer transition-colors items-center`}
            >
              <div
                className={`w-16 h-16 bg-black/20 rounded-2xl flex flex-row items-center justify-center shrink-0`}
              >
                <PaintBrushIcon className={`w-8 h-8`} />
              </div>
              <div className={`flex flex-col justify-center gap-1`}>
                <span className={`text-lg font-medium font-poppins`}>
                  Customize Appearance
                </span>
                <span className={`text-sm text-gray-400`}>
                  Customize your Dazai experience
                </span>
              </div>
            </div>

            <div
              className={`flex flex-row gap-4 rounded-2xl p-2 hover:bg-gray-800/40 cursor-pointer transition-colors items-center`}
            >
              <div
                className={`w-16 h-16 bg-black/20 rounded-2xl flex flex-row items-center justify-center shrink-0`}
              >
                <ShieldCheckIcon className={`w-8 h-8`} />
              </div>
              <div className={`flex flex-col justify-center gap-1`}>
                <span className={`text-lg font-medium font-poppins`}>
                  Customize Permissions
                </span>
                <span className={`text-sm text-gray-400`}>
                  Setup permissions for your server
                </span>
              </div>
            </div>

            <div
              className={`flex flex-row gap-4 rounded-2xl p-2 hover:bg-gray-800/40 cursor-pointer transition-colors items-center`}
            >
              <div
                className={`w-16 h-16 bg-black/20 rounded-2xl flex flex-row items-center justify-center shrink-0`}
              >
                <StarIcon className={`w-8 h-8`} />
              </div>
              <div className={`flex flex-col justify-center gap-1`}>
                <span className={`text-lg font-medium font-poppins`}>
                  Vote for Dazai!
                </span>
                <span className={`text-sm text-gray-400`}>
                  Spread the love and vote for Dazai!
                </span>
              </div>
            </div>

            <div
              className={`flex flex-row gap-4 rounded-2xl p-2 hover:bg-gray-800/40 cursor-pointer transition-colors items-center`}
            >
              <div
                className={`w-16 h-16 bg-black/20 rounded-2xl flex flex-row items-center justify-center shrink-0`}
              >
                <FaCompass className={`w-7 h-7`} />
              </div>
              <div className={`flex flex-col justify-center gap-1`}>
                <span className={`text-lg font-medium font-poppins`}>
                  Explore Commands
                </span>
                <span className={`text-sm text-gray-400`}>
                  Explore all the commands Dazai has to offer
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* {JSON.stringify(guildData)} */}
      </div>
    </div>
  );
};
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    redirect: {
      destination: `${context.resolvedUrl}/music`,
      permanent: false,
    },
  };
};
export default GuildDashboard;
