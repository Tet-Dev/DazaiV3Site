import { Switch, Transition } from "@headlessui/react";
import { PencilIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import {
  Card,
  InventoryCardRenderer,
} from "../../../../../components/Dashboard/Inventory/InventoryCardRenderer";
import { InventoryCardRendererNotOwned } from "../../../../../components/Dashboard/Inventory/InventoryCardRendererNotOwned";
import { InventoryCrateRenderer } from "../../../../../components/Dashboard/Inventory/InventoryCrateRenderer";
import { DummyInventoryCardRenderer } from "../../../../../components/Dashboard/Inventory/InventoryDummyCardRenderer";
import { clientID } from "../../../../../utils/constants";
import { useDiscordUser } from "../../../../../utils/hooks/useDiscordUser";
import { useAPIProp } from "../../../../../utils/hooks/useProp";
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
  forceLogin: boolean;
}) => {
  const { guild, userID } = useRouter().query as {
    guild: string;
    userID: string;
  };
  const [inventory, updateInventory] = useAPIProp<GuildInventory>(
    `/guilds/${guild}/inventory/${userID === "@me" ? `` : userID}`
  );
  const [guildCards, updateGuildCards] = useAPIProp<CardType[]>(
    `/guilds/${guild}/settings/cards`
  );
  const [crates, updateCrates] = useAPIProp<Crate[]>(
    userID === "@me" ? `/inventory/crates/` : `/inventory/crates/user/${userID}`
  );

  const [viewingCard, setViewingCard] = useState(null as CardType | null);
  const [createCard, setCreateCard] = useState(false);
  const [stack, setStack] = useState(true);
  const [cards, setCards] = useState<Card[]>([]);
  const [popup, setPopup] = useState(0);
  const [self, setSelf] = useState(false);
  const [sortedGuildCards, setSortedGuildCards] = useState([] as CardType[]);

  const router = useRouter();
  const {user} = useDiscordUser();
  useEffect(() => {
    if (
      (inventory?.viewingPerson?.id === user?.id && user) ||
      (inventory && !inventory.viewingPerson)
    ) {
      setPopup(-1);
      setSelf(true);
    }
    if (
      (inventory?.viewingPerson?.id !== user?.id &&
        user &&
        inventory?.viewingPerson) ||
      (user === undefined && inventory)
    ) {
      setPopup((p) => (p === 0 ? 1 : p));
    }
  }, [inventory, user]);
  useEffect(() => {
    if (guildCards) {
      setSortedGuildCards(
        guildCards.sort((a, b) => {
          if (a.guild === undefined && b.guild !== undefined) {
            return 1;
          }
          if (a.rarity === b.rarity) {
            return a.name.localeCompare(b.name);
          }
          return rarityValue[b.rarity] - rarityValue[a.rarity];
        })
      );
    }
  }, [guildCards]);

  // useEffect(() => {
  //   if (user === null) {
  //     localStorage.setItem("redirect", globalThis?.location?.href);
  //     router.push(
  //       `https://discord.com/api/oauth2/authorize?client_id=${clientID}&redirect_uri=${encodeURIComponent(
  //         window?.location?.origin
  //       )}%2Fauth&response_type=code&scope=identify%20email%20connections%20guilds`
  //     );
  //     return;
  //   }
  // }, [user]);
  useEffect(() => {
    if (!inventory) return;
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
        // sort by if guild is undefined, then rarity and then by name
        if (a.card.guild === '@global' && b.card.guild !== '@global') {
          return 1;
        }

        if (a.card.rarity === b.card.rarity) {
          return a.card.name.localeCompare(b.card.name);
        }
        return rarityValue[b.card.rarity] - rarityValue[a.card.rarity];
      })
    );
  }, [stack, inventory?.cards]);
  return (
    <div
      className={`gap-8 2xl:gap-0 px-8 relative flex flex-col items-center justify-center flex-grow`}
    >
      <div
        className={`col-span-8 relative h-screen flex flex-col gap-6 pt-8 overflow-auto transition-all max-w-[200ch] lg:max-w-[100vw] w-auto pb-8 items-center`}
      >
        <div className={`flex flex-col gap-4 w-full`}>
          <div
            className={`flex flex-row lg:flex-col gap-16 lg:gap-6 items-center`}
          >
            <h1 className={`text-3xl font-bold font-poppins lg:text-xl`}>
              Inventory
            </h1>{" "}
            <div className={`flex flex-row gap-4`}>
              <div className={`p-2 bg-gray-900 rounded-2xl px-4`}>
                <span className={`font-wsans text-sm lg:inline hidden`}>
                  Wallet:{" "}
                </span>

                <span className={`font-bold font-wsans`}>
                  {!inventory ? `N/A` : inventory.money ?? 0} 円
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
            className={`flex flex-row gap-4 items-center font-medium text-gray-100/30 text-sm lg:bg-blend-hard-light lg:hidden`}
          >
            Stack Cards:
            <Switch
              checked={stack}
              onChange={setStack}
              className={`${
                stack ? "bg-indigo-500" : "bg-gray-900"
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
        <span
          className={`text-gray-400 font-wsans lg:px-8 ${
            (cards.length || crates?.length) && `hidden`
          }`}
        >
          Your rank card inventory is where you can view all of the rank cards
          you own and use them on your server!
        </span>
        {!!crates?.filter(
          (x) => !x.opened && (x.guildID === guild || x.guildID === `@global`)
        ).length && (
          <div className={`flex flex-col gap-4 w-full items-center`}>
            <div
              className={`flex flex-row gap-2 items-center justify-between w-full`}
            >
              <h2 className={`text-lg font-bold font-poppins wf`}>
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
              {self && (
                <button
                  className={`bg-indigo-500 group-hover:bg-indigo-400 text-gray-50 font-wsans font-bold text-sm px-4 py-2 rounded-xl transition-all w-fit`}
                  onClick={() => {
                    router.push(`/crate/all/${guild}`);
                  }}
                >
                  Open All Crates
                </button>
              )}
            </div>
            <div
              className={`grid md:grid-cols-1 xl:grid-cols-2 2.5xl:grid-cols-3 3xl:grid-cols-5 inf:grid-cols-5 lg:justify-center w-fit gap-4`}
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
                    selfOwned={self}
                  />
                ))}
            </div>
          </div>
        )}
        <h2 className={`text-lg font-bold font-poppins w-full`}>
          Rank Cards ({cards.length})
        </h2>
        <div
          className={`grid md:grid-cols-1 xl:grid-cols-2 2.5xl:grid-cols-3 3xl:grid-cols-5 inf:grid-cols-5 lg:justify-center px-4 w-fit`}
        >
          {cards.map((card, i) => (
            <InventoryCardRenderer
              card={card}
              selected={card.id === inventory?.selectedCard}
              key={`inventory-card-render-${card.id}`}
              updateInventory={updateInventory}
              selfOwned={self}
            />
          ))}
          {(inventory === undefined || guildCards === undefined) &&
            // render 20 dummy cards while loading
            Array.from({ length: 20 }).map((_, i) => (
              <DummyInventoryCardRenderer key={`dummy-card-${i}`} />
            ))}
          {inventory && !inventory?.cards.length && (
            <div
              className={`flex w-screen flex-col gap-8 items-center justify-center mb-8 p-12 rounded-3xl border-gray-700`}
            >
              <span className={`text-gray-600 font-wsans`}>
                You don&apos;t have any rank cards yet!
              </span>
            </div>
          )}
        </div>

        <div className={`flex flex-col gap-4`}>
          <h2 className={`text-lg font-bold font-poppins w-full`}>
            Collected Guild Cards (
            {
              new Set(
                inventory?.cards
                  .filter((x) => x.card.guild === guild)
                  .map((x) => x.cardID)
              ).size
            }
            /{sortedGuildCards?.length})
          </h2>
          <div
            className={`grid md:grid-cols-1 xl:grid-cols-2 2.5xl:grid-cols-3 3xl:grid-cols-5 inf:grid-cols-5 lg:justify-center px-4 w-fit gap-4`}
          >
            {(inventory === undefined || sortedGuildCards === undefined) &&
              // render 20 dummy cards while loading
              Array.from({ length: 20 }).map((_, i) => (
                <DummyInventoryCardRenderer key={`dummy-card2-${i}`} />
              ))}
            {sortedGuildCards?.map((card, i) => {
              if (inventory?.cards.find((c) => c.cardID === card._id)) {
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

      <Transition
        show={popup === 1}
        enter={`transition ease-bounce duration-500 delay-1000`}
        enterFrom={`translate-y-full opacity-0`}
        enterTo={`translate-y-0 opacity-100`}
        leave={`transition ease-bounce duration-300`}
        leaveFrom={`translate-y-0 opacity-100`}
        leaveTo={`translate-y-full opacity-0`}
        as={Fragment}
      >
        <div
          className={`absolute max-w-[90vw] w-fit p-1.5 px-4 bg-gray-900 bottom-4 left-1/2 -translate-x-1/2 z-30 flex flex-row gap-2 rounded-2xl font-wsans items-center text-gray-300 text-sm lg:text-xs`}
        >
          <span className={``}>Viewing</span>
          <div className={`flex flex-row gap-px items-center`}>
            <div
              className={`flex flex-row gap-2 p-0.5 pr-3 md:px-3 rounded-full bg-indigo-500/30 items-center`}
            >
              <img
                src={inventory?.viewingPerson?.avatarURL}
                className={`w-8 h-8 lg:w-6 lg:h-6 rounded-full bg-gray-900/50 p-0.5 md:hidden`}
              />

              <span className={`text-gray-50 font-bold`}>
                {inventory?.viewingPerson?.name}
              </span>
            </div>
            <span className={``}>&apos;s</span>
          </div>
          <span className={``}>Inventory</span>
          <button
            className={`text-gray-300 flex flex-row gap-1 bg-black hover:bg-white hover:text-gray-900 p-1.5 rounded-full transition-all`}
            onClick={() => setPopup(-1)}
          >
            <XMarkIcon className={`w-4 h-4`} />
          </button>
        </div>
      </Transition>
    </div>
  );
};

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const guildID = context.query.guild as string;
//   //   read authy_cookie from context.req.cookies
//   const authy_cookie = context.req.cookies.authy_cookie;
//   //   if authy_cookie is undefined, redirect to login
//   if (!authy_cookie) {
//     return {
//       redirect: {
//         destination: "/",
//         permanent: false,
//       },
//     };
//   }

//   const guildInventory = await fetch(
//     `${getGuildShardURL(guildID)}/guilds/${guildID}/inventory`,
//     {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${authy_cookie}`,
//       },
//     }
//   );
//   if (guildInventory.status === 401) {
//     return {
//       // redirect: {
//       //   destination: "/",
//       //   permanent: false,
//       // },
//       props: {
//         forceLogin: true,
//       },
//     };
//   }
//   const guildInventoryJSON = await guildInventory.json();

//   const inventory = guildInventoryJSON as GuildInventory;

//   const allCards = await fetch(
//     `${getGuildShardURL(guildID)}/guilds/${guildID}/settings/cards`
//   );
//   const allCardsJSON = (await allCards.json()) as CardType[];
//   // sort by rarity

//   allCardsJSON.sort((a, b) => rarityValue[a.rarity] - rarityValue[b.rarity]);

//   const crates = await fetch(`${getGuildShardURL(guildID)}/inventory/crates`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${authy_cookie}`,
//     },
//   });
//   const cratesJSON = await crates.json();

//   //   cards.push({
//   //     _id: "63e3f70bf538f8e190963d88",
//   //     name: "Sunset Dazai",
//   //     description: "Dazai with a sunset background",
//   //     url: "https://assets.dazai.app/cards/_default/ani_dazai.gif",
//   //     rarity: CardRarity.LEGENDARY,
//   //   });
//   //   cards.push({
//   //     _id: "63e3f70bf538f8e190963d8f",
//   //     name: "Dazai Thousand",
//   //     description: "The 1000 server milestone celebration card",
//   //     url: "https://assets.dazai.app/cards/_default/dazai1000.png",
//   //     rarity: CardRarity.EVENT_RARE,
//   //   });
//   return {
//     props: {
//       guild: guildID,
//       inventory,
//       guildCards: allCardsJSON,
//       crates: cratesJSON,
//     },
//   };
// };
export default GuildInventoryPage;
