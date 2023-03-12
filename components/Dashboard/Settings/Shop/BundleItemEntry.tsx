import { TrashIcon } from '@heroicons/react/24/outline';
import { BundleItem } from '../../../../utils/types';
import {
  LevelUpRewardActionCard,
  LevelUpRewardActionCrate,
  LevelUpRewardActionRole,
} from '../LevelupRewards/LevelUpRewardActionRenderers';

export const BundleItemEntry = (props: {
  reward: BundleItem;
  guildID: string;
  onDelete: () => void;
  editing: boolean;
}) => {
  const { reward, editing, guildID } = props;
  return (
    <div
      className={`flex flex-row gap-3 p-2 w-full bg-gray-800 items-center px-4 rounded-xl`}
    >
      <span className={`text-gray-400`}>User</span>
      {reward.type === 'role' ? (
        <LevelUpRewardActionRole
          action={{ action: 'add', type: 'role', roleID: reward.itemID }}
          guildID={guildID}
        />
      ) : reward.type === 'crate' ? (
        <LevelUpRewardActionCrate
          action={{
            action: 'add',
            type: 'crate',
            crateID: reward.itemID,
            count: reward.count ?? 0,
          }}
          guildID={guildID}
        />
      ) : reward.type === 'card' ? (
        <LevelUpRewardActionCard
          action={{
            action: 'add',
            type: 'card',
            cardID: reward.itemID,
            count: reward.count ?? 0,
          }}
          guildID={guildID}
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
