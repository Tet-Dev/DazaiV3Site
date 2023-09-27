import router from "next/router";
import { useState, useEffect } from "react";
import { fetcher } from "../../utils/discordFetcher";
import { useScroll } from "../../utils/hooks/useScroll";
import { getGuildShardURL } from "../../utils/ShardLib";
import {
  rarityGradientMap,
  nonAnimatedRarityGradientMap,
  rarityWordMap,
} from "../../utils/types";

export const LandingCustomRankCards = () => {
  const scroll = useScroll();
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
      setScale(scale * 0.4);
    };
    // add event listener
    window.addEventListener("resize", handleResize);
    // call handler right away so state gets updated with initial window size
    handleResize();
    // remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className={`w-full flex flex-col gap-2`}>
      <svg
        id="visual"
        viewBox="0 0 1500 300"
        version="1.1"
        className="saturate-[0.8]"
      >
        <path
          d="M0 116L55.5 132.8C111 149.7 222 183.3 333.2 194.7C444.3 206 555.7 195 666.8 189.5C778 184 889 184 1000 190C1111 196 1222 208 1333.2 199.2C1444.3 190.3 1555.7 160.7 1666.8 157.5C1778 154.3 1889 177.7 1944.5 189.3L2000 201L2000 0L1944.5 0C1889 0 1778 0 1666.8 0C1555.7 0 1444.3 0 1333.2 0C1222 0 1111 0 1000 0C889 0 778 0 666.8 0C555.7 0 444.3 0 333.2 0C222 0 111 0 55.5 0L0 0Z"
          className="fill-sky-400"
        ></path>
        <path
          d="M0 91L55.5 89.2C111 87.3 222 83.7 333.2 86.3C444.3 89 555.7 98 666.8 106.5C778 115 889 123 1000 135.3C1111 147.7 1222 164.3 1333.2 164C1444.3 163.7 1555.7 146.3 1666.8 142.2C1778 138 1889 147 1944.5 151.5L2000 156L2000 0L1944.5 0C1889 0 1778 0 1666.8 0C1555.7 0 1444.3 0 1333.2 0C1222 0 1111 0 1000 0C889 0 778 0 666.8 0C555.7 0 444.3 0 333.2 0C222 0 111 0 55.5 0L0 0Z"
          className={`fill-cyan-400`}
        ></path>
        <path
          d="M0 100L55.5 98.3C111 96.7 222 93.3 333.2 98.8C444.3 104.3 555.7 118.7 666.8 117.5C778 116.3 889 99.7 1000 95.5C1111 91.3 1222 99.7 1333.2 96.3C1444.3 93 1555.7 78 1666.8 77.5C1778 77 1889 91 1944.5 98L2000 105L2000 0L1944.5 0C1889 0 1778 0 1666.8 0C1555.7 0 1444.3 0 1333.2 0C1222 0 1111 0 1000 0C889 0 778 0 666.8 0C555.7 0 444.3 0 333.2 0C222 0 111 0 55.5 0L0 0Z"
          className={`fill-indigo-500`}
        ></path>
        {/* <path
          d="M0 89L55.5 82.7C111 76.3 222 63.7 333.2 65C444.3 66.3 555.7 81.7 666.8 83.7C778 85.7 889 74.3 1000 76C1111 77.7 1222 92.3 1333.2 87.3C1444.3 82.3 1555.7 57.7 1666.8 47.8C1778 38 1889 43 1944.5 45.5L2000 48L2000 0L1944.5 0C1889 0 1778 0 1666.8 0C1555.7 0 1444.3 0 1333.2 0C1222 0 1111 0 1000 0C889 0 778 0 666.8 0C555.7 0 444.3 0 333.2 0C222 0 111 0 55.5 0L0 0Z"
          fill="#e509a1"
        ></path> */}
        <path
          d="M0 36L55.5 36C111 36 222 36 333.2 40.3C444.3 44.7 555.7 53.3 666.8 52.7C778 52 889 42 1000 39C1111 36 1222 40 1333.2 44.7C1444.3 49.3 1555.7 54.7 1666.8 49.5C1778 44.3 1889 28.7 1944.5 20.8L2000 13L2000 0L1944.5 0C1889 0 1778 0 1666.8 0C1555.7 0 1444.3 0 1333.2 0C1222 0 1111 0 1000 0C889 0 778 0 666.8 0C555.7 0 444.3 0 333.2 0C222 0 111 0 55.5 0L0 0Z"
          className="fill-blue-600"
        ></path>
      </svg>
      <div className="flex flex-row gap-24 w-full mx-auto max-w-[125ch] h-fit items-center ">
        <div className={`relative w-7/12 h-fit shrink-0`}>
          <div className="p-1 h-fit -rotate-3 relative">
            <video
              autoPlay
              loop
              muted
              className={`w-full h-auto rounded-xl shadow-md z-10`}
              src={`/images/landing/dazaiInv.mp4`}
            />
            <div
              className={`absolute top-0 left-0 w-full h-full rounded-xl bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 blur-lg -z-10`}
            ></div>
          </div>

          <img
            src="/images/landing/cardEx.webp"
            className={`absolute bottom-0 translate-y-1/4 right-0 w-auto h-full rounded-2xl rotate-6`}
          />
        </div>
        <div className={`flex flex-col gap-8 h-full justify-center grow`}>
          <h2 className={`text-4xl font-extrabold leading-relaxed`}>
            <b
              className={` bg-gradient-to-r  from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent text-6xl`}
            >
              Customizable
            </b><br/>
            Server Rewards
          </h2>
          <p className={`text-2xl text-gray-300`}>
            Give your members a reason to stay active in your server by creating
            server rewards that they can earn by participating in your server.
          </p>
        </div>
      </div>
    </div>
  );
};
