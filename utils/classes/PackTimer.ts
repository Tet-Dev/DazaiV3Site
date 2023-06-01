import { EventEmitter } from "events";
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export class PackTimer extends EventEmitter {
  static instance: PackTimer;
  static getInstance(): PackTimer {
    if (!PackTimer.instance) {
      PackTimer.instance = new PackTimer();
    }
    return PackTimer.instance;
  }
  opening: boolean = false;
  cardPullAudio = new Audio("/audio/crates/cardPull.mp3");
  dustAudio = new Audio("/audio/crates/dust.mp3");
  openPackAudio = new Audio("/audio/crates/openPack.mp3");

  constructor() {
    super();
    this.dustAudio.play()
  }

  async open() {
    if (this.opening) return;
    if (!this.dustAudio.currentTime || this.dustAudio.currentTime === 0) {
      this.dustAudio.play();
    }
    this.opening = true;
    this.openPackAudio.play();
    this.emit("preOpen", true);
    await sleep(150);
    this.emit("ripPack", true);
    await sleep(2000);
    alert("Pong!");
    // this.emit("preOpen", false);
    this.opening = false;
  }
  async tapCard() {
    this.cardPullAudio.cloneNode().play();
  }
}
