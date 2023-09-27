import { IParallax, Parallax, ParallaxLayer } from "@react-spring/parallax";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef } from "react";
import { LandingHero } from "../components/Landing/LandingHero";
import { LandingCustomRankCards } from "../components/Landing/LandingCustomRankCards";
import { Navbar } from "../components/Navbar";
import { useLandingTimer } from "../utils/hooks/useLandingTimer";
import { LandingLeaderboard } from "../components/Landing/LandingLeaderboard";
import { GetServerSideProps } from "next";

const LandingPage = () => {
  const paraRef = useRef<IParallax | null>(null);
  const router = useRouter();
  const landingTimer = useLandingTimer();
  return (
    <div
      className={`w-full h-full flex flex-col bg-gray-850 overflow-hidden pb-64`}
    >
      <Navbar />
      <LandingHero />
      {landingTimer >= 3 && (
        <div className={`flex flex-col gap-72`}>
          <LandingCustomRankCards />
          <LandingLeaderboard />
        </div>
      )}
      <h3 className={`text-2xl text-gray-50/80 text-center mt-64`}>
        Site is still in development, so some features may not work as intended.
      </h3>
    </div>
  );
};
export default LandingPage;
// export const getServerSideProps: GetServerSideProps= async (ctx) => {
//   const { guild } = ctx.;
//   if (!ctx) {
//     return {
//       redirect: {
//         destination: "/app",
//         permanent: false,
//       },
//     };
//   }
//   return {
//     props: {},
//   };
// }
