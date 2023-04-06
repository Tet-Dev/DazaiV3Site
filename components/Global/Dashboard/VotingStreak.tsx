import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { clientID } from "../../../utils/constants";
import { useDiscordUser } from "../../../utils/hooks/useDiscordUser";
import { useAPIProp } from "../../../utils/hooks/useProp";
import {
  LevelUpAtLevelRewardType,
  LevelUpEveryNLevelsRewardType,
  LevelUpRewardActionType,
  LevelUpRewardType,
  UserData,
} from "../../../utils/types";
import { LevelUpRewardActionEntry } from "../../Dashboard/Settings/LevelupRewards/LevelUpRewardActionEntry";
import { Modal } from "../../Modal";
import { VoteRewardEntry } from "./VoteRewardRender";
const calculateTimeLeftToNextVote = (lastVote: number) => {
  const now = Date.now();
  const timeSinceLastVote = now - lastVote;
  const timeLeftToNextVote = 12 * 60 * 60 * 1000 - timeSinceLastVote;
  // return in hh:mm:ss format
  const hours = Math.floor(timeLeftToNextVote / (60 * 60 * 1000));
  const minutes = Math.floor(
    (timeLeftToNextVote - hours * 60 * 60 * 1000) / (60 * 1000)
  );
  const seconds = Math.floor(
    (timeLeftToNextVote - hours * 60 * 60 * 1000 - minutes * 60 * 1000) / 1000
  );
  // pad with 0s
  const hoursStr = hours.toString().padStart(2, "0");
  const minutesStr = minutes.toString().padStart(2, "0");
  const secondsStr = seconds.toString().padStart(2, "0");
  return `${hoursStr}:${minutesStr}:${secondsStr}`;
};

const calculateRewardAtLevel = (
  level: number,
  rewards: LevelUpRewardType[]
) => {
  let totalRewards = [] as LevelUpRewardActionType[];
  // only get rewards that are either at the level or if its an interval, the level is a multiple of the interval - offset
  let filteredRewards = rewards.filter((x) => {
    console.log("calculating reward at level", level, x);
    if (x.type === "atLevel" && (x as LevelUpAtLevelRewardType).level === level)
      return true;
    let rwd = x as LevelUpEveryNLevelsRewardType;
    let offset = rwd.offset || 0;
    return (level - offset) % rwd.everyNLevel === 0;
  });
  filteredRewards.forEach((x) => {
    totalRewards = totalRewards.concat(x.rewards);
  });
  return totalRewards;
};
const getRewardAtLevelsInInterval = (
  startLevel: number,
  endLevel: number,
  rewards: LevelUpRewardType[]
) => {
  let totalRewards = [] as {
    level: number;
    rewards: LevelUpRewardActionType[];
  }[];
  const levelRewardMap = new Map<number, LevelUpRewardActionType[]>();
  const addLevelReward = (level: number, reward: LevelUpRewardActionType[]) => {
    if (levelRewardMap.has(level)) {
      levelRewardMap.set(level, [
        ...(levelRewardMap.get(level) || []),
        ...reward,
      ]);
    } else {
      levelRewardMap.set(level, reward);
    }
  };

  //   for every reward, if its an at level reward, add it to the map
  //   if its an every n levels reward, add it to the map for every level in the interval
  for (let i = 0; i < rewards.length; i++) {
    const reward = rewards[i];
    if (
      reward.type === "atLevel" &&
      (reward as LevelUpAtLevelRewardType).level
    ) {
      addLevelReward(
        (reward as LevelUpAtLevelRewardType).level,
        reward.rewards
      );
    }
    if ((reward as LevelUpEveryNLevelsRewardType).everyNLevel) {
      let rwd = reward as LevelUpEveryNLevelsRewardType;
      // we start at the closest multiple of the interval past the start level + offset
      let offset = rwd.offset || 0;
      let offsettedLevel = startLevel - offset;
      let closestMultiple =
        Math.ceil(offsettedLevel / rwd.everyNLevel) * rwd.everyNLevel;
      let closestMultiplePastStartLevel = closestMultiple + offset;
      for (
        let j = closestMultiplePastStartLevel;
        j <= endLevel;
        j += rwd.everyNLevel
      ) {
        addLevelReward(j, reward.rewards);
      }
    }
  }
  // return the map as an array
  return Array.from(levelRewardMap.entries())
    .map((x) => {
      return { level: x[0], rewards: x[1] };
    })
    .sort((a, b) => a.level - b.level);
};

export const VotingStreak = () => {
  const [rewards, updateRewards] = useAPIProp<LevelUpRewardType[]>(
    `/guilds/@global/settings/levelrewards`
  );
  const userData = useDiscordUser();
  const rewardArray = useMemo(() => {
    if (!userData || !(userData as UserData).userID) return [];

    // get starting 0 to current level + 20
    return getRewardAtLevelsInInterval(1, 30, rewards || []);
  }, [userData, rewards]);
  const rewardAtLevel = useMemo(() => {
    if (!userData || !(userData as UserData).userID) return [];
    return calculateRewardAtLevel(
      (userData as UserData).currentStreak + 1,
      rewards || []
    );
  }, [userData, rewards]);
  const [viewAll, setViewAll] = useState(false);
  useEffect(() => {
    if (viewAll && userData && (userData as UserData).userID) {
      setTimeout(() => {
        document
          .getElementById(
            `levelupreward${(userData as UserData).currentStreak + 1}`
          )
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 150);
    }
    return () => {};
  }, [viewAll, userData]);
  const [forceUpdate, setForceUpdate] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setForceUpdate((x) => x + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [forceUpdate]);

  return (
    <>
      <div className={`flex flex-col gap-2`}>
        {/* <h2 className={`text-lg font-bold font-poppins text-gray-100/20`}>
      Voting Rewards
    </h2> */}
        <div
          className={`rounded-3xl bg-gray-800 w-full p-8 flex flex-col gap-8`}
        >
          <div className={`flex flex-col gap-2`}>
            <div className={`flex flex-row md:flex-col gap-2 justify-between`}>
              <h3
                className={`text-2xl md:text-lg font-bold font-poppins text-gray-100`}
              >
                Upcoming Rewards
              </h3>
              <span
                className={`leading-relaxed bg-gradient-to-br from-indigo-300 to-purple-400 text-2xl font-wsans font-black text-transparent bg-clip-text w-fit`}
              >
                {(userData as UserData).currentStreak} Votes
              </span>
            </div>

            <span className={`text-gray-500 text-base `}>
              Unlock these rewards by voting one more time!
            </span>
            <div
              className={`grid grid-cols-2 md:grid-cols-1 md:grid-rows-2 gap-4 p-6 bg-gray-900 rounded-3xl overflow-hidden`}
              style={{
                gridTemplateRows: `repeat(${Math.ceil(
                  rewardAtLevel.length / 2
                )}, 1fr)`,
              }}
            >
              {rewardAtLevel.map((x, i) => (
                <VoteRewardEntry
                  action={x}
                  key={`leveluprewardactionentry0-${i}`}
                />
              ))}
            </div>
          </div>
          <div className={`flex flex-row justify-end gap-4`}>
            <div
              className={`flex flex-row gap-4 grow justify-between sm:justify-evenly items-center`}
            >
              {/* <Link href={"/app/@global"}> */}
              <button
                className={`py-3 px-6 lg:px-4 w-fit lg:py-2 lg:text-base md:text-xs md:py-1.5 md:px-3 rounded-full font-bold text-lg text-white bg-indigo-500 hover:bg-indigo-900 transition-all shadow-lg pointer-events-auto disabled:opacity-50 disabled:cursor-not-allowed`}
                onClick={() => {
                  window.open(
                    `https://top.gg/bot/747901310749245561/vote`,
                    "_blank",
                    "noopener,noreferrer,width=625,height=970"
                  );
                }}
                disabled={((userData as UserData)?.lastVote || 0) > Date.now()}
              >
                Vote
                {(userData as UserData)?.userID &&
                  ((userData as UserData)?.lastVote || 0) >= Date.now() &&
                  `(${calculateTimeLeftToNextVote(
                    (userData as UserData).lastVote
                  )}`}
              </button>
              {/* </Link> */}
              <button
                className={`py-2 px-4 rounded-full font-medium text-sm text-white border border-gray-100/10 hover:bg-indigo-900 transition-all pointer-events-auto`}
                onClick={() => {
                  setViewAll(!viewAll);
                }}
              >
                View All Rewards
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal visible={viewAll} onClose={() => setViewAll(false)} hideBG>
        <div
          className={`flex flex-col gap-8 w-[65ch] max-w-[90vw] p-8 rounded-3xl bg-gray-850 h-fit max-h-[90vh] overflow-auto`}
        >
          <h2 className={`text-3xl font-bold font-poppins text-gray-100`}>
            All Voting Streak Rewards
          </h2>
          <div className="flex flex-col gap-4 grow overflow-auto p-2">
            {rewardArray.map((x, i) => (
              <div
                className={`flex flex-col gap-2 ${
                  x.level < (userData as UserData).currentStreak + 1
                    ? "opacity-50"
                    : ""
                }`}
                key={`levelupreward${i}`}
                id={`levelupreward${x.level}`}
              >
                <h3 className={`text-2xl font-bold font-poppins text-gray-100`}>
                  {x.level} Vote{x.level === 1 ? "" : "s"}
                </h3>
                <div
                  className={`grid grid-cols-2 md:grid-cols-1 md:grid-rows-2 gap-4 p-6 bg-gray-900 rounded-3xl overflow-hidden`}
                  style={{
                    gridTemplateRows: `repeat(${Math.ceil(
                      x.rewards.length / 2
                    )}, 1fr)`,
                  }}
                >
                  {x.rewards.map((y, j) => (
                    <VoteRewardEntry
                      action={y}
                      key={`leveluprewardactionentry${i}-${j}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
};
