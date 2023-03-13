import Image from "next/image";
import { useRouter } from "next/router";
import { Crate } from "../../../utils/types";

export const InventoryCrateRenderer = (props: {
  crate: Crate;
  guildID: string;
}) => {
  const { crate, guildID } = props;
  const router = useRouter();
  return (
    <div
      className={`flex flex-col gap-4 p-6 bg-gray-800 rounded-3xl relative overflow-hidden w-96 h-64 lg:w-full border border-gray-100/10 group cursor-pointer`}
      onClick={() => {
        router.push(`/crate/${crate._id}`)
      }}
    >
      <div
        className={`bg-gradient-to-br from-indigo-300 to-purple-400 absolute w-full h-full top-0 left-0 opacity-40`}
      />
      <img
        src={`/images/crates/chest.png`}
        alt="chest"
        className={`object-cover grow-0 h-full w-auto z-10`}
      />
      <div
        className={`bg-gradient-to-t from-gray-900/90 via-gray-900/70 to-gray-900/20 w-full h-full absolute top-0 left-0 z-20 group-hover:opacity-50 transition-all`}
      />
      <div className={`absolute bottom-4 left-4 flex flex-col z-30`}>
        <h3 className={`text-gray-50 font-wsans font-extrabold text-xl`}>
          {crate.name}
        </h3>
      </div>
      <div className={`absolute top-4 right-4 flex flex-col z-30`}>
        <button
          className={`bg-indigo-500 group-hover:bg-indigo-400 text-gray-50 font-wsans font-bold text-sm px-4 py-2 rounded-xl transition-all`}
        >
          Open
        </button>
      </div>
    </div>
  );
};
