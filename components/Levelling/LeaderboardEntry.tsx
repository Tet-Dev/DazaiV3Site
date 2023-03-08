import { BiMedal } from "react-icons/bi";
import { FaCrown } from "react-icons/fa";
import { GuildLeaderboardEntry } from "../../utils/types";

const formatLargeNumber = (num: number) => {
  if (num < 1000) return ~~num;
  if (num < 1000000) return `${Math.floor(num / 100) / 10}K`;
  if (num < 1000000000) return `${Math.floor(num / 1000) / 1000}M`;
  return `${Math.floor(num / 1000000000)}B`;
};
const getRequiredXPForLevel = (level: number) => {
  level++;
  if (level <= 3) return level * 75;
  return Math.floor((100 * level ** 1.2) / 250) * 250;
};
const getIconForPlace = (place: number) => {
  switch (place) {
    case 0:
      return <FaCrown className={`text-yellow-400 w-6 h-6`} />;
    case 1:
      return <BiMedal className={`text-gray-200 w-6 h-6`} />;
    case 2:
      return <BiMedal className={`text-orange-400 w-6 h-6`} />;
  }
};
export const LeaderboardEntry = (props: {
  entry: GuildLeaderboardEntry;
  index: number;
}) => {
  const { entry, index } = props;
  return (
    <div
      className={`flex flex-row gap-4 p-4 bg-gray-800 rounded-3xl items-center relative overflow-hidden z-0 md:p-2 md:ring-2 ${
        index === 0
          ? `ring-4 ring-yellow-500`
          : index === 1
          ? `ring-4 ring-gray-300`
          : index === 2
          ? `ring-4 ring-orange-500 `
          : `ring-2 md:!ring ring-gray-500`
      }`}
    >
      <div className={`absolute top-0 left-0 w-full h-full`}>
        <div
          className={`absolute top-0 left-0 w-full h-full bg-gradient-to-l from-gray-900/80 via-gray-900/60 to-gray-900/50 z-10`}
        ></div>
        <div
          className={`w-full h-full bg-cover bg-center pointer-events-none opacity-90`}
          style={{
            backgroundImage: `url(${entry.card})`,
          }}
        />
      </div>

      <div
        className={`${
          index <= 2 ? `text-3xl p-0` : `text-base`
        } font-mono bg-black  w-10 h-10 md:w-6 md:h-6 md:p-0.5 flex flex-row items-center justify-center rounded-full z-10`}
      >
        {getIconForPlace(index) ?? (
          <span className={`font-bold`}>{index + 1}</span>
        )}
      </div>
      <img
        src={entry.user.avatarURL}
        className={`w-16 h-16 rounded-3xl z-10 md:w-10 md:h-10`}
      />
      <div className={`flex flex-col gap-3 md:gap-1 flex-grow z-10`}>
        <div className={`text-xl font-poppins font-medium md:text-base`}>
          {entry.user.username}
          <span className={`text-gray-400 text-base font-wsans md:text-sm`}>
            #{entry.user.discriminator}
          </span>
        </div>
        <div className={`flex flex-col gap-1`}>
          <div
            className={`w-full relative h-1 md:h-0.5 bg-gray-900 rounded-full`}
          >
            <div
              className={`absolute top-0 left-0 h-full bg-gradient-to-r ${
                index === 0
                  ? `from-yellow-400  to-amber-500`
                  : index === 1
                  ? `from-gray-300 to-gray-500`
                  : index === 2
                  ? `from-amber-500 to-orange-700`
                  : `from-white to-white`
              } rounded-full`}
              style={{
                width: `${Math.min(
                  (entry.xp * 100) / getRequiredXPForLevel(entry.level),
                  100
                )}%`,
              }}
            ></div>
          </div>
          <div className={`flex flex-row gap-1 text-gray-300 md:font-light`}>
            <div className={`text-xs`}>{formatLargeNumber(entry.xp)} XP</div>
            <div className={`text-xs text-gray-600`}>/</div>
            <div className={`text-xs`}>
              {formatLargeNumber(getRequiredXPForLevel(entry.level))} XP
            </div>
          </div>
        </div>
      </div>
      <div
        className={`flex flex-col gap-2 min-w-[5rem] h-16 items-center justify-center z-10`}
      >
        <div
          className={`text-2xl md:text-lg font-medium flex flex-row gap-1 text-gray-300`}
        >
          Lv.{" "}
          <b
            className={`bg-gradient-to-br  ${
              index === 0
                ? `from-yellow-400  to-amber-500`
                : index === 1
                ? `from-gray-300 to-gray-500`
                : index === 2
                ? `from-amber-500 to-orange-700`
                : `from-white to-white`
            } bg-clip-text text-transparent`}
          >
            {entry.level}
          </b>
        </div>
        {/* <div className={`text-xs`}>
              {formatLargeNumber(entry.xp)} XP
            </div> */}
      </div>

      {/* <div className={`flex flex-row gap-4`}>
            <div className={`flex flex-col gap-2`}>
              <div className={`text-2xl`}>{index + 1}</div>
              <div className={`text-sm`}>{entry.level}</div>
            </div>
            <div className={`flex flex-col gap-2`}>
              <div className={`text-2xl`}>{entry.user.username}</div>
              <div className={`text-sm`}>{entry.xp}</div>
            </div>
          </div> */}
    </div>
  );
};
