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
export const CreateCrate = (props: {
  cards: CardType[];
  onSave: () => void;
}) => {
  const [editMode, setEditMode] = useState(false);
  const [crateName, setCrateName] = useState("");
  const [crateDescription, setCrateDescription] = useState("");
  const [crateItems, setCrateItems] = useState([] as string[]);
  const [crateDropRates, setCrateDropRates] = useState({
    [CardRarity.SECRET_RARE]: 0,
    [CardRarity.COMMON]: 0,
    [CardRarity.RARE]: 0,
    [CardRarity.SUPER_RARE]: 0,
    [CardRarity.EPIC]: 0,
    [CardRarity.MYTHIC]: 0,
    [CardRarity.LEGENDARY]: 0,
    [CardRarity.EVENT_RARE]: 0,
  } as {
    [key in CardRarity]: number | string;
  });
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

  return (
    <div
      className={`flex flex-col gap-6 border mt-6 p-8 rounded-3xl border-gray-100/10 bg-gray-800 shadow-md ${
        updating && `opacity-50 animate-pulse pointer-events-none`
      } transition-all`}
    >
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
            Crate Name
          </span>
          <input
            type="text"
            value={crateName}
            onChange={(e) => setCrateName(e.target.value.substring(0, 40))}
            className={`text-3xl bg-gray-850 px-4 p-2 rounded-2xl font-medium font-poppins focus:outline-none focus:ring-2 ring-0 ring-indigo-500 transition-all`}
          />
          <span
            className={`absolute bottom-0 right-0 text-gray-400 bg-gray-850/90 p-2 rounded-2xl text-xs`}
          >
            {crateName.length}/40
          </span>
        </div>
        {/* <div
          className={`flex flex-col gap-2 items-start font-wsans font-medium z-20 w-64`}
        >
          <SelectMenu
            label="Rarity"
            selectItems={Object.values(CardRarity).map((x) => ({
              id: x,
              name: rarityWordMap[x],
            }))}
            selectedItemId={rarity}
            onSelect={(x) => setRarity(x.id as CardRarity)}
            className={`w-full`}
          />
        </div> */}
      </div>
      <div className={`flex flex-col gap-2 relative`}>
        <span className={`text-gray-300 font-wsans font-medium`}>
          Crate Description
        </span>
        <textarea
          className="text-gray-300 bg-gray-850 p-4 rounded-2xl font-medium font-wsans focus:outline-none resize-none h-40 focus:ring-2 ring-0 ring-indigo-500 transition-all"
          value={crateDescription}
          onChange={(e) =>
            setCrateDescription(e.target.value.substring(0, 200))
          }
        />
        <span
          className={`absolute bottom-0 right-0 text-gray-400 bg-gray-850/90 p-2 rounded-2xl text-xs`}
        >
          {crateDescription.length}/200
        </span>
      </div>
      <div
        className={`flex flex-col gap-4 p-6 bg-gray-850 shadow-inner rounded-3xl `}
      >
        <span className={`text-gray-300 font-wsans font-medium text-xl`}>
          Drop Rates
        </span>
        <div
          className={`grid grid-cols-3 xl:grid-cols-2 gap-4 place-items-center`}
        >
          <div className={`flex flex-row gap-2 items-center`}>
            <span
              className={`font-wsans font-bold text-xl text-transparent bg-gradient-to-r ${
                rarityGradientMap[CardRarity.SECRET_RARE]
              } animate-gradient-medium bg-clip-text leading-loose`}
            >
              Secret Rare
            </span>
            <div className={`relative`}>
              <input
                className={`text-base font-bold p-1.5 px-3 bg-gray-900 rounded-xl shadow-inner w-16 h-10 !outline-none ring-0 ring-fuchsia-400/30 focus:ring transition-all`}
                value={crateDropRates.secret_rare}
                // add a % sign to the end of the number
                onChange={(e) =>
                  setCrateDropRates({
                    ...crateDropRates,
                    secret_rare: e.target.value,
                  })
                }
              />
              <span
                className={`absolute right-2 top-1/2 -translate-y-1/2 text-gray-400`}
              >
                %
              </span>
            </div>
            {/* >
              {crateDropRates.secret_rare ?? 0}%
            </span> */}
          </div>
          <div className={`flex flex-row gap-2 items-center`}>
            <span
              className={`font-wsans font-bold text-xl text-transparent bg-gradient-to-r ${
                rarityGradientMap[CardRarity.COMMON]
              } animate-gradient-medium bg-clip-text leading-loose`}
            >
              Common
            </span>
            <div className={`relative`}>
              <input
                className={`text-base font-bold p-1.5 px-3 bg-gray-900 rounded-xl shadow-inner w-16 h-10 !outline-none ring-0 ring-fuchsia-400/30 focus:ring transition-all`}
                value={crateDropRates.common}
                // add a % sign to the end of the number
                onChange={(e) =>
                  setCrateDropRates({
                    ...crateDropRates,
                    common: e.target.value,
                  })
                }
              />
              <span
                className={`absolute right-2 top-1/2 -translate-y-1/2 text-gray-400`}
              >
                %
              </span>
            </div>
          </div>

          <div className={`flex flex-row gap-2 items-center`}>
            <span
              className={`font-wsans font-bold text-xl text-transparent bg-gradient-to-r ${
                rarityGradientMap[CardRarity.RARE]
              } animate-gradient-medium bg-clip-text leading-loose`}
            >
              Rare
            </span>
            <div className={`relative`}>
              <input
                className={`text-base font-bold p-1.5 px-3 bg-gray-900 rounded-xl shadow-inner w-16 h-10 !outline-none ring-0 ring-fuchsia-400/30 focus:ring transition-all`}
                value={crateDropRates.rare}
                // add a % sign to the end of the number
                onChange={(e) =>
                  setCrateDropRates({
                    ...crateDropRates,
                    rare: e.target.value,
                  })
                }
              />
              <span
                className={`absolute right-2 top-1/2 -translate-y-1/2 text-gray-400`}
              >
                %
              </span>
            </div>
          </div>

          <div className={`flex flex-row gap-2 items-center`}>
            <span
              className={`font-wsans font-bold text-xl text-transparent bg-gradient-to-r ${
                rarityGradientMap[CardRarity.SUPER_RARE]
              } animate-gradient-medium bg-clip-text leading-loose`}
            >
              Super Rare
            </span>
            <div className={`relative`}>
              <input
                className={`text-base font-bold p-1.5 px-3 bg-gray-900 rounded-xl shadow-inner w-16 h-10 !outline-none ring-0 ring-fuchsia-400/30 focus:ring transition-all`}
                value={crateDropRates.super_rare}
                // add a % sign to the end of the number
                onChange={(e) =>
                  setCrateDropRates({
                    ...crateDropRates,
                    super_rare: e.target.value,
                  })
                }
              />
              <span
                className={`absolute right-2 top-1/2 -translate-y-1/2 text-gray-400`}
              >
                %
              </span>
            </div>
          </div>

          <div className={`flex flex-row gap-2 items-center`}>
            <span
              className={`font-wsans font-bold text-xl text-transparent bg-gradient-to-r ${
                rarityGradientMap[CardRarity.EPIC]
              } animate-gradient-medium bg-clip-text leading-loose`}
            >
              Epic
            </span>
            <div className={`relative`}>
              <input
                className={`text-base font-bold p-1.5 px-3 bg-gray-900 rounded-xl shadow-inner w-16 h-10 !outline-none ring-0 ring-fuchsia-400/30 focus:ring transition-all`}
                value={crateDropRates.epic}
                // add a % sign to the end of the number
                onChange={(e) =>
                  setCrateDropRates({
                    ...crateDropRates,
                    epic: e.target.value,
                  })
                }
              />
              <span
                className={`absolute right-2 top-1/2 -translate-y-1/2 text-gray-400`}
              >
                %
              </span>
            </div>
          </div>

          <div className={`flex flex-row gap-2 items-center`}>
            <span
              className={`font-wsans font-bold text-xl text-transparent bg-gradient-to-r ${
                rarityGradientMap[CardRarity.MYTHIC]
              } animate-gradient-medium bg-clip-text leading-loose`}
            >
              Mythic
            </span>
            <div className={`relative`}>
              <input
                className={`text-base font-bold p-1.5 px-3 bg-gray-900 rounded-xl shadow-inner w-16 h-10 !outline-none ring-0 ring-fuchsia-400/30 focus:ring transition-all`}
                value={crateDropRates.mythic}
                // add a % sign to the end of the number
                onChange={(e) =>
                  setCrateDropRates({
                    ...crateDropRates,
                    mythic: e.target.value,
                  })
                }
              />
              <span
                className={`absolute right-2 top-1/2 -translate-y-1/2 text-gray-400`}
              >
                %
              </span>
            </div>
          </div>

          <div className={`flex flex-row gap-2 items-center`}>
            <span
              className={`font-wsans font-bold text-xl text-transparent bg-gradient-to-r ${
                rarityGradientMap[CardRarity.LEGENDARY]
              } animate-gradient-medium bg-clip-text leading-loose`}
            >
              Legendary
            </span>
            <div className={`relative`}>
              <input
                className={`text-base font-bold p-1.5 px-3 bg-gray-900 rounded-xl shadow-inner w-16 h-10 !outline-none ring-0 ring-fuchsia-400/30 focus:ring transition-all`}
                value={crateDropRates.legendary}
                // add a % sign to the end of the number
                onChange={(e) =>
                  setCrateDropRates({
                    ...crateDropRates,
                    legendary: e.target.value,
                  })
                }
              />
              <span
                className={`absolute right-2 top-1/2 -translate-y-1/2 text-gray-400`}
              >
                %
              </span>
            </div>
          </div>

          <div className={`flex flex-row gap-2 items-center`}>
            <span
              className={`font-wsans font-bold text-xl text-transparent bg-gradient-to-r ${
                rarityGradientMap[CardRarity.EVENT_RARE]
              } animate-gradient-medium bg-clip-text leading-loose`}
            >
              Event Rare
            </span>
            <div className={`relative`}>
              <input
                className={`text-base font-bold p-1.5 px-3 bg-gray-900 rounded-xl shadow-inner w-16 h-10 !outline-none ring-0 ring-fuchsia-400/30 focus:ring transition-all`}
                value={crateDropRates.event_rare}
                // add a % sign to the end of the number
                onChange={(e) =>
                  setCrateDropRates({
                    ...crateDropRates,
                    event_rare: e.target.value,
                  })
                }
              />
              <span
                className={`absolute right-2 top-1/2 -translate-y-1/2 text-gray-400`}
              >
                %
              </span>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`flex flex-col gap-4 p-6 bg-gray-850 rounded-3xl shadow-inner`}
      >
        <span className={`text-gray-300 font-wsans font-medium text-xl`}>
          Crate Items
        </span>
        <div className={`flex flex-row flex-wrap justify-center`}>
          {crateItems
            .map((id) => cardMap.get(id)!)
            .sort((a, b) => rarityValue[a.rarity] - rarityValue[b.rarity])
            .map((card) => (
              <SettingsCardRenderer
                card={card}
                deletemode
                onDelete={() => {
                  setCrateItems(crateItems.filter((i) => i !== card._id));
                }}
                key={`crate-item-${card._id}`}
              />
            ))}

          <div
            className={`card rounded-3xl shadow-lg relative shrink-0 grow-0 p-1 z-10 h-fit group hover:scale-105 ease-in duration-200 cursor-pointer opacity-80 hover:opacity-100 border-4 border-gray-50/20 border-dashed overflow-hidden hover:bg-gray-50/10
            
            ${
              props.cards.filter(
                (card) => !crateItems.includes(card._id as string)
              ).length === 0 &&
              `opacity-30 cursor-not-allowed pointer-events-none`
            }
            `}
            onClick={() => {
              if (
                props.cards.filter(
                  (card) => !crateItems.includes(card._id as string)
                ).length === 0
              )
                return;
              // setCreateCard(true);
              // setViewingCard(null);
              setSelectCardModalVisible(true);
            }}
          >
            <div
              className={`w-[13.3125rem] h-[4.98rem] p-1 z-10 transition-all pointer-events-none brightness-75 group-hover:brightness-100 ease-in duration-200 flex flex-col gap items-center justify-center`}
            >
              <PlusIcon className={`w-8 h-8 text-gray-50/40`} />
              <span className={`text-gray-50/40 w-fit font-wsans font-medium`}>
                Add Card
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className={`flex flex-row gap-4 justify-start w-full`}>
        <button
          className={`rounded-2xl px-4 py-2 border border-gray-50/10 w-fit bg-gray-50/5 flex flex-row gap-2 items-center hover:bg-indigo-500 hover:border-transparent transition-all`}
          onClick={async () => {
            setUpdating(true);
            const guildShardURL = await getGuildShardURL(
              props.cards[0].guild as string
            );

            const res = await fetcher(
              `${guildShardURL}/guilds/${props.cards[0].guild}/settings/crates/`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  name: crateName,
                  description: crateDescription,
                  dropRates: Object.fromEntries(
                    Object.entries(crateDropRates).map(([key, value]) => [
                      key,
                      parseFloat(`${value}`),
                    ])
                  ),
                  items: crateItems,
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
              await props.onSave();
              setEditMode(false);
              setUpdating(false);
            } else {
              const data = await res.json();
              setError(data.error);
              setUpdating(false);
            }
          }}
        >
          Create Crate
        </button>
        {/* add revert button muted text button */}
        <button
          className={`rounded-2xl text-gray-500 hover:text-gray-50 px-4 py-2 w-fit flex flex-row gap-2 items-center hover:bg-red-500 hover:border-transparent transition-all`}
          onClick={() => props.onSave()}
        >
          Cancel
        </button>
      </div>
      <Modal
        visible={selectCardModalVisible}
        onClose={() => setSelectCardModalVisible(false)}
      >
        <div
          className={`flex flex-col gap-4 p-6 w-[90vw] max-w-[75ch] max-h-[80vh] overflow-auto`}
        >
          <h1 className={`text-2xl font-poppins font-bold`}>
            Select a Card to Add
          </h1>
          <div
            className={`flex flex-row flex-wrap items-center justify-center`}
          >
            {props.cards
              .filter((card) => !crateItems.includes(card._id as string))
              .sort((a, b) => rarityValue[a.rarity] - rarityValue[b.rarity])
              .map((card) => (
                <SettingsCardRenderer
                  card={card}
                  onClick={() => {
                    setCrateItems([...crateItems, card._id as string]);
                    setSelectCardModalVisible(false);
                  }}
                  key={`card-renderer-${card._id}`}
                />
              ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};
