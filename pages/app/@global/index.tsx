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
const GlobalDashboard = () => {
  const router = useRouter();
  const guildID = router.query.guild as string;
  // const guild = useDiscordGuild(guildID);
  // const guildData = useGuildData(guildID);
  return (
    <div
      className={`flex flex-row flex-grow w-full h-full justify-center`}
    >
      <div className={`bg-gray-850 w-full`}>
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
