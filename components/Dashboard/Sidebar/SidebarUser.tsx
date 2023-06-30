import {
  ArrowRightOnRectangleIcon,
  ChevronRightIcon,
  LifebuoyIcon,
} from "@heroicons/react/24/outline";
import { APIGuild, APIRole, APIUser } from "discord-api-types/v10";
import localforage from "localforage";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { renderUsername } from "../../../utils/renderUsername";
import { BotGuildData } from "../../../utils/types";

export const GuildSidebarUser = (props: {
  guild?: Partial<APIGuild> | null | undefined;
  skeleton?: boolean;
  guildData?: Partial<BotGuildData> | null | undefined;
  user: APIUser | null | undefined;
  global?: boolean;
}) => {
  const { guild, skeleton, guildData, user, global } = props;
  const router = useRouter();
  const [popout, setPopout] = useState(false);
  const highestUserRole = useMemo(() => {
    if (!user || !guildData || !guildData.roles || !guildData.member) {
      console.log("returning undefined", guildData);
      return undefined;
    }
    const guildRoles = new Map<string, APIRole>();
    guildData.roles?.map((role) => guildRoles.set(role.id, role));
    const roles = guildData
      .member!.roles.map((roleID) => guildRoles.get(roleID))
      .filter((role) => role?.hoist) as APIRole[];
    roles.sort((a, b) => b.position - a.position);
    return (
      roles[0] || {
        color: 0,
        hoist: false,
        name: "No Role",
      }
    );
  }, [user, guildData]);
  return (
    <div className={`w-full relative`}>
      <div
        className={`absolute right-0 translate-x-[calc(100%+1rem)] -translate-y-1/2 md:-translate-x-1/2 md:left-1/2 md:origin-bottom md:top-0 md:-translate-y-[calc(100%+1rem)] top-1/2 w-max bg-black p-4 text-white rounded-lg ${
          popout ? `scale-100` : `scale-0`
        } origin-left duration-200 transition-all flex flex-col gap-2 z-50`}
      >
        <div
          className={`flex flex-row gap-2 p-2 text-yellow-400 hover:bg-yellow-900/60 transition-colors cursor-pointer rounded-lg`}
          onClick={() => {
            window.open(`https://support.dazai.app`, "_blank");
          }}
        >
          <LifebuoyIcon className={`w-5 h-5`} />
          <div className={`text-sm font-wsans`}>Support Server</div>
        </div>
        <div
          className={`flex flex-row gap-2 bg-red-900/40 p-2 text-red-400 hover:bg-red-900/60 transition-colors cursor-pointer rounded-lg`}
        >
          <ArrowRightOnRectangleIcon className={`w-5 h-5 `} />
          <div
            className={`text-sm font-wsans`}
            onClick={() => {
              localStorage.clear();
              localforage.clear().then(() => {
                router.push(`/`);
              });
            }}
          >
            Log out of {renderUsername(user)}
          </div>
        </div>
      </div>
      <div
        className={`flex flex-row gap-4 2xl:gap-1 2xl:p-2 items-center relative group p-3 border border-gray-100/20 rounded-xl hover:bg-gray-100/10 cursor-pointer transition-colors`}
        onClick={() => setPopout(!popout)}
      >
        <div
          // width={64}
          // height={64}
          className={`rounded-full flex-shrink-0 w-12 h-12 2xl:w-6 2xl:h-6 transition-all duration-500 bg-center bg-cover relative group ${
            !user && `pointer-events-none`
          } 
          ${skeleton && `animate-pulse bg-gray-850`}
          `}
          onClick={() => setPopout(!popout)}
          style={{
            backgroundImage: `url(${
              user?.avatar &&
              `https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}${
                user?.avatar.startsWith("a_") ? ".gif" : ".png"
              }?size=256`
            })`,
          }}
        />
        <div className={`flex flex-col gap-1 flex-grow`}>
          <div
            className={`text-lg font-bold text-gray-100 font-poppins 2xl:text-xs 2xl:font-medium ${
              skeleton && `blur-sm animate-pulse`
            }`}
          >
            {renderUsername(user)}
          </div>
          {!global && (
            <div
              className={`bg-black text-gray-300 rounded-lg px-2 py-1 text-sm 2xl:text-xs w-fit flex flex-row gap-2 items-center 2xl:hidden ${
                skeleton && `blur-sm animate-pulse`
              }`}
            >
              <div
                className={`rounded-md w-3 h-3`}
                style={{
                  backgroundColor: highestUserRole?.color
                    ? `#${highestUserRole?.color.toString(16)}`
                    : `#ffffff`,
                }}
              />

              {skeleton ? `LOADING` : highestUserRole?.name || ""}
            </div>
          )}
        </div>
        <ChevronRightIcon
          className={`w-5 h-5 text-gray-100 md:-rotate-90 transition-all`}
        />
      </div>
    </div>
  );
};
