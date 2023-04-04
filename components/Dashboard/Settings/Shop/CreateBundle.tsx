import {
  ExclamationTriangleIcon,
  PlusCircleIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { cropResizeGif } from "gif-cropper-resizer-browser";
import { GifCodec, GifFrame, GifUtil } from "gifwrap";
import Jimp from "jimp";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { fetcher } from "../../../../utils/discordFetcher";
import { getGuildShardURL } from "../../../../utils/ShardLib";
import {
  CardRarity,
  rarityGradientMap,
  rarityWordMap,
  ShopItem,
  BundleItem,
} from "../../../../utils/types";
import SelectMenu from "../../../Misc/SelectMenu";
import { Modal } from "../../../Modal";
import { NewRewardActionModal } from "../LevelupRewards/NewRewardActionModal";
import { BundleItemEntry } from "./BundleItemEntry";
import { NewBundleRewardModal } from "./NewBundleRewardModal";

export const CreateBundle = (props: { guild: string; onClose: () => void }) => {
  const { guild, onClose } = props;
  const [editMode, setEditMode] = useState(false);
  const [cardName, setCardName] = useState("");
  const [cardDescription, setCardDescription] = useState("");
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [price, setPrice] = useState<number | string>(0);
  const [newReward, setNewReward] = useState(false);
  const [rewards, setRewards] = useState<BundleItem[]>([]);
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);
  //   useEffect(() => {
  //     setCardName(card.name);
  //     setCardDescription(card.description);
  //     setRarity(card.rarity);
  //   }, [card, editMode]);
  return (
    <>
      <div
        className={`flex flex-col gap-6 border mt-6 p-8 rounded-3xl border-gray-100/10 bg-gray-800 shadow-md ${
          updating && `opacity-50 animate-pulse pointer-events-none`
        } transition-all`}
      >
        <div className={`flex flex-row justify-between items-start z-20`}>
          <h1 className={`text-2xl font-bold font-poppins w-full`}>
            Add a new bundle
          </h1>
          {/* <span
        className={`text-2xl font-wsans font-bold uppercase bg-gradient-to-r ${
          rarityGradientMap[card.rarity]
        } animate-gradient-medium leading-loose bg-clip-text text-transparent `}
      >
        {rarityWordMap[card.rarity]}
      </span> */}
        </div>
        {error && (
          <div
            className={`flex flex-row gap-4 bg-red-900/30 p-4 rounded-3xl items-center`}
          >
            <ExclamationTriangleIcon className={`h-6 w-6 text-red-400`} />
            <span className={`text-red-400`}>{error}</span>
          </div>
        )}

        <div className={`flex flex-row gap-4`}>
          <div className={`flex flex-col gap-2 relative w-full`}>
            <span className={`text-gray-300 font-wsans font-medium`}>
              Bundle Name
            </span>
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value.substring(0, 40))}
              className={`text-3xl bg-gray-850 px-4 p-2 rounded-2xl font-medium font-poppins focus:outline-none focus:ring-2 ring-0 ring-indigo-500 transition-all`}
            />
            <span
              className={`absolute bottom-0 right-0 text-gray-400 bg-gray-850/90 p-2 rounded-2xl text-xs`}
            >
              {cardName.length}/40
            </span>
          </div>
          <div className={`flex flex-col gap-2 relative w-32`}>
            <span className={`text-gray-300 font-wsans font-medium`}>
              Sell Price
            </span>
            <div className={`w-full h-full relative`}>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={`text-sm w-full h-full pr-8 bg-gray-850 px-4 p-2 rounded-2xl font-medium font-poppins focus:outline-none focus:ring-2 ring-0 ring-indigo-500 transition-all`}
                onBlur={() => {
                  if (typeof price === "string") {
                    if (price.length === 0) {
                      setPrice(0);
                    } else {
                      setPrice(parseInt(price) || 0);
                    }
                  }
                }}
              />
              <span
                className={`absolute top-1/2 -translate-y-1/2 right-1 text-gray-400 p-2 rounded-2xl text-xs`}
              >
                円
              </span>
            </div>
          </div>
        </div>
        <div
          className={`flex flex-col gap-4 p-4 w-full bg-gray-850 rounded-2xl`}
        >
          {rewards.map((rwd, i) => (
            <BundleItemEntry
              reward={rwd}
              guildID={props.guild}
              onDelete={() => {
                setRewards(rewards.filter((_, index) => index !== i));
              }}
              editing
              key={`createbundlerewardentry-${i}`}
            />
          ))}
          <div
            className={`flex flex-row gap-3 p-2 w-full bg-gray-800/50 hover:bg-gray-750 transition-all cursor-pointer items-center px-4 rounded-xl text-gray-50/50 py-3`}
            onClick={() => {
              setNewReward(true);
            }}
          >
            <PlusCircleIcon className={`h-6 w-6`} />
            <span className={`font-wsans`}>Add Action</span>
          </div>
        </div>
        <NewBundleRewardModal
          open={newReward}
          onClose={() => setNewReward(false)}
          guildID={props.guild}
          onAdd={(action) => {
            setRewards([...rewards, action]);
          }}
        />
        <div className={`flex flex-col gap-2 relative`}>
          <span className={`text-gray-300 font-wsans font-medium`}>
            Bundle Description
          </span>
          <textarea
            className="text-gray-300 bg-gray-850 p-4 rounded-2xl font-medium font-wsans focus:outline-none resize-none h-40 focus:ring-2 ring-0 ring-indigo-500 transition-all"
            value={cardDescription}
            onChange={(e) =>
              setCardDescription(e.target.value.substring(0, 200))
            }
          />
          <span
            className={`absolute bottom-0 right-0 text-gray-400 bg-gray-850/90 p-2 rounded-2xl text-xs`}
          >
            {cardDescription.length}/200
          </span>
        </div>

        <div className={`flex flex-row gap-4 justify-start w-full`}>
          <button
            className={`rounded-2xl px-4 py-2 border border-gray-50/10 w-fit bg-gray-50/5 flex flex-row gap-2 items-center hover:bg-indigo-500 hover:border-transparent transition-all`}
            onClick={async () => {
              if (updating) return;
              setUpdating(true);
              const res = await fetcher(
                `${await getGuildShardURL(
                  guild as string
                )}/guilds/${guild}/shop/items`,
                {
                  method: "POST",
                  body: JSON.stringify({
                    name: cardName,
                    description: cardDescription,
                    price,
                    items: rewards,
                  }),
                }
              ).then((x) => x.json());
              if (res.error) {
                setError(res.error);
                setUpdating(false);
                return;
              } else {
                router.replace(router.asPath);
                setUpdating(false);
                onClose();
              }
            }}
          >
            Create Bundle
          </button>
          {/* add revert button muted text button */}
        </div>
      </div>
    </>
  );
};
