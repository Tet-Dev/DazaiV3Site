import { APIGuild } from "discord-api-types/v10";
import { BotGuildData } from "../utils/types";

export const GuildIconRenderer = (props: {
  guild: Partial<APIGuild> | BotGuildData | null | undefined;
  skeleton?: boolean;
  className?: string;
}) => {
  const { guild, skeleton, className } = props;
  console.log(guild,`url(${
    guild?.icon?.match(/http(s)?:\/\//)
      ? guild.icon
      : `https://cdn.discordapp.com/icons/${guild?.id}/${guild?.icon}.${
          guild?.icon?.startsWith("a_") ? "gif" : "png"
        }?size=256`
  })`);
  return (
    <div
      style={{
        backgroundImage: `url(${
          guild?.icon?.match(/http(s)?:\/\//)
            ? guild.icon
            : `https://cdn.discordapp.com/icons/${guild?.id}/${guild?.icon}.${
                guild?.icon?.startsWith("a_") ? "gif" : "png"
              }?size=256`
        })`,
        backgroundSize: "cover",
      }}
      className={`${className} ${skeleton && "animate-pulse"}`}
    >
      {guild && !guild?.icon && (
        <span
          className={`text-xl font-poppins font-bold`}
        >{`${guild?.name?.charAt(0)}${Array.from(
          guild?.name?.matchAll(/\s(.)/g) ?? []
        )
          .map((x) => x[1])
          ?.join("")}`}</span>
      )}
    </div>
  );
};
