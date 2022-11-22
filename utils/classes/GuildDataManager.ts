import { APIGuild } from "discord-api-types/v10";
import EventEmitter from "events";
import localforage from "localforage";
import { discordAPI } from "../constants";
import { fetcher } from "../discordFetcher";
import { getGuildShardURL } from "../ShardLib";
import { DiscordGuildData } from "../types";

export class GuildDataManager extends EventEmitter {
  static instance: GuildDataManager;
  static getInstance(): GuildDataManager {
    if (!GuildDataManager.instance) {
      GuildDataManager.instance = new GuildDataManager();
    }
    return GuildDataManager.instance;
  }
  guildMap: Map<string, DiscordGuildData> | undefined;
  guildRegistrations: Map<string, Partial<APIGuild>> | undefined;
  private constructor() {
    super();
    this.loadCache();
    this.getGuildRegistrations(true);
  }
  async loadCache() {
    localforage.getItem("guildMap").then((guildMap) => {
      if (guildMap) {
        this.guildMap = new Map(guildMap as Map<string, DiscordGuildData>);
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
  async getGuildData(guildID: string): Promise<DiscordGuildData | null> {
    const guildData = (await fetcher(
      `http://${getGuildShardURL(guildID)}/api/guilds/${guildID}`,
      {
        method: "GET",
      }
    ).then((res) => (res.ok ? res.json() : null))) as DiscordGuildData;
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
  ): Promise<(DiscordGuildData | undefined)[]> {
    const guildsData = (await fetcher(
      `http://${getGuildShardURL(guildIDs[0])}/api/guilds/multi`,

      {
        method: "POST",
        body: JSON.stringify({
          guildIDs,
        }),
      }
    ).then((res) => (res.ok ? res.json() : null))) as {
      id: string;
      guild?: DiscordGuildData;
      error?: string;
    }[];
    if (guildsData) {
      this.guildMap = this.guildMap ?? new Map();
      guildsData.forEach((guildData) => {
        if (guildData.guild) {
          console.log({ guildData });
          this.guildMap!.set(guildData.id, guildData.guild);
          // this.emit("guildDataUpdate", guildData.guild);
        }
        if (guildData.error){
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
      });
      this.emit("guildRegistrationsUpdate", guildRegistrations);
      await localforage.setItem("guildRegistrations", this.guildRegistrations);
    }
    if (updateGuildData) {
      await this.getGuildsData(guildRegistrations.map((guild) => guild.id!));
    }
    return guildRegistrations;
  }
}
