// audioChannels: joinableVoiceChannels.map((c) => ({
//     id: c.id,
//     name: c.name,
//     userLimit: c.userLimit,
//     voiceMembers: c.voiceMembers.map((m) => ({
//       id: m.id,
//       username: m.username,
//       discriminator: m.discriminator,
//       avatarURL: m.avatarURL,
//     })),
//   })),
//   textChannels: sendableTextChannels.map((c) => ({
//     id: c.id,
//     name: c.name,
//   })),

import { useState } from "react";
import { fetcher } from "../../utils/discordFetcher";
import { getGuildShardURL } from "../../utils/ShardLib";

// }
export type JoinableChannelsPayload = {
  audioChannels: {
    id: string;
    name: string;
    userLimit: number;
    voiceMembers: {
      id: string;
      username: string;
      discriminator: string;
      avatarURL: string;
    }[];
  }[];
  textChannels: {
    id: string;
    name: string;
  }[];
};

export const MusicChannelSelect = (props: {
  guildID: string;
  joinableChannels: JoinableChannelsPayload;
}) => {
  const { guildID, joinableChannels } = props;
  const [selectedTextChannel, setSelectedTextChannel] = useState("");
  const [selectedAudioChannel, setSelectedAudioChannel] = useState("");
  return (
    <div className={`flex flex-col gap-4 p-6`}>
      <div className={`text-2xl font-bold`}>Select Channels</div>
      <span className={`text-gray-400`}>
        Select the channels you want to use for the music module.
      </span>
      <div className={`flex flex-col gap-4`}>
        <div className={`text-xl font-bold`}>Text Channels</div>
        <div className={`flex flex-col gap-2`}>
          {joinableChannels.textChannels.map((c) => (
            <div
              key={c.id}
              className={`flex flex-row items-center gap-2 p-2 rounded-md cursor-pointer ${
                selectedTextChannel === c.id ? "bg-gray-800" : "bg-gray-700"
              }`}
              onClick={() => setSelectedTextChannel(c.id)}
            >
              <div className={`text-gray-300`}>#</div>
              <div className={`text-gray-100`}>{c.name}</div>
            </div>
          ))}
        </div>
      </div>
      <div className={`flex flex-col gap-4`}>
        <div className={`text-xl font-bold`}>Voice Channel</div>
        <div className={`flex flex-col gap-2`}>
          {joinableChannels.audioChannels.map((c) => (
            <div
              key={c.id}
              className={`flex flex-row items-center gap-2 p-2 rounded-md cursor-pointer ${
                selectedAudioChannel === c.id ? "bg-gray-800" : "bg-gray-700"
              }`}
              onClick={() => setSelectedAudioChannel(c.id)}
            >
              <div className={`text-gray-300`}>#</div>
              <div className={`text-gray-100`}>{c.name}</div>
            </div>
          ))}
        </div>
      </div>
      <button
        className={`bg-gray-800 p-2 rounded-md`}
        onClick={() => {
          const shardURL = getGuildShardURL(guildID);
          console.log(selectedAudioChannel, selectedTextChannel);
          fetcher(`${shardURL}/guilds/${guildID}/music/channels`, {
            method: "POST",
            body: JSON.stringify({
              textChannel: selectedTextChannel,
              voiceChannel: selectedAudioChannel,
            }),
          });
        }}
      >
        Join Channels
      </button>
    </div>
  );
};
