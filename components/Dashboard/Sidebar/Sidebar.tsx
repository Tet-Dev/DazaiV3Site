import { GuildIconRenderer } from "../../GuildIconRenderer";
import { useDiscordGuild } from "../../../utils/hooks/useDiscordGuildData";
import { useGuildData } from "../../../utils/hooks/useGuildData";
import { GuildSidebarModule } from "./SidebarModule";
import {
  ArchiveBoxIcon,
  Bars3Icon,
  CurrencyDollarIcon,
  GiftIcon,
  HomeIcon,
  MusicalNoteIcon,
  QueueListIcon,
  RectangleStackIcon,
  ShieldCheckIcon,
  SparklesIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useDiscordUser } from "../../../utils/hooks/useDiscordUser";
import { APIRole } from "discord-api-types/v10";
import { useMemo, useState } from "react";
import { GuildSidebarUser } from "./SidebarUser";
import { useRouter } from "next/router";
import { promptLogin } from "../../../utils/helpers/promptLogin";

export const GuildSidebar = (props: { guildID: string | undefined }) => {
  const { guildID } = props;
  const guild = useDiscordGuild(guildID);
  const guildData = useGuildData(guildID);
  const { user } = useDiscordUser();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  if (user === null) {
    promptLogin();
    return null;
  }
  return (
    <div className={`w-fit shrink-0 max-w-full z-40`}>
      <div
        className={`absolute w-screen h-screen bg-black/80 z-40 hidden ${
          open ? "lg:block" : " pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />
      <div
        className={`top-4 left-4 absolute p-2 bg-gray-850/30 backdrop-blur-2xl hover:bg-gray-500/70 rounded-full cursor-pointer z-40 transition-all ${
          open ? "-translate-x-[150%]" : ""
        } lg:block hidden`}
        onClick={() => setOpen(true)}
      >
        <Bars3Icon className={`w-6 h-6`} />
      </div>
      <div
        className={`h-screen p-6 2xl:p-2 z-[999] shrink-0 lg:absolute md:w-full md:max-w-[30ch] ${
          open ? `` : `lg:-translate-x-full`
        } transition-all duration-300 ease-in-out delay-75`}
      >
        <div
          className={`p-2 bg-gray-850/30 backdrop-blur-2xl hover:bg-gray-500/70 rounded-full cursor-pointer z-10 transition-all hidden md:block absolute top-1 right-0`}
          onClick={() => setOpen(false)}
        >
          <XMarkIcon className={`w-6 h-6`} />
        </div>
        <div
          className={`flex flex-col gap-12 lg:gap-6 lg:p-6 p-8 bg-gray-800 rounded-3xl shadow-2xl h-full shrink-0`}
        >
          <div className={`flex flex-row gap-4 items-center w-full`}>
            <GuildIconRenderer
              guild={guild}
              className={`rounded-3xl w-8 h-8 flex flex-row items-center justify-center bg-gray-850 2xl:hidden`}
            />
            <div className={`flex flex-col gap-2`}>
              <div className={`text-xl font-bold text-gray-100 font-poppins`}>
                {guild?.name}
              </div>
              {/* <div className={`text-gray-700`}>#{guild?.id}</div> */}
            </div>
          </div>
          <div className={`flex flex-col gap-12 overflow-auto grow`}>
            <div
              className={`flex flex-col gap-8 lg:gap-6 ${
                user === undefined ? "blur-md pointer-events-none" : ""
              }`}
            >
              {/* <GuildSidebarModule
            name="Dashboard"
            icon={<HomeIcon className={`w-6 h-6 md:w-4 md:h-4`} />}
            route={`/app/guild/${guildID}`}
          /> */}
              <GuildSidebarModule
                name="Back to Server List"
                icon={<QueueListIcon className={`w-6 h-6 md:w-4 md:h-4`} />}
                route={`/app/`}
                // disabled={"Coming soon!"}
              />
              <GuildSidebarModule
                name="Music"
                icon={<MusicalNoteIcon className={`w-6 h-6 md:w-4 md:h-4`} />}
                route={`/app/guild/${guildID}/music`}
              />
              <GuildSidebarModule
                name="Leaderboard"
                icon={<SparklesIcon className={`w-6 h-6 md:w-4 md:h-4`} />}
                route={`/app/guild/${guildID}/xp`}
                // disabled={"Coming soon!"}
              />
              <GuildSidebarModule
                name="Inventory"
                icon={<ArchiveBoxIcon className={`w-6 h-6 md:w-4 md:h-4`} />}
                route={`/app/guild/${guildID}/inventory/@me`}
                // disabled={"Coming soon!"}
              />
              <GuildSidebarModule
                name="Shop"
                icon={
                  <CurrencyDollarIcon className={`w-6 h-6 md:w-4 md:h-4`} />
                }
                route={`/app/guild/${guildID}/shop`}
                // disabled={"Coming soon!"}
              />
              <GuildSidebarModule
                name="Crates"
                icon={<GiftIcon className={`w-6 h-6 md:w-4 md:h-4`} />}
                route={`/app/guild/${guildID}/crates`}
                // disabled={"Coming soon!"}
              />
            </div>
            {guildData?.hasAdmin && (
              <div className={`flex flex-col gap-6`}>
                <span className={`text-gray-400 text-sm font-wsans font-bold`}>
                  Server Admin
                </span>
                <div className={`flex flex-col gap-8 lg:gap-6 px-2`}>
                  {/* <GuildSidebarModule
            name="Dashboard"
            icon={<HomeIcon className={`w-6 h-6 md:w-4 md:h-4`} />}
            route={`/app/guild/${guildID}`}
          /> */}
                  <GuildSidebarModule
                    name="Server Rank Cards"
                    icon={
                      <RectangleStackIcon className={`w-6 h-6 md:w-4 md:h-4`} />
                    }
                    route={`/app/guild/${guildID}/settings/rankcards`}
                    // disabled={"Coming soon!"}
                  />
                  <GuildSidebarModule
                    name="Server Crates"
                    icon={
                      <ArchiveBoxIcon className={`w-6 h-6 md:w-4 md:h-4`} />
                    }
                    route={`/app/guild/${guildID}/settings/crates`}
                    // disabled={"Coming soon!"}
                  />
                  <GuildSidebarModule
                    name="Server Shop Bundles"
                    icon={
                      <CurrencyDollarIcon className={`w-6 h-6 md:w-4 md:h-4`} />
                    }
                    route={`/app/guild/${guildID}/settings/shop`}
                    // disabled={"Coming soon!"}
                  />
                  <GuildSidebarModule
                    name="Levelup Rewards"
                    icon={<GiftIcon className={`w-6 h-6 md:w-4 md:h-4`} />}
                    route={`/app/guild/${guildID}/settings/leveluprewards`}
                    // disabled={"Coming soon!"}
                  />
                  <GuildSidebarModule
                    name="Permissions"
                    icon={
                      <ShieldCheckIcon className={`w-6 h-6 md:w-4 md:h-4`} />
                    }
                    route={`/app/guild/${guildID}/permissions`}
                    disabled={"Coming soon!"}
                  />
                </div>
              </div>
            )}

            <div className={`flex flex-grow`} />
          </div>
          <GuildSidebarUser
            user={user}
            guild={guild}
            guildData={guildData}
            skeleton={!user}
          />
        </div>
      </div>
    </div>
  );
};
