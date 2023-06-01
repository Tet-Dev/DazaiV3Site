import { EventEmitter } from "events";
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export class CrateTimer extends EventEmitter {
  static instance: CrateTimer;
  static getInstance(): CrateTimer {
    if (!CrateTimer.instance) {
      CrateTimer.instance = new CrateTimer();
    }
    return CrateTimer.instance;
  }
  opening: boolean = false;
// crateData:
  constructor() {
    super();
  }
  async loadAudioFiles(){

  }
  async open() {
    if (this.opening) return;
    this.opening = true;
    this.emit("cameraShake");
    await sleep(2000);
    this.emit("stopCameraShake");
    await sleep(200);
    this.emit("crateOpen");
    await sleep(400);
    this.emit("cratePresent");
    await sleep(200);
    this.opening = false;
  }
}
