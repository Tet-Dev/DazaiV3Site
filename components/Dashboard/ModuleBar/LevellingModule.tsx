import { TrophyIcon } from "@heroicons/react/24/outline";
import { APIGuild } from "discord-api-types/v10";
import { BotGuildData } from "../../../utils/types";
import { MusicModule } from "./MusicModule";
import { TemplateModule } from "./TemplateModule";

export const LevellingModule = (props: {
  guildID: string;
  guildData?: Partial<BotGuildData> | null;
  guild?: Partial<APIGuild> | null;
}) => {
  const { guildID, guildData, guild } = props;
  return (
    <TemplateModule>
      <div className={`flex flex-col justify-between h-full py-1`}>
        <TrophyIcon className={`w-12 h-12 text-indigo-200`} />
        <span className={`text-xl font-bold font-poppins text-indigo-400`}>
          Lv. 24
        </span>
        <span className={`text-base text-indigo-100`}>290k XP gained this week</span>
      </div>
    </TemplateModule>
  );
};
