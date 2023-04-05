import {
  ChevronDownIcon,
  ChevronUpIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ForwardIcon,
  PauseIcon,
  PhoneXMarkIcon,
  PlayIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import { NotificationsClass } from "../../utils/classes/NotificationsClass";
import { fetcher } from "../../utils/discordFetcher";
import { useDiscordUser } from "../../utils/hooks/useDiscordUser";
import { msToFormat } from "../../utils/parseTime";
import { getGuildShardURL } from "../../utils/ShardLib";
import { MusicTrack } from "../../utils/types";
import { MusicThumbnailRenderer } from "./MusicThumbnailRenderer";

export const GuildMusicNowPlaying = (props: {
  musicData: {
    track?: MusicTrack;
    status?: "playing" | "paused" | "stopped";
    position?: number;
    queue?: MusicTrack[];
    error?: string;
  };
  position: number;
  guildID: string;
}) => {
  const { musicData, position, guildID } = props;
  const [showNP, setShowNP] = useState(false);
  const {user} = useDiscordUser();
  if (!musicData.track) return null;
  return (
    <>
      <div
        className={`lg:flex hidden w-full h-[4.5rem] absolute bottom-6 bg-gray-750/60 hover:bg-gray-600/80 transition-all border border-gray-100/20 backdrop-blur-xl z-30 scale-90 rounded-2xl flex-row gap-4 p-2 px-4 items-center
        ${showNP ? `translate-y-0` : `translate-y-[calc(100%+3rem)]`}
         transition-all duration-500 ease-in-out cursor-pointer`}
        onClick={() => setShowNP(!showNP)}
      >
        <div
          className={`h-full aspect-square relative overflow-hidden z-10 rounded-2xl shrink-0`}
        >
          <MusicThumbnailRenderer
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-0 bg-cover min-w-[185%] h-auto pointer-events-none`}
            src={musicData.track?.thumbnail!}
          />
        </div>
        <div className={`flex flex-col justify-evenly grow relative`}>
          <span
            className={`text-base font-bold leading-snug font-poppins text-ellipsis whitespace-nowrap`}
          >
            {musicData.track?.title.length > 30
              ? musicData.track?.title.slice(0, 30) + "..."
              : musicData.track?.title}
          </span>
          <span className={`text-sm font-medium leading-snug font-wsans`}>
            {(musicData.track?.author ?? "").length > 30
              ? (musicData.track?.author ?? "unknown").slice(0, 30) + "..."
              : musicData.track?.author}
          </span>
          <span className={`text-xs font-medium leading-snug font-wsans`}>
            {msToFormat(position)} / {msToFormat(musicData.track?.duration!)}
          </span>
        </div>
        <div
          className={`w-8 h-8 relative overflow-hidden z-10 rounded-2xl shrink-0 border border-gray-100/20 p-1.5`}
        >
          <ChevronUpIcon className={`w-full h-full`} />
        </div>
      </div>
      <div
        className={`col-span-4 ${
          user ? `p-8 2xl:p-2` : `p-8 2xl:p-6 2xl:px-4`
        } h-full lg:absolute z-40 lg:w-full lg:pt-6 ${
          showNP ? `lg:translate-y-full` : ``
        } lg:transition-all lg:duration-300 lg:ease-in-out lg:px-4 lg:pb-6 lg:cursor-pointer`}
        onClick={() => setShowNP(!showNP)}
      >
        <div className={`absolute top-6 left-0 w-full z-40 h-8 px-2`}>
          <div
            className={`relative w-full h-full p-1 z-40 rounded-3xl flex flex-row gap-2`}
          >
            <div
              className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 text-gray-400 bg-black hover:bg-white hover:text-gray-900 rounded-full`}
              onClick={() => setShowNP(!showNP)}
            >
              <ChevronDownIcon className={`w-6 h-6`} />
            </div>
          </div>
        </div>
        <div
          className={`w-full h-full relative rounded-3xl overflow-hidden bg-gray-800 shadow-xl ${
            user ? `p-8 2xl:p-4` : `p-8 2xl:p-6`
          } flex flex-col gap-4 lg:p-12 lg:pt-20`}
        >
          <div className="absolute w-full h-full top-0 left-0 z-0">
            <div
              className={`relative h-full w-full overflow-hidden opacity-50`}
            >
              <div
                className={`w-full h-full absolute z-10 bg-gradient-to-t from-gray-800 via-gray-800/90 to-gray-800/40`}
              />
              <MusicThumbnailRenderer
                className={`absolute left-1/2 -translate-x-1/2 -translate-y-[12.5%] -z-0 bg-cover min-w-[300%] pointer-events-none blur-xl`}
                src={musicData.track?.thumbnail!}
              />
            </div>
          </div>
          <div className={`w-full flex flex-row justify-center`}>
            <div
              className={`w-full aspect-square max-w-[45ch] relative overflow-hidden z-10 rounded-2xl shrink-0`}
            >
              <MusicThumbnailRenderer
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-0 bg-cover min-w-[185%] h-auto pointer-events-none`}
                src={musicData.track?.thumbnail!}
              />
            </div>
          </div>
          <div className={`flex flex-col gap-4 z-10`}>
            <div className={`text-2xl font-bold font-poppins 2xl:text-xl`}>
              {musicData.track?.title}
            </div>
            <div className={`text-gray-400 font-wsans 2xl:text-lg`}>
              {musicData.track?.author}
            </div>
          </div>
          <div className={`flex flex-col gap-4 z-10`}>
            <div className={`flex-grow`}>
              <div className={`w-full h-1 bg-gray-900 rounded-full`}>
                <div
                  className={`h-full bg-gray-50 rounded-full`}
                  style={{
                    width: `${(position! / musicData.track!.duration!) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div className={`flex flex-row justify-between font-wsans`}>
              <div className={`text-gray-400`}>{msToFormat(position)}</div>
              <div className={`text-gray-400`}>
                {msToFormat(musicData.track!.duration!)}
              </div>
            </div>
          </div>
          <div className={`flex flex-row gap-4 z-10`}>
            <div
              className={`flex-grow flex flex-row gap-4 items-center justify-center ${
                !user && `opacity-20 cursor-not-allowed pointer-events-none`
              }`}
            >
              <div
                className={`p-4 bg-gray-900 hover:bg-gray-750 rounded-full flex flex-row justify-center items-center cursor-pointer transition-all`}
                onClick={(e) => {
                  e.stopPropagation();
                  fetcher(
                    `${getGuildShardURL(
                      guildID
                    )}/guilds/${guildID}/music/status`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        disconnect: true,
                      }),
                    }
                  ).then((res) => {
                    if (res.ok) {
                      console.log("success");
                      NotificationsClass.getInstance().addNotif({
                        title: `Disconnected from voice channel`,
                        message: `Successfully disconnected from voice channel`,
                        type: "success",
                      });
                    } else {
                      console.log("error");
                    }
                  });
                }}
              >
                <PhoneXMarkIcon className={`w-6 h-6 text-gray-300`} />
              </div>
              <div
                className={`p-4 bg-gray-900 hover:bg-gray-750 rounded-full flex flex-row justify-center items-center cursor-pointer transition-all`}
                onClick={(e) => {
                  e.stopPropagation();
                  fetcher(
                    `${getGuildShardURL(
                      guildID
                    )}/guilds/${guildID}/music/status`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        paused: musicData.status !== "paused",
                      }),
                    }
                  ).then((res) => {
                    if (res.ok) {
                      console.log("success");
                      NotificationsClass.getInstance().addNotif({
                        title: `${
                          musicData.status === "playing" ? "Paused" : "Playing"
                        } Music`,
                        message: `Music is now ${
                          musicData.status === "playing" ? "paused" : "playing"
                        }`,
                        type: "success",
                        duration: 2000,
                      });
                    }
                  });
                }}
              >
                {musicData.status === "playing" ? (
                  <PauseIcon className={`w-6 h-6 text-gray-300`} />
                ) : (
                  <PlayIcon className={`w-6 h-6 text-gray-300`} />
                )}
              </div>
              <div
                className={`p-4 bg-gray-900 hover:bg-gray-750 rounded-full flex flex-row justify-center items-center cursor-pointer transition-all`}
                onClick={(e) => {
                  e.stopPropagation();
                  fetcher(
                    `${getGuildShardURL(
                      guildID
                    )}/guilds/${guildID}/music/status`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        skip: true,
                      }),
                    }
                  ).then((res) => {
                    if (res.ok) {
                      console.log("success");
                      NotificationsClass.getInstance().addNotif({
                        title: `Skipped Music`,
                        message: `Skipped the current song`,
                        type: "success",
                        duration: 2000,
                      });
                    }
                  });
                }}
              >
                <ForwardIcon className={`w-6 h-6 text-gray-300`} />
              </div>
            </div>
          </div>
          {/* <div className={`grow`} /> */}
          <div className={`flex flex-col gap-2 z-10`}>
            <span className={`text-gray-400 text-sm font-poppins font-medium`}>
              Requested By
            </span>
            <div className={`flex flex-row gap-4 items-center`}>
              <img
                src={musicData.track?.requestedBy?.avatar!}
                className={`w-10 h-10 rounded-full`}
              />
              <div className={`text-base font-medium font-wsans`}>
                {musicData.track?.requestedBy?.username}#
                {musicData.track?.requestedBy?.discriminator}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
