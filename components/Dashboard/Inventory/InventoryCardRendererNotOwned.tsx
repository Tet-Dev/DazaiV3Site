import { useRouter } from "next/router";
import { useState } from "react";
import { FaQuestion } from "react-icons/fa";
import { fetcher } from "../../../utils/discordFetcher";
import { getGuildShardURL } from "../../../utils/ShardLib";
import {
  CardType,
  rarityGradientMap,
  rarityWordMap,
} from "../../../utils/types";
import { Modal } from "../../Modal";

export const InventoryCardRendererNotOwned = (props: { card: CardType }) => {
  const { card } = props;
  const [modalOpen, setmodalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  return (
    <>
      {/* <div> */}
      {/* <span className={`text-gray-50/40 w-fit font-wsans font-medium`}>
          {props.selected ? `Selected` : <>&nbsp;</>}
        </span> */}
      <div
        className={` w-fit rounded-2xl shadow-lg relative shrink-0 z-10 h-fit group hover:scale-105 ease-in duration-200 cursor-pointer opacity-80 hover:opacity-100 bg-gradient-to-r ${
          rarityGradientMap[card.rarity]
        }  p-1 overflow-hidden shrink-0 opacity-20 brightness-50`}
        //   onClick={() => {
        //     setViewingCard(card);
        //     setCreateCard(false);
        //   }}
        onClick={() => setmodalOpen(true)}
        key={`card-inventory-${card._id}`}
      >
        <div
          className={`w-[17.75rem] h-[6.64rem] object-cover z-10 transition-all pointer-events-none brightness-75 group-hover:brightness-100 ease-in duration-200 rounded-2xl overflow-hidden`}
        >
          {card.rarity === "secret_rare" ? (
            <div
              className={`bg-gray-900 w-full h-full flex flex-row items-center justify-center`}
            >
              <span className={`font-black font-wsans text-6xl text-gray-500`}>?</span>
            </div>
          ) : (
            <img src={card.url} alt="" className={`w-full h-full`} />
          )}
        </div>
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20`}
        >
          <span className={`font-bold text-2xl uppercase font-wsans`}>
            {" "}
            Locked{" "}
          </span>
        </div>
      </div>
      {/* </div> */}
      <Modal
        visible={modalOpen}
        onClose={() => setmodalOpen(false)}
        className={`lg:w-[90vw]`}
        hideBG
      >
        <div
          className={`flex flex-col p-6 gap-6 rounded-3xl border-gray-100/10 bg-gray-800 lg:max-w-[90vw] ${
            updating && `opacity-50 pointer-events-none`
          } transition-all lg:w-screen`}
        >
          <div
            className={`flex flex-row justify-between items-center -mt-2 -mb-4`}
          >
            {card.rarity !== `secret_rare` && (
              <span className={`text-gray-500 font-wsans lg:text-xs`}>
                Card ID: {card._id as string}
              </span>
            )}
            <span
              className={`text-2xl font-wsans font-bold uppercase bg-gradient-to-r ${
                rarityGradientMap[card.rarity]
              } animate-gradient-medium leading-loose bg-clip-text text-transparent lg:text-lg`}
            >
              {rarityWordMap[card.rarity]}
            </span>
          </div>
          <div className={`flex flex-row gap-4 justify-between w-full`}>
            <h1
              className={`text-4xl font-poppins font-extrabold lg:text-2xl ${
                card.rarity === `secret_rare` && `blur-md pointer-events-none`
              }`}
            >
              {
                (card.rarity !== `secret_rare`
                  ? card.name
                  : `Nice Try lol :D`) as string
              }
            </h1>
            <span
              className={`text-gray-500 font-wsans font-black text-xl uppercase text-end lg:text-base`}
            >
              Unowned
            </span>
          </div>
          <div className={`flex flex-col justify-center items-center`}>
            <div
              className={`card rounded-3xl shadow-lg w-fit p-1.5 relative overflow-hidden shrink-0 z-10`}
            >
              <div
                className={`w-[65ch] h-auto object-cover z-10 rounded-3xl pointer-events-none overflow-hidden`}
              >
                {card.rarity === "secret_rare" ? (
                  <div
                    className={`bg-gray-900 w-full h-full flex flex-row items-center justify-center aspect-[1024/340]`}
                  >
                    <span className={`font-black text-gray-700 animate-pulse font-wsans text-6xl`}>?</span>
                  </div>
                ) : (
                  <img src={card.url} alt="" className={`w-full h-full`} />
                )}
              </div>
              {/* <img
                src={card.url}
                alt=""
                className={`w-full h-auto object-cover z-10 rounded-3xl pointer-events-none`}
              /> */}

              <div
                className={`bg-gradient-to-r ${
                  rarityGradientMap[card.rarity]
                } animate-gradient absolute top-0 left-0 w-full h-full -z-10`}
              />
            </div>
          </div>
          <span
            className={`text-gray-400 font-wsans text-xl p-4 border border-gray-50/10 rounded-2xl lg:text-sm lg:p-3`}
          >
            {card.rarity === "secret_rare" ? `???` : card.description}
          </span>
          <div className={`flex flex-row gap-4 justify-end w-full`}>
            <button
              className={`rounded-2xl px-4 py-2 border border-gray-50/10 w-fit bg-gray-50/5 flex flex-row gap-2 items-center hover:bg-indigo-500 hover:border-transparent transition-all disabled:opacity-50 disabled:pointer-events-none`}
              onClick={() => {
                setmodalOpen(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
