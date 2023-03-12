import { PencilIcon, PlusIcon } from "@heroicons/react/24/outline";
import { GetServerSideProps } from "next";
import { useState } from "react";
import { CreateRankCard } from "../../../../../components/Dashboard/Settings/RankCards/createRankCard";
import { ViewRankCard } from "../../../../../components/Dashboard/Settings/RankCards/ViewRankCard";
import { useDiscordUser } from "../../../../../utils/hooks/useDiscordUser";
import { getGuildShardURL } from "../../../../../utils/ShardLib";
import { CardRarity, CardType } from "../../../../../utils/types";

export const RankCardSettings = (props: {
  guild: string;
  cards: CardType[];
  selectedCard: CardType | null;
}) => {
  const { guild, selectedCard } = props;
  const [cards, setCards] = useState(props.cards);
  const [viewingCard, setViewingCard] = useState(
    selectedCard ?? (null as CardType | null)
  );
  const [createCard, setCreateCard] = useState(false);
  const user = useDiscordUser();
  return (
    <div
      className={`relative grid grid-cols-12 ${
        user ? `2xl:ml-2 gap-8 2xl:gap-0 ml-[5%]` : `ml-[5%] gap-8`
      } relative`}
    >
      <div
        className={`col-span-8 relative h-screen flex flex-col gap-6 pt-8 overflow-auto transition-all`}
      >
        <h1 className={`text-3xl font-bold font-poppins`}>
          Server-Wide Custom Rank Cards
        </h1>
        <span className={`text-gray-400 font-wsans`}>
          Custom rank cards are a great way to boost your server&apos;s
          engagement and add some flair to your server&apos;s ranks! You can
          create up to 10 rank cards for free.
        </span>

        {viewingCard ? (
          <ViewRankCard
            card={viewingCard}
            onSave={async () => {
              const res = await fetch(
                `${getGuildShardURL(guild)}/guilds/${guild}/settings/cards`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
              setCards(await res.json());
              setViewingCard(null);
            }}
            key={`view-card-${viewingCard._id}`}
          />
        ) : createCard ? (
          <CreateRankCard />
        ) : (
          <div
            className={`flex flex-grow flex-col gap-8 items-center justify-center border-2 mb-8 p-12 rounded-3xl border-dashed border-gray-700`}
          >
            <span className={`text-gray-500 font-wsans text-2xl `}>
              {cards.length
                ? `Click on a card in the list on the right to view`
                : `Click on the "Add Card" button to add your first card!`}
            </span>
          </div>
        )}
      </div>
      <div
        className={`col-span-4 relative h-screen flex flex-col gap-4 p-8 items-center bg-gray-900 overflow-auto`}
      >
        <h1 className={`text-2xl font-bold font-poppins w-full text-end`}>
          Server Card List
        </h1>
        <span
          className={`text-gray-200 font-wsans font-medium text-end w-full`}
        >
          {cards.length} / 25 card slots used
        </span>
        {cards.map((card) => (
          <div
            className={`card rounded-3xl shadow-lg relative shrink-0 z-10 h-fit group hover:scale-105 ease-in duration-200 cursor-pointer opacity-80 hover:opacity-100 border-4 ${
              viewingCard === card ? `border-indigo-500` : `border-gray-100/20`
            } overflow-hidden shrink-0`}
            onClick={() => {
              setViewingCard(card);
              setCreateCard(false);
            }}
            key={`card-slot-${card._id}`}
          >
            <img
              src={card.url}
              alt=""
              className={`w-[17.75rem] h-[6.64rem] object-cover z-10 transition-all pointer-events-none brightness-75 group-hover:brightness-100 ease-in duration-200`}
            />
          </div>
        ))}
        <div
          className={`card rounded-3xl shadow-lg relative shrink-0 z-10 h-fit group hover:scale-105 ease-in duration-200 cursor-pointer opacity-80 hover:opacity-100 border-4 border-gray-50/20 border-dashed overflow-hidden hover:bg-gray-50/10`}
          onClick={() => {
            setCreateCard(true);
            setViewingCard(null);
          }}
        >
          <div
            className={`w-[17.75rem] h-[6.64rem] z-10 transition-all pointer-events-none brightness-75 group-hover:brightness-100 ease-in duration-200 flex flex-col gap-4 items-center justify-center`}
          >
            <PlusIcon className={`w-10 h-10 text-gray-50/40`} />
            <span className={`text-gray-50/40 w-fit font-wsans font-medium`}>
              Add Card
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const guildID = context.query.guild as string;

  const guildCards = await fetch(
    `${getGuildShardURL(guildID)}/guilds/${guildID}/settings/cards`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const cards = (await guildCards.json()) as CardType[];
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
      cards,
      selectedCard: context.query.card
        ? cards.find((card) => card._id === context.query.card)
        : null,
    },
  };
};
export default RankCardSettings;
