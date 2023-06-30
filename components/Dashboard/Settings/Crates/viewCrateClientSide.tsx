import { Switch } from "@headlessui/react";
import {
  ExclamationTriangleIcon,
  PencilIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { fetcher } from "../../../../utils/discordFetcher";
import { getGuildShardURL } from "../../../../utils/ShardLib";
import {
  CardRarity,
  CardType,
  CrateTemplate,
  rarityGradientMap,
  rarityValue,
} from "../../../../utils/types";
import { Modal } from "../../../Modal";
import { SettingsCardRenderer } from "./CardRenderer";
export const ViewCrateClientside = (props: {
  crate: CrateTemplate;
  cards: CardType[];
  onSave: () => Promise<void>;
}) => {
  const { crate, onSave } = props;
  const [editMode, setEditMode] = useState(false);
  const [crateName, setCrateName] = useState(crate.name);
  const [crateDescription, setCrateDescription] = useState(crate.description);
  const [crateItems, setCrateItems] = useState(crate.items);
  const [crateDropRates, setCrateDropRates] = useState(
    crate.dropRates as {
      [key in CardRarity]: number | string;
    }
  );

  const [showDrops, setShowDrops] = useState(false);
  const [showRates, setShowRates] = useState(false);
  const [showCrateDetails, setShowCrateDetails] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const cardMap = useMemo(() => {
    const map = new Map<string, CardType>();
    props.cards.forEach((card) => {
      map.set(card._id as string, card);
    });
    return map;
  }, [props.cards]);
  const [selectCardModalVisible, setSelectCardModalVisible] = useState(false);
  useEffect(() => {
    setCrateName(crate.name);
    setCrateDescription(crate.description);
    setCrateItems(crate.items);
    setCrateDropRates(crate.dropRates);
    setShowDrops(!!crate.showDrops);
    setShowRates(!!crate.showRates);
    setShowCrateDetails(!!crate.showCrateDetails);
  }, [crate, editMode]);

  return (
    <div
      className={`flex flex-col gap-6 border mt-6 p-8 rounded-3xl border-gray-100/10 bg-gray-800 shadow-md`}
    >
      <div className={`flex flex-row justify-between items-center -mt-2 -mb-4`}>
        <span className={`text-gray-500 font-wsans`}>
          Crate Template ID: {crate._id.toString()}
        </span>
      </div>
      <h1 className={`text-4xl font-poppins font-extrabold`}>{crateName}</h1>
      <div className={`flex flex-col justify-center items-center`}></div>
      <span
        className={`text-gray-400 font-wsans text-xl p-4 border border-gray-50/10 rounded-2xl`}
      >
        {crateDescription}
      </span>
      <div
        className={`flex flex-col gap-4 p-6 bg-gray-850 shadow-inner rounded-3xl `}
      >
        <span className={`text-gray-300 font-wsans font-medium text-xl`}>
          Drop Rates
        </span>
        {crateDropRates.common !== -1 ? (
          <div
            className={`grid grid-cols-3 xl:grid-cols-2 gap-4 place-items-end`}
          >
            <div className={`flex flex-row gap-2 items-center`}>
              <span
                className={`font-wsans font-bold text-base text-transparent bg-gradient-to-r ${
                  rarityGradientMap[CardRarity.SECRET_RARE]
                } animate-gradient-medium bg-clip-text leading-loose`}
              >
                Secret Rare
              </span>
              <span
                className={`text-xl font-bold p-1.5 px-3 bg-gray-850 rounded-xl shadow-inner`}
              >
                {crateDropRates.secret_rare ?? 0}%
              </span>
            </div>
            <div className={`flex flex-row gap-2 items-center`}>
              <span
                className={`font-wsans font-bold text-base text-transparent bg-gradient-to-r ${
                  rarityGradientMap[CardRarity.COMMON]
                } animate-gradient-medium bg-clip-text leading-loose`}
              >
                Common
              </span>
              <span
                className={`text-xl font-bold p-1.5 px-3 bg-gray-850 rounded-xl shadow-inner`}
              >
                {crateDropRates.common ?? 0}%
              </span>
            </div>

            <div className={`flex flex-row gap-2 items-center`}>
              <span
                className={`font-wsans font-bold text-base text-transparent bg-gradient-to-r ${
                  rarityGradientMap[CardRarity.RARE]
                } animate-gradient-medium bg-clip-text leading-loose`}
              >
                Rare
              </span>
              <span
                className={`text-xl font-bold p-1.5 px-3 bg-gray-850 rounded-xl shadow-inner`}
              >
                {crateDropRates.rare ?? 0}%
              </span>
            </div>

            <div className={`flex flex-row gap-2 items-center`}>
              <span
                className={`font-wsans font-bold text-base text-transparent bg-gradient-to-r ${
                  rarityGradientMap[CardRarity.SUPER_RARE]
                } animate-gradient-medium bg-clip-text leading-loose`}
              >
                Super Rare
              </span>
              <span
                className={`text-xl font-bold p-1.5 px-3 bg-gray-850 rounded-xl shadow-inner`}
              >
                {crateDropRates.super_rare ?? 0}%
              </span>
            </div>

            <div className={`flex flex-row gap-2 items-center`}>
              <span
                className={`font-wsans font-bold text-base text-transparent bg-gradient-to-r ${
                  rarityGradientMap[CardRarity.EPIC]
                } animate-gradient-medium bg-clip-text leading-loose`}
              >
                Epic
              </span>
              <span
                className={`text-xl font-bold p-1.5 px-3 bg-gray-850 rounded-xl shadow-inner`}
              >
                {crateDropRates.epic ?? 0}%
              </span>
            </div>

            <div className={`flex flex-row gap-2 items-center`}>
              <span
                className={`font-wsans font-bold text-base text-transparent bg-gradient-to-r ${
                  rarityGradientMap[CardRarity.MYTHIC]
                } animate-gradient-medium bg-clip-text leading-loose`}
              >
                Mythic
              </span>
              <span
                className={`text-xl font-bold p-1.5 px-3 bg-gray-850 rounded-xl shadow-inner`}
              >
                {crateDropRates.mythic ?? 0}%
              </span>
            </div>

            <div className={`flex flex-row gap-2 items-center`}>
              <span
                className={`font-wsans font-bold text-base text-transparent bg-gradient-to-r ${
                  rarityGradientMap[CardRarity.LEGENDARY]
                } animate-gradient-medium bg-clip-text leading-loose`}
              >
                Legendary
              </span>
              <span
                className={`text-xl font-bold p-1.5 px-3 bg-gray-850 rounded-xl shadow-inner`}
              >
                {crateDropRates.legendary}%
              </span>
            </div>

            <div className={`flex flex-row gap-2 items-center`}>
              <span
                className={`font-wsans font-bold text-base text-transparent bg-gradient-to-r ${
                  rarityGradientMap[CardRarity.EVENT_RARE]
                } animate-gradient-medium bg-clip-text leading-loose`}
              >
                Event Rare
              </span>
              <span
                className={`text-xl font-bold p-1.5 px-3 bg-gray-850 rounded-xl shadow-inner`}
              >
                {crateDropRates.event_rare ?? 0}%
              </span>
            </div>
          </div>
        ) : (
          <div className={`flex flex-row gap-2 items-center justify-center`}>
            <span className={`text-gray-500 font-wsans text-lg -mt-2`}>
              Drop Rates unknown
            </span>
          </div>
        )}
      </div>
      <div
        className={`flex flex-col gap-4 p-6 bg-gray-850 rounded-3xl shadow-inner`}
      >
        <span className={`text-gray-300 font-wsans font-medium text-xl`}>
          Potential Crate Items
        </span>
        <div className={`flex flex-row flex-wrap justify-center`}>
          {crate.items.length ? (
            crate.items
              .map((id) => cardMap.get(id)!)
              .sort((a, b) => rarityValue[a.rarity] - rarityValue[b.rarity])
              .map((card) => (
                <SettingsCardRenderer
                  card={card}
                  key={`crate-item-view-${card._id}`}
                  hideEdit
                />
              ))
          ) : (
            <span className={`text-gray-500 font-wsans text-lg -mt-2`}>
              Crate items unknown
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
