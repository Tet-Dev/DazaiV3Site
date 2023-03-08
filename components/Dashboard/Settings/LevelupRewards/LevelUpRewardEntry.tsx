import { PencilIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { NotificationsClass } from "../../../../utils/classes/NotificationsClass";
import { fetcher } from "../../../../utils/discordFetcher";
import { getGuildShardURL } from "../../../../utils/ShardLib";
import {
  CardRarity,
  LevelUpRewardType,
  rarityGradientMap,
} from "../../../../utils/types";
import SelectMenu from "../../../Misc/SelectMenu";
import { LevelUpRewardActionEntry } from "./LevelUpRewardActionEntry";
import { LevelUpRewardActionRole } from "./LevelUpRewardActionRenderers";
import { NewRewardActionModal } from "./NewRewardActionModal";
const numberToHex = (num: number) => {
  return num.toString(16).padStart(2, "0");
};
export const LevelUpRewardEntry = (props: {
  reward: LevelUpRewardType;
  index: number;
  onDelete: (index: number) => void;
  onEdit: (index: number, reward: LevelUpRewardType) => void;
}) => {
  const { reward: initialRWD, index, onDelete, onEdit } = props;
  const [reward, setReward] = useState(
    initialRWD as LevelUpRewardType & {
      level?: number | string;
      everyNlevel?: number | string;
      offset?: number | string;
    }
  );
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [newAction, setNewAction] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setReward(initialRWD);
  }, [initialRWD]);
  return (
    <div
      className={`flex flex-row gap-16 items-start p-8 bg-gray-750 rounded-3xl  ${
        updating &&
        `animate-pulse opacity-50 cursor-not-allowed pointer-events-none`
      }`}
    >
      <div className={`flex flex-col gap-2 w-full`}>
        <div className={`flex flex-row gap-2 justify-between`}>
          {editing ? (
            <input
              className={`bg-gray-800 text-gray-200 font-poppins font-bold text-xl rounded-2xl p-2 px-4 !outline-none focus:ring ring-indigo-500 ring-0 transition-all w-full`}
              value={reward.name}
              onChange={(e) => {
                setReward({
                  ...reward,
                  name: e.target.value,
                });
              }}
            />
          ) : (
            <span className={`text-gray-200 font-poppins font-bold text-xl`}>
              {reward.name}
            </span>
          )}
          {!editing && (
            <div className={`flex flex-row gap-2 items-center`}>
              <div
                className={`p-1 px-3 border border-gray-100/30 flex flex-row gap-2 rounded-2xl items-center hover:bg-indigo-500 bg-gray-50/10 text-gray-50 cursor-pointer transition-all`}
                onClick={() => {
                  setEditing(true);
                }}
              >
                <PencilIcon className={`h-4 w-4`} />
                <span className={`font-wsans`}>Edit Reward</span>
              </div>
            </div>
          )}
        </div>
        {editing && (
          <div className={`flex flex-row gap-6 w-full p-4 bg-gray-850 rounded-2xl`}>
            <div className={`flex flex-col gap-2 grow`}>
              <span className={`text-gray-300 font-bold text-sm`}>
                Reward Frequency
              </span>
              <SelectMenu
                selectItems={[
                  {
                    id: "atLevel",
                    name: "Once, at a specific level (eg. Lv. 10)",
                  },
                  {
                    id: "everyNLevels",
                    name: "Every N levels where N is a number (eg. Every 5 Lvls. starting from Lv. 2)",
                  },
                ]}
                onSelect={(item) => {
                  setReward({
                    ...reward,
                    type: item.id as any,
                  });
                }}
                selectedItemId={
                  reward.type === "atLevel" ? "atLevel" : "everyNLevels"
                }
                overrideClasses={`w-full !bg-gray-800`}
              />
            </div>
          </div>
        )}
        <div className={`flex flex-col gap-1`}>
          <span
            className={`text-gray-400 font-wsans flex flex-row gap-1 items-center`}
          >
            {reward.type === "atLevel" ? (
              <>
                <span>When a user reaches</span>
                <span
                  className={`font-bold text-xl text-indigo-400 flex flex-row items-center gap-2`}
                >
                  Level{" "}
                  {editing ? (
                    <input
                      className={`bg-gray-800 text-gray-200 font-wsans font-medium text-sm rounded-xl p-1 px-3 !outline-none focus:ring ring-indigo-500 ring-0 transition-all w-16`}
                      value={reward.level}
                      onChange={(e) => {
                        // @ts-ignore
                        setReward({
                          ...reward,
                          level: e.target.value,
                        });
                      }}
                    />
                  ) : (
                    reward.level
                  )}
                </span>
              </>
            ) : (
              <>
                <span>Starting from level</span>
                <span className={`font-bold text-xl text-indigo-400`}>
                  {editing ? (
                    <input
                      className={`bg-gray-800 text-gray-200 font-wsans font-medium text-sm rounded-xl p-1 px-3 !outline-none focus:ring ring-indigo-500 ring-0 transition-all w-16`}
                      value={reward.offset}
                      onChange={(e) => {
                        setReward({
                          ...reward,
                          // @ts-ignore
                          offset: e.target.value,
                        });
                      }}
                    />
                  ) : (
                    reward.offset
                  )}
                </span>
                <span>, for every</span>
                <span className={`font-bold text-xl text-indigo-400`}>
                  {editing ? (
                    <input
                      className={`bg-gray-800 text-gray-200 font-wsans font-medium text-sm rounded-xl p-1 px-3 !outline-none focus:ring ring-indigo-500 ring-0 transition-all w-16`}
                      value={reward.everyNLevel}
                      onChange={(e) => {
                        setReward({
                          ...reward,
                          // @ts-ignore
                          everyNLevel: e.target.value,
                        });
                      }}
                    />
                  ) : (
                    reward.everyNLevel
                  )}{" "}
                  levels
                </span>
              </>
            )}
            ,
          </span>
          <span
            className={`text-gray-400 font-wsans flex flex-row gap-1 items-center`}
          >
            execute the following actions:
          </span>
        </div>
        <div
          className={`flex flex-col gap-4 p-4 w-full bg-gray-850 rounded-2xl`}
        >
          {reward.rewards.map((rwd, i) => (
            <LevelUpRewardActionEntry
              key={i}
              action={rwd}
              levelUpReward={reward}
              onDelete={() => {
                setReward({
                  ...reward,
                  rewards: reward.rewards.filter((_, index) => index !== i),
                });
              }}
              editing={editing}
            />
          ))}
          {editing && (
            <div
              className={`flex flex-row gap-3 p-2 w-full bg-gray-800/50 hover:bg-gray-750 transition-all cursor-pointer items-center px-4 rounded-xl text-gray-50/50 py-3`}
              onClick={() => {
                setNewAction(true);
              }}
            >
              <PlusCircleIcon className={`h-6 w-6`} />
              <span className={`font-wsans`}>Add Action</span>
            </div>
          )}
        </div>
        <NewRewardActionModal
          open={newAction}
          onClose={() => setNewAction(false)}
          guildID={reward.guildID}
          onAdd={(action) => {
            setReward({
              ...reward,
              rewards: [...reward.rewards, action],
            });
          }}
        />

        {editing && (
          <div className={`flex flex-row gap-2 items-center`}>
            <div
              className={`p-1 px-3 border border-gray-100/30 flex flex-row gap-2 rounded-2xl items-center hover:bg-indigo-500 bg-gray-50/10 text-gray-50 cursor-pointer transition-all`}
              onClick={async () => {
                setUpdating(true);
                if (reward.type === "atLevel") {
                  if (
                    isNaN(parseInt(reward.level as any as string)) ||
                    reward.level < 0
                  ) {
                    NotificationsClass.getInstance().addNotif({
                      type: "error",
                      message: "Level must be a positive number",
                      title: "Failed to update reward",
                    });
                    setUpdating(false);
                    return;
                  }
                  reward.level = parseInt(reward.level as any as string);
                } else {
                  if (
                    isNaN(parseInt(reward.offset as any as string)) ||
                    reward.offset < 0
                  ) {
                    NotificationsClass.getInstance().addNotif({
                      type: "error",
                      message: "Offset must be a positive number",
                      title: "Failed to update reward",
                    });
                    setUpdating(false);
                    return;
                  }
                  if (
                    isNaN(parseInt(reward.everyNLevel as any as string)) ||
                    reward.everyNLevel < 0
                  ) {
                    NotificationsClass.getInstance().addNotif({
                      type: "error",
                      message: "Every N Level must be a positive number",
                      title: "Failed to update reward",
                    });
                    setUpdating(false);
                    return;
                  }
                  reward.offset = parseInt(reward.offset as any as string);
                  reward.everyNLevel = parseInt(
                    reward.everyNLevel as any as string
                  );
                }
                const res = await fetcher(
                  `${await getGuildShardURL(reward.guildID)}/guilds/${
                    reward.guildID
                  }/settings/levelrewards/${reward._id}`,
                  {
                    method: "PATCH",
                    body: JSON.stringify(reward),
                  }
                );
                const json = await res.json();
                if (!res.ok) {
                  NotificationsClass.getInstance().addNotif({
                    type: "error",
                    message: json.error,
                    title: "Failed to update reward",
                  });
                } else {
                  onEdit(index, json);
                  setEditing(false);
                }
                setUpdating(false);
              }}
            >
              <span className={`font-wsans`}>Save Changes</span>
            </div>
            <div
              className={`p-1 px-3 flex flex-row gap-2 rounded-2xl items-center hover:bg-red-500 text-gray-50 cursor-pointer transition-all`}
              onClick={() => {
                setReward(initialRWD);
                setEditing(false);
              }}
            >
              <span className={`font-wsans`}>Revert</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
