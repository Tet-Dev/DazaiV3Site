import Image from "next/image";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useElementSizeCalculation } from "../../utils/hooks/useElementSizeCalculation";
import {
  startLandingTimer,
  useLandingTimer,
} from "../../utils/hooks/useLandingTimer";
// import svg

export const LandingHero = () => {
  const update = useLandingTimer();
  const titleSize = useElementSizeCalculation("heroText");
  useEffect(() => {
    let loaded = false;
    if (softUpdate.current > 0) loaded = true;

    const onLoad = () => {
      if (loaded) return;
      loaded = true;
      startLandingTimer();
      console.log("loaded");
    };
    setTimeout(() => {
      if (loaded) return;
      loaded = true;
      startLandingTimer();
      console.log("loaded");
    }, 1000);
    console.log("loading");
    window.addEventListener("load", onLoad);
    return () => {
      window.removeEventListener("load", onLoad);
    };
  }, []);
  const softUpdate = useRef(0);
  useLayoutEffect(() => {
    softUpdate.current = update;
  }, [update]);

  return (
    <>
      {/* <h1
        className={`text-9xl font-black font-poppins leading-loose absolute opacity-0 pointer-events-none`}
        id="hText"
      >
        Dazai
      </h1> */}
      <div
        className={`w-full h-screen flex flex-col justify-center items-center relative shadow-none`}
      >
        <div
          className={`absolute top-0 left-0 w-full h-full z-10 transition-all duration-500 ease-out overflow-hidden`}
        >
          <img
            src="/images/landing/landingbgsmall.jpg"
            alt="hero-bg"
            className={`w-full h-full object-cover ${
              update >= 3 ? `opacity-10 blur-sm` : `opacity-0`
            }`}
          />
        </div>
        <div
          className={`absolute top-0 left-0 w-full h-full z-10 bg-gradient-to-b from-gray-900/0 via-gray-900/20 to-purple-500/20 ${
            update >= 3 ? `` : `opacity-0`
          } transition-all duration-500 ease-out delay-500`}
        />

        <div className={`flex flex-row gap-24 z-30`}>
          <div
            className={`w-fit h-fit border-4 border-indigo-400 bg-gray-900 rounded-full relative overflow-hidden ${
              update < 1 && `animate-pulse`
            }`}
          >
            <img
              src="/images/landing/dazaiFull.jpeg"
              width={256}
              height={256}
              alt=""
              className={`
            ${update >= 3 && `opacity-50 blur-sm`}
            transition-all duration-500 rounded-full 
            `}
            />
            <img
              src="/images/landing/dazaiTrans.png"
              width={256}
              height={256}
              alt=""
              className={`
              ${update >= 2 ? `opacity-100` : `opacity-0 `}
            transition-all duration-500 delay-200 rounded-full absolute top-0 left-0
            `}
            />
          </div>
          <div className={`absolute bottom-0 left-0 w-full shadow-none`}>
            <svg
              id="visual"
              viewBox="0 0 2400 600"
              version="1.1"
              className="saturate-[0.8]"
            >
              <path
                d="M0 246L57.2 260C114.3 274 228.7 302 343 302.8C457.3 303.7 571.7 277.3 686 288.2C800.3 299 914.7 347 1028.8 374.7C1143 402.3 1257 409.7 1371.2 410.7C1485.3 411.7 1599.7 406.3 1714 407C1828.3 407.7 1942.7 414.3 2057 398C2171.3 381.7 2285.7 342.3 2342.8 322.7L2400 303L2400 601L2342.8 601C2285.7 601 2171.3 601 2057 601C1942.7 601 1828.3 601 1714 601C1599.7 601 1485.3 601 1371.2 601C1257 601 1143 601 1028.8 601C914.7 601 800.3 601 686 601C571.7 601 457.3 601 343 601C228.7 601 114.3 601 57.2 601L0 601Z"
                className={`transition-all duration-1000 delay-700 ease-in-out fill-purple-500 ${
                  update < 2 ? `translate-y-full` : `translate-y-0`
                }`}
              ></path>
              <path
                d="M0 423L57.2 417.8C114.3 412.7 228.7 402.3 343 389.5C457.3 376.7 571.7 361.3 686 373.3C800.3 385.3 914.7 424.7 1028.8 431.7C1143 438.7 1257 413.3 1371.2 395.8C1485.3 378.3 1599.7 368.7 1714 373.5C1828.3 378.3 1942.7 397.7 2057 403.7C2171.3 409.7 2285.7 402.3 2342.8 398.7L2400 395L2400 601L2342.8 601C2285.7 601 2171.3 601 2057 601C1942.7 601 1828.3 601 1714 601C1599.7 601 1485.3 601 1371.2 601C1257 601 1143 601 1028.8 601C914.7 601 800.3 601 686 601C571.7 601 457.3 601 343 601C228.7 601 114.3 601 57.2 601L0 601Z"
                className={`transition-all duration-1000 delay-500 ease-in-out fill-fuchsia-400 ${
                  update < 2 ? `translate-y-full` : `translate-y-0`
                }`}
              ></path>
              <path
                d="M0 392L57.2 402.8C114.3 413.7 228.7 435.3 343 434.8C457.3 434.3 571.7 411.7 686 401.2C800.3 390.7 914.7 392.3 1028.8 403C1143 413.7 1257 433.3 1371.2 440.8C1485.3 448.3 1599.7 443.7 1714 455.3C1828.3 467 1942.7 495 2057 510.3C2171.3 525.7 2285.7 528.3 2342.8 529.7L2400 531L2400 601L2342.8 601C2285.7 601 2171.3 601 2057 601C1942.7 601 1828.3 601 1714 601C1599.7 601 1485.3 601 1371.2 601C1257 601 1143 601 1028.8 601C914.7 601 800.3 601 686 601C571.7 601 457.3 601 343 601C228.7 601 114.3 601 57.2 601L0 601Z"
                className={`transition-all duration-1000 delay-300 ease-in-out fill-indigo-500 ${
                  update < 2 ? `translate-y-full` : `translate-y-0`
                }`}
              ></path>
              <path
                d="M0 568L57.2 550.5C114.3 533 228.7 498 343 492.7C457.3 487.3 571.7 511.7 686 514.5C800.3 517.3 914.7 498.7 1028.8 486C1143 473.3 1257 466.7 1371.2 479.5C1485.3 492.3 1599.7 524.7 1714 528.5C1828.3 532.3 1942.7 507.7 2057 495.5C2171.3 483.3 2285.7 483.7 2342.8 483.8L2400 484L2400 601L2342.8 601C2285.7 601 2171.3 601 2057 601C1942.7 601 1828.3 601 1714 601C1599.7 601 1485.3 601 1371.2 601C1257 601 1143 601 1028.8 601C914.7 601 800.3 601 686 601C571.7 601 457.3 601 343 601C228.7 601 114.3 601 57.2 601L0 601Z"
                fill="#c026d3"
                className={`transition-all duration-1000 delay-100 ease-in-out fill-blue-600 ${
                  update < 2 ? `translate-y-full` : `translate-y-0`
                }`}
              ></path>
            </svg>
          </div>

          <div
            className={`flex flex-col gap-0 transition-all duration-1000 delay-500 overflow-hidden ${
              update >= 1 && `overflow-visible`
            } justify-evenly`}
            style={{
              width: update >= 1 ? titleSize?.width : "0px",
            }}
          >
            <div className={`flex flex-row gap-12 items-center`}>
              <h1
                className={`text-9xl font-black font-poppins bg-clip-text bg-gradient-to-r from-rose-300 via-fuchsia-400 to-indigo-400  ${
                  update >= 2
                    ? `opacity-100 text-transparent`
                    : `opacity-0 -translate-x-1/4 scale-90`
                } transition-all duration-500 delay-200 ease-in-out leading-none`}
                id="hText"
              >
                Dazai
              </h1>
              <div
                className={`px-6 py-3 text-2xl font-bold font-poppins bg-indigo-800 h-fit w-fit backdrop-blur-lg rounded-xl ${
                  update >= 2
                    ? `opacity-100`
                    : `opacity-0 -translate-x-full scale-90`
                } transition-all duration-500 delay-[300ms] ease-out`}
              >
                v3.0
              </div>
            </div>
            <div
              className={`text-5xl font-bold font-wsans transition-all duration-1000 delay-500 ease-in-out leading-none whitespace-nowrap
                ${update >= 2 ? `opacity-100` : `opacity-0 -translate-y-1/2`}
              `}
            >
              Your useful discord helper.
            </div>
            <div
              className={`flex flex-row gap-4 mt-6 ${
                update >= 2 ? `opacity-100` : `opacity-0 -translate-y-1/2`
              } transition-all duration-700 delay-[1000ms] ease-in-out items-center`}
            >
              <button
                className={`px-8 py-3 text-xl font-semibold font-wsans bg-black text-gray-50 rounded-2xl hover:bg-gray-50 hover:text-gray-900 transition-all z-20`}
              >
                Invite Bot
              </button>
              <button
                className={`px-4 py-2 text-base h-fit font-semibold font-wsans bg-gray-300/20 text-gray-50 rounded-2xl hover:bg-gray-50 hover:text-gray-900 transition-all ${
                  update >= 2 ? `opacity-100` : `opacity-0 -translate-x-1/2`
                } transition-all duration-700 delay-[1250ms] ease-in-out

                `}
              >
                Support Server
              </button>
            </div>
          </div>
          <div
            className={`flex flex-col gap-4 transition-all duration-1000 delay-500 overflow-none justify-evenly opacity-0 absolute`}
            id="heroText"
            // style={{
            //   width: update >= 1 ? titleSize?.width : "0px",
            // }}
          >
            <div className={`flex flex-row gap-12 items-center`}>
              <h1
                className={`text-9xl font-black font-poppins bg-clip-text bg-gradient-to-r from-rose-300 via-fuchsia-400 to-indigo-400  ${
                  update >= 2
                    ? `opacity-100 text-transparent`
                    : `opacity-0 -translate-x-1/2 scale-90`
                } transition-all duration-500 delay-200 ease-in-out leading-none`}
                id="hText"
              >
                Dazai
              </h1>
              <div
                className={`px-6 py-3 text-3xl font-bold font-poppins bg-black h-fit w-fit backdrop-blur-lg rounded-2xl`}
              >
                v3
              </div>
            </div>
            <div
              className={`text-5xl font-bold font-wsans transition-all duration-1000 delay-200 ease-in-out leading-none`}
            >
              Your useful discord helper.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
