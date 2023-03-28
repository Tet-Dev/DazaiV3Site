"use client";
import { Transition } from "@headlessui/react";
import { GetServerSideProps } from "next/types";
import { useEffect, useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";
// import { CrateCanvas } from "../../components/Crates/CrateCanvas";
import { CrateTimer } from "../../../utils/classes/CrateTimer";
import {
  CardRarity,
  CardType,
  Crate,
  rarityGradientMap,
  rarityWordMap,
} from "../../../utils/types";
import Tilt from "react-parallax-tilt";
import { fetcher } from "../../../utils/discordFetcher";
import { getGuildShardURL } from "../../../utils/ShardLib";
import Mongo from "../../../utils/classes/Mongo";
import { ObjectId } from "mongodb";
import { useRouter } from "next/router";
import { clientID } from "../../../utils/constants";

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
export const AllCratesPage = (props: { crates: Crate[]; guildID: String }) => {
  const { crates, guildID } = props;
  const [stage, setStage] = useState(0);
  const [cratesOpened, setCratesOpened] = useState(0);
  const [unopenedCrates, setUnopenedCrates] = useState<Crate[]>([]);
  const [opening, setOpening] = useState(false);
  const [crateIndex, setCrateIndex] = useState(0);
  const [crateTypes, setCrateTypes] = useState(new Map<String, number>());
  const router = useRouter();

  const increaseCrateIndex = () => {
    setStage(-1);
    setTimeout(() => {
      setCrateIndex((v) => v + 1);
      setStage(2);
    }, 250);
  };

  useEffect(() => {
    const uc = crates.filter((v) => !v.opened);
    setUnopenedCrates(uc);
    let ct = new Map<String, number>();
    uc.forEach((v) => {
      if (ct.has(v.name)) ct.set(v.name, ct.get(v.name)! + 1);
      else ct.set(v.name, 1);
    });
    setCrateTypes(ct);
  }, [crates]);

  useEffect(() => {
    if (stage === 2) {
      const timer = setTimeout(() => {
        setStage(3);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (stage === 3) {
      const timer = setTimeout(() => {
        setStage(4);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [stage]);
  return (
    <>
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
          <h1 className="text-5xl lg:text-3xl text-center font-poppins font-bold">
            Open All Crates
          </h1>
          <span className="text-2xl lg:text-lg text-center font-wsans font-medium">
            {Array.from(crateTypes.entries()).map(([v, i], j) => (
              <div key={j}>
                {v}: x{i}
              </div>
            ))}
          </span>
          <button
            className="mx-auto px-8 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-2xl text-lg font-wsans font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={opening || unopenedCrates.length == 0}
            onClick={async () => {
              if (opening) return;
              setOpening(true);
              for (let i = 0; i < unopenedCrates.length; i++) {
                const crate = unopenedCrates[i];
                const res = await fetcher(
                  `${await getGuildShardURL(crate.guildID)}/inventory/crates/${
                    crate._id
                  }/open`,
                  {
                    method: "POST",
                  }
                );
                if (!res.ok) {
                  if (res.status === 401) {
                    localStorage.setItem(
                      "redirect",
                      globalThis?.location?.href
                    );
                    return router.push(
                      `https://discord.com/api/oauth2/authorize?client_id=${clientID}&redirect_uri=${encodeURIComponent(
                        window?.location?.origin
                      )}%2Fauth&response_type=code&scope=identify%20email%20connections%20guilds`
                    );
                  }
                }
                setCratesOpened((v) => v + 1);
              }
              setOpening(false);

              setStage(2);

              // CrateTimer.getInstance().open();
            }}
          >
            {opening
              ? `Opening (${cratesOpened}/${unopenedCrates.length})`
              : "Open All"}
          </button>
        </div>
      </Transition>

      {unopenedCrates.length > 0 && (
        // <Transition
        //   show={stage >= 2}
        //   enter='transition-opacity duration-1000'
        //   enterFrom='opacity-0'
        //   enterTo='opacity-100'
        //   leave='transition-opacity duration-1000'
        //   leaveFrom='opacity-100'
        //   leaveTo='opacity-0'
        // >
        //   <div className={`w-screen h-screen absolute top-0 left-0 z-0`}>
        //     <div className='w-full h-full relative'>
        //       <div className='w-full h-full absolute top-0 left-0 bg-gradient-to-t from-gray-850 via-gray-850 to-gray-850/50 z-10 ' />
        //       <img
        //         src={unopenedCrates[crateIndex].item.url}
        //         className={`absolute left-1/2 -translate-x-1/2 w-[200%] brightness-75 transition-all duration-1000 blur-xl`}
        //       />
        //     </div>
        //   </div>
        //   <div className='h-screen w-[80vw] absolute top-0 left-1/2 -translate-x-1/2 z-10 flex flex-row gap-24 items-center justify-evenly'>
        //     <Tilt
        //       glareEnable={true}
        //       glareMaxOpacity={0.5}
        //       glareColor={
        //         rarityParticleColorMap[
        //           unopenedCrates[crateIndex].item.rarity
        //         ][0]
        //       }
        //       glarePosition='bottom'
        //       glareBorderRadius='10px'
        //       tiltMaxAngleX={20}
        //       tiltMaxAngleY={10}
        //       scale={1.1}
        //       className={`rounded-3xl overflow-hidden scale-100 opacity-100 ease-bounce transition-all duration-1000 delay-300`}
        //     >
        //       <div
        //         className={`card rounded-3xl shadow-lg w-fit p-1.5 relative overflow-hidden shrink-0`}
        //       >
        //         <img
        //           src={unopenedCrates[crateIndex].item.url}
        //           alt=''
        //           className={`w-[40rem] h-auto object-cover z-10 rounded-3xl brightness-75 transition-all duration-1000 ease-in pointer-events-none`}
        //         />

        //         <ConfettiExplosion
        //           className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
        //           duration={5000}
        //           force={0.8}
        //           width={2000}
        //           particleCount={200}
        //           colors={
        //             rarityParticleColorMap[
        //               unopenedCrates[crateIndex].item.rarity
        //             ]
        //           }
        //         />
        //         <div
        //           className={`bg-gradient-to-r ${
        //             rarityGradientMap[unopenedCrates[crateIndex].item.rarity]
        //           } animate-gradient absolute top-0 left-0 w-full h-full -z-10`}
        //         />
        //       </div>
        //     </Tilt>
        //     <div
        //       className={`w-full max-w-prose flex flex-col gap-4 items-center`}
        //     >
        //       <div className={`flex flex-col gap-4 items-start w-fit`}>
        //         <span
        //           className={`text-lg font-bold font-wsans text-gray-50/40 uppercase delay-500 duration-1000 transition-all opacity-100 ease-bounce`}
        //         >
        //           Card Background
        //         </span>
        //         <h1
        //           className={`text-5xl text-center font-poppins font-extrabold delay-[750ms] duration-[2000ms] transition-all opacity-100 ease-out`}
        //         >
        //           {unopenedCrates[crateIndex].item.name}
        //         </h1>
        //         <span
        //           className={`text-2xl font-wsans font-bold uppercase bg-gradient-to-r ${
        //             rarityGradientMap[unopenedCrates[crateIndex].item.rarity]
        //           } animate-gradient-medium leading-loose bg-clip-text text-transparent delay-[750ms] duration-[2000ms] transition-all opacity-100 ease-out`}
        //         >
        //           {rarityWordMap[unopenedCrates[crateIndex].item.rarity]}
        //         </span>

        //         <span
        //           className={`text-2xl font-wsans font-medium delay-[2000ms] duration-1000 transition-all opacity-100`}
        //         >
        //           {unopenedCrates[crateIndex].item.description}
        //         </span>
        //         <button
        //           onClick={increaseCrateIndex}
        //           disabled={stage >= 3}
        //           className='mx-auto px-8 py-4 bg-indigo-500 hover:bg-indigo-600 rounded-2xl text-2xl font-wsans font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
        //         >
        //           Next
        //         </button>
        //         <Transition
        //           show={stage >= 3}
        //           enter='delay-[2000ms] duration-1000'
        //           enterFrom='opacity-0 scale-50'
        //           enterTo='opacity-100 scale-100'
        //           leave='duration-1000 opacity-0 scale-50'
        //         >
        //           <button
        //             className={` px-6 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-2xl text-xl font-wsans font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
        //             onClick={() => {
        //               if (guildID && guildID !== `@global`)
        //                 router.push(`/app/guild/${guildID}/inventory`);
        //               else router.push(`/app`);
        //             }}
        //             // disabled={stage === 5}
        //           >
        //             {guildID && guildID !== `@global`
        //               ? `Back to Inventory`
        //               : `Back to Home`}
        //           </button>
        //         </Transition>
        //       </div>
        //     </div>
        //   </div>
        // </Transition>
        <Transition
          show={stage >= 2}
          enter={`transition-opacity ${
            stage === -1 ? `duration-[0ms] delay-[0ms]` : `duration-1000`
          }`}
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave={`transition-opacity ${
            stage === -1 ? `duration-[0ms] delay-[0ms]` : `duration-1000`
          }`}
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className={`w-screen h-screen absolute top-0 left-0 z-0`}>
            <div className="w-full h-full relative ">
              <div className="w-full h-full absolute top-0 left-0 bg-gradient-to-t from-gray-850 via-gray-850 to-gray-850/50 z-10 " />
              <img
                src={unopenedCrates[crateIndex].item.url}
                className={`absolute left-1/2 -translate-x-1/2 w-[200%] ${
                  stage >= 4
                    ? `brightness-75`
                    : `brightness-0 opacity-0 -translate-y-3/4 ease-out`
                } transition-all ${
                  stage === -1 ? `duration-[0ms] delay-[0ms]` : `duration-1000`
                } blur-xl`}
              />
            </div>
          </div>
          <div className="h-screen w-[80vw] absolute top-0 left-1/2 -translate-x-1/2 z-10 flex flex-row lg:flex-col lg:gap-12 lg:justify-start lg:pt-12 gap-24 items-center justify-evenly">
            <Tilt
              glareEnable={true}
              glareMaxOpacity={0.5}
              glareColor={
                rarityParticleColorMap[
                  unopenedCrates[crateIndex].item.rarity
                ][0]
              }
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
                className={`card rounded-3xl shadow-lg w-fit p-1.5 lg:p-1 sm:p-0.5 relative overflow-hidden shrink-0`}
              >
                <img
                  src={unopenedCrates[crateIndex].item.url}
                  alt=""
                  className={`w-[40rem] h-auto aspect-[1024/340] object-cover z-10 rounded-3xl ${
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
                    colors={
                      rarityParticleColorMap[
                        unopenedCrates[crateIndex].item.rarity
                      ]
                    }
                  />
                )}
                <div
                  className={`bg-gradient-to-r ${
                    rarityGradientMap[unopenedCrates[crateIndex].item.rarity]
                  } animate-gradient absolute top-0 left-0 w-full h-full -z-10`}
                />
              </div>
            </Tilt>
            <div
              className={`w-full max-w-prose flex flex-col gap-4 items-center`}
            >
              <div
                className={`flex flex-col gap-4 items-start md:items-center w-full`}
              >
                <span
                  className={`text-lg lg:text-sm font-bold font-wsans text-gray-50/40 uppercase delay-500 duration-1000 transition-all ${
                    stage >= 3 ? `opacity-100` : `opacity-0 scale-50`
                  } ease-bounce md:w-full delay-75`}
                >
                  {crateIndex + 1}/{unopenedCrates.length}
                </span>
                <span
                  className={`text-lg lg:text-sm font-bold font-wsans text-gray-50/40 uppercase delay-500 duration-1000 transition-all ${
                    stage >= 3 ? `opacity-100` : `opacity-0 scale-50`
                  } ease-bounce md:w-full`}
                >
                  Card Background
                </span>
                <h1
                  className={`text-5xl lg:text-2xl text-center font-poppins font-extrabold delay-[750ms] duration-[2000ms] transition-all ${
                    stage >= 3 ? `opacity-100` : `opacity-0 -translate-y-10`
                  } ease-out md:w-full`}
                >
                  {unopenedCrates[crateIndex].item.name}
                </h1>
                <span
                  className={`text-2xl lg:text-base md:text-sm font-wsans font-bold uppercase bg-gradient-to-r ${
                    rarityGradientMap[unopenedCrates[crateIndex].item.rarity]
                  } animate-gradient-medium leading-loose bg-clip-text text-transparent delay-[750ms] duration-[2000ms] transition-all ${
                    stage >= 3
                      ? `opacity-100`
                      : `opacity-0 scale-75 -translate-y-20`
                  } ease-out md:w-full`}
                >
                  {rarityWordMap[unopenedCrates[crateIndex].item.rarity]}
                </span>

                <span
                  className={`text-2xl lg:text-sm md:text-xs font-wsans font-medium delay-[2000ms] duration-1000 transition-all ${
                    stage >= 3 ? `opacity-100` : `opacity-0`
                  } md:w-full`}
                >
                  {unopenedCrates[crateIndex].item.description}
                </span>

                <Transition
                  show={stage >= 3}
                  enter="delay-[2000ms] duration-1000"
                  enterFrom="opacity-0 scale-50"
                  enterTo="opacity-100 scale-100"
                  leave="duration-1000 opacity-0 scale-50"
                >
                  {unopenedCrates[crateIndex + 1] !== undefined ? (
                    <button
                      onClick={increaseCrateIndex}
                      disabled={unopenedCrates[crateIndex + 1] === undefined}
                      className="mx-auto px-6 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-2xl text-xl font-wsans font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      className={` px-6 py-2 md:px-4 md:py-1 md:mt-8 md:text-base bg-indigo-500 hover:bg-indigo-600 rounded-2xl text-xl font-wsans font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                      onClick={() => {
                        if (
                          unopenedCrates[crateIndex].guildID &&
                          unopenedCrates[crateIndex].guildID !== `@global`
                        )
                          router.push(
                            `/app/guild/${unopenedCrates[crateIndex].guildID}/inventory`
                          );
                        else router.push(`/app`);
                      }}
                      // disabled={stage === 5}
                    >
                      {unopenedCrates[crateIndex].guildID &&
                      unopenedCrates[crateIndex].guildID !== `@global`
                        ? `Back to Inventory`
                        : `Back to Home`}
                    </button>
                  )}
                </Transition>
              </div>
            </div>
          </div>
        </Transition>
      )}
    </>
  );
};

export default AllCratesPage;
export const getServerSideProps: GetServerSideProps = async (context) => {
  const guildID = context.query.guildID as string;
  //   read authy_cookie from context.req.cookies
  const authy_cookie = context.req.cookies.authy_cookie;
  //   if authy_cookie is undefined, redirect to login
  if (!authy_cookie) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const crates = await fetch(`${getGuildShardURL(guildID)}/inventory/crates`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authy_cookie}`,
    },
  });
  const cratesJSON = await crates.json();
  return {
    props: {
      guildID: guildID,
      crates: cratesJSON,
    },
  };
};
