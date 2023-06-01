import { APIGuild, APIRole, APIUser } from "discord-api-types/v10";
import { ObjectId } from "mongodb";
export type DiscordOauthBundle = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
};
export type RawUserData = {
  _id: ObjectId;
  userID: string;
  votes: number;
  points: number;
  highestStreak: number;
  currentStreak: number;
  lastVote: number;
  premiumUntil: number;
  remindVote: boolean;
  disableLevelUpMessages: boolean;
};
export type UserData = RawUserData & { user: APIUser };
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

export enum Rarity {
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
  [Rarity.COMMON]: 1,
  [Rarity.RARE]: 2,
  [Rarity.SUPER_RARE]: 3,
  [Rarity.EPIC]: 4,
  [Rarity.MYTHIC]: 5,
  [Rarity.LEGENDARY]: 6,
  [Rarity.EVENT_RARE]: 7,
  [Rarity.SECRET_RARE]: 8,
};

export type CardType = {
  _id: string | ObjectId;
  name: string;
  description: string;
  url: string;
  rarity: Rarity;
  guild?: string;
  sellPrice?: number;
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
export type CardPack = {
  _id: string | ObjectId;
  userID: string;
  guildID: string;
  createdAt: number;
  opened?: boolean;
  openedAt?: number;
  pack: CrateTemplate;
};

export type ShopItem = {
  _id: string | ObjectId;
  guildID: string;
  name: string;
  description: string;
  price: number;
  items: BundleItem[];
};

export type BundleItem = {
  type: "card" | "crate" | "role";
  itemID: string;
  count?: number;
};

export type GuildShop = {
  guildID: string;
  shopItems: ShopItem[];
  name: string;
  description: string;
  _id?: string | ObjectId;
};

export type CrateTemplate = {
  _id: string | ObjectId;
  name: string;
  description: string;
  items: string[];
  dropRates: {
    [key in Rarity]: number;
  };
  guild?: string;
  count?: number | [number, number] | null;
  packURL?: string;
};

export const rarityWordMap = {
  [Rarity.COMMON]: "Common",
  [Rarity.RARE]: "Rare",
  [Rarity.SUPER_RARE]: "Super Rare",
  [Rarity.EPIC]: "Epic",
  [Rarity.MYTHIC]: "Mythic",
  [Rarity.LEGENDARY]: "Legendary",
  [Rarity.EVENT_RARE]: "Event Rare",
  [Rarity.SECRET_RARE]: "Secret Rare",
};

export const rarityGradientMap = {
  [Rarity.LEGENDARY]: "from-indigo-500 to-indigo-500 via-pink-400",
  [Rarity.MYTHIC]: "from-pink-500 via-orange-400 to-pink-500",
  [Rarity.EPIC]: "from-purple-500 via-red-500 to-purple-500",
  [Rarity.SUPER_RARE]: "from-blue-500 via-violet-500 to-blue-500",
  [Rarity.RARE]: "from-green-500 via-teal-500 to-green-500",
  [Rarity.COMMON]: "from-gray-500 via-gray-500 to-gray-500",
  [Rarity.EVENT_RARE]: "from-yellow-200 via-emerald-200 to-yellow-200",
  [Rarity.SECRET_RARE]: "from-gray-700 via-gray-500 to-gray-700",
};
export const nonAnimatedRarityGradientMap = {
  [Rarity.LEGENDARY]: "from-indigo-500 to-pink-400",
  [Rarity.MYTHIC]: "from-orange-400 to-rose-400",
  [Rarity.EPIC]: "from-rose-500 to-fuchsia-500",
  [Rarity.SUPER_RARE]: "from-blue-500 to-violet-500",
  [Rarity.RARE]: "from-green-500 to-teal-500",
  [Rarity.COMMON]: "from-gray-500 to-gray-500",
  [Rarity.EVENT_RARE]: "from-yellow-200 to-emerald-200",
  [Rarity.SECRET_RARE]: "from-gray-700 to-gray-500",
};

export const rarityParticleColorMap = {
  [Rarity.LEGENDARY]: ["##818cf8", "#db2777", "#8b5cf6"],
  [Rarity.MYTHIC]: ["#f87171", "#be123c", "#9d174d"],
  [Rarity.EPIC]: ["#f472b6", "#e148ec", "#9748ec"],
  [Rarity.SUPER_RARE]: ["#2495ff", "#87ffff", "#7040ff"],
  [Rarity.RARE]: ["#34d399", "#00b303", "#00b591"],
  [Rarity.COMMON]: ["#a0aec0", "#bdcade", "#4a5568"],
  [Rarity.EVENT_RARE]: ["#f6e05e", "#80ffce", "#a3ffa9"],
  [Rarity.SECRET_RARE]: ["#a0aec0", "#cfe2ff", "#fce3ff"],
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
  viewingPerson?: {
    name: string;
    username: string;
    avatarURL: string;
    id: string;
  };
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
export type LevelUpRewardActionType =
  | LevelUpRewardRoleActionType
  | LevelUpRewardCardActionType
  | LevelUpRewardCrateActionType;

export interface BaseLevelUpRewardActionType {
  type: "role" | "card" | "crate";
  action: "add" | "remove";
}

export interface LevelUpRewardRoleActionType
  extends BaseLevelUpRewardActionType {
  type: "role";
  roleID: string;
}

export interface LevelUpRewardCardActionType
  extends BaseLevelUpRewardActionType {
  type: "card";
  cardID: string;
  count: number;
}

export interface LevelUpRewardCrateActionType
  extends BaseLevelUpRewardActionType {
  type: "crate";
  crateID: string;
  count: number;
}
