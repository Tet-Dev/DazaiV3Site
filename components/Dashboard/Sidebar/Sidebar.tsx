import { GuildIconRenderer } from "../../GuildIconRenderer";
import { useDiscordGuild } from "../../../utils/hooks/useDiscordGuildData";
import { useGuildData } from "../../../utils/hooks/useGuildData";
import { GuildSidebarModule } from "./SidebarModule";
import {
  ArchiveBoxIcon,
  GiftIcon,
  HomeIcon,
  MusicalNoteIcon,
  QueueListIcon,
  RectangleStackIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { useDiscordUser } from "../../../utils/hooks/useDiscordUser";
import { APIRole } from "discord-api-types/v10";
import { useMemo } from "react";
import { GuildSidebarUser } from "./SidebarUser";
import { useRouter } from "next/router";
import { promptLogin } from "../../../utils/helpers/promptLogin";

export const GuildSidebar = (props: { guildID: string | undefined }) => {
  const { guildID } = props;
  const guild = useDiscordGuild(guildID);
  const guildData = useGuildData(guildID);
  const user = useDiscordUser();
  const router = useRouter();
  if (user === null) {
    promptLogin();
    return null;
  }
  if (user === undefined) {
    return (
      <div className={`h-screen p-6 2xl:p-2 z-50 shrink-0`}>
        <div
          className={`flex flex-col gap-12 p-8 bg-gray-800 rounded-3xl shadow-2xl h-full`}
        >
          <div className={`flex flex-row gap-4 items-center`}>
            <GuildIconRenderer
              guild={guild}
              className={`rounded-3xl w-8 h-8 flex flex-row items-center justify-center bg-gray-850 2xl:hidden blur-md animate-pulse`}
            />
            <div className={`flex flex-col gap-2`}>
              <div
                className={`text-xl font-bold text-gray-100 font-poppins blur-md animate-pulse`}
              >
                {guild?.name}
              </div>
              {/* <div className={`text-gray-700`}>#{guild?.id}</div> */}
            </div>
          </div>
          <div
            className={`flex flex-col gap-8 blur-md pointer-events-none animate-pulse`}
          >
            {/* <GuildSidebarModule
          name="Dashboard"
          icon={<HomeIcon className={`w-6 h-6`} />}
          route={`/app/guild/${guildID}`}
        /> */}
            <GuildSidebarModule
              name="Back to Server List"
              icon={<QueueListIcon className={`w-6 h-6`} />}
              route={`/app/`}
              // disabled={"Coming soon!"}
            />
            <GuildSidebarModule
              name="Music"
              icon={<MusicalNoteIcon className={`w-6 h-6`} />}
              route={`/app/guild/${guildID}/music`}
            />
            <GuildSidebarModule
              name="Leaderboard"
              icon={<SparklesIcon className={`w-6 h-6`} />}
              route={`/app/guild/${guildID}/xp`}
              // disabled={"Coming soon!"}
            />
            <GuildSidebarModule
              name="Inventory"
              icon={<ArchiveBoxIcon className={`w-6 h-6`} />}
              route={`/app/guild/${guildID}/inventory`}
              // disabled={"Coming soon!"}
            />
            <GuildSidebarModule
              name="Inventory"
              icon={<ArchiveBoxIcon className={`w-6 h-6`} />}
              route={`/app/guild/${guildID}/inventory`}
              // disabled={"Coming soon!"}
            />
            <GuildSidebarModule
              name="Inventory"
              icon={<ArchiveBoxIcon className={`w-6 h-6`} />}
              route={`/app/guild/${guildID}/inventory`}
              // disabled={"Coming soon!"}
            />
            <GuildSidebarModule
              name="Inventory"
              icon={<ArchiveBoxIcon className={`w-6 h-6`} />}
              route={`/app/guild/${guildID}/inventory`}
              // disabled={"Coming soon!"}
            />
          </div>
          <div className={`flex flex-grow`} />
          <GuildSidebarUser
            user={user}
            guild={guild}
            guildData={guildData}
            skeleton
          />
        </div>
      </div>
    );
    // if (user === null) {
    //   promptLogin();
    // }
  }
  return (
    <div className={`h-screen p-6 2xl:p-2 z-50 shrink-0`}>
      <div
        className={`flex flex-col gap-12 p-8 bg-gray-800 rounded-3xl shadow-2xl h-full`}
      >
        <div className={`flex flex-row gap-4 items-center`}>
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
        <div className={`flex flex-col gap-8`}>
          {/* <GuildSidebarModule
            name="Dashboard"
            icon={<HomeIcon className={`w-6 h-6`} />}
            route={`/app/guild/${guildID}`}
          /> */}
          <GuildSidebarModule
            name="Back to Server List"
            icon={<QueueListIcon className={`w-6 h-6`} />}
            route={`/app/`}
            // disabled={"Coming soon!"}
          />
          <GuildSidebarModule
            name="Music"
            icon={<MusicalNoteIcon className={`w-6 h-6`} />}
            route={`/app/guild/${guildID}/music`}
          />
          <GuildSidebarModule
            name="Leaderboard"
            icon={<SparklesIcon className={`w-6 h-6`} />}
            route={`/app/guild/${guildID}/xp`}
            // disabled={"Coming soon!"}
          />
          <GuildSidebarModule
            name="Inventory"
            icon={<ArchiveBoxIcon className={`w-6 h-6`} />}
            route={`/app/guild/${guildID}/inventory`}
            // disabled={"Coming soon!"}
          />
        </div>
        <div className={`flex flex-col gap-6`}>
          <span className={`text-gray-400 text-sm font-wsans font-bold`}>
            Server Admin
          </span>
          <div className={`flex flex-col gap-8 px-2`}>
            {/* <GuildSidebarModule
            name="Dashboard"
            icon={<HomeIcon className={`w-6 h-6`} />}
            route={`/app/guild/${guildID}`}
          /> */}
            <GuildSidebarModule
              name="Server Rank Cards"
              icon={<RectangleStackIcon className={`w-6 h-6`} />}
              route={`/app/guild/${guildID}/settings/rankcards`}
              // disabled={"Coming soon!"}
            />
            <GuildSidebarModule
              name="Server Crates"
              icon={<ArchiveBoxIcon className={`w-6 h-6`} />}
              route={`/app/guild/${guildID}/settings/crates`}
              // disabled={"Coming soon!"}
            />
            <GuildSidebarModule
              name="Levelup Rewards"
              icon={<GiftIcon className={`w-6 h-6`} />}
              route={`/app/guild/${guildID}/settings/leveluprewards`}
              disabled={"Coming soon!"}
            />
            <GuildSidebarModule
              name="Permissions"
              icon={<ShieldCheckIcon className={`w-6 h-6`} />}
              route={`/app/guild/${guildID}/permissions`}
              disabled={"Coming soon!"}
            />
          </div>
        </div>

        <div className={`flex flex-grow`} />
        <GuildSidebarUser user={user} guild={guild} guildData={guildData} />
      </div>
    </div>
  );
};
