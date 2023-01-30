import { PlusIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { NotificationsClass } from "../../utils/classes/NotificationsClass";
import { clientID } from "../../utils/constants";
import { fetcher } from "../../utils/discordFetcher";
import { useDiscordUser } from "../../utils/hooks/useDiscordUser";
import { msToFormat } from "../../utils/parseTime";
import { getGuildShardURL } from "../../utils/ShardLib";
import { MusicTrack } from "../../utils/types";
import { MusicModal } from "./MusicModal";
import { MusicThumbnailRenderer } from "./MusicThumbnailRenderer";

export const GuildMusicQueue = (props: { queue: MusicTrack[] }) => {
  const { queue } = props;
  const user = useDiscordUser();
  const router = useRouter();
  const guildID = router.query.guild as string;
  const [location, setLocation] = useState("");
  const [openModal, setOpenModal] = useState(false);
  useEffect(() => {
    setLocation(window.location.origin);
  }, []);
  return (
    <div className={`col-span-8 relative h-full`}>
      <div
        className={` flex flex-col h-full overflow-auto pb-40 gap-2 absolute w-full`}
      >
        <div
          className={`flex flex-row gap-4 sticky top-0 z-40 bg-gray-850/80 pt-8 pb-4 items-center backdrop-blur-xl`}
        >
          <span
            className={`text-base font-bold font-poppins text-gray-100/20  `}
          >
            Queue ({queue?.length ?? 0})
          </span>
          {user && (
            <span
              className={`text-sm font-wsans bg-red-900/50 hover:bg-red-500 p-1.5 px-3 w-fit text-center rounded-2xl items-center opacity-80 h-fit cursor-pointer z-30 ${
                queue.length === 0 && `!opacity-10 pointer-events-none`
              }`}
              onClick={() => {
                fetcher(
                  `${getGuildShardURL(guildID)}/guilds/${guildID}/music/status`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      purgeQueue: true,
                    }),
                  }
                ).then((res) => {
                  if (res.ok) {
                    console.log("success");
                    NotificationsClass.getInstance().addNotif({
                      title: `Purged Queue`,
                      message: `Removed all songs from the queue`,
                      type: "success",
                      duration: 2000,
                    });
                  }
                });
              }}
            >
              Remove All Songs From Queue
            </span>
          )}
        </div>
        <div className={`flex flex-col gap-4`}>
          {queue?.map((track, i) => (
            <div
              className={`relative w-full h-32 bg-gray-800 rounded-3xl p-4 overflow-hidden flex flex-row gap-4`}
              key={`guild-queue-${track.url}-${i}`}
            >
              <div
                className={`cardBackground w-full h-full absolute top-0 left-0 overflow-hidden`}
              >
                <div className={`w-full h-full relative z-0 opacity-20`}>
                  <div
                    className={`w-full h-full absolute z-10 bg-gradient-to-r from-gray-800 to-gray-800/10`}
                  ></div>
                  <MusicThumbnailRenderer
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-0 bg-cover min-w-[185%] h-auto pointer-events-none blur-2xl`}
                    src={track.thumbnail!}
                  />
                </div>
              </div>

              <div
                className={`w-24 h-24 relative overflow-hidden z-10 rounded-2xl shrink-0`}
              >
                <MusicThumbnailRenderer
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-0 bg-cover min-w-[185%] h-auto pointer-events-none`}
                  src={track.thumbnail!}
                />
              </div>
              <div className={`flex flex-col justify-evenly grow relative`}>
                <span className={`text-lg font-bold leading-snug font-poppins`}>
                  {track.title}
                </span>
                <span className={`text-base leading-loose font-poppins`}>
                  {track.author}
                </span>
                <div
                  className={`absolute flex flex-row gap-6 bottom-0 right-0 items-center`}
                >
                  <div
                    className={`flex flex-row gap-2  bg-gray-900 pr-4 p-1 rounded-2xl items-center opacity-80`}
                  >
                    <img
                      className={`w-8 h-8 rounded-2xl`}
                      src={track.requestedBy?.avatar}
                    />
                    <span className={`text-sm font-wsans`}>
                      {track.requestedBy?.username}#
                      {track.requestedBy?.discriminator}
                    </span>
                  </div>
                  <span
                    className={`text-sm font-mono bg-gray-900/50 p-1.5 w-20 text-center rounded-2xl items-center opacity-80 h-fit`}
                  >
                    {msToFormat(track.duration!)}
                  </span>
                  {user && (
                    <span
                      className={`text-sm font-wsans bg-red-900/50 hover:bg-red-500 p-1.5 w-20 text-center rounded-2xl items-center opacity-80 h-fit cursor-pointer z-30`}
                      onClick={() => {
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
                              removeSong: track.url,
                              removeSongIndex: i,
                            }),
                          }
                        ).then((res) => {
                          if (res.ok) {
                            console.log("success");
                            NotificationsClass.getInstance().addNotif({
                              title: `Removed Song`,
                              message: `Removed ${track.title} from the queue`,
                              type: "success",
                              duration: 2000,
                            });
                          }
                        });
                      }}
                    >
                      Remove
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        className={`absolute ${
          queue?.length
            ? `bottom-6 bg-gray-750/60 border border-gray-100/20`
            : `bottom-1/2 translate-y-1/2 bg-gray-800/60 border border-gray-100/10`
        } right-0 w-full  hover:bg-gray-600/80 transition-all cursor-pointer z-30 rounded-2xl backdrop-blur-xl flex flex-row gap-4 p-4 overflow-hidden items-center`}
        onClick={() => {
          if (!user) {
            localStorage.setItem("redirect", globalThis?.location?.href);
            return router.push(
              `https://discord.com/api/oauth2/authorize?client_id=${clientID}&redirect_uri=${encodeURIComponent(
                location
              )}%2Fauth&response_type=code&scope=identify%20email%20connections%20guilds`
            );
          }
          setOpenModal(true);
        }}
      >
        <div
          className={`w-8 h-8 relative overflow-hidden z-10 rounded-2xl shrink-0 border border-gray-100/20 p-1.5`}
        >
          <PlusIcon className={`w-full h-full`} />
        </div>
        <div className={`flex flex-col justify-evenly grow relative`}>
          <span className={`text-lg font-medium leading-snug font-wsans`}>
            {!user ? `Login to add` : `Add`} a song or playlist to the queue
          </span>
        </div>
      </div>
      <MusicModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        guildID={guildID}
      />
    </div>
  );
};
