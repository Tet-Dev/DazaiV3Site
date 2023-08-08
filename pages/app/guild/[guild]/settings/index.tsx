import { Switch } from "@headlessui/react";
import router from "next/router";

// {
//     "_id": {
//       "$oid": "6408f803e015b48f611f3f99"
//     },
//     "guildID": "739559911033405592",
//     "enabled": true,
//     "useChannelWhitelist": false,
//     "channelIDs": [],
//     "blacklist": [],
//     "xpRange": [
//       50,
//       100
//     ],
//     "diminishingReturns": 1.001,
//     "cooldown": 2,
//     "resetPeriod": 86400000
//   }
export type GuildSettingsConfig = {
    levelling:{
        _id: string,
        guildID: string,
        enabled: boolean,
        useChannelWhitelist: boolean,
        channelIDs: string[],
        blacklist: string[],
        xpRange: number[],
        diminishingReturns: number,
        cooldown: number,
        resetPeriod: number
    },
    
}

export const SettingsPage = () => {
  return (
    <div
      className={`gap-8 2xl:gap-0 px-8 relative flex flex-col items-center justify-center flex-grow `}
    >
      <div
        className={`w-full relative h-screen flex flex-col gap-6 pt-8 overflow-auto transition-all max-w-[200ch] lg:max-w-[100vw] pb-8 items-center`}
      >
        <div className={`flex flex-col gap-4 w-full`}>
          <div
            className={`flex flex-row lg:flex-col gap-16 lg:gap-6 items-center`}
          >
            <h1 className={`text-3xl font-bold font-poppins lg:text-xl`}>
              Settings
            </h1>{" "}
          </div>
          <span className={`text-gray-400 font-wsans`}>
            Customize Dazai-Specific settings for your server.
          </span>
        </div>
        <div className="flex flex-col gap-12 w-full grow px-8">
          <div className="flex flex-col gap-4 w-full">
            <h2 className="text-lg font-bold font-poppins text-gray-200">
              XP and Leveling
            </h2>
            <div className="flex flex-row gap-4 items-center">
              <span className="text-gray-400 font-wsans">
                Enable Dazai's XP and Leveling System
              </span>
              {/* <Switch
                checked={0}
                // onChange={0}
                className={`${
                  0 ? "bg-indigo-500" : "bg-gray-200/10"
                } relative inline-flex h-6 w-11 items-center rounded-full transition-all`}
              >
                <span
                  className={`${
                    0 ? "translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch> */}
            </div>
            {/* <div className="flex flex-row gap-4 items-center">
                <span className="text-gray-400 font-wsans">Enable Dazai's Economy System</span> */}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;
