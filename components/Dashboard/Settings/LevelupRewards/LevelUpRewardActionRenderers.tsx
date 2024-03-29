import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetcher } from "../../../../utils/discordFetcher";
import { useGuildData } from "../../../../utils/hooks/useGuildData";
import { useAPIProp } from "../../../../utils/hooks/useProp";
import { getGuildShardURL } from "../../../../utils/ShardLib";
import {
  CardRarity,
  CardType,
  Crate,
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
  const router = useRouter();
  const [crate, updateCrate] = useAPIProp<CrateTemplate>({
    APIPath: `/guilds/${guildID}/settings/crate/${action.crateID}?reveal=1`,
    guildID,
    cacheable: true,
  });
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
  const router = useRouter();
  const [card, updateCard] = useAPIProp<CardType>({
    APIPath: `/guilds/${guildID}/settings/cards/${action.cardID}?revealsecretrarecards=1`,
    guildID,
    cacheable: true,
  });

  return (
    <div
      className={`bg-gray-900 px-4 rounded-3xl relative group cursor-pointer hover:bg-gray-750 transition-all p-1`}
      onClick={() => {
        if (card) {
          router.push(
            `/app${
              guildID !== `@global` ? `/guild` : ``
            }/${guildID}/settings/rankcards?card=${card._id}`
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
