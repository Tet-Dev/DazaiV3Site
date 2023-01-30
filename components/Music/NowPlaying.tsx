import {
  ForwardIcon,
  PauseIcon,
  PhoneXMarkIcon,
  PlayIcon,
} from "@heroicons/react/24/solid";
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
  const user = useDiscordUser();
  if (!musicData.track) return null;
  return (
    <div
      className={`col-span-4 ${
        user ? `p-8 2xl:p-2` : `p-8 2xl:p-6 2xl:px-4`
      } h-full`}
    >
      <div
        className={`w-full h-full relative rounded-3xl overflow-hidden bg-gray-800 shadow-xl ${
          user ? `p-8 2xl:p-4` : `p-8 2xl:p-6`
        } flex flex-col gap-4`}
      >
        <div className="absolute w-full h-full top-0 left-0 z-0">
          <div className={`relative h-full w-full overflow-hidden opacity-50`}>
            <div
              className={`w-full h-full absolute z-10 bg-gradient-to-t from-gray-800 via-gray-800/90 to-gray-800/40`}
            />
            <MusicThumbnailRenderer
              className={`absolute left-1/2 -translate-x-1/2 -translate-y-[12.5%] -z-0 bg-cover min-w-[300%] pointer-events-none blur-xl`}
              src={musicData.track?.thumbnail!}
            />
          </div>
        </div>
        <div
          className={`w-full aspect-square relative overflow-hidden z-10 rounded-2xl shrink-0`}
        >
          <MusicThumbnailRenderer
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-0 bg-cover min-w-[185%] h-auto pointer-events-none`}
            src={musicData.track?.thumbnail!}
          />
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
              onClick={() => {
                fetcher(
                  `${getGuildShardURL(guildID)}/guilds/${guildID}/music/status`,
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
              onClick={() => {
                fetcher(
                  `${getGuildShardURL(guildID)}/guilds/${guildID}/music/status`,
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
              onClick={() => {
                fetcher(
                  `${getGuildShardURL(guildID)}/guilds/${guildID}/music/status`,
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
  );
};
