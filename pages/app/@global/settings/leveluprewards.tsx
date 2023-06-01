import {
  PencilIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { GetServerSideProps } from "next";
import { useState } from "react";
import { LevelUpRewardCreate } from "../../../../components/Dashboard/Settings/LevelupRewards/LevelUpRewardCreate";
import { LevelUpRewardEntry } from "../../../../components/Dashboard/Settings/LevelupRewards/LevelUpRewardEntry";
import { getGuildShardURL } from "../../../../utils/ShardLib";
import {
  Rarity,
  CardType,
  LevelUpRewardType,
} from "../../../../utils/types";
const numberToHex = (num: number) => {
  return num.toString(16).padStart(2, "0");
};
export const LevelUpRewards = (props: {
  guildID: string;
  rewards: LevelUpRewardType[];
}) => {
  const { guildID, rewards: rwds } = props;
  const [rewards, setRewards] = useState(rwds);
  const [creating, setCreating] = useState(false);
  return (
    <div
      className={`flex flex-col gap-2 items-center justify-center h-screen w-full`}
    >
      <div
        className={`flex flex-col gap-12 py-8 w-full max-w-prose h-full overflow-auto`}
      >
        <div className={`flex flex-col gap-6`}>
          <h1 className={`text-3xl font-bold font-poppins`}>
            Voting Streak Rewards
          </h1>
          <span className={`text-gray-400 font-wsans`}>
            Set voting rewards to incentivize your members to level up and gain
            new cool cosmetics!
          </span>
        </div>
        <div className={`flex flex-col gap-6`}>
          {rewards.map((x, i) => (
            <LevelUpRewardEntry
              reward={x}
              index={i}
              onDelete={(index) => {
                console.log(index);
              }}
              onEdit={(index, reward) => {
                console.log(index, reward);
                setRewards([
                  ...rewards.slice(0, index),
                  reward,
                  ...rewards.slice(index + 1),
                ]);
              }}
              key={`reward-renderer-${x._id}`}
            />
          ))}
          {creating ? (
            <LevelUpRewardCreate
              guildID={guildID}
              onCancel={() => {
                setCreating(false);
              }}
              onCreate={(reward) => {
                setCreating(false);
                setRewards([...rewards, reward]);
              }}
            />
          ) : (
            <div
              className={`flex flex-row gap-12 items-start p-4 border border-gray-100/10 border-dashed rounded-3xl hover:bg-gray-750 cursor-pointer transition-all text-gray-200/50 hover:text-gray-200`}
              onClick={() => {
                setCreating(true);
              }}
            >
              <div
                className={`flex flex-row gap-4 w-full  font-wsans font-medium text-lg items-center justify-center`}
              >
                <PlusCircleIcon className={`h-8 w-8`} />
                <span className={``}>Create New Reward</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export const getServerSideProps: GetServerSideProps = async (context) => {
  const guildID = `@global`

  const levelRewards = await fetch(
    `${getGuildShardURL(guildID)}/guilds/${guildID}/settings/levelrewards`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then((x) => x.json());
  const rewards = [
    {
      _id: "19",
      type: "atLevel",
      level: 10,
      name: "Level 10 Reward",
      guildID: `808465183767920650`,
      rewards: [
        {
          action: "add",
          type: "crate",
          count: 1,
          crateID: "64055d223f7afebf6ae748db",
        },
        {
          action: "add",
          type: "role",
          roleID: "956004676212523029",
        },
        {
          action: "add",
          type: "card",
          cardID: "63e75a1f0435f8abad939f81",
          count: 1,
        },
      ],
    },
    {
      _id: "20",
      type: "everyNLevels",
      everyNLevel: 5,
      offset: 0,
      name: "Every 5 Levels",
      guildID: `808465183767920650`,
      rewards: [
        {
          action: "add",
          type: "crate",
          count: 1,
          crateID: "64055d223f7afebf6ae748db",
        },
      ],
    },
  ] as LevelUpRewardType[];
  //   cards.push({
  //     _id: "63e3f70bf538f8e190963d88",
  //     name: "Sunset Dazai",
  //     description: "Dazai with a sunset background",
  //     url: "https://assets.dazai.app/cards/_default/ani_dazai.gif",
  //     rarity: Rarity.LEGENDARY,
  //   });
  //   cards.push({
  //     _id: "63e3f70bf538f8e190963d8f",
  //     name: "Dazai Thousand",
  //     description: "The 1000 server milestone celebration card",
  //     url: "https://assets.dazai.app/cards/_default/dazai1000.png",
  //     rarity: Rarity.EVENT_RARE,
  //   });
  return {
    props: {
      guildID,
      rewards: levelRewards,
    },
  };
};
export default LevelUpRewards;
