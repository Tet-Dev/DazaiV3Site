import { TrashIcon } from "@heroicons/react/24/outline";
import {
  LevelUpRewardActionType,
  LevelUpRewardType,
} from "../../../../utils/types";
import {
  LevelUpRewardActionCard,
  LevelUpRewardActionCrate,
  LevelUpRewardActionRole,
} from "./LevelUpRewardActionRenderers";

export const LevelUpRewardActionEntry = (props: {
  action: LevelUpRewardActionType;
  levelUpReward: LevelUpRewardType;
  onDelete: () => void;
  editing: boolean;
}) => {
  const { action, levelUpReward, editing } = props;
  return (
    <div
      className={`flex flex-row gap-3 p-2 w-full bg-gray-800 items-center px-4 rounded-xl`}
    >
      {action.action === "add" ? (
        <span className={`text-emerald-300 font-bold font-wsans uppercase`}>
          Give
        </span>
      ) : (
        <span className={`text-rose-500 font-bold font-wsans uppercase`}>
          Remove
        </span>
      )}

      <span className={`text-gray-400`}>User</span>
      {action.type === "role" ? (
        <LevelUpRewardActionRole
          action={action}
          guildID={levelUpReward.guildID}
        />
      ) : action.type === "crate" ? (
        <LevelUpRewardActionCrate
          action={action}
          guildID={levelUpReward.guildID}
        />
      ) : action.type === "card" ? (
        <LevelUpRewardActionCard
          action={action}
          guildID={levelUpReward.guildID}
        />
      ) : null}
      <div className={`flex flex-grow`} />
      {editing && (
        <div
          className={`p-1.5 border border-gray-100/10 rounded-xl hover:bg-rose-800 cursor-pointer transition-all`}
          onClick={() => {
            props.onDelete();
          }}
        >
          <TrashIcon className={`w-5 h-5 text-gray-100`} />
        </div>
      )}
    </div>
  );
};
