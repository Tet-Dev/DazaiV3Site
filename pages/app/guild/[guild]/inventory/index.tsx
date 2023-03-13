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
  forceLogin: boolean;
}) => {
  const { guild, inventory, guildCards, crates } = props;
  const [viewingCard, setViewingCard] = useState(null as CardType | null);
  const [createCard, setCreateCard] = useState(false);
  const [stack, setStack] = useState(true);
  const [cards, setCards] = useState<Card[]>([]);
  const router = useRouter();
  const user = useDiscordUser();
  useEffect(() => {
    if (props.forceLogin) {
      router.push("/app/login");
    }
  }, []);
  useEffect(() => {
    let c = [];
    if (!stack) {
      c = inventory.cards.map((v) => ({ ...v, amount: 1 }));
    } else {
      let addedCards = new Map<String, Card>();
      inventory.cards.forEach((v) => {
        if (addedCards.has(v.cardID)) {
          addedCards.get(v.cardID)!.amount += 1;
        } else {
          addedCards.set(v.cardID, {
            ...v,
            amount: 1,
          });
        }
      });
      c = Array.from(addedCards.values());
    }
    setCards(
      c.sort((a, b) => {
        // sort by rarity and then by name
        if (a.card.rarity === b.card.rarity) {
          return a.card.name.localeCompare(b.card.name);
        }
        return rarityValue[b.card.rarity] - rarityValue[a.card.rarity];
      })
    );
  }, [stack, inventory.cards]);
  return (
    <div
      className={`relative ${
        user ? ` gap-8 2xl:gap-0 px-8` : `ml-[5%] gap-8`
      } relative flex flex-col items-center justify-center flex-grow`}
    >
      <div
        className={`col-span-8 relative h-screen flex flex-col gap-6 pt-8 overflow-auto transition-all max-w-[150ch] lg:max-w-[100vw] w-auto pb-8 items-center`}
      >
        <div className={`flex flex-col gap-4 w-full`}>
          <div
            className={`flex flex-row lg:flex-col gap-16 lg:gap-6 items-center`}
          >
            <h1 className={`text-3xl font-bold font-poppins lg:text-xl`}>
              Rank Card Inventory
            </h1>{" "}
            <div className={`flex flex-row gap-4`}>
              <div className={`p-2 bg-gray-900 rounded-2xl px-4`}>
                <span className={`font-wsans text-sm lg:inline hidden`}>
                  Wallet:{" "}
                </span>

                <span className={`font-bold font-wsans`}>
                  {inventory.money ?? 0} 円
                </span>
              </div>
              <div
                className={` flex-row gap-4 items-center font-bold lg:flex hidden`}
              >
                Stack Cards:
                <Switch
                  checked={stack}
                  onChange={setStack}
                  className={`${
                    stack ? "bg-indigo-500" : "bg-gray-200"
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-all`}
                >
                  <span
                    className={`${
                      stack ? "translate-x-6" : "translate-x-1"
                    } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                  />
                </Switch>
              </div>
            </div>
          </div>
          <div
            className={`flex flex-row gap-4 items-center font-bold lg:bg-blend-hard-light lg:hidden`}
          >
            Stack Cards:
            <Switch
              checked={stack}
              onChange={setStack}
              className={`${
                stack ? "bg-indigo-500" : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-all`}
            >
              <span
                className={`${
                  stack ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
          </div>
        </div>
        <span className={`text-gray-400 font-wsans lg:px-8 `}>
          Your rank card inventory is where you can view all of the rank cards
          you own and use them on your server!
        </span>
        <div
          className={`grid md:grid-cols-1 xl:grid-cols-2 2.5xl:grid-cols-3 3xl:grid-cols-5 lg:justify-center px-4 w-fit`}
        >
          {cards.map((card, i) => (
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
        {!!crates.filter(
          (x) => !x.opened && (x.guildID === guild || x.guildID === `@global`)
        ).length && (
          <div className={`flex flex-col gap-4`}>
            <div className={`flex flex-row gap-2 items-center justify-center`}>
              <h2 className={`text-lg font-bold font-poppins`}>
                Guild Crates (
                {
                  crates.filter(
                    (x) =>
                      !x.opened &&
                      (x.guildID === guild || x.guildID === `@global`)
                  ).length
                }
                )
              </h2>
              <button
                className={`bg-indigo-500 group-hover:bg-indigo-400 text-gray-50 font-wsans font-bold text-sm px-4 py-2 rounded-xl transition-all w-fit`}
                onClick={() => {
                  router.push(`/crate/all/${guild}`);
                }}
              >
                Open All
              </button>
            </div>
            <div
              className={`flex flex-row flex-wrap justify-evenly px-6 gap-4`}
            >
              {crates
                .filter(
                  (x) =>
                    !x.opened &&
                    (x.guildID === guild || x.guildID === `@global`)
                )
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
          <h2 className={`text-lg font-bold font-poppins w-full`}>
            Collected Guild Cards (
            {
              new Set(
                inventory.cards.filter((x) => x.card.guild).map((x) => x.cardID)
              ).size
            }
            /{guildCards.length})
          </h2>
          <div
            className={`flex flex-row flex-wrap justify-start lg:justify-center px-6 gap-4`}
          >
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
