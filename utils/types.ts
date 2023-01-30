import { APIGuild, APIRole } from "discord-api-types/v10";
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
  member: {
    nickname: string | null;
    roles: string[];
  };
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
