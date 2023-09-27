import { PlusIcon } from "@heroicons/react/24/outline";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { CreateCrate } from "../../../../components/Dashboard/Settings/Crates/createCrate";
import { ViewCrateClientside } from "../../../../components/Dashboard/Settings/Crates/viewCrateClientSide";
import { ViewCrate } from "../../../../components/Dashboard/Settings/Crates/viewCrates";
import { useDiscordUser } from "../../../../utils/hooks/useDiscordUser";
import { useAPIProp } from "../../../../utils/hooks/useProp";
import { CrateTemplate, CardType } from "../../../../utils/types";
export const CrateSettings = (props: {}) => {
  const router = useRouter();
  const guildID = router.query.guild as string;
  const [crates, updateCrates] = useAPIProp<CrateTemplate[]>(
    guildID ? `/guilds/${guildID}/settings/crates` : undefined,
    guildID
  );
  const [cards, updateCards] = useAPIProp<CardType[]>(
    guildID ? `/guilds/${guildID}/settings/cards` : undefined,
    guildID
  );

  const [viewingCrate, setViewingCrate] = useState(
    null as CrateTemplate | null
  );
  useEffect(() => {
    if (router.query.c && crates) {
      const crate = crates?.find((c) => c._id.toString() === router.query.c);
      if (crate) {
        setViewingCrate(crate);
      }
    }
  }, [crates, router]);
  const { user } = useDiscordUser();
  return (
    <div
      className={`relative grid grid-cols-12 ${
        user ? ` gap-8 2xl:gap-0` : ` gap-8`
      } relative`}
    >
      <div
        className={`col-span-8 relative h-screen flex flex-col gap-6 py-8 overflow-auto transition-all px-4`}
      >
        <h1 className={`text-3xl font-bold font-poppins`}>
          Server-Wide Crate Encyclopedia
        </h1>
        <span className={`text-gray-400 font-wsans`}>
          View all the crates in your server here.
        </span>

        {viewingCrate && (
          <ViewCrateClientside
            crate={viewingCrate}
            onSave={async () => {
              updateCrates();
              setViewingCrate(null);
              // const res = await fetch(
              //   `${getGuildShardURL(guild)}/guilds/${guild}/settings/cards`,
              //   {
              //     method: "GET",
              //     headers: {
              //       "Content-Type": "application/json",
              //     },
              //   }
              // );
              // setCards(await res.json());
              // setViewingCard(null);
            }}
            cards={cards!}
          />
        )}
      </div>
      <div
        className={`col-span-4 relative h-screen flex flex-col gap-4 p-8 items-center bg-gray-900 overflow-auto`}
      >
        <h1 className={`text-2xl font-bold font-poppins w-full text-end`}>
          Server Crates
        </h1>
        <span
          className={`text-gray-200 font-wsans font-medium text-end w-full`}
        >
          {crates?.length} / 10 crate slots used
        </span>
        <div className={`gap-4 grid grid-cols-2 w-full`}>
          {crates?.map((crate) => (
            <div
              className={`card rounded-3xl shadow-lg relative shrink-0 z-10 h-fit group hover:scale-105 ease-in duration-200 cursor-pointer opacity-80 hover:opacity-100 border-4 ${
                viewingCrate === crate
                  ? `border-indigo-500`
                  : `border-gray-100/20`
              } overflow-hidden shrink-0 w-full aspect-square`}
              onClick={() => {
                setViewingCrate(crate);
              }}
              key={`crate-slot-${crate._id}`}
            >
              <img
                src={`/images/crates/chest.webp`}
                alt="chest"
                className={`object-cover grow-0 h-full w-auto z-10`}
              />
              <div
                className={`bg-gradient-to-t from-gray-900/90 via-gray-900/70 to-gray-900/20 w-full h-full absolute top-0 left-0 z-20 group-hover:opacity-50 transition-all`}
              />
              <div className={`absolute bottom-4 left-4 flex flex-col z-30`}>
                <h3
                  className={`text-gray-50 font-wsans font-extrabold text-sm`}
                >
                  {crate.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const guildID = context.query.guild as string;

//   const guildCards = await fetch(
//     `${getGuildShardURL(guildID)}/guilds/${guildID}/settings/cards`,
//     {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }
//   );
//   const cards = (await guildCards.json()) as CardType[];
//   const crates = await fetch(
//     `${getGuildShardURL(guildID)}/guilds/${guildID}/settings/crates`,
//     {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }
//   );
//   const cratesJSON = (await crates?.json()) as CrateTemplate[];
//   //   cards.push({
//   //     _id: "63e3f70bf538f8e190963d88",
//   //     name: "Sunset Dazai",
//   //     description: "Dazai with a sunset background",
//   //     url: "https://assets.dazai.app/cards/_default/ani_dazai.gif",
//   //     rarity: CardRarity.LEGENDARY,
//   //   });
//   //   cards.push({
//   //     _id: "63e3f70bf538f8e190963d8f",
//   //     name: "Dazai Thousand",
//   //     description: "The 1000 server milestone celebration card",
//   //     url: "https://assets.dazai.app/cards/_default/dazai1000.png",
//   //     rarity: CardRarity.EVENT_RARE,
//   //   });
//   let viewingCrate = (context.query.c as string)
//     ? cratesJSON.find((crate) => crate._id === context.query.c)
//     : null;
//   return {
//     props: {
//       guildID,
//       cards,
//       crates: cratesJSON,
//       viewingCrate,
//     },
//   };
// };
export default CrateSettings;
