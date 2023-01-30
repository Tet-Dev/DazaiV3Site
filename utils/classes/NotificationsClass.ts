import EventEmitter from "events";

export type Notif = {
  title: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  image?: string;
  duration?: number;
  onClick?: () => void;
  uuid?: string;
};
export class NotificationsClass extends EventEmitter {
  notifs: Notif[];
  private static instance: NotificationsClass;
  private constructor() {
    super();
    this.notifs = [];
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new NotificationsClass();
    }
    return this.instance;
  }
  addNotif(notif: Notif) {
    console.log("addNotif", notif);
    const newnotif = {
      ...notif,
      uuid: Math.random().toString(36).substr(2, 9),
    };
    this.notifs.push(newnotif);
    this.emit("notify", newnotif);
  }
  removeNotif(notifID: string) {
    console.log("removeNotif", notifID);
    this.notifs = this.notifs.filter((n) => n.uuid !== notifID);
    console.log("removeNotif", this.notifs);
    this.emit("notifGone", notifID);
  }
  getNotifs() {
    return this.notifs;
  }
}
