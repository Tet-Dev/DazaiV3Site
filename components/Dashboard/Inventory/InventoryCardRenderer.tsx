import { useRouter } from "next/router";
import { useState } from "react";
import { fetcher } from "../../../utils/discordFetcher";
import { getGuildShardURL } from "../../../utils/ShardLib";
import {
  CardType,
  rarityGradientMap,
  rarityWordMap,
} from "../../../utils/types";
import { Modal } from "../../Modal";

export const InventoryCardRenderer = (props: {
  card: {
    cardID: string;
    id: string;
    card: CardType;
  };
  selected?: boolean;
}) => {
  const { card, cardID, id } = props.card;
  const [modalOpen, setmodalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  return (
    <>
      <div
        className={`flex flex-col gap-1 p-2 ${
          props.selected && `bg-indigo-700/40`
        } rounded-3xl hover:bg-transparent transition-all`}
      >
        {/* <span className={`text-gray-50/40 w-fit font-wsans font-medium`}>
          {props.selected ? `Selected` : <>&nbsp;</>}
        </span> */}
        <div
          className={`card rounded-2xl shadow-lg relative shrink-0 z-10 h-fit group hover:scale-105 ease-in duration-200 cursor-pointer opacity-80 hover:opacity-100 bg-gradient-to-r ${
            rarityGradientMap[card.rarity]
          } animate-gradient p-1 overflow-hidden shrink-0 ${
            !props.selected && `opacity-75`
          }`}
          //   onClick={() => {
          //     setViewingCard(card);
          //     setCreateCard(false);
          //   }}
          onClick={() => setmodalOpen(true)}
          key={`card-inventory-${card._id}`}
        >
          <img
            src={card.url}
            alt=""
            className={`w-[17.75rem] h-[6.64rem] object-cover z-10 transition-all pointer-events-none brightness-75 group-hover:brightness-100 ease-in duration-200 rounded-2xl`}
          />
        </div>
      </div>
      <Modal visible={modalOpen} onClose={() => setmodalOpen(false)}>
        <div
          className={`flex flex-col p-6 gap-6 rounded-3xl border-gray-100/10 bg-gray-800 max-w-prose ${
            updating && `opacity-50 pointer-events-none`
          } transition-all`}
        >
          <div
            className={`flex flex-row justify-between items-center -mt-2 -mb-4`}
          >
            <span className={`text-gray-500 font-wsans`}>
              Card ID: {card._id as string}
            </span>

            <span
              className={`text-2xl font-wsans font-bold uppercase bg-gradient-to-r ${
                rarityGradientMap[card.rarity]
              } animate-gradient-medium leading-loose bg-clip-text text-transparent `}
            >
              {rarityWordMap[card.rarity]}
            </span>
          </div>
          <h1 className={`text-4xl font-poppins font-extrabold`}>
            {card.name}
          </h1>
          <div className={`flex flex-col justify-center items-center`}>
            <div
              className={`card rounded-3xl shadow-lg w-fit p-1.5 relative overflow-hidden shrink-0 z-10`}
            >
              <img
                src={card.url}
                alt=""
                className={`w-full h-auto object-cover z-10 rounded-3xl pointer-events-none`}
              />

              <div
                className={`bg-gradient-to-r ${
                  rarityGradientMap[card.rarity]
                } animate-gradient absolute top-0 left-0 w-full h-full -z-10`}
              />
            </div>
          </div>
          <span
            className={`text-gray-400 font-wsans text-xl p-4 border border-gray-50/10 rounded-2xl`}
          >
            {card.description}
          </span>
          <div className={`flex flex-row gap-4 justify-end w-full`}>
            <button
              className={`rounded-2xl px-4 py-2 border border-gray-50/10 w-fit bg-gray-50/5 flex flex-row gap-2 items-center hover:bg-indigo-500 hover:border-transparent transition-all disabled:opacity-50 disabled:pointer-events-none`}
              onClick={async () => {
                if (updating) return;
                setUpdating(true);
                const res = await fetcher(
                  `${await getGuildShardURL(
                    router.query.guild as string
                  )}/guilds/${router.query.guild}/inventory/selectCard`,
                  {
                    method: "POST",
                    body: JSON.stringify({
                      cardID: id,
                    }),
                  }
                );
                setUpdating(false);
                if (res.status === 200) {
                  router.replace(router.asPath);
                }
              }}
              disabled={updating || props.selected}
            >
              {props.selected ? `Card Selected` : `Select Card`}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
