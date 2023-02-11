import { APIGuild } from "discord-api-types/v10";
import Link from "next/link";
import { GuildIconRenderer } from "../GuildIconRenderer";
import { clientID } from "../../utils/constants";
import { BotGuildData } from "../../utils/types";

export const DashboardCard = (props: {
  guild?: BotGuildData | Partial<APIGuild> | null;
  skeleton?: boolean;
  botSetup?: boolean;
}) => {
  const { guild, botSetup, skeleton } = props;
  return (
    <div
      className={`w-[512px] max-w-[100%] h-72 bg-gradient-to-br from-neutral-900 to-gray-900 rounded-2xl p-4 flex flex-row gap-4 items-center relative overflow-hidden`}
    >
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] blur-xl brightness-75`}
      >
        {skeleton ? (
          <img
            src={"/images/landing/landingbg.png"}
            className={`w-full h-full object-center object-cover contrast-50 grayscale animate-pulse`}
          />
        ) : (
          <img
            src={
              guild?.icon
                ? guild?.icon?.match(/http(s)?:\/\//)
                  ? guild.icon
                  : `https://cdn.discordapp.com/icons/${guild?.id}/${guild?.icon}.png?size=512`
                : "/images/landing/landingbg.png"
            }
            className={`w-full h-full object-center object-cover`}
          />
        )}
      </div>
      <div
        className={`absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-900/20 to-[rgb(10,10,10)]`}
      ></div>

      <div
        className={`absolute bottom-4 left-4 w-[calc(100%-2rem)] h-20 flex flex-row gap-6`}
      >
        <GuildIconRenderer
          guild={guild}
          skeleton={skeleton}
          className={`rounded-3xl w-20 h-20 flex flex-row items-center justify-center bg-gray-850 shrink-0`}
        />
        <div className={`flex flex-col gap-1 justify-center w-full`}>
          <span
            className={`text-xl font-poppins font-bold ${
              skeleton &&
              `w-full !text-transparent bg-gray-600 animate-pulse rounded-2xl`
            }`}
          >
            {guild?.name} {skeleton && `.`}
          </span>
          <span
            className={`text-gray-50/80 font-wsans font-medium text-lg ${
              skeleton &&
              `w-1/2 !text-transparent bg-gray-700 animate-pulse rounded-2xl`
            }`}
          >
            Server Admin {skeleton && `.`}
          </span>
        </div>
      </div>
      <div className={`absolute top-4 right-4`}>
        {guild &&
          (botSetup ? (
            <Link href={`/app/guild/${guild?.id}`}>
              <button
                className={`py-4 px-6 h-fit w-36 rounded-2xl font-bold uppercase text-sm text-white bg-purple-700 hover:bg-purple-500 transition-all`}
              >
                Dashboard
              </button>
            </Link>
          ) : (
            <button
              className={`py-4 px-6 h-fit w-36 rounded-2xl font-bold uppercase text-sm text-white bg-neutral-900 hover:bg-purple-900 transition-all shadow-lg`}
              onClick={() => {
                window.open(
                  `https://discord.com/oauth2/authorize?client_id=${clientID}&permissions=8&scope=bot%20applications.commands&guild_id=${guild?.id}`,
                  "_blank",
                  "noopener,noreferrer,width=625,height=970"
                );
              }}
            >
              Setup Dazai
            </button>
          ))}
        {skeleton && (
          <button
            className={`py-4 px-6 h-fit w-36 rounded-2xl font-bold uppercase text-sm text-transparent bg-gray-600 animate-pulse transition-all shadow-lg`}
          >
            .
          </button>
        )}
      </div>
    </div>
  );
};
