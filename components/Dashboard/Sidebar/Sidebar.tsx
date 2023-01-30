import { GuildIconRenderer } from "../../GuildIconRenderer";
import { useDiscordGuild } from "../../../utils/hooks/useDiscordGuildData";
import { useGuildData } from "../../../utils/hooks/useGuildData";
import { GuildSidebarModule } from "./SidebarModule";
import {
  HomeIcon,
  MusicalNoteIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { useDiscordUser } from "../../../utils/hooks/useDiscordUser";
import { APIRole } from "discord-api-types/v10";
import { useMemo } from "react";
import { GuildSidebarUser } from "./SidebarUser";

export const GuildSidebar = (props: { guildID: string | undefined }) => {
  const { guildID } = props;
  const guild = useDiscordGuild(guildID);
  const guildData = useGuildData(guildID);
  const user = useDiscordUser();
  if (!user) return null;
  return (
    <div className={`h-screen p-6 xl:p-2`}>
      <div
        className={`flex flex-col gap-12 p-8 bg-gray-800 rounded-3xl shadow-2xl h-full`}
      >
        <div className={`flex flex-row gap-4`}>
          <GuildIconRenderer
            guild={guild}
            className={`rounded-3xl w-16 h-16 flex flex-row items-center justify-center bg-gray-850 xl:hidden`}
          />
          <div className={`flex flex-col gap-2`}>
            <div className={`text-2xl font-bold text-gray-100 font-poppins`}>
              {guild?.name}
            </div>
            <div className={`text-gray-700`}>#{guild?.id}</div>
          </div>
        </div>
        <div className={`flex flex-col gap-8 flex-grow`}>
          {/* <GuildSidebarModule
            name="Dashboard"
            icon={<HomeIcon className={`w-6 h-6`} />}
            route={`/app/guild/${guildID}`}
          /> */}
          <GuildSidebarModule
            name="Music"
            icon={<MusicalNoteIcon className={`w-6 h-6`} />}
            route={`/app/guild/${guildID}/music`}
          />
          <GuildSidebarModule
            name="Levelling & EXP"
            icon={<SparklesIcon className={`w-6 h-6`} />}
            route={`/app/guild/${guildID}/xp`}
            disabled={"Coming soon!"}
          />
          <GuildSidebarModule
            name="Permissions"
            icon={<ShieldCheckIcon className={`w-6 h-6`} />}
            route={`/app/guild/${guildID}/permissions`}
            disabled={"Coming soon!"}
          />
        </div>
        <GuildSidebarUser user={user} guild={guild} guildData={guildData} />
      </div>
    </div>
  );
};
