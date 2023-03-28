import { Switch } from "@headlessui/react";
import { PencilIcon, PlusIcon } from "@heroicons/react/24/outline";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Card,
  InventoryCardRenderer,
} from "../../../../../components/Dashboard/Inventory/InventoryCardRenderer";
import { InventoryCardRendererNotOwned } from "../../../../../components/Dashboard/Inventory/InventoryCardRendererNotOwned";
import { InventoryCrateRenderer } from "../../../../../components/Dashboard/Inventory/InventoryCrateRenderer";
import { ShopOfferRenderer } from "../../../../../components/Dashboard/Shop/ShopOfferRenderer";
import { fetcher } from "../../../../../utils/discordFetcher";
import { useDiscordUser } from "../../../../../utils/hooks/useDiscordUser";
import { getGuildShardURL } from "../../../../../utils/ShardLib";
import {
  CardRarity,
  CardType,
  Crate,
  GuildInventory,
  GuildShop,
  rarityValue,
  ShopItem,
} from "../../../../../utils/types";

export const GuildInventoryPage = (props: {
  guild: string;
  inventory: GuildInventory;
  shop: GuildShop;
  forceLogin: boolean;
}) => {
  const { guild, inventory, shop } = props;
  const router = useRouter();
  const user = useDiscordUser();
  const [buyingOffer, setBuyingOffer] = useState(false);
  console.log(shop);
  useEffect(() => {
    if (props.forceLogin) {
      router.push("/app/login");
    }
  }, []);

  return (
    <div
      className={`relative ${
        user ? `2xl:ml-2 gap-8 2xl:gap-0 ml-[5%]` : `ml-[5%] gap-8`
      } relative flex flex-col items-center`}
    >
      <div
        className={`col-span-8 relative h-screen flex flex-col gap-6 pt-8 overflow-auto transition-all max-w-[150ch] w-fit pb-8`}
      >
        <div className={`flex flex-col gap-4`}>
          <div className={`flex flex-row gap-16 items-center`}>
            <h1 className={`text-3xl font-bold font-poppins`}>Shop</h1>
            <div className={`p-2 bg-gray-900 rounded-2xl px-4`}>
              <span className={`font-bold font-wsans`}>
                {inventory.money ?? 0} 円
              </span>
            </div>
          </div>
        </div>
        <div className={`w-full flex flex-wrap gap-8`}>
          {shop.shopItems.map((item) => {
            return (
              <ShopOfferRenderer
                inventory={inventory}
                item={item}
                key={`shop-item-${item._id}`}
                buyingOffer={buyingOffer}
                setBuyingOffer={setBuyingOffer}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const guildID = context.query.guild as string;
  //   read authy_cookie from context.req.cookies
  const authy_cookie = context.req.cookies.authy_cookie;
  //   if authy_cookie is undefined, redirect to login
  if (!authy_cookie) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const guildInventory = await fetch(
    `${getGuildShardURL(guildID)}/guilds/${guildID}/inventory`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authy_cookie}`,
      },
    }
  );
  if (guildInventory.status === 401) {
    return {
      // redirect: {
      //   destination: "/",
      //   permanent: false,
      // },
      props: {
        forceLogin: true,
      },
    };
  }
  const guildInventoryJSON = await guildInventory.json();

  const inventory = guildInventoryJSON as GuildInventory;

  const shop = await fetch(
    `${getGuildShardURL(guildID)}/guilds/${guildID}/shop`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authy_cookie}`,
      },
    }
  );
  const shopJSON = (await shop.json()) as GuildShop;
  shopJSON.shopItems.sort((a, b) => a.price - b.price);

  return {
    props: {
      guild: guildID,
      inventory,
      shop: shopJSON,
    },
  };
};
export default GuildInventoryPage;
