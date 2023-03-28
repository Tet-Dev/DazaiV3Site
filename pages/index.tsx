"use client";
import { IParallax, Parallax, ParallaxLayer } from "@react-spring/parallax";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef } from "react";
import { LandingHero } from "../components/Landing/LandingHero";
import { LandingXPLevelling } from "../components/Landing/LandingXPLevelling";
import { Navbar } from "../components/Navbar";
import { useLandingTimer } from "../utils/hooks/useLandingTimer";

const LandingPage = () => {
  const paraRef = useRef<IParallax | null>(null);
  const router = useRouter();
  const landingTimer = useLandingTimer();
  return (
    <div className={`w-full h-full flex flex-col`}>
      <Navbar />
      <LandingHero />
      {landingTimer >= 3 && (
        <>
          <LandingXPLevelling />
        </>
      )}
    </div>
  );
};
export default LandingPage;
