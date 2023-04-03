import { GlobeAltIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRouter } from "next/router";
import { Crate } from "../../../../utils/types";

export const OpenCrateRenderer = (props: { crate: Crate; guildID: string }) => {
  const { crate, guildID } = props;
  const router = useRouter();
  return (
    <div
      className={`flex flex-col gap-4 bg-gray-800 rounded-3xl relative w-72 h-48 lg:w-full border border-gray-100/5 group cursor-default`}
    >
      <div
        className={`bg-gradient-to-r from-indigo-300 via-purple-400 to-indigo-300  absolute w-full h-full top-0 left-0 opacity-40 rounded-3xl`}
      />
      <div
        className={`bg-gradient-to-r from-indigo-300 via-purple-400 to-indigo-300 animate-gradient-medium absolute w-full h-full top-0 left-0 rounded-3xl blur-md group-hover:opacity-50 brightness-75 opacity-0 transition-all`}
      />
      <div
        className={`w-full h-full overflow-hidden flex items-center justify-center`}
      >
        <img
          src={`/images/crates/chest2.png`}
          alt="chest"
          className={`object-cover grow-0 h-full w-auto z-10 blur-sm group-hover:blur-0 transition-all duration-300 group-hover:animate-bounce-mini2`}
        />
      </div>
      <div
        className={`bg-gradient-to-t from-gray-900/90 via-gray-900/70 to-gray-900/20 w-full h-full absolute top-0 left-0 z-20 group-hover:opacity-70 transition-all rounded-3xl`}
      />
      <div className={`absolute bottom-4 left-4 flex flex-col z-30`}>
        <h3 className={`text-gray-50 font-wsans font-extrabold text-xl`}>
          {crate.name}
        </h3>
      </div>
      {crate.guildID === `@global` && (
        <div
          className={`absolute z-10 top-2.5 right-2.5 p-1 bg-gray-900/70 backdrop-blur-sm w-fit h-fit flex flex-row items-center justify-center rounded-full text-xs font-medium font-wsans gap-1`}
        >
          <GlobeAltIcon className={`w-4 h-4`} /> <span>Global Crate</span>
        </div>
      )}
    </div>
  );
};
