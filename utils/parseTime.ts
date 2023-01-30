export const msToFormat = (d: number) => {
  let ms = Number(d);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor(((ms % 360000) % 60000) / 1000);
  return `${h > 0 ? `${h}:`.padStart(3, "0") : ""}${`${m}:`.padStart(3, "0")}${
    s > 0 ? `${s}`.padStart(2, "0") : "00"
  }`;
};
