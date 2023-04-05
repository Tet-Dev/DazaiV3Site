import {
  ExclamationTriangleIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { fetcher } from '../../../../utils/discordFetcher';
import { getGuildShardURL } from '../../../../utils/ShardLib';
import {
  CardRarity,
  CardType,
  rarityGradientMap,
  rarityWordMap,
} from '../../../../utils/types';
import SelectMenu from '../../../Misc/SelectMenu';
export const ViewRankCard = (props: {
  card: CardType;
  onSave: () => Promise<void>;
}) => {
  const { card, onSave } = props;
  const [editMode, setEditMode] = useState(false);
  const [cardName, setCardName] = useState(card.name);
  const [cardDescription, setCardDescription] = useState(card.description);
  const [cardPrice, setCardPrice] = useState(
    card.sellPrice ?? (0 as number | string)
  );
  const [rarity, setRarity] = useState(card.rarity);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  useEffect(() => {
    setCardName(card.name);
    setCardDescription(card.description);
    setRarity(card.rarity);
  }, [card, editMode]);

  return editMode ? (
    <div
      className={`flex flex-col gap-6 border mt-6 p-8 rounded-3xl border-gray-100/10 bg-gray-800 shadow-md ${
        updating && `opacity-50 animate-pulse pointer-events-none`
      } transition-all`}
    >
      <div className={`flex flex-row justify-between items-start z-20`}>
        <span className={`text-gray-700 font-wsans`}>
          Card ID: {card._id as string}
        </span>

        {/* <span
          className={`text-2xl font-wsans font-bold uppercase bg-gradient-to-r ${
            rarityGradientMap[card.rarity]
          } animate-gradient-medium leading-loose bg-clip-text text-transparent `}
        >
          {rarityWordMap[card.rarity]}
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
            type='text'
            value={cardName}
            onChange={(e) => setCardName(e.target.value.substring(0, 40))}
            className={`text-3xl bg-gray-850 px-4 p-2 rounded-2xl font-medium font-poppins focus:outline-none focus:ring-2 ring-0 ring-indigo-500 transition-all`}
          />
          <span
            className={`absolute bottom-0 right-0 text-gray-400 bg-gray-850/90 p-2 rounded-2xl text-xs`}
          >
            {cardName.length}/40
          </span>
        </div>
        <div className={`flex flex-col gap-2 relative w-32`}>
          <span className={`text-gray-300 font-wsans font-medium`}>
            Sell Price
          </span>
          <div className={`w-full h-full relative`}>
            <input
              type='text'
              value={cardPrice}
              onChange={(e) => setCardPrice(e.target.value)}
              className={`text-sm w-full h-full pr-8 bg-gray-850 px-4 p-2 rounded-2xl font-medium font-poppins focus:outline-none focus:ring-2 ring-0 ring-indigo-500 transition-all`}
              onBlur={() => {
                if (typeof cardPrice === 'string') {
                  if (cardPrice.length === 0) {
                    setCardPrice(0);
                  } else {
                    setCardPrice(parseInt(cardPrice) || 0);
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
        <div
          className={`flex flex-col gap-2 items-start font-wsans font-medium z-20 w-64`}
        >
          <SelectMenu
            label='Rarity'
            selectItems={Object.values(CardRarity).map((x) => ({
              id: x,
              name: rarityWordMap[x],
            }))}
            selectedItemId={rarity}
            onSelect={(x) => setRarity(x.id as CardRarity)}
            className={`w-full h-full`}
            overrideClasses={`h-full`}
          />
        </div>
      </div>

      <div className={`flex flex-col justify-center items-center`}>
        <div
          className={`card rounded-3xl shadow-lg w-fit p-1.5 relative overflow-hidden shrink-0 z-10`}
        >
          <img
            src={card.url}
            alt=''
            className={`w-full h-auto object-cover z-10 rounded-3xl pointer-events-none`}
          />

          <div
            className={`bg-gradient-to-r ${rarityGradientMap[rarity]} animate-gradient absolute top-0 left-0 w-full h-full -z-10`}
          />
        </div>
      </div>
      <div className={`flex flex-col gap-2 relative`}>
        <span className={`text-gray-300 font-wsans font-medium`}>
          Card Description
        </span>
        <textarea
          className='text-gray-300 bg-gray-850 p-4 rounded-2xl font-medium font-wsans focus:outline-none resize-none h-40 focus:ring-2 ring-0 ring-indigo-500 transition-all'
          value={cardDescription}
          onChange={(e) => setCardDescription(e.target.value.substring(0, 200))}
        />
        <span
          className={`absolute bottom-0 right-0 text-gray-400 bg-gray-850/90 p-2 rounded-2xl text-xs`}
        >
          {cardDescription.length}/200
        </span>
      </div>

      <div className={`flex flex-row gap-4 justify-start w-full`}>
        <button
          className={`rounded-2xl px-4 py-2 border border-gray-50/10 w-fit bg-gray-50/5 flex flex-row gap-2 items-center hover:bg-indigo-500 hover:border-transparent transition-all`}
          onClick={async () => {
            setUpdating(true);
            const guildShardURL = await getGuildShardURL(
              card.guild as string
            );
            let int = parseInt(`${cardPrice}`);
            if (isNaN(int)) {
              int = 0;
            }
            const res = await fetcher(
              `${guildShardURL}/guilds/${card.guild}/settings/cards/${card._id}`,
              {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  name: cardName,
                  description: cardDescription,
                  rarity: rarity,
                  sellPrice: int,
                }),
              }
            );
            if (res.ok) {
              //   setCard({
              //     ...card,
              //     name: cardName,
              //     description: cardDescription,
              //     rarity: rarity,
              //   });
              await onSave();
              setEditMode(false);
              setUpdating(false);
            } else {
              const data = await res.text();
              setError(data);
              setUpdating(false);
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
          Card ID: {card._id as string}
        </span>
        <div className={`flex flex-col items-center`}>
          <span
            className={`text-2xl font-wsans font-bold uppercase bg-gradient-to-r ${
              rarityGradientMap[card.rarity]
            } animate-gradient-medium leading-loose bg-clip-text text-transparent `}
          >
            {rarityWordMap[card.rarity]}
          </span>
          {!card.sellPrice && (
            <span className={`text-red-500 font-wsans font-medium`}>
              Not for Sale
            </span>
          )}
        </div>
      </div>
      <h1 className={`text-4xl font-poppins font-extrabold`}>{card.name}</h1>
      <div className={`flex flex-col justify-center items-center`}>
        <div
          className={`card rounded-3xl shadow-lg w-fit p-1.5 relative overflow-hidden shrink-0 z-10`}
        >
          <img
            src={card.url}
            alt=''
            className={`w-full h-auto object-cover z-10 rounded-3xl pointer-events-none`}
          />

          <div
            className={`bg-gradient-to-r ${
              rarityGradientMap[card.rarity]
            } animate-gradient absolute top-0 left-0 w-full h-full -z-10`}
          />
        </div>
      </div>
      <span
        className={`text-gray-400 font-wsans text-xl p-4 border border-gray-50/10 rounded-2xl`}
      >
        {card.description}
      </span>
      <div
        className={`flex flex-row gap-4 ${
          card.sellPrice ? 'justify-between' : 'justify-end'
        } w-full items-center`}
      >
        {!!card.sellPrice && (
          <span className={`text-gray-100/50 font-wsans text-sm`}>
            Sells for{' '}
            <b className={`text-base text-gray-300`}>{card.sellPrice} 円</b>
          </span>
        )}
        <button
          className={`rounded-2xl px-4 py-2 border border-gray-50/10 w-fit bg-gray-50/5 flex flex-row gap-2 items-center hover:bg-indigo-500 hover:border-transparent transition-all`}
          onClick={() => setEditMode(true)}
        >
          <PencilIcon className='w-5 h-5' /> Edit Card
        </button>
      </div>
    </div>
  );
};
