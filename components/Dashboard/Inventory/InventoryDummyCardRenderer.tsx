import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetcher } from "../../../utils/discordFetcher";
import { getGuildShardURL } from "../../../utils/ShardLib";
import {
  Rarity,
  CardType,
  nonAnimatedRarityGradientMap,
  rarityGradientMap,
  rarityParticleColorMap,
  rarityWordMap,
} from "../../../utils/types";
import { Modal } from "../../Modal";
import Tilt from "react-parallax-tilt";
export interface Card {
  amount: number;
}

export const DummyInventoryCardRenderer = (props: { owned?: boolean }) => {
  const [updating, setUpdating] = useState(false);
  const router = useRouter();
  const [scale, setScale] = useState(1);
  useEffect(() => {
    // calculate appropriate scale
    const cardHeight = 576;
    const cardWidth = 400;
    // on window resize, recalculate scale
    const handleResize = () => {
      const sW = window.innerWidth;
      const sH = window.innerHeight;
      // card should take up 75% of the screen height, but not more than 80% of the width
      const scale = Math.min((sH * 0.75) / cardHeight, (sW * 0.93) / cardWidth);

      // const scale = (sH * 0.4) / cardHeight;
      setScale(scale);
    };
    // add event listener
    window.addEventListener("resize", handleResize);
    // call handler right away so state gets updated with initial window size
    handleResize();
    // remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={` flex-col gap-1 p-2 rounded-3xl hover:bg-transparent transition-all md:flex`}
    >
      {/* <span className={`text-gray-50/40 w-fit font-wsans font-medium`}>
          {props.selected ? `Selected` : <>&nbsp;</>}
        </span> */}
      <div
        className={`card rounded-2xl shadow-lg relative shrink-0 z-10 h-fit group hover:scale-105 ease-in duration-200 cursor-pointer opacity-80 hover:opacity-100 bg-gradient-to-r ${
          rarityGradientMap[Rarity.COMMON]
        } p-1 overflow-hidden shrink-0 w-fit`}
        //   onClick={() => {
        //     setViewingCard(card);
        //     setCreateCard(false);
        //   }}
      >
        <div className={`w-[17.75rem] h-[6.64rem] bg-gray-900 animate-pulse rounded-2xl`} />
      </div>
    </div>
  );
};
