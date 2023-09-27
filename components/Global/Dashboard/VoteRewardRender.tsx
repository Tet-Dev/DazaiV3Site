import { GlobeAltIcon, TrashIcon } from "@heroicons/react/24/outline";
import from from "fetch-blob/from";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAPIProp } from "../../../utils/hooks/useProp";
import {
  CardType,
  CrateTemplate,
  LevelUpRewardActionType,
  LevelUpRewardCardActionType,
  LevelUpRewardCrateActionType,
  rarityGradientMap,
  rarityWordMap,
} from "../../../utils/types";
import { InventoryCardRendererNotOwned } from "../../Dashboard/Inventory/InventoryCardRendererNotOwned";
import { OpenCrateRenderer } from "../../Dashboard/Settings/Crates/OpenCrateRenderer";
import { Modal } from "../../Modal";

export const VoteRewardEntry = (props: { action: LevelUpRewardActionType }) => {
  const { action } = props;
  return (
    <div className={`w-full items-center rounded-xl`}>
      {action.type === "crate" ? (
        <VoteRewardEntryCrate reward={action} />
      ) : action.type === "card" ? (
        <VoteRewardEntryCard reward={action} />
      ) : null}

      <div className={`flex flex-grow`} />
    </div>
  );
};
const VoteRewardEntryCrate = (props: {
  reward: LevelUpRewardCrateActionType;
}) => {
  const { reward } = props;
  const [crate, updateCrate] = useAPIProp<CrateTemplate>(
    `/guilds/${`@global`}/settings/crate/${reward.crateID}`,
    `@global`
  );
  return (
    <div
      className={`flex flex-col gap-4 bg-gray-800 rounded-3xl relative h-48 grow border border-gray-100/5 group cursor-default`}
    >
      <div
        className={`bg-gradient-to-r from-indigo-300 via-purple-400 to-indigo-300  absolute w-full h-full top-0 left-0 opacity-40 rounded-3xl`}
      />
      <div
        className={`bg-gradient-to-r from-indigo-300 via-purple-400 to-indigo-300 animate-gradient-medium absolute w-full h-full top-0 left-0 rounded-3xl blur-md group-hover:opacity-50 brightness-75 opacity-0 transition-all`}
      />
      <div
        className={`w-full h-full overflow-hidden flex items-center justify-center`}
      >
        <img
          src={`/images/crates/chest2.webp`}
          alt="chest"
          className={`object-cover grow-0 h-[200%] w-auto z-10 blur-sm group-hover:blur-0 transition-all duration-300 group-hover:animate-bounce-mini2`}
        />
      </div>
      <div
        className={`bg-gradient-to-t from-gray-900/90 via-gray-900/70 to-gray-900/20 w-full h-full absolute top-0 left-0 z-20 group-hover:opacity-70 transition-all rounded-3xl`}
      />
      <div className={`absolute bottom-4 left-4 flex flex-col z-30`}>
        <h3 className={`text-gray-50 font-wsans font-extrabold text-xl`}>
          {crate?.name}
        </h3>
      </div>
      <div
        className={`absolute z-10 top-2.5 right-2.5 p-1 bg-gray-900/70 backdrop-blur-sm w-fit h-fit flex flex-row items-center justify-center rounded-full text-xs font-medium font-wsans gap-1`}
      >
        <GlobeAltIcon className={`w-4 h-4`} /> <span>Global Crate</span>
      </div>
    </div>
  );
};
const VoteRewardEntryCard = (props: {
  reward: LevelUpRewardCardActionType;
}) => {
  const { reward } = props;
  const [card, updateCard] = useAPIProp<CardType>(
    `/guilds/${`@global`}/settings/cards/${reward.cardID}`,
    `@global`
  );
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
        className={` w-full rounded-3xl shadow-lg relative shrink-0 z-10 h-full group ease-in duration-200 cursor-pointer bg-gradient-to-r ${
          rarityGradientMap[card?.rarity || "common"]
        }  p-0.5 shrink-0 bg-opacity-5 hover:bg-opacity-90`}
        //   onClick={() => {
        //     setViewingCard(card);
        //     setCreateCard(false);
        //   }}
        onClick={() => setmodalOpen(true)}
        key={`card-inventory-${card?._id}`}
      >
        {card?.rarity !== "secret_rare" && (
          <img
            src={card?.url}
            alt=""
            className={`w-full h-full object-cover blur-lg group-hover:opacity-100 opacity-0 transition-all absolute top-0 left-0 z-0`}
          />
        )}
        <div
          className={`w-full h-full object-cover z-10 transition-all pointer-events-none ease-in duration-200 rounded-3xl overflow-hidden bg-gray-900`}
        >
          {card?.rarity === "secret_rare" ? (
            <div
              className={`bg-gray-900 group-hover:bg-gray-800 w-full h-full flex flex-row items-center justify-center transition-all`}
            >
              <span className={`font-black font-wsans text-6xl text-gray-500`}>
                ?
              </span>
            </div>
          ) : (
            <img
              src={card?.url}
              alt=""
              className={`w-full h-full object-cover blur-md group-hover:blur-0 transition-all`}
            />
          )}
        </div>
        <div className={`absolute bottom-4 left-4 flex flex-col z-40`}>
          <h3 className={`text-gray-50 font-wsans font-extrabold text-xl`}>
            Card BG
          </h3>
        </div>
        <div
          className={`absolute z-10 top-2.5 right-2.5 p-1 bg-gray-900/70 backdrop-blur-sm w-fit h-fit flex flex-row items-center justify-center rounded-full text-xs font-medium font-wsans gap-1`}
        >
          <GlobeAltIcon className={`w-4 h-4`} /> <span>Global Background</span>
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
            <span
              className={`text-gray-300 font-wsans font-bold text-xl text-end lg:text-base`}
            >
              Global Dazai Card
            </span>
            <span
              className={`text-2xl font-wsans font-bold uppercase bg-gradient-to-r ${
                rarityGradientMap[card?.rarity || "common"]
              } animate-gradient-medium leading-loose bg-clip-text text-transparent lg:text-lg`}
            >
              {rarityWordMap[card?.rarity || "common"]}
            </span>
          </div>
          <div className={`flex flex-row gap-4 justify-between w-full`}>
            <h1
              className={`text-4xl font-poppins font-extrabold lg:text-2xl ${
                card?.rarity === `secret_rare` && `blur-md pointer-events-none`
              }`}
            >
              {
                (card?.rarity !== `secret_rare`
                  ? card?.name
                  : `Nice Try lol :D`) as string
              }
            </h1>
          </div>
          <div className={`flex flex-col justify-center items-center`}>
            <div
              className={`card rounded-3xl shadow-lg w-full p-1.5 lg:p-1 md:p-0.5 relative overflow-hidden shrink-0 z-10`}
            >
              <div
                className={`w-full h-auto object-cover z-10 rounded-3xl pointer-events-none overflow-hidden`}
              >
                {card?.rarity === "secret_rare" ? (
                  <div
                    className={`bg-gray-900 w-[65ch] h-full flex flex-row items-center justify-center aspect-[1024/340]`}
                  >
                    <span
                      className={`font-black text-gray-700 animate-pulse font-wsans text-6xl`}
                    >
                      ?
                    </span>
                  </div>
                ) : (
                  <img src={card?.url} alt="" className={`w-full h-full`} />
                )}
              </div>
              {/* <img
                src={card?.url}
                alt=""
                className={`w-full h-auto object-cover z-10 rounded-3xl pointer-events-none`}
              /> */}

              <div
                className={`bg-gradient-to-r ${
                  rarityGradientMap[card?.rarity || "common"]
                } animate-gradient absolute top-0 left-0 w-full h-full -z-10`}
              />
            </div>
          </div>
          <span
            className={`text-gray-400 font-wsans text-xl p-4 border border-gray-50/10 rounded-2xl lg:text-sm lg:p-3`}
          >
            {card?.rarity === "secret_rare" ? `???` : card?.description}
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
