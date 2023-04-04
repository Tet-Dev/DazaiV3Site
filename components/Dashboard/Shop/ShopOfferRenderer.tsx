import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { NotificationsClass } from "../../../utils/classes/NotificationsClass";
import { fetcher } from "../../../utils/discordFetcher";
import { getGuildShardURL } from "../../../utils/ShardLib";
import { GuildInventory, ShopItem } from "../../../utils/types";
import { ShopOfferItemRenderer } from "./ShopOfferItemRenderer";

export const ShopOfferRenderer = (props: {
  item: ShopItem;
  inventory: GuildInventory;
  buyingOffer: boolean;
  setBuyingOffer: (v: boolean) => void;
}) => {
  const { item: shopItem, inventory, buyingOffer, setBuyingOffer } = props;
  const router = useRouter();
  const buyBundle = async (v: ShopItem) => {
    if ((inventory.money ?? 0) < shopItem.price) return;
    const res = await fetcher(
      `${await getGuildShardURL(shopItem.guildID as string)}/guilds/${
        shopItem.guildID
      }/shop/items/${shopItem._id as string}/buy`,
      {
        method: "POST",
      }
    ).then((x) => x.json());
    router.replace(router.asPath);
  };
  return (
    <div
      className={`bg-gray-800 p-6 rounded-3xl flex w-[400px] max-w-full flex-col gap-2`}
    >
      <h1 className={`font-poppins font-bold text-white text-xl`}>
        {shopItem.name}
      </h1>
      <div className={`font-wsans text-gray-400`}>{shopItem.description}</div>
      <div className={`font-wsans text-gray-500`}>Contains:</div>
      <div className={`p-4 pb-0 bg-gray-850 rounded-2xl grow overflow-auto`}>
        <div
          className={`flex flex-row gap-2 pb-4 flex-wrap justify-start items-start`}
        >
          {shopItem.items.map((item) => (
            <ShopOfferItemRenderer
              item={item}
              key={`shop-offer-${shopItem._id}-item-${item.itemID}`}
              guildID={shopItem.guildID}
            />
          ))}
        </div>
      </div>
      <div className={`justify-end flex flex-row w-full pt-4 items-end`}>
        <button
          disabled={(inventory.money ?? 0) < shopItem.price || buyingOffer}
          onClick={async () => {
            setBuyingOffer(true);
            await buyBundle(shopItem);
            setBuyingOffer(false);
            NotificationsClass.getInstance().addNotif({
              title: "Shop",
              message: `You have successfully bought "${shopItem.name}" item for ${shopItem.price} 円.`,
              type: "success",
              duration: 2500,
            });
          }}
          className={`rounded-full px-4 py-2 border border-gray-50/10 w-fit bg-gray-50/5 flex flex-row gap-2 items-center hover:bg-indigo-500 hover:border-transparent transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          <ShoppingCartIcon className={`h-6 w-6`} />
          Buy ({shopItem.price} 円)
        </button>
      </div>
    </div>
  );
};
