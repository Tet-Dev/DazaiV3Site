import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { fetcher } from "../../utils/discordFetcher";
import { useDiscordUser } from "../../utils/hooks/useDiscordUser";
import { msToFormat } from "../../utils/parseTime";
import { getGuildShardURL } from "../../utils/ShardLib";
import { MusicTrack } from "../../utils/types";
import { Modal } from "../Modal";
import { MusicThumbnailRenderer } from "./MusicThumbnailRenderer";
type SearchResults =
  | {
      error: string;
      message: string | undefined;
      tracks?: undefined;
      type?: undefined;
    }
  | {
      error: string | undefined;
      tracks: MusicTrack[];
      type: "playlist" | "track" | "search";
      message?: undefined;
    };
export const MusicModal = (props: {
  guildID: string;
  open: boolean;
  onClose: () => void;
}) => {
  const { guildID, open, onClose } = props;
  const user = useDiscordUser();
  const [searchResult, setSearchResult] = useState(
    undefined as SearchResults | undefined
  );
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(-1);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      globalThis?.document?.getElementById("music-search-input")?.focus();
    }, 10);
  }, [open]);
  if (!user) return null;
  return (
    <Modal
      visible={props.open}
      onClose={() => {
        onClose();
        setSearchResult(undefined);
        setQuery("");
        setSelected(-1);
      }}
      hideBG
    >
      <div
        className={`max-w-prose w-[90vw] flex flex-col gap-4 p-4 bg-gray-850 rounded-3xl`}
      >
        <div className={`p-4`}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSelected(-1);
              globalThis?.document?.getElementById("music-search")?.click();
            }}
            className={`flex flex-row gap-4 items-center`}
          >
            <input
              type="text"
              placeholder="Search for a song or type a URL (Youtube, Spotify)"
              className={`bg-gray-800 text-gray-100 rounded-2xl px-4 py-4 w-full focus:!outline-none border border-gray-100/10 focus:border-transparent focus:ring-4 ring-0 transition-all ring-indigo-700`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onPaste={(e) => {
                e.preventDefault();
                let text = e.clipboardData.getData("text");
                console.log(
                  e.clipboardData.getData("text"),
                  text.match(
                    /https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|open\.spotify\.com\/track\/|open\.spotify\.com\/playlist\/|open\.spotify\.com\/album\/)([a-zA-Z0-9_-]+)/
                  )
                );
                setQuery(text);
                // if text is a valid youtube or spotify url, set it as the query
                if (
                  text.match(
                    /https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtube\.com\/playlist\?list=|youtu\.be\/|open\.spotify\.com\/track\/|open\.spotify\.com\/playlist\/|open\.spotify\.com\/album\/)([a-zA-Z0-9_-]+)/
                  )
                ) {
                  setSelected(-1);
                  console;
                  setTimeout(() => {
                    globalThis?.document
                      ?.getElementById("music-search")
                      ?.click();
                  }, 10);
                }
              }}
              onKeyDown={(e) => {
                // close if escape is pressed
                if (e.key === "Escape") {
                  onClose();
                  setSearchResult(undefined);
                  setQuery("");
                  setSelected(-1);
                }
              }}
              id="music-search-input"
            />
            <button
              className={`bg-indigo-600 text-gray-100 rounded-full p-2 w-10 h-10 flex flex-row items-center justify-center disabled:opacity-10`}
              onClick={() => {
                setSelected(-1);
                setFetching(true);
                fetcher(
                  `${getGuildShardURL(
                    guildID
                  )}/guilds/${guildID}/music/search?song=${query}`
                )
                  .then((res) => res.json())
                  .then((data) => {
                    setSearchResult(data);
                    setFetching(false);
                  });
              }}
              id="music-search"
              disabled={fetching}
            >
              <MagnifyingGlassIcon className={`w-full h-full`} />
            </button>
          </form>
        </div>
        {!!searchResult?.error && (
          <div
            className={`p-4 bg-red-900/20 rounded-2xl flex flex-row gap-2 mx-4`}
          >
            <ExclamationTriangleIcon className={`w-6 h-6`} />
            <p>An error occured while searching: {searchResult.error}</p>
          </div>
        )}
        {searchResult?.tracks?.length && (
          <div
            className={`flex flex-col gap-4 max-h-[70vh] overflow-auto px-4 pb-1`}
          >
            {searchResult?.tracks?.map((track, i) => (
              <MusicResult
                track={track}
                key={`search-result-${track.title}-${track.url}`}
                onSelected={
                  searchResult.type === "search"
                    ? () => {
                        fetcher(
                          `${getGuildShardURL(
                            guildID
                          )}/guilds/${guildID}/music/queue`,
                          {
                            method: "POST",
                            body: JSON.stringify({
                              url: searchResult.tracks[i].url,
                            }),
                          }
                        ).then((res) => {
                          if (res.status === 200) {
                            onClose();
                            setSearchResult(undefined);
                            setQuery("");
                            setSelected(-1);
                          }
                        });
                      }
                    : undefined
                }
                selected={
                  searchResult.type === "search" ? selected === i : undefined
                }
                hideOption={searchResult.type !== "search"}
              />
            ))}
          </div>
        )}
        {searchResult &&
          ((searchResult.type === "search" &&
            selected >= 0 &&
            selected < searchResult?.tracks?.length!) ||
            searchResult.type === "playlist" ||
            searchResult?.type === "track") && (
            <div className={`flex flex-row gap-4 justify-end w-full`}>
              <button
                className={`bg-indigo-600 text-gray-100 rounded-full p-1.5 px-3 disabled:opacity-50`}
                onClick={() => {
                  let url =
                    searchResult.type === "search"
                      ? searchResult.tracks[selected].url
                      : searchResult.type === "playlist"
                      ? query
                      : searchResult.type === "track"
                      ? searchResult.tracks[0].url
                      : "";
                  setFetching(true);
                  fetcher(
                    `${getGuildShardURL(
                      guildID
                    )}/guilds/${guildID}/music/queue`,
                    {
                      method: "POST",
                      body: JSON.stringify({
                        url,
                      }),
                    }
                  ).then((res) => {
                    if (res.status === 200) {
                      onClose();
                      setSearchResult(undefined);
                      setQuery("");
                      setSelected(-1);
                    }
                    setFetching(false);
                  });
                }}
                disabled={fetching}
                id="music-add-to-queue"
              >
                {searchResult.type === "search"
                  ? "Add selected to queue"
                  : searchResult.type === "playlist"
                  ? "Add playlist to queue"
                  : "Add to queue"}
              </button>
            </div>
          )}
      </div>
    </Modal>
  );
};

const MusicResult = (props: {
  track: MusicTrack;
  selected?: boolean;
  onSelected?: () => void;
  hideOption?: boolean;
}) => {
  const { track, selected, hideOption, onSelected } = props;

  return (
    <div
      className={`relative w-full h-28 bg-gray-800 rounded-3xl p-4 overflow-hidden flex flex-row gap-4 shrink-0 items-center  ring-indigo-600 ${
        selected ? `ring-1 sticky top-px z-50` : `ring-0`
      } transition-all ${
        onSelected && `cursor-pointer hover:ring-2 group`
      } first:mt-1`}
      key={`search-result-${track.url}`}
      onClick={onSelected}
    >
      <div
        className={`cardBackground w-full h-full absolute top-0 left-0 overflow-hidden`}
      >
        <div
          className={`w-full h-full relative z-0 opacity-20 group-hover:opacity-50`}
        >
          <div
            className={`w-full h-full absolute z-10 bg-gradient-to-r from-gray-800 to-gray-800/10`}
          ></div>
          <MusicThumbnailRenderer
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-0 bg-cover min-w-[185%] h-auto pointer-events-none blur-2xl`}
            src={track.thumbnail!}
          />
        </div>
      </div>
      {/* add a checkmark */}
      {/* {!hideOption && (
        <div
          className={`w-4 h-4 border border-gray-100/30 rounded-full shrink-0 ${
            selected && "bg-indigo-500 !border-indigo-500"
          } z-30 transition-all`}
        />
      )} */}
      <div
        className={`w-20 h-20 relative overflow-hidden z-10 rounded-2xl shrink-0`}
      >
        <MusicThumbnailRenderer
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-0 bg-cover min-w-[185%] h-auto pointer-events-none`}
          src={track.thumbnail!}
        />
      </div>
      <div className={`flex flex-col justify-evenly gap-4 grow relative`}>
        <span className={`text-base font-bold leading-snug font-poppins`}>
          {track.title}
        </span>
        <span className={`text-sm leading-loose font-poppins`}>
          {track.author}
        </span>
        <div
          className={`absolute flex flex-row gap-6 bottom-0 right-0 items-center`}
        >
          <span
            className={`text-sm font-mono bg-gray-900/50 p-1.5 w-24 text-center rounded-2xl items-center opacity-80 h-fit`}
          >
            {msToFormat(track.duration!)}
          </span>
        </div>
      </div>
    </div>
  );
};
