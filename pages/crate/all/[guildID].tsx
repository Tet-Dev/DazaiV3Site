"use client";
import { Switch, Transition } from "@headlessui/react";
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
  rarityValue,
  rarityWordMap,
} from "../../../utils/types";
import Tilt from "react-parallax-tilt";
import { fetcher } from "../../../utils/discordFetcher";
import { getGuildShardURL } from "../../../utils/ShardLib";
import Mongo from "../../../utils/classes/Mongo";
import { ObjectId } from "mongodb";
import { useRouter } from "next/router";
import { clientID } from "../../../utils/constants";
import { OpenCrateRenderer } from "../../../components/Dashboard/Settings/Crates/OpenCrateRenderer";
import { useGuildData } from "../../../utils/hooks/useGuildData";

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
export const AllCratesPage = (props: { crates: Crate[]; guildID: string }) => {
  const { crates, guildID } = props;
  const [stage, setStage] = useState(0);
  const [cratesOpened, setCratesOpened] = useState(0);
  const [unopenedCrates, setUnopenedCrates] = useState<Crate[]>([]);
  const [opening, setOpening] = useState(false);
  const [crateIndex, setCrateIndex] = useState(0);
  const [noAnim, setNoAnim] = useState(false);
  const router = useRouter();
  const guildData = useGuildData(guildID);

  const increaseCrateIndex = () => {
    setStage(-1);
    setTimeout(
      () => {
        setCrateIndex((v) => v + 1);
        setStage(2);
      },
      noAnim ? 1 : 110
    );
  };

  useEffect(() => {
    const uc = crates.filter((v) => !v.opened);
    setUnopenedCrates(uc);
  }, [crates]);

  useEffect(() => {
    if (stage === 2) {
      const timer = setTimeout(
        () => {
          setStage(3);
        },
        noAnim ? 1 : 1000
      );
      return () => clearTimeout(timer);
    } else if (stage === 3) {
      const timer = setTimeout(
        () => {
          setStage(4);
        },
        noAnim ? 1 : 1000
      );
      return () => clearTimeout(timer);
    }
  }, [stage, noAnim]);
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
        <div className="h-screen w-screen absolute top-0 left-0 z-10 py-[10%] flex flex-col gap-4 items-center px-8">
          <div className={`flex flex-col items-center gap-2`}>
            <div
              className={`flex flex-row gap-4 w-full px-8 items-center pb-4`}
            >
              <img
                src={guildData?.icon!}
                className={`w-20 h-20 lg:w-16 lg:h-16 rounded-2xl ${
                  !guildData?.icon && `hidden`
                }`}
              />
              <h1 className="text-5xl lg:text-3xl font-poppins font-bold w-full">
                Open {guildData?.name} Crates
              </h1>
            </div>
            <span className="text-lg lg:text-lg font-wsans font-medium w-full px-8">
              Please confirm that you want to open all your crates below
            </span>
            <div className={`relative`}>
              <div
                className={`absolute w-full h-full top-0 left-0 bg-gradient-to-b from-gray-850/0 to-gray-850 via-gray-850/0 via-90% z-40 pointer-events-none`}
              />
              <div
                className={`w-fit h-[32rem] max-h-[50vh] overflow-auto relative`}
              >
                <div
                  className={`grid md:grid-cols-2 sm:grid-cols-1 2.5xl:grid-cols-3 3xl:grid-cols-5 inf:grid-cols-5 lg:justify-center w-fit gap-4 pb-24 px-8 pt-8`}
                >
                  {crates
                    .filter(
                      (x) =>
                        !x.opened &&
                        (x.guildID === guildID || x.guildID === `@global`)
                    )
                    .map((crate, i) => (
                      <OpenCrateRenderer
                        crate={crate}
                        guildID={guildID as string}
                        key={`inventory-crate-render-${crate._id}`}
                      />
                    ))}
                </div>
              </div>
            </div>
            <div
              className={`flex flex-row gap-8 justify-between w-full px-8 items-center`}
            >
              <div
                className={`flex flex-row gap-2 items-center font-medium text-gray-100/30 text-sm lg:bg-blend-hard-light`}
              >
                Skip Animations
                <Switch
                  checked={noAnim}
                  onChange={setNoAnim}
                  className={`${
                    noAnim ? "bg-indigo-500" : "bg-gray-200/10"
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-all`}
                >
                  <span
                    className={`${
                      noAnim ? "translate-x-6" : "translate-x-1"
                    } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                  />
                </Switch>
              </div>
              <button
                className=" px-8 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-2xl text-lg font-wsans font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={opening || unopenedCrates.length == 0}
                onClick={async () => {
                  if (opening) return;
                  setOpening(true);
                  for (let i = 0; i < unopenedCrates.length; i++) {
                    const crate = unopenedCrates[i];
                    const res = await fetcher(
                      `${await getGuildShardURL(
                        crate.guildID
                      )}/inventory/crates/${crate._id}/open`,
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
                    // if (i <= 3) {
                    //   await sleep(50);
                    // } else {
                    //   await sleep(5);
                    // }
                    setCratesOpened((v) => v + 1);
                    if (i === 3 || i === unopenedCrates.length - 1) {
                      setStage(2);
                    }
                  }
                  setOpening(false);

                  // CrateTimer.getInstance().open();
                }}
              >
                {opening
                  ? `Opening (${cratesOpened}/${unopenedCrates.length})`
                  : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      </Transition>

      {unopenedCrates.length > 0 && (
        <Transition
          show={stage >= 2}
          enter={`transition-opacity ${
            stage === -1
              ? `duration-[0ms] delay-[0ms]`
              : unopenedCrates.length > 4
              ? `duration-500`
              : `duration-1000`
          } ${noAnim && `!transition-none !delay-[0ms]`}`}
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave={`transition-opacity ${
            stage === -1
              ? `duration-[0ms] delay-[0ms]`
              : unopenedCrates.length > 4
              ? `duration-500`
              : `duration-1000`
          }  ${noAnim && `!transition-none !delay-[0ms]`}`}
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
                  stage === -1
                    ? `duration-[0ms] delay-[0ms]`
                    : unopenedCrates.length > 4
                    ? `duration-500`
                    : `duration-1000`
                } blur-xl  ${noAnim && `!transition-none !delay-[0ms]`}`}
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
              } ease-bounce transition-all duration-1000 delay-300  ${
                noAnim && `!transition-none !delay-[0ms]`
              }`}
            >
              <div
                className={`card rounded-3xl shadow-lg w-fit p-1.5 lg:p-1 sm:p-0.5 relative overflow-hidden shrink-0`}
              >
                <img
                  src={unopenedCrates[crateIndex].item.url}
                  alt=""
                  className={`w-[40rem] h-auto aspect-[1024/340] object-cover z-10 rounded-3xl ${
                    stage >= 4 ? `brightness-75` : `brightness-0 opacity-50`
                  } transition-all duration-1000 ease-in pointer-events-none  ${
                    noAnim && `!transition-none !delay-[0ms]`
                  }`}
                />

                {stage === 4 && !noAnim && (
                  <ConfettiExplosion
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
                    duration={5000}
                    force={0.6}
                    width={2000}
                    particleCount={
                      ~~(
                        50 *
                        rarityValue[unopenedCrates[crateIndex].item.rarity] **
                          0.5
                      )
                    }
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
                  } ease-bounce md:w-full delay-75  ${
                    noAnim && `!transition-none !delay-[0ms]`
                  }`}
                >
                  {crateIndex + 1}/{unopenedCrates.length}
                </span>
                <span
                  className={`text-lg lg:text-sm font-bold font-wsans text-gray-50/40 uppercase delay-500 duration-1000 transition-all ${
                    stage >= 3 ? `opacity-100` : `opacity-0 scale-50`
                  } ease-bounce md:w-full  ${
                    noAnim && `!transition-none !delay-[0ms]`
                  }`}
                >
                  Card Background
                </span>
                <h1
                  className={`text-5xl lg:text-2xl text-center font-poppins font-extrabold delay-[750ms] duration-[2000ms] transition-all ${
                    stage >= 3 ? `opacity-100` : `opacity-0 -translate-y-10`
                  } ease-out md:w-full  ${
                    noAnim && `!transition-none !delay-[0ms]`
                  }`}
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
                  } ease-out md:w-full  ${
                    noAnim && `!transition-none !delay-[0ms]`
                  }`}
                >
                  {rarityWordMap[unopenedCrates[crateIndex].item.rarity]}
                </span>

                <span
                  className={`text-xl lg:text-sm md:text-xs font-wsans font-medium delay-[2000ms] duration-1000 transition-all ${
                    stage >= 3 ? `opacity-100` : `opacity-0`
                  } md:w-full  ${
                    noAnim && `!transition-none !delay-[0ms]`
                  } w-full h-[30vh] overflow-auto p-4 bg-gray-900/40 shadow-inner rounded-xl my-6`}
                >
                  {unopenedCrates[crateIndex].item.description}
                </span>

                <Transition
                  show={stage >= 3}
                  enter={`delay-[2000ms] duration-1000  ${
                    noAnim && `!transition-none !delay-[0ms]`
                  }`}
                  enterFrom="opacity-0 scale-50"
                  enterTo="opacity-100 scale-100"
                  leave={`duration-1000 opacity-0 scale-50  ${
                    noAnim && `!transition-none !delay-[0ms]`
                  }`}
                >
                  {unopenedCrates[crateIndex + 1] !== undefined ? (
                    <button
                      onClick={increaseCrateIndex}
                      disabled={
                        unopenedCrates[crateIndex + 1] === undefined ||
                        cratesOpened <= crateIndex + 1
                      }
                      className="mx-auto px-6 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-2xl text-xl font-wsans font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {
                        // only allow opening of next crate if the next crate is loaded
                        cratesOpened > crateIndex + 1
                          ? `Next Crate`
                          : `Loading Crate...`
                      }
                    </button>
                  ) : (
                    <button
                      className={` px-6 py-2 md:px-4 md:py-1 md:mt-8 md:text-base bg-indigo-500 hover:bg-indigo-600 rounded-2xl text-xl font-wsans font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                      onClick={() => {
                        router.push(
                          `/app/guild/${guildID}/inventory/@me`
                        );
                      }}
                      // disabled={stage === 5}
                    >
                      Back to Inventory
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
