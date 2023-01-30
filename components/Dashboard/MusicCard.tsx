import { APIGuild } from "discord-api-types/v10";
import { BotGuildData } from "../../../../../utils/types";

export const MusicCard = (props: {
  guildID: string;
  guildData?: Partial<BotGuildData> | null;
  guild?: Partial<APIGuild> | null;
}) => {
  const { guildID, guildData, guild } = props;
  const imgURL = `https://i.ytimg.com/vi/94Q10yjOgNs/hqdefault.jpg`;
  return (
    <div
      className={`flex flex-row p-8 pr-16 rounded-2xl w-full h-48 border border-gray-100/10 relative overflow-hidden items-center group`}
    >
      <div
        className={`absolute top-0 left-0 w-full h-full group-hover:bg-white/5 z-20 transition-colors cursor-pointer`}
      />
      <div className={`flex flex-row gap-4 w-full h-fit z-10`}>
        <div
          className={`w-32 h-32 relative overflow-hidden bg-red-50 z-10 rounded-xl`}
        >
          <img
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-0 bg-cover min-w-[185%] h-auto pointer-events-none`}
            src={imgURL}
          />
        </div>
        <div className={`flex flex-col justify-evenly flex-grow h-32 z-10`}>
          <span className={`text-xl font-bold font-poppins`}>
            House of Memories - Slowed
          </span>
          <span className={`text-base`}>Panic! At The Disco</span>
          <div className={`flex flex-col gap-0.5 w-full`}>
            <div
              className={`relative flex flex-row items-start justify-start rounded-full overflow-hidden bg-gray-100/10 h-2`}
            >
              <div
                className={`absolute top-0 left-0 h-full bg-gray-100 rounded-full`}
                style={{
                  width: `70%`,
                }}
              ></div>
            </div>
            <div className={`flex flex-row justify-between items-center`}>
              <span className={`text-sm`}>3:45</span>
              <span className={`text-sm`}>5:45</span>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-0 bg-cover w-[300%] h-[300%] blur-lg brightness-50`}
        style={{
          backgroundImage: `url(${imgURL})`,
        }}
      />
    </div>
  );
};
