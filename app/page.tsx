"use client";
import { IParallax, Parallax, ParallaxLayer } from "@react-spring/parallax";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { Navbar } from "../components/Navbar";

export const LandingPage = () => {
  const paraRef = useRef<IParallax | null>(null);
  const router = useRouter();
  return (
    <>
      <Navbar />
      <Parallax pages={4} ref={paraRef} className={`bg-gray-900`}>
        <ParallaxLayer offset={0} speed={-0.2} factor={1}>
          <div className="w-full h-full overflow-hidden">
            <img
              src="/images/landing/landingbg.png"
              className="object-cover w-full h-full blur-md"
            />
            <div
              className={`absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-900/90 to-gray-900`}
            />
          </div>
        </ParallaxLayer>
        <ParallaxLayer offset={0} speed={1} factor={1}>
          <div
            className={`w-full h-full flex flex-row items-center justify-center gap-16 relative`}
          >
            <div
              className={`p-2 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500`}
            >
              <Image
                src="/images/landing/dazai.png"
                width={128}
                height={128}
                alt={"Dazai pfp"}
                className={`rounded-[64px] bg-gray-900`}
              />
            </div>
            <div className={`flex flex-col gap-8`}>
              <h1
                className={`font-bold font-poppins text-6xl bg-gradient-to-br from-indigo-300 to-purple-400 bg-clip-text text-transparent`}
              >
                Dazai Discord Bot
              </h1>
              <span
                className={`font-medium font-wsans text-xl text-gray-50/40`}
              >
                Version 3.0
              </span>
              <div className={`flex flex-row gap-8 items-center`}>
                <Link href="https://invite.dazai.app">
                  <button
                    className={`p-4 px-6 rounded-2xl font-bold text-white bg-purple-600 hover:bg-purple-500 transition-all`}
                    onClick={() => router.push("https://invite.dazai.app")}
                  >
                    Invite to your server
                  </button>
                </Link>
                <span
                  className={`text-gray-100/40 cursor-pointer hover:text-gray-100/80 transition-all`}
                  onClick={() => paraRef.current?.scrollTo(0.5)}
                >
                  Features
                </span>
              </div>
            </div>
          </div>
        </ParallaxLayer>
        <ParallaxLayer offset={0.999} speed={1} factor={1}>
          <div
            className={`w-full h-full flex flex-row items-center justify-center gap-16 relative`}
          >
            <div className={`flex flex-col gap-8 max-w-[80%] w-[100ch]`}>
              <h1
                className={`font-bold font-poppins text-6xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent`}
              >
                Music
              </h1>
            </div>
          </div>
        </ParallaxLayer>
      </Parallax>
    </>
  );
};
export default LandingPage;
