import { GetServerSideProps } from "next/types";
import { getGuildShardURL } from "../../../../../utils/ShardLib";

export const XPCardSettings = (props: {}) => {
  const cards = [];
};
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { guild } = ctx.query;
  if (!guild) {
    return {
      redirect: {
        destination: "/app",
        permanent: false,
      },
    };
  }
  // guild lookup shard
  const shardURL = getGuildShardURL(guild as string);
  const musicData = await fetch(`${shardURL}/guilds/${guild}/music/status`);
  const musicDataJSON = await musicData.json();
  if (musicData.status === 404) {
    const joinableChannelsPayload = await fetch(
      `${shardURL}/guilds/${guild}/music/channels`
    );
    const joinableChannels = await joinableChannelsPayload.json();
    return {
      props: {
        guild,
        musicData: musicDataJSON,
        joinableChannels,
      },
    };
  }
  return {
    props: {
      guild,
      musicData: musicDataJSON,
    },
  };
};
export default XPCardSettings;
