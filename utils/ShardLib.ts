export const calcShardID = (guildID: string, shardCount: number) =>
  (~~guildID >> 22) % shardCount;

export const ShardMap = {
  0: "http://localhost:888",
};
export const getGuildShardURL = (guildID: string) =>
  ShardMap[
    calcShardID(guildID, Object.keys(ShardMap).length) as keyof typeof ShardMap
  ];
