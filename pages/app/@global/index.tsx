"use client";

import { GetServerSideProps, NextPage } from "next";
import { AppProps } from "next/app";
import { useMemo, useState } from "react";
import {
  PaintBrushIcon,
  ShieldCheckIcon,
  StarIcon,
} from "@heroicons/react/20/solid";
import { FaCompass } from "react-icons/fa";
import { useRouter } from "next/router";
import { VotingStreak } from "../../../components/Global/Dashboard/VotingStreak";
const GlobalDashboard = () => {
  const router = useRouter();
  const guildID = router.query.guild as string;
  // const guild = useDiscordGuild(guildID);
  // const guildData = useGuildData(guildID);
  return (
    <div className={`flex flex-row flex-grow w-full h-full justify-center`}>
      <div className={`w-[80ch] max-w-[90vw] h-screen relative overflow-auto py-12 gap-12 flex flex-col`}>
        <div className={`w-full`}>
          <h1 className={`text-3xl font-bold font-poppins`}>
            Voting
          </h1>
        </div>
        <VotingStreak />
      </div>
    </div>
  );
};
// export const getServerSideProps: GetServerSideProps = async (context) => {
//   return {
//     redirect: {
//       destination: `${context.resolvedUrl}/music`,
//       permanent: false,
//     },
//   };
// };
export default GlobalDashboard;
