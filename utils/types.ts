import { APIGuild, APIRole } from "discord-api-types/v10";
import { ObjectId } from "mongodb";
export type DiscordOauthBundle = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
};
export type BotGuildData = {
  name: string;
  id: string;
  icon: string | null;
  roles: APIRole[];
  banner?: string;
  background?: string;
  member: {
    nickname: string | null;
    roles: string[];
  };
  hasAdmin?: boolean;
};

// MUSIC
export type MusicTrack = {
  title: string;
  url: string | undefined;
  duration: number | undefined;
  thumbnail: string | null | undefined;
  author: string | undefined;
  requestedBy?: {
    id: string;
    username: string;
    discriminator: string;
    avatar: string;
  };
};

//LEADERBOARD
export type GuildMemeberXP = {
  guildID: string;
  userID: string;
  level: number;
  xp: number;
  dailyMessages: number;
  resetAt: number;
};
export type GuildLeaderboardEntry = GuildMemeberXP & {
  user: {
    username: string;
    discriminator: string;
    avatarURL: string;
    id: string;
    banner: string | null;
    color: string | null;
  };
  card?: string | null;
};

// CRATES

export enum CardRarity {
  COMMON = "common",
  RARE = "rare",
  SUPER_RARE = "super_rare",
  EPIC = "epic",
  MYTHIC = "mythic",
  LEGENDARY = "legendary",
  EVENT_RARE = "event_rare",
  SECRET_RARE = "secret_rare",
}
export const rarityValue = {
  [CardRarity.COMMON]: 1,
  [CardRarity.RARE]: 2,
  [CardRarity.SUPER_RARE]: 3,
  [CardRarity.EPIC]: 4,
  [CardRarity.MYTHIC]: 5,
  [CardRarity.LEGENDARY]: 6,
  [CardRarity.EVENT_RARE]: 7,
  [CardRarity.SECRET_RARE]: 8,
};

export type CardType = {
  _id: string | ObjectId;
  name: string;
  description: string;
  url: string;
  rarity: CardRarity;
  guild?: string;
};

export type Crate = {
  _id: string | ObjectId;
  item: CardType;
  userID: string;
  guildID: string;
  createdAt: number;
  opened?: boolean;
  openedAt?: number;
  name: string;
  description: string;
};

export type CrateTemplate = {
  _id: string | ObjectId;
  name: string;
  description: string;
  items: string[];
  dropRates: {
    [key in CardRarity]: number;
  };
  guild?: string;
};

export const rarityWordMap = {
  [CardRarity.COMMON]: "Common",
  [CardRarity.RARE]: "Rare",
  [CardRarity.SUPER_RARE]: "Super Rare",
  [CardRarity.EPIC]: "Epic",
  [CardRarity.MYTHIC]: "Mythic",
  [CardRarity.LEGENDARY]: "Legendary",
  [CardRarity.EVENT_RARE]: "Event Rare",
  [CardRarity.SECRET_RARE]: "Secret Rare",
};

export const rarityGradientMap = {
  [CardRarity.LEGENDARY]: "from-indigo-500 to-indigo-500 via-pink-400",
  [CardRarity.MYTHIC]: "from-pink-500 via-red-500 to-pink-500",
  [CardRarity.EPIC]: "from-rose-500 via-fuchsia-500 to-rose-500",
  [CardRarity.SUPER_RARE]: "from-blue-500 via-violet-500 to-blue-500",
  [CardRarity.RARE]: "from-green-500 via-teal-500 to-green-500",
  [CardRarity.COMMON]: "from-gray-500 via-gray-500 to-gray-500",
  [CardRarity.EVENT_RARE]: "from-yellow-200 via-emerald-200 to-yellow-200",
  [CardRarity.SECRET_RARE]: "from-gray-700 via-gray-500 to-gray-700",
};

export const rarityParticleColorMap = {
  [CardRarity.LEGENDARY]: ["##818cf8", "#db2777", "#8b5cf6"],
  [CardRarity.MYTHIC]: ["#f87171", "#be123c", "#9d174d"],
  [CardRarity.EPIC]: ["#f472b6", "#e148ec", "#9748ec"],
  [CardRarity.SUPER_RARE]: ["#2495ff", "#87ffff", "#7040ff"],
  [CardRarity.RARE]: ["#34d399", "#00b303", "#00b591"],
  [CardRarity.COMMON]: ["#a0aec0", "#bdcade", "#4a5568"],
  [CardRarity.EVENT_RARE]: ["#f6e05e", "#80ffce", "#a3ffa9"],
  [CardRarity.SECRET_RARE]: ["#a0aec0", "#cfe2ff", "#fce3ff"],
};

export type GuildInventory = {
  userID: string;
  guildID: string;
  cards: {
    cardID: string;
    id: string;
    card: CardType;
  }[];
  selectedCard?: string;
  money?: number;
};

export type LevelUpRewardType =
  | LevelUpAtLevelRewardType
  | LevelUpEveryNLevelsRewardType;
export interface BaseLevelUpRewardType {
  _id: string | ObjectId;
  guildID: string;
  type: "everyNLevels" | "atLevel";
  name: string;
  rewards: LevelUpRewardActionType[];
}

export interface LevelUpAtLevelRewardType extends BaseLevelUpRewardType {
  type: "atLevel";
  level: number;
}

export interface LevelUpEveryNLevelsRewardType extends BaseLevelUpRewardType {
  type: "everyNLevels";
  everyNLevel: number;
  offset: number;
}
 export type LevelUpRewardActionType = LevelUpRewardRoleActionType | LevelUpRewardCardActionType | LevelUpRewardCrateActionType;

export interface BaseLevelUpRewardActionType {
  type: "role" | "card" | "crate";
  action: "add" | "remove";
}

export interface LevelUpRewardRoleActionType extends BaseLevelUpRewardActionType {
  type: "role";
  roleID: string;
}

export interface LevelUpRewardCardActionType extends BaseLevelUpRewardActionType {
  type: "card";
  cardID: string;
  count: number;
}

export interface LevelUpRewardCrateActionType extends BaseLevelUpRewardActionType {
  type: "crate";
  crateID: string;
  count: number;
}
