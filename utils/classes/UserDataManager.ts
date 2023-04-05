import { APIUser } from "discord-api-types/v10";
import EventEmitter from "events";
import localforage from "localforage";
import { discordAPI } from "../constants";
import { fetcher } from "../discordFetcher";
import { getGuildShardURL } from "../ShardLib";
import { UserData } from "../types";

export class UserDataManager extends EventEmitter {
  static instance: UserDataManager;
  static getInstance() {
    if (!UserDataManager.instance) {
      UserDataManager.instance = new UserDataManager();
    }
    return UserDataManager.instance;
  }
  discordSelf: UserData | null | undefined = undefined;
  userCacheMap: Map<string, UserData> = new Map();
  private constructor() {
    super();
    this.getSelf();
    this.loadCache();
  }
  async loadCache() {
    localforage.getItem("discordSelf").then((discordSelf) => {
      if (discordSelf) {
        this.discordSelf = discordSelf as UserData;
        this.emit("selfUpdate", this.discordSelf);
      }
    });
    // localforage.getItem("userCacheMap").then((userCacheMap)=>{
    //   if(userCacheMap){
    //     this.userCacheMap = new Map(Object.entries(userCacheMap))
    //   }
    // })
  }
  async loadCachedUser() {
    const cachedUser = await localforage.getItem("discordSelf");
    const cachedUserVersion = await localforage.getItem("discordSelfVersion");
    if (cachedUserVersion === 1) {
      if (cachedUser) {
        this.discordSelf = cachedUser as UserData;
        this.emit("selfUpdate", this.discordSelf);
      }
    }
  }
  async getSelf() {
    const dself = await fetcher(`${await getGuildShardURL()}/user/@me`, {
      method: "GET",
    }).then((res) => (res.ok ? res.json() : null));
    this.discordSelf = dself;
    this.emit("selfUpdate", dself);
    await localforage.setItem("discordSelf", dself);
    await localforage.setItem("discordSelfVersion", 1);
    return dself;
  }
}
