import { MusicalNoteIcon } from "@heroicons/react/24/outline";
import { APIGuild } from "discord-api-types/v10";
import { BotGuildData } from "../../../utils/types";
import { TemplateModule } from "./TemplateModule";

export const MusicModule = (props: {
  guildID: string;
  guildData?: Partial<BotGuildData> | null;
  guild?: Partial<APIGuild> | null;
}) => {
  const { guildID, guildData, guild } = props;
  const imgURL = `https://i.ytimg.com/vi/eFqUUlQSsbo/hqdefault.jpg`;
  return (
    <TemplateModule className={`!col-span-2`}>
      <div className={`flex flex-col gap-6`}>
        <div className={`flex flex-row gap-4`}>
          <div
            className={`w-24 h-24 relative overflow-hidden bg-red-50 z-10 rounded-xl`}
          >
            <img
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-0 bg-cover min-w-[185%] h-auto pointer-events-none`}
              src={imgURL}
            />
          </div>
          <div className={`flex flex-col gap-2 flex-grow h-24 justify-center`}>
            <span className={`text-xl font-bold font-poppins`}>
              House of Memories - Slowed
            </span>
            <span className={`text-base`}>Panic! At The Disco</span>
          </div>
        </div>
        <div className={`flex flex-col gap-0.5 w-full`}>
          <div
            className={`relative flex flex-row items-start justify-start rounded-full overflow-hidden bg-gray-100/10 h-1`}
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
        {/* <MusicalNoteIcon className={`w-24 h-24`} /> */}
      </div>
    </TemplateModule>
  );
};
