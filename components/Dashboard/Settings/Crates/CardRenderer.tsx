import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { fetcher } from "../../../../utils/discordFetcher";
import { getGuildShardURL } from "../../../../utils/ShardLib";
import {
  CardType,
  rarityGradientMap,
  rarityWordMap,
} from "../../../../utils/types";
import { Modal } from "../../../Modal";

export const SettingsCardRenderer = (props: {
  card: CardType;
  deletemode?: boolean;
  onDelete?: () => void;
  onClick?: () => void;
}) => {
  const { card, deletemode, onDelete, onClick } = props;
  const [modalOpen, setmodalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  return (
    <>
      <div
        className={`flex flex-col gap-1 p-1 rounded-3xl hover:bg-transparent transition-all`}
      >
        {/* <span className={`text-gray-50/40 w-fit font-wsans font-medium`}>
          {props.selected ? `Selected` : <>&nbsp;</>}
        </span> */}
        <div
          className={`card rounded-2xl shadow-lg relative shrink-0 z-10 h-fit group hover:scale-105 ease-in duration-200 cursor-pointer opacity-80 hover:opacity-100 bg-gradient-to-r ${
            rarityGradientMap[card.rarity]
          } animate-gradient p-1 overflow-hidden shrink-0`}
          //   onClick={() => {
          //     setViewingCard(card);
          //     setCreateCard(false);
          //   }}
          onClick={() => {
            if (deletemode) {
              onDelete && onDelete();
              return;
            }
            if (onClick) return onClick();
            setmodalOpen(true);
          }}
          key={`card-inventory-${card._id}`}
        >
          <img
            src={card.url}
            alt=""
            className={`w-[13.3125rem] h-[4.98rem] object-cover z-10 transition-all pointer-events-none brightness-75 group-hover:brightness-100 ease-in duration-200 rounded-2xl  ${
              deletemode &&
              `group-hover:blur-lg blur-none group-hover:brightness-50 transition-all duration-300`
            }`}
          />
          {deletemode && (
            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap items-center group-hover:opacity-100 opacity-0 transition-all duration-300 z-20`}
            >
              <span className={`text-xs font-wsans font-medium text-red-300`}>
                Click to Delete
              </span>
              <span className={`text-xs font-wsans font-bold text-gray-50`}>
                {card.name}
              </span>
              <span
                className={`text-xs font-wsans font-medium text-gray-50/60`}
              >
                from Crate Loot
              </span>
            </div>
          )}
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
            <Link
              href={`/app/guild/${card.guild}/settings/rankcards?card=${card._id}`}
            >
              <button
                className={`rounded-2xl px-4 py-2 border border-gray-50/10 w-fit bg-gray-50/5 flex flex-row gap-2 items-center hover:bg-indigo-500 hover:border-transparent transition-all disabled:opacity-50 disabled:pointer-events-none`}
              >
                Edit Card
              </button>
            </Link>
          </div>
        </div>
      </Modal>
    </>
  );
};
