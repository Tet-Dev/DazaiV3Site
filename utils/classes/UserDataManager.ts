import { APIUser } from "discord-api-types/v10";
import EventEmitter from "events";
import localforage from "localforage";
import { discordAPI } from "../constants";
import { fetcher } from "../discordFetcher";

export class UserDataManager extends EventEmitter {
  static instance: UserDataManager;
  static getInstance() {
    if (!UserDataManager.instance) {
      UserDataManager.instance = new UserDataManager();
    }
    return UserDataManager.instance;
  }
  discordSelf: APIUser | null | undefined = undefined;
  userCacheMap: Map<string, APIUser> = new Map();
  private constructor() {
    super();
    this.getSelf();
    this.loadCache();
  }
  async loadCache() {
    localforage.getItem("discordSelf").then((discordSelf) => {
      if (discordSelf) {
        this.discordSelf = discordSelf as APIUser;
        this.emit("selfUpdate", this.discordSelf);
      }
    });
    // localforage.getItem("userCacheMap").then((userCacheMap)=>{
    //   if(userCacheMap){
    //     this.userCacheMap = new Map(Object.entries(userCacheMap))
    //   }
    // })
  }
  async getSelf() {
    const dself = await fetcher(`${discordAPI}/users/@me`, {
      method: "GET",
    }).then((res) => (res.ok ? res.json() : null));
    this.discordSelf = dself;
    this.emit("selfUpdate", dself);
    await localforage.setItem("discordSelf", dself);
    return dself;
  }
}
