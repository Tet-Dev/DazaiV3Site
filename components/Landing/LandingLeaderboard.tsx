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

export const LandingLeaderboard = () => {
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
      <div className="flex flex-row gap-24 w-full mx-auto max-w-[120ch] h-fit items-center ">
        <div
          className={`relative w-7/12 h-fit shrink-0 px-1 flex flex-row justify-start`}
        >
          <div className="p-1 h-fit -rotate-6 relative w-1/2 z-10">
            <img
              src="/images/landing/leaderboard.png"
              className={`w-auto h-full rounded-2xl`}
            />
            <div
              className={`absolute top-0 left-0 w-full h-full rounded-xl bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 blur-lg -z-10`}
            ></div>
          </div>
          <div
            className={`absolute bottom-[50%] right-1/4 translate-x-1/4 w-[55%] h-auto aspect-[1024/340] rounded-2xl rotate-6 z-30`}
          >
            <div className={`relative`}>
              <video
                src="/images/landing/rankcards/rankcard.mp4"
                autoPlay
                loop
                muted
                className={`w-full h-auto rounded-xl z-10`}
              />
              <div
                className={`absolute top-0 left-0 w-full h-full rounded-xl bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 blur-md -z-10`}
              ></div>
            </div>
          </div>
          <div
            className={`absolute bottom-[35%] right-1/4 translate-x-1/4 w-[45%] h-auto aspect-[1024/340] rounded-2xl rotate-0 z-20`}
          >
            <div className={`relative`}>
              <img
                src="/images/landing/rankcards/card2.png"
                className={`w-full h-auto rounded-xl z-10 brightness-90 blur-[0.5px]`}
              />
              <div
                className={`absolute top-0 left-0 w-full h-full rounded-xl bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 blur-md -z-10`}
              ></div>
            </div>
          </div>
          <div
            className={`absolute bottom-[25%] right-1/4 translate-x-1/4 w-[35%] h-auto aspect-[1024/340] rounded-2xl -rotate-6 z-10`}
          >
            <div className={`relative`}>
              <img
                src="/images/landing/rankcards/card1.png"
                className={`w-full h-auto rounded-xl z-10 brightness-90 blur-[0.5px]`}
              />
              <div
                className={`absolute top-0 left-0 w-full h-full rounded-xl bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 blur-md -z-10`}
              ></div>
            </div>
          </div>
        </div>
        <div className={`flex flex-col gap-8 h-full justify-center grow`}>
          <h2 className={`text-4xl font-extrabold leading-relaxed`}>
            <b
              className={` bg-gradient-to-r  from-pink-300 via-purple-300 to-indigo-400 bg-clip-text text-transparent text-6xl`}
            >
              Incentivize
            </b>
            <br />
            Server Activity
          </h2>
          <p className={`text-2xl text-gray-300`}>
            Give your members a reason to stay active in your server. The more
            they talk, the more they level up!
          </p>
        </div>
      </div>
    </div>
  );
};
