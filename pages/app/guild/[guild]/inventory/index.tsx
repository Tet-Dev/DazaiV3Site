import { PencilIcon, PlusIcon } from "@heroicons/react/24/outline";
import { GetServerSideProps } from "next";
import { useState } from "react";
import { InventoryCardRenderer } from "../../../../../components/Dashboard/Inventory/InventoryCardRenderer";
import { InventoryCardRendererNotOwned } from "../../../../../components/Dashboard/Inventory/InventoryCardRendererNotOwned";
import { InventoryCrateRenderer } from "../../../../../components/Dashboard/Inventory/InventoryCrateRenderer";
import { CreateRankCard } from "../../../../../components/Dashboard/Settings/RankCards/createRankCard";
import { ViewRankCard } from "../../../../../components/Dashboard/Settings/RankCards/ViewRankCard";
import { useDiscordUser } from "../../../../../utils/hooks/useDiscordUser";
import { getGuildShardURL } from "../../../../../utils/ShardLib";
import {
  CardRarity,
  CardType,
  Crate,
  GuildInventory,
  rarityValue,
} from "../../../../../utils/types";

export const GuildInventoryPage = (props: {
  guild: string;
  inventory: GuildInventory;
  guildCards: CardType[];
  crates: Crate[];
}) => {
  const { guild, inventory, guildCards, crates } = props;
  const [viewingCard, setViewingCard] = useState(null as CardType | null);
  const [createCard, setCreateCard] = useState(false);
  const user = useDiscordUser();
  return (
    <div
      className={`relative ${
        user ? `2xl:ml-2 gap-8 2xl:gap-0 ml-[5%]` : `ml-[5%] gap-8`
      } relative flex flex-col items-center`}
    >
      <div
        className={`col-span-8 relative h-screen flex flex-col gap-6 pt-8 overflow-auto transition-all max-w-[100ch] min-w-[95%] pb-8`}
      >
        <h1 className={`text-3xl font-bold font-poppins`}>
          Rank Card Inventory
        </h1>
        <span className={`text-gray-400 font-wsans`}>
          Your rank card inventory is where you can view all of the rank cards
          you own and use them on your server!
        </span>
        <div
          className={`flex flex-row flex-wrap justify-start w-fit max-w-full px-4`}
        >
          {inventory.cards.map((card, i) => (
            <InventoryCardRenderer
              card={card}
              selected={card.id === inventory.selectedCard}
              key={`inventory-card-render-${card.id}`}
            />
          ))}
          {!inventory.cards.length && (
            <div
              className={`flex w-screen flex-col gap-8 items-center justify-center mb-8 p-12 rounded-3xl border-gray-700`}
            >
              <span className={`text-gray-600 font-wsans`}>
                You don&apos;t have any rank cards yet!
              </span>
            </div>
          )}
        </div>
        {!!crates.filter((x) => !x.opened &&  (x.guildID === guild || x.guildID === `@global`)).length && (
          <div className={`flex flex-col gap-4`}>
            <h2 className={`text-lg font-bold font-poppins`}>
              Guild Crates (
              {crates.filter((x) => !x.opened &&  (x.guildID === guild || x.guildID === `@global`)).length})
            </h2>
            <div className={`flex flex-row flex-wrap justify-evenly px-6 gap-4`}>
              {crates
                .filter((x) => !x.opened &&  (x.guildID === guild || x.guildID === `@global`))
                .map((crate, i) => (
                  <InventoryCrateRenderer
                    crate={crate}
                    guildID={guild}
                    key={`inventory-crate-render-${crate._id}`}
                  />
                ))}
            </div>
          </div>
        )}
        <div className={`flex flex-col gap-4`}>
          <h2 className={`text-lg font-bold font-poppins`}>
            Collected Guild Cards (
            {
              new Set(
                inventory.cards.filter((x) => x.card.guild).map((x) => x.cardID)
              ).size
            }
            /{guildCards.length})
          </h2>
          <div className={`flex flex-row flex-wrap justify-start px-6 gap-4`}>
            {guildCards.map((card, i) => {
              if (inventory.cards.find((c) => c.cardID === card._id)) {
                return null;
              }
              return (
                <InventoryCardRendererNotOwned
                  card={card}
                  key={`inventory-card-render-notowned-${card._id}`}
                />
              );
            })}
          </div>
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
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const guildInventoryJSON = await guildInventory.json();

  const inventory = guildInventoryJSON as GuildInventory;

  const allCards = await fetch(
    `${getGuildShardURL(guildID)}/guilds/${guildID}/settings/cards`
  );
  const allCardsJSON = (await allCards.json()) as CardType[];
  // sort by rarity

  allCardsJSON.sort((a, b) => rarityValue[a.rarity] - rarityValue[b.rarity]);

  const crates = await fetch(`${getGuildShardURL(guildID)}/inventory/crates`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authy_cookie}`,
    },
  });
  const cratesJSON = await crates.json();

  //   cards.push({
  //     _id: "63e3f70bf538f8e190963d88",
  //     name: "Sunset Dazai",
  //     description: "Dazai with a sunset background",
  //     url: "https://assets.dazai.app/cards/_default/ani_dazai.gif",
  //     rarity: CardRarity.LEGENDARY,
  //   });
  //   cards.push({
  //     _id: "63e3f70bf538f8e190963d8f",
  //     name: "Dazai Thousand",
  //     description: "The 1000 server milestone celebration card",
  //     url: "https://assets.dazai.app/cards/_default/dazai1000.png",
  //     rarity: CardRarity.EVENT_RARE,
  //   });
  return {
    props: {
      guild: guildID,
      inventory,
      guildCards: allCardsJSON,
      crates: cratesJSON,
    },
  };
};
export default GuildInventoryPage;
