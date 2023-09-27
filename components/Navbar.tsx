"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useLayoutEffect, useState } from "react";
import { clientID } from "../utils/constants";
import { useDiscordUser } from "../utils/hooks/useDiscordUser";
import { renderUsername } from "../utils/renderUsername";

export const Navbar = () => {
  const router = useRouter();
  const [location, setLocation] = useState("");
  useEffect(() => {
    setLocation(window.location.origin);
  }, []);
  const { user } = useDiscordUser();
  return (
    <div
      className={`p-2 pr-4 flex flex-row gap-8 absolute top-4 right-4 z-30 bg-black rounded-full w-fit items-center lg:w-[90vw] lg:p-1 lg:pr-2`}
    >
      <div
        // width={64}
        // height={64}
        className={`rounded-full flex-shrink-0 w-16 h-16 lg:w-6 lg:h-6 transition-all duration-500 bg-center bg-cover relative group ${
          !user && `pointer-events-none`
        }`}
        style={{
          backgroundImage: `url(${
            user?.avatar
              ? `https://cdn.discordapp.com/avatars/${user?.id}/${
                  user?.avatar
                }${user?.avatar.startsWith("a_") ? ".gif" : ".webp"}?size=256`
              : `/images/landing/dazai.webp`
          })`,
        }}
      >
        <div
          className={`absolute bottom-0 translate-y-[calc(100%+1rem)] -translate-x-1/2 lg:translate-x-0 lg:origin-top-left left-0 w-max bg-gray-900 p-2 text-white rounded-lg scale-0 origin-top group-hover:scale-100 duration-200 transition-all`}
        >
          Signed in as {renderUsername(user)}
        </div>
      </div>
      <div
        className={`flex flex-row gap-4 items-center justify-center h-auto text-base lg:text-sm lg:grow`}
      >
        <Link href="/">
          <span
            className={`font-medium font-wsans  text-gray-50 hover:text-indigo-400 cursor-pointer`}
          >
            Home
          </span>
        </Link>
        <Link href="/legal">
          <span
            className={`font-medium font-wsans text-gray-50 hover:text-indigo-400 cursor-pointer`}
          >
            Legal
          </span>
        </Link>
        {/* <Link href="/legal/privacy">
          <span
            className={`font-medium font-wsans text-base text-gray-50 hover:text-indigo-400 cursor-pointer`}
          >
            Privacy
          </span>
        </Link> */}
      </div>
      <Link
        href={
          user
            ? `/app`
            : `https://discord.com/api/oauth2/authorize?client_id=${clientID}&redirect_uri=${encodeURIComponent(
                location
              )}%2Fauth&response_type=code&scope=identify%20email%20connections%20guilds`
        }
      >
        <button
          className={`p-2 px-6 lg:p-1 lg:px-3 lg:text-sm text-center h-fit rounded-full font-bold text-lg text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:pointer-events-none transition-all`}
          disabled={user === undefined ? true : false}
        >
          {user ? `Dashboard` : `Login`}
        </button>
      </Link>
    </div>
  );
};
