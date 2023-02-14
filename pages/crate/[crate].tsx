"use client";
import { Transition } from "@headlessui/react";
import { GetServerSideProps } from "next/types";
import { useEffect, useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import { CrateCanvas } from "../../components/Crates/CrateCanvas";
import { CrateTimer } from "../../utils/classes/CrateTimer";
import {
  CardRarity,
  CardType,
  Crate,
  rarityGradientMap,
  rarityWordMap,
} from "../../utils/types";
import Tilt from "react-parallax-tilt";
import { fetcher } from "../../utils/discordFetcher";
import { getGuildShardURL } from "../../utils/ShardLib";
import Mongo from "../../utils/classes/Mongo";
import { ObjectId } from "mongodb";
import { useRouter } from "next/router";
import { clientID } from "../../utils/constants";

const rarityParticleColorMap = {
  [CardRarity.LEGENDARY]: ["##818cf8", "#db2777", "#8b5cf6"],
  [CardRarity.MYTHIC]: ["#f87171", "#be123c", "#9d174d"],
  [CardRarity.EPIC]: ["#f472b6", "#e148ec", "#9748ec"],
  [CardRarity.SUPER_RARE]: ["#2495ff", "#87ffff", "#7040ff"],
  [CardRarity.RARE]: ["#34d399", "#00b303", "#00b591"],
  [CardRarity.COMMON]: ["#a0aec0", "#bdcade", "#4a5568"],
  [CardRarity.EVENT_RARE]: ["#f6e05e", "#80ffce", "#a3ffa9"],
  [CardRarity.SECRET_RARE]: ["#a0aec0", "#cfe2ff", "#fce3ff"],
};

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
export const CratePage = (props: { crate: Crate }) => {
  const { crate } = props;
  const [stage, setStage] = useState(crate.opened ? 5 : 0);
  const [opening, setOpening] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const openListener = () => {
      setStage(1);
    };

    const openCrate = async () => {
      await sleep(1010);
      setStage(2);
    };
    const presentCrate = async () => {
      await sleep(1010);
      setStage(3);
      await sleep(1010);
      setStage(4);
    };
    // presentCrate()
    CrateTimer.getInstance().on("cameraShake", openListener);
    CrateTimer.getInstance().on("crateOpen", openCrate);
    CrateTimer.getInstance().on("cratePresent", presentCrate);
    return () => {
      CrateTimer.getInstance().off("cameraShake", openListener);
      CrateTimer.getInstance().off("crateOpen", openCrate);
      CrateTimer.getInstance().off("cratePresent", presentCrate);
    };
  }, []);
  return (
    <>
      <img src={crate.item.url} className="hidden" />

      <Transition
        show={stage === 0}
        enter="transition-opacity duration-1000"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-1000"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="h-screen w-screen absolute top-0 left-0 z-10 pt-[10%] flex flex-col gap-4">
          <h1 className="text-5xl text-center font-poppins font-bold">
            {crate.name}
          </h1>
          <span className="text-2xl text-center font-wsans font-medium">
            {crate.description}
          </span>
          <button
            className="mx-auto px-8 py-4 bg-indigo-500 hover:bg-indigo-600 rounded-2xl text-2xl font-wsans font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={opening}
            onClick={async () => {
              if (opening) return;
              setOpening(true);
              const res = await fetcher(
                `${await getGuildShardURL(crate.guildID)}/inventory/crates/${
                  crate._id
                }/open`,
                {
                  method: "POST",
                }
              );
              if (res.ok) {
                CrateTimer.getInstance().open();
              } else {
                if (res.status === 401) {
                  localStorage.setItem("redirect", globalThis?.location?.href);
                  return router.push(
                    `https://discord.com/api/oauth2/authorize?client_id=${clientID}&redirect_uri=${encodeURIComponent(
                      window?.location?.origin
                    )}%2Fauth&response_type=code&scope=identify%20email%20connections%20guilds`
                  );
                }
              }
              setOpening(false);

              // CrateTimer.getInstance().open();
            }}
          >
            {opening ? "Opening..." : "Open Crate"}
          </button>
        </div>
      </Transition>
      {/* {stage} */}
      <Transition
        show={stage < 2}
        enter="transition-opacity duration-1000"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-1000"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className={"h-screen w-screen absolute top-0 left-0 z-0 "}
      >
        <CrateCanvas />
      </Transition>

      <Transition
        show={stage >= 2}
        enter="transition-opacity duration-1000"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-1000"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className={`w-screen h-screen absolute top-0 left-0 z-0`}>
          <div className="w-full h-full relative ">
            <div className="w-full h-full absolute top-0 left-0 bg-gradient-to-t from-gray-850 via-gray-850 to-gray-850/50 z-10 " />
            <img
              src={crate.item.url}
              className={`absolute left-1/2 -translate-x-1/2 w-[200%] ${
                stage >= 4
                  ? `brightness-75`
                  : `brightness-0 opacity-0 -translate-y-3/4 ease-out`
              } transition-all duration-1000 blur-xl`}
            />
          </div>
        </div>
        <div className="h-screen w-[80vw] absolute top-0 left-1/2 -translate-x-1/2 z-10 flex flex-row gap-24 items-center justify-evenly">
          <Tilt
            glareEnable={true}
            glareMaxOpacity={0.5}
            glareColor={rarityParticleColorMap[crate.item.rarity][0]}
            glarePosition="bottom"
            glareBorderRadius="10px"
            tiltMaxAngleX={20}
            tiltMaxAngleY={10}
            scale={1.1}
            className={`rounded-3xl overflow-hidden ${
              stage >= 3 ? `scale-100 opacity-100` : `scale-[0.25] opacity-0`
            } ease-bounce transition-all duration-1000 delay-300`}
          >
            <div
              className={`card rounded-3xl shadow-lg w-fit p-1.5 relative overflow-hidden shrink-0`}
            >
              <img
                src={crate.item.url}
                alt=""
                className={`w-[40rem] h-auto object-cover z-10 rounded-3xl ${
                  stage >= 4 ? `brightness-75` : `brightness-0 opacity-50`
                } transition-all duration-1000 ease-in pointer-events-none`}
              />

              {stage === 4 && (
                <ConfettiExplosion
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
                  duration={5000}
                  force={0.8}
                  width={2000}
                  particleCount={200}
                  colors={rarityParticleColorMap[crate.item.rarity]}
                />
              )}
              <div
                className={`bg-gradient-to-r ${
                  rarityGradientMap[crate.item.rarity]
                } animate-gradient absolute top-0 left-0 w-full h-full -z-10`}
              />
            </div>
          </Tilt>
          <div
            className={`w-full max-w-prose flex flex-col gap-4 items-center`}
          >
            <div className={`flex flex-col gap-4 items-start w-fit`}>
              <span
                className={`text-lg font-bold font-wsans text-gray-50/40 uppercase delay-500 duration-1000 transition-all ${
                  stage >= 3 ? `opacity-100` : `opacity-0 scale-50`
                } ease-bounce`}
              >
                Card Background
              </span>
              <h1
                className={`text-5xl text-center font-poppins font-extrabold delay-[750ms] duration-[2000ms] transition-all ${
                  stage >= 3 ? `opacity-100` : `opacity-0 -translate-y-10`
                } ease-out`}
              >
                {crate.item.name}
              </h1>
              <span
                className={`text-2xl font-wsans font-bold uppercase bg-gradient-to-r ${
                  rarityGradientMap[crate.item.rarity]
                } animate-gradient-medium leading-loose bg-clip-text text-transparent delay-[750ms] duration-[2000ms] transition-all ${
                  stage >= 3
                    ? `opacity-100`
                    : `opacity-0 scale-75 -translate-y-20`
                } ease-out`}
              >
                {rarityWordMap[crate.item.rarity]}
              </span>

              <span
                className={`text-2xl font-wsans font-medium delay-[2000ms] duration-1000 transition-all ${
                  stage >= 3 ? `opacity-100` : `opacity-0`
                }`}
              >
                {crate.item.description}
              </span>
              <Transition
                show={stage >= 3}
                enter="delay-[2000ms] duration-1000"
                enterFrom="opacity-0 scale-50"
                enterTo="opacity-100 scale-100"
                leave="duration-1000 opacity-0 scale-50"
              >
                <button
                  className={` px-6 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-2xl text-xl font-wsans font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                  onClick={() => {
                    if (crate.guildID && crate.guildID !== `@global`)
                      router.push(`/app/guild/${crate.guildID}/inventory`);
                    else router.push(`/app`);
                  }}
                  // disabled={stage === 5}
                >
                  {crate.guildID && crate.guildID !== `@global`
                    ? `Back to Inventory`
                    : `Back to Home`}
                </button>
              </Transition>
            </div>
          </div>
        </div>
      </Transition>
    </>
  );
};
export default CratePage;
export const getServerSideProps: GetServerSideProps = async (context) => {
  const crateID = context.query.crate as string;
  if (!crateID) {
    return {
      notFound: true,
    };
  }
  const items = {
    name: "Nithyan Miku",
    description:
      "Nithya's fujoshi obsession with a certain virtual blue-haired idol",
    url: "https://cdn.discordapp.com/attachments/757863990129852509/1072679924692959252/migu.png",
    rarity: CardRarity.SUPER_RARE,
  };
  const rawCrate = (await (
    await Mongo
  )
    .db("Crates")
    .collection("userCrates")
    .findOne({
      _id: new ObjectId(crateID),
    })) as
    | (Omit<Crate, "item"> & {
        itemID: string;
      })
    | null;
  if (!rawCrate) {
    return {
      notFound: true,
    };
  }
  const item = (await (
    await Mongo
  )
    .db("Guilds")
    .collection("customCards")
    .findOne({ _id: new ObjectId(rawCrate.itemID) })) as CardType | null;
  const crate = {
    ...rawCrate,
    item: {
      ...item,
      _id: item?._id.toString(),
    },
  };
  return {
    props: {
      crate: {
        ...crate,
        _id: crate._id.toString(),
      },
    },
  };

  // 63ea96e50296c1c2c951ba66

  // {
  //   name: "Sunset Dazai",
  //   description: "Dazai with a sunset background",
  //   url: "https://assets.dazai.app/cards/_default/ani_dazai.gif",
  //   rarity: CardRarity.LEGENDARY,
  // };
  // {
  //   name: "Bitchless David",
  //   description:
  //     "No bitches?",
  //   url: "https://cdn.discordapp.com/attachments/964267364642324600/1072569025659416616/david.png",
  //   rarity: CardRarity.COMMON,
  // } as CardType;

  // {
  //   name: "Studious Kimiko",
  //   description:
  //     "I was forced to do this by the Kimiko Enthusiasts, please send help",
  //   url: "https://assets.dazai.app/cards/_default/kimiko.png",
  //   rarity: CardRarity.SECRET_RARE,
  // } as CardType;
  // cardNames[
  //   Object.keys(cardNames)[
  //     Math.floor(Math.random() * Object.keys(cardNames).length)
  //   ]
  // ];
  // const crateItem = {
  //   _id: crateID,
  //   item: items,
  //   userID: "295391243318591490",
  //   createdAt: Date.now(),
  //   name: "Dazai Crate",
  //   description: "What could it be???",
  //   // opened: true
  // } as Crate;
  // return {
  //   props: {
  //     crate: crateItem,
  //   },
  // };
};
