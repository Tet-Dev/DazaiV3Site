import {
  ArchiveBoxIcon,
  IdentificationIcon,
  MinusCircleIcon,
  PlusCircleIcon,
  RectangleStackIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import { CreditCardIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import { BiRectangle } from 'react-icons/bi';
import { fetcher } from '../../../../utils/discordFetcher';
import { useGuildData } from '../../../../utils/hooks/useGuildData';
import { getGuildShardURL } from '../../../../utils/ShardLib';
import {
  BundleItem,
  CardType,
  CrateTemplate,
  LevelUpRewardActionType,
} from '../../../../utils/types';
import SelectMenu, { SelectMenuItem } from '../../../Misc/SelectMenu';
import { Modal } from '../../../Modal';
const numberToHex = (num: number) => {
  return num.toString(16).padStart(2, '0');
};
export const NewBundleRewardModal = (props: {
  open: boolean;
  onClose: () => void;
  onAdd: (action: BundleItem) => void;
  guildID: string;
}) => {
  const { open, onClose, onAdd, guildID } = props;
  const [actionConstructor, setActionConstructor] = useState({
    type: 'role',
    itemID: '',
    count: 1,
  } as BundleItem);
  const guildData = useGuildData(guildID);
  const roles = guildData?.roles ?? [];
  const [crateData, setCrateData] = useState(
    undefined as CrateTemplate[] | undefined | null
  );
  const [cardData, setCardData] = useState(
    undefined as CardType[] | undefined | null
  );
  useEffect(() => {
    (async () => {
      const guildCards = await fetcher(
        `${getGuildShardURL(guildID)}/guilds/${guildID}/settings/cards?revealsecretrarecards=1`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const cards = (await guildCards.json()) as CardType[];
      const crates = await fetcher(
        `${getGuildShardURL(guildID)}/guilds/${guildID}/settings/crates?reveal=1`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const cratesJSON = (await crates.json()) as CrateTemplate[];
      setCrateData(cratesJSON);
      setCardData(cards);
    })();

    return () => {};
  }, []);
  const items = (
    actionConstructor.type === 'role'
      ? roles
          .sort((a, b) => b.position - a.position)
          .map((role) => ({
            id: role.id,
            name: `${role.name}`,
            image: (props) => (
              <TagIcon
                className={`${props.className}`}
                style={{
                  color: `#${numberToHex(role.color)}`,
                }}
              />
            ),
          }))
      : actionConstructor.type === 'crate'
      ? crateData!.map((crate) => ({
          id: crate._id,
          name: crate.name,
          image: ArchiveBoxIcon,
        }))
      : cardData!.map((card) => ({
          id: card._id,
          name: card.name,
          image: (props) => (
            <img
              src={card.url}
              className={`h-12 aspect-[1024/340] object-cover origin-center rounded-xl bg-gray-900 border border-gray-100/10`}
              key={`reward-action-option-card-${card._id}`}
            />
          ),
        }))
  ) as SelectMenuItem[];
  return (
    <Modal visible={open} onClose={onClose} title='Add Reward Action'>
      <div className={`flex flex-col gap-4 p-6 w-[90vw] max-w-[75ch]`}>
        <h1 className={`text-2xl font-poppins font-bold`}>
          Create a New Bundle Item
        </h1>
        <div className={`flex flex-row gap-6 w-full`}>
          <div className={`flex flex-row gap-6 w-full`}>
            <div className={`flex flex-col gap-2 grow`}>
              <span className={`text-gray-300 font-bold text-sm`}>
                Reward Type
              </span>

              <SelectMenu
                selectItems={[
                  {
                    id: 'role',
                    name: 'Role',
                    image: TagIcon,
                  },
                  {
                    id: 'crate',
                    name: 'Crate',
                    image: ArchiveBoxIcon,
                  },
                  {
                    id: 'card',
                    name: 'Card',
                    image: IdentificationIcon,
                  },
                ]}
                onSelect={(item) => {
                  setActionConstructor({
                    ...actionConstructor,
                    type: item.id as any,
                  });
                }}
                selectedItemId={actionConstructor.type}
                className={`w-full`}
              />
            </div>
            {actionConstructor.type !== 'role' && (
              <div className={`flex flex-col gap-2`}>
                <span className={`text-gray-300 font-bold text-sm`}>
                  Reward Amount
                </span>

                <input
                  className={`bg-gray-850 text-gray-200 font-poppins font-medium text-xl border border-gray-700 rounded-xl p-2 px-4 !outline-none focus:ring ring-indigo-500 ring-0 transition-all w-28 h-full`}
                  value={actionConstructor.count}
                  onChange={(e) => {
                    setActionConstructor({
                      ...actionConstructor,
                      //@ts-ignore
                      count: e.target.value,
                    });
                  }}
                  //   type="number"
                  // add regex to only allow numbers
                  pattern='[0-9]*'
                />
              </div>
            )}
          </div>
        </div>
        <div className={`flex flex-col gap-2 w-full`}>
          <span className={`text-gray-300 font-bold text-sm`}>Reward</span>
          <SelectMenu
            selectItems={items}
            onSelect={(item) => {
              setActionConstructor({
                ...actionConstructor,
                //@ts-ignore
                itemID: item.id,
              });
            }}
            selectedItemId={
              actionConstructor.type === 'role'
                ? actionConstructor.itemID || (items[0]?.id as string)
                : actionConstructor.type === 'crate'
                ? actionConstructor.itemID || (crateData![0]?._id as string)
                : actionConstructor.itemID || (cardData![0]?._id as string)
            }
            className={`w-full`}
          />
        </div>
        <div className={`flex flex-row gap-2 items-center`}>
          <div
            className={`p-1 px-3 border border-gray-100/30 flex flex-row gap-2 rounded-2xl items-center hover:bg-indigo-500 bg-gray-50/10 text-gray-50 cursor-pointer transition-all`}
            onClick={() => {
              const newAction = {
                ...actionConstructor,
              } as BundleItem;
              if (newAction.type === 'role') {
                // @ts-ignore
                delete newAction.crateID;
                // @ts-ignore
                delete newAction.cardID;
                newAction.itemID = newAction.itemID || (items[0].id as string);
              }
              if (newAction.type === 'crate') {
                // @ts-ignore
                delete newAction.roleID;
                // @ts-ignore
                delete newAction.cardID;
                newAction.itemID =
                  newAction.itemID || (crateData![0]?._id as string);
                newAction.count = parseInt(`${newAction.count}`);
              }
              if (newAction.type === 'card') {
                // @ts-ignore
                delete newAction.roleID;
                // @ts-ignore
                delete newAction.crateID;
                newAction.itemID =
                  newAction.itemID || (cardData![0]?._id as string);
                newAction.count = parseInt(`${newAction.count}`);
              }

              onAdd(newAction);
              onClose();
            }}
          >
            <span className={`font-wsans`}>Add Reward</span>
          </div>
          <div
            className={`p-1 px-3 flex flex-row gap-2 rounded-2xl items-center hover:bg-red-500 text-gray-50 cursor-pointer transition-all`}
            onClick={() => {
              onClose();
            }}
          >
            <span className={`font-wsans`}>Cancel</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
