import { APIGuild } from "discord-api-types/v10";
import { BotGuildData } from "../../../utils/types";
import { CommandsModule } from "./CommandsModule";
import { LevellingModule } from "./LevellingModule";
import { MusicModule } from "./MusicModule";

export const TopModuleBar = (props: {
  guildID: string;
  guildData?: Partial<BotGuildData> | null;
  guild?: Partial<APIGuild> | null;
}) => {
  const { guildID, guildData, guild } = props;
  return (
    <div className={`grid grid-cols-4 gap-4`}>
      <MusicModule guildID={guildID} guildData={guildData} guild={guild} />
      <LevellingModule guildID={guildID} guildData={guildData} guild={guild} />
      <CommandsModule guildID={guildID} guildData={guildData} guild={guild} />
    </div>
  );
};
