import { useEffect, useState } from "react";

let upd = 0;
let updateFuncs = new Set<() => void>();
function setUpd(u: number) {
  upd = u;
  updateFuncs.forEach((func) => func());
}
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export const startLandingTimer = async () => {
  setUpd(0.1);
  await sleep(100);
  setUpd(1);
  await sleep(100);
  setUpd(2);
  await sleep(1000);
  setUpd(3);
  await sleep(1000);
  setUpd(4);
};

export const useLandingTimer = () => {
  const [update, setUpdate] = useState(upd);
  useEffect(() => {
    const func = () => setUpdate(upd);
    updateFuncs.add(func);
    return () => {
      updateFuncs.delete(func);
    };
  }, []);
  return update;
};
