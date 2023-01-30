import { APIGuild } from "discord-api-types/v10";
import EventEmitter from "events";
import localforage from "localforage";
import { discordAPI } from "../constants";
import { fetcher } from "../discordFetcher";
import { getGuildShardURL } from "../ShardLib";
import { BotGuildData } from "../types";

export class GuildDataManager extends EventEmitter {
  static instance: GuildDataManager;
  static getInstance(): GuildDataManager {
    if (!GuildDataManager.instance) {
      GuildDataManager.instance = new GuildDataManager();
    }
    return GuildDataManager.instance;
  }
  guildMap: Map<string, BotGuildData> | undefined;
  guildRegistrations: Map<string, Partial<APIGuild>> | undefined;
  private constructor() {
    super();
    this.loadCache();
    this.getGuildRegistrations(true);
  }
  async loadCache() {
    localforage.getItem("guildMap").then((guildMap) => {
      if (guildMap) {
        this.guildMap = new Map(guildMap as Map<string, BotGuildData>);
        console.log("Loaded guildMap from cache", guildMap);
        this.emit("guildDataBulkUpdate", Array.from(this.guildMap.values()));
        // this.emit("guildDataUpdate", Array.from(this.guildMap.values()));
      }
    });
    localforage.getItem("guildRegistrations").then((guildRegistrations) => {
      if (guildRegistrations) {
        this.guildRegistrations = new Map(
          guildRegistrations as Map<string, Partial<APIGuild>>
        );
        this.emit(
          "guildRegistrationsUpdate",
          Array.from(this.guildRegistrations.values())
        );
      }
    });
  }
  async getGuildData(guildID: string): Promise<BotGuildData | null> {
    const guildData = (await fetcher(
      `${getGuildShardURL(guildID)}/api/guilds/${guildID}`,
      {
        method: "GET",
      }
    ).then((res) => (res.ok ? res.json() : null))) as BotGuildData;
    this.guildMap = this.guildMap ?? new Map();
    if (guildData) {
      this.guildMap.set(guildID, guildData);
      this.emit("guildDataUpdate", guildData);
      await localforage.setItem("guildMap", this.guildMap);
    }
    return guildData;
  }
  async getGuildsData(
    guildIDs: string[]
  ): Promise<(BotGuildData | undefined)[]> {
    const guildsData = (await fetcher(
      `${getGuildShardURL(guildIDs[0])}/api/guilds/multi`,

      {
        method: "POST",
        body: JSON.stringify({
          guildIDs,
        }),
      }
    ).then((res) => (res.ok ? res.json() : null))) as {
      id: string;
      guild?: BotGuildData;
      error?: string;
    }[];
    if (guildsData) {
      this.guildMap = this.guildMap ?? new Map();
      guildsData.forEach((guildData) => {
        if (guildData.guild) {
          this.guildMap!.set(guildData.id, guildData.guild);
          this.emit("guildDataUpdate", guildData.guild, true);
        }
        if (guildData.error) {
          this.guildMap!.delete(guildData.id);
        }
      });
      this.emit("guildDataBulkUpdate", guildsData);
      await localforage.setItem("guildMap", this.guildMap);
    }
    return guildsData.map((guildData) => guildData.guild);
  }

  async getGuildRegistrations(
    updateGuildData: boolean = false
  ): Promise<Partial<APIGuild>[]> {
    const guildRegistrations = (await fetcher(
      `${discordAPI}/users/@me/guilds`,
      {
        method: "GET",
      }
    ).then((res) => (res.ok ? res.json() : null))) as Partial<APIGuild>[];
  if (guildRegistrations) {
      this.guildRegistrations = this.guildRegistrations ?? new Map();
      guildRegistrations.forEach((guild) => {
        this.guildRegistrations!.set(guild.id!, guild);
        this.emit("guildRegistrationUpdate", guild, true);
      });
      this.emit("guildRegistrationsUpdate", guildRegistrations);
      await localforage.setItem("guildRegistrations", this.guildRegistrations);
      if (updateGuildData) {
        await this.getGuildsData(guildRegistrations.map((guild) => guild.id!));
      }
    }

    return guildRegistrations;
  }
  async getGuildRegistration(
    guildID: string
  ): Promise<Partial<APIGuild> | null> {
    const guildRegistration = (await fetcher(
      `${discordAPI}/users/@me/guilds/${guildID}`,
      {
        method: "GET",
      }
    ).then((res) => (res.ok ? res.json() : null))) as Partial<APIGuild>;
    if (guildRegistration) {
      this.guildRegistrations = this.guildRegistrations ?? new Map();
      this.guildRegistrations!.set(guildID, guildRegistration);
      this.emit("guildRegistrationUpdate", guildRegistration);
      await localforage.setItem("guildRegistrations", this.guildRegistrations);
    }
    return guildRegistration;
  }
}
