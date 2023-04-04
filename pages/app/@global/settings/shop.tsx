import { PencilIcon, PlusIcon } from "@heroicons/react/24/outline";
import { GetServerSideProps } from "next";
import { useState } from "react";
import { CreateRankCard } from "../../../../components/Dashboard/Settings/RankCards/createRankCard";
import { ViewRankCard } from "../../../../components/Dashboard/Settings/RankCards/ViewRankCard";
import { CreateBundle } from "../../../../components/Dashboard/Settings/Shop/CreateBundle";
import { ViewBundle } from "../../../../components/Dashboard/Settings/Shop/ViewBundle";
import { useDiscordUser } from "../../../../utils/hooks/useDiscordUser";
import { getGuildShardURL } from "../../../../utils/ShardLib";
import { CardRarity, CardType, ShopItem } from "../../../../utils/types";

export const ShopSettings = (props: {
  guild: string;
  bundles: ShopItem[];
  selectedCard: ShopItem | null;
}) => {
  const { guild, selectedCard } = props;
  const [bundles, setBundles] = useState(props.bundles);
  const [viewingBundle, setViewingBundle] = useState(
    selectedCard ?? (null as ShopItem | null)
  );
  const [createBundle, setCreateBundle] = useState(false);
  const user = useDiscordUser();
  return (
    <div
      className={`relative grid grid-cols-12 ${
        user ? `2xl:ml-2 gap-8 2xl:gap-0 ml-[5%]` : `ml-[5%] gap-8`
      } relative`}
    >
      <div
        className={`col-span-8 relative h-screen flex flex-col gap-6 pt-8 overflow-auto transition-all`}
      >
        <h1 className={`text-3xl font-bold font-poppins`}>
          Server-Wide Shop Bundles
        </h1>
        <span className={`text-gray-400 font-wsans`}>
          Custom server bundles allow users to spend the currency which they
          have aquired by selling cards.
        </span>

        {viewingBundle ? (
          <ViewBundle
            bundle={viewingBundle}
            guild={guild}
            onSave={async () => {
              const res = await fetch(
                `${getGuildShardURL(guild)}/guilds/${guild}/shop`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
              setBundles((await res.json()).shopItems);
              setViewingBundle(null);
            }}
            key={`view-bundle-${viewingBundle._id}`}
          />
        ) : createBundle ? (
          <CreateBundle
            guild={guild}
            onClose={async () => {
              const res = await fetch(
                `${getGuildShardURL(guild)}/guilds/${guild}/shop`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
              setBundles((await res.json()).shopItems);
              setCreateBundle(false);
            }}
          />
        ) : (
          <div
            className={`flex flex-grow flex-col gap-8 items-center justify-center border-2 mb-8 p-12 rounded-3xl border-dashed border-gray-700`}
          >
            <span className={`text-gray-500 font-wsans text-2xl`}>
              {bundles.length
                ? `Click on a bundle in the list on the right to view`
                : `Click on the "Add Bundle" button to add your first card!`}
            </span>
          </div>
        )}
      </div>
      <div
        className={`col-span-4 relative h-screen flex flex-col gap-4 p-8 items-center bg-gray-900 overflow-auto`}
      >
        <h1 className={`text-2xl font-bold font-poppins w-full text-center`}>
          Server Bundle List
        </h1>
        {bundles.map((bundle) => (
          <div
            className={`card rounded-3xl shadow-lg relative shrink-0 z-10 h-fit text-center group hover:scale-105 ease-in duration-200 cursor-pointer opacity-80 hover:opacity-100 border-4 w-full p-4 ${
              viewingBundle === bundle
                ? `border-indigo-500`
                : `border-gray-100/20`
            } overflow-hidden shrink-0`}
            onClick={() => {
              setViewingBundle(bundle);
              setCreateBundle(false);
            }}
            key={`bundle-slot-${bundle._id}`}
          >
            {bundle.name}
          </div>
        ))}
        <div
          className={`card rounded-3xl shadow-lg relative shrink-0 z-10 h-fit group hover:scale-105 ease-in duration-200 cursor-pointer opacity-80 hover:opacity-100 border-4 border-gray-50/20 border-dashed overflow-hidden hover:bg-gray-50/10`}
          onClick={() => {
            setCreateBundle(true);
            setViewingBundle(null);
          }}
        >
          <div
            className={`w-[17.75rem] h-[6.64rem] z-10 transition-all pointer-events-none brightness-75 group-hover:brightness-100 ease-in duration-200 flex flex-col gap-4 items-center justify-center`}
          >
            <PlusIcon className={`w-10 h-10 text-gray-50/40`} />
            <span className={`text-gray-50/40 w-fit font-wsans font-medium`}>
              Add Bundle
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const guildID = context.query.guild as string;

  const guildBundles = await fetch(
    `${getGuildShardURL(guildID)}/guilds/${guildID}/shop`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const bundles = (await guildBundles.json()).shopItems as ShopItem[];

  return {
    props: {
      guild: guildID,
      bundles,
      selectedCard: context.query.card
        ? bundles.find((bundle) => bundle._id === context.query.card)
        : null,
    },
  };
};

export default ShopSettings;
