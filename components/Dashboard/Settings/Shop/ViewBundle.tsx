import {
  ExclamationTriangleIcon,
  PencilIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetcher } from "../../../../utils/discordFetcher";
import { getGuildShardURL } from "../../../../utils/ShardLib";
import {
  BundleItem,
  CardRarity,
  CardType,
  rarityGradientMap,
  rarityWordMap,
  ShopItem,
} from "../../../../utils/types";
import SelectMenu from "../../../Misc/SelectMenu";
import { BundleItemEntry } from "./BundleItemEntry";
import { NewBundleRewardModal } from "./NewBundleRewardModal";

export const ViewBundle = (props: {
  bundle: ShopItem;
  guild: string;
  onSave: () => Promise<void>;
}) => {
  const { bundle, onSave } = props;
  const [editMode, setEditMode] = useState(false);
  const [bundleName, setBundleName] = useState(bundle.name);
  const [rewards, setRewards] = useState<BundleItem[]>(bundle.items);
  const [newReward, setNewReward] = useState(false);
  const [bundleDescription, setBundleDescription] = useState(
    bundle.description
  );
  const [bundlePrice, setBundlePrice] = useState(
    bundle.price as number | string
  );
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  useEffect(() => {
    setBundleName(bundle.name);
    setBundleDescription(bundle.description);
  }, [bundle, editMode]);

  return editMode ? (
    <div
      className={`flex flex-col gap-6 border mt-6 p-8 rounded-3xl border-gray-100/10 bg-gray-800 shadow-md ${
        updating && `opacity-50 animate-pulse pointer-events-none`
      } transition-all`}
    >
      <div className={`flex flex-row justify-between items-start z-20`}>
        <span className={`text-gray-700 font-wsans`}>
          Bundle ID: {bundle._id as string}
        </span>

        {/* <span
          className={`text-2xl font-wsans font-bold uppercase bg-gradient-to-r ${
            rarityGradientMap[bundle.rarity]
          } animate-gradient-medium leading-loose bg-clip-text text-transparent `}
        >
          {rarityWordMap[bundle.rarity]}
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
            Card Name
          </span>
          <input
            type="text"
            value={bundleName}
            onChange={(e) => setBundleName(e.target.value.substring(0, 40))}
            className={`text-3xl bg-gray-850 px-4 p-2 rounded-2xl font-medium font-poppins focus:outline-none focus:ring-2 ring-0 ring-indigo-500 transition-all`}
          />
          <span
            className={`absolute bottom-0 right-0 text-gray-400 bg-gray-850/90 p-2 rounded-2xl text-xs`}
          >
            {bundleName.length}/40
          </span>
        </div>
        <div className={`flex flex-col gap-2 relative w-32`}>
          <span className={`text-gray-300 font-wsans font-medium`}>Price</span>
          <div className={`w-full h-full relative`}>
            <input
              type="text"
              value={bundlePrice}
              onChange={(e) => setBundlePrice(e.target.value)}
              className={`text-sm w-full h-full pr-8 bg-gray-850 px-4 p-2 rounded-2xl font-medium font-poppins focus:outline-none focus:ring-2 ring-0 ring-indigo-500 transition-all`}
              onBlur={() => {
                if (typeof bundlePrice === "string") {
                  if (bundlePrice.length === 0) {
                    setBundlePrice(0);
                  } else {
                    setBundlePrice(parseInt(bundlePrice) || 0);
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
      <div className={`flex flex-col gap-4 p-4 w-full bg-gray-850 rounded-2xl`}>
        {rewards.map((rwd, i) => (
          <BundleItemEntry
            reward={rwd}
            guildID={props.guild}
            onDelete={() => {
              setRewards(rewards.filter((_, index) => index !== i));
            }}
            editing
            key={`editbundlerewardentry-${i}`}
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
          value={bundleDescription}
          onChange={(e) =>
            setBundleDescription(e.target.value.substring(0, 200))
          }
        />
        <span
          className={`absolute bottom-0 right-0 text-gray-400 bg-gray-850/90 p-2 rounded-2xl text-xs`}
        >
          {bundleDescription.length}/200
        </span>
      </div>

      <div className={`flex flex-row gap-4 justify-start w-full`}>
        <button
          className={`rounded-2xl px-4 py-2 border border-gray-50/10 w-fit bg-gray-50/5 flex flex-row gap-2 items-center hover:bg-indigo-500 hover:border-transparent transition-all`}
          onClick={async () => {
            if (updating) return;
            setUpdating(true);
            const res = await fetcher(
              `${await getGuildShardURL(bundle.guildID as string)}/guilds/${
                bundle.guildID
              }/shop/items/${bundle._id as string}`,
              {
                method: "PATCH",
                body: JSON.stringify({
                  name: bundleName,
                  description: bundleDescription,
                  price: bundlePrice,
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
              onSave();
            }
          }}
        >
          Save Changes
        </button>
        {/* add revert button muted text button */}
        <button
          className={`rounded-2xl text-gray-500 hover:text-gray-50 px-4 py-2 w-fit flex flex-row gap-2 items-center hover:bg-red-500 hover:border-transparent transition-all`}
          onClick={() => setEditMode(false)}
        >
          Revert Changes
        </button>
      </div>
    </div>
  ) : (
    <div
      className={`flex flex-col gap-6 border mt-6 p-8 rounded-3xl border-gray-100/10 bg-gray-800 shadow-md`}
    >
      <div className={`flex flex-row justify-between items-center -mt-2 -mb-4`}>
        <span className={`text-gray-500 font-wsans`}>
          Bundle ID: {bundle._id as string}
        </span>
      </div>
      <h1 className={`text-4xl font-poppins font-extrabold`}>{bundle.name}</h1>
      <span
        className={`text-gray-400 font-wsans text-xl p-4 border border-gray-50/10 rounded-2xl`}
      >
        {bundle.description}
      </span>
      <div
        className={`flex flex-row gap-4 ${
          bundle.price ? "justify-between" : "justify-end"
        } w-full items-center`}
      >
        {bundle.price && (
          <span className={`text-gray-100/50 font-wsans text-sm`}>
            Sells for{" "}
            <b className={`text-base text-gray-300`}>{bundle.price} 円</b>
          </span>
        )}
        <button
          className={`rounded-2xl px-4 py-2 border border-gray-50/10 w-fit bg-gray-50/5 flex flex-row gap-2 items-center hover:bg-indigo-500 hover:border-transparent transition-all`}
          onClick={() => setEditMode(true)}
        >
          <PencilIcon className="w-5 h-5" /> Edit Card
        </button>
      </div>
    </div>
  );
};
