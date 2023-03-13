export const calcShardID = (guildID: string, shardCount: number) =>
  (~~guildID >> 22) % shardCount;

export const ShardMap = {
  0:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:888'
      : `https://v2api.dazai.app:2053`,
};
export const getGuildShardURL = (guildID: string) =>
  ShardMap[
    calcShardID(guildID, Object.keys(ShardMap).length) as keyof typeof ShardMap
  ];
