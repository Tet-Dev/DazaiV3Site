import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useGuildData } from "../../../../utils/hooks/useGuildData";
import { getGuildShardURL } from "../../../../utils/ShardLib";
import {
  CardRarity,
  CardType,
  CrateTemplate,
  LevelUpRewardCardActionType,
  LevelUpRewardCrateActionType,
  LevelUpRewardRoleActionType,
  rarityGradientMap,
} from "../../../../utils/types";

const numberToHex = (num: number) => {
  return num.toString(16).padStart(2, "0");
};

export const LevelUpRewardActionRole = (props: {
  action: LevelUpRewardRoleActionType;
  guildID: string;
}) => {
  const { action, guildID } = props;
  const guildData = useGuildData(guildID);
  return (
    <div className={`bg-gray-900 px-4 py-1 rounded-3xl relative group `}>
      <div className={`flex flex-row gap-2 items-center`}>
        <span className={`text-gray-300 font-bold text-sm`}>Role</span>

        {guildData?.roles ? (
          <span
            className={`text-base border rounded-full px-2 p-0.5`}
            style={{
              color: `#${numberToHex(
                guildData.roles?.find((r) => r.id === action.roleID)?.color ?? 0
              )}`,
              borderColor: `#${numberToHex(
                guildData.roles?.find((r) => r.id === action.roleID)?.color ?? 0
              )}`,
            }}
          >
            @{guildData.roles.find((r) => r.id === action.roleID)?.name}
          </span>
        ) : (
          <span
            className={`w-32 h-full bg-gray-700 text-gray-700 animate-pulse rounded-full px-4`}
          >
            @Loading
          </span>
        )}
      </div>
    </div>
  );
};

export const LevelUpRewardActionCrate = (props: {
  action: LevelUpRewardCrateActionType;
  guildID: string;
}) => {
  const { action, guildID } = props;
  const [crate, setCrate] = useState(null as null | CrateTemplate | undefined);
  const router = useRouter();
  useEffect(() => {
    fetch(
      `${getGuildShardURL(guildID)}/guilds/${guildID}/settings/crate/${
        action.crateID
      }`
    )
      .then((res) => res.json())
      .then(setCrate);
  }, [action.crateID]);
  return (
    <div
      className={`bg-gray-900 px-4 rounded-3xl relative group cursor-pointer hover:bg-gray-750 transition-all p-1`}
      onClick={() => {
        if (crate) {
          router.push(`/app/guild/${guildID}/settings/crates?c=${crate._id}`);
        }
      }}
    >
      <div className={`flex flex-row gap-2 items-center`}>
        <span className={`text-gray-300 font-bold`}>x{action.count}</span>
        <span
          className={`font-bold text-lg ${
            !crate &&
            "animate-pulse bg-gray-800 w-32 h-full text-gray-800 rounded-full"
          }`}
        >
          {crate?.name ?? "Loading"}
        </span>
      </div>
      {/* <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[calc(100%+0.5rem)] w-max bg-black p-2 rounded-xl pointer-events-none group-hover:scale-100 scale-0 origin-top transition-all font-poppins font-bold z-30`}
      >
        Kawaii Kimiko
      </div> */}
    </div>
  );
};
export const LevelUpRewardActionCard = (props: {
  action: LevelUpRewardCardActionType;
  guildID: string;
}) => {
  const { action, guildID } = props;
  const [card, setCard] = useState(null as null | CardType | undefined);
  const router = useRouter();
  useEffect(() => {
    fetch(
      `${getGuildShardURL(guildID)}/guilds/${guildID}/settings/cards/${
        action.cardID
      }`
    )
      .then((res) => res.json())
      .then(setCard);
  }, [action.cardID]);
  return (
    <div
      className={`bg-gray-900 px-4 rounded-3xl relative group cursor-pointer hover:bg-gray-750 transition-all p-1`}
      onClick={() => {
        if (card) {
          router.push(
            `/app/guild/${guildID}/settings/rankcards?card=${card._id}`
          );
        }
      }}
    >
      <div className={`flex flex-row gap-2 items-center`}>
        <span className={`text-gray-300 font-bold`}>x{action.count}</span>
        <span
          className={`font-bold text-lg ${
            !card &&
            "animate-pulse bg-gray-800 w-32 h-full text-gray-800 rounded-full"
          }`}
        >
          {card?.name ?? "Loading"}
        </span>
      </div>
      {/* <div
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[calc(100%+0.5rem)] w-max bg-black p-2 rounded-xl pointer-events-none group-hover:scale-100 scale-0 origin-top transition-all font-poppins font-bold z-30`}
        >
          Kawaii Kimiko
        </div> */}
    </div>
  );
};
