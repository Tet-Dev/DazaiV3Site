import { useRouter } from "next/router";
import { fetcher } from "../../../utils/discordFetcher";
import { getGuildShardURL } from "../../../utils/ShardLib";
import { BundleItem, GuildInventory, ShopItem } from "../../../utils/types";
import {
  LevelUpRewardActionRole,
  LevelUpRewardActionCrate,
  LevelUpRewardActionCard,
} from "../Settings/LevelupRewards/LevelUpRewardActionRenderers";

export const ShopOfferItemRenderer = (props: {
  item: BundleItem;
  guildID: string;
}) => {
  const { item, guildID } = props;
  return (
    <div className={` pointer-events-none w-fit h-fit`}>
      {item.type === "role" ? (
        <LevelUpRewardActionRole
          action={{
            action: "add",
            roleID: item.itemID,
            type: "role",
          }}
          guildID={guildID}
        />
      ) : item.type === "crate" ? (
        <LevelUpRewardActionCrate
          action={{
            action: "add",
            crateID: item.itemID,
            type: "crate",
            count: item.count ?? 1,
          }}
          guildID={guildID}
        />
      ) : item.type === "card" ? (
        <LevelUpRewardActionCard
          action={{
            action: "add",
            cardID: item.itemID,
            type: "card",
            count: item.count ?? 1,
          }}
          guildID={guildID}
        />
      ) : null}
    </div>
  );
};
