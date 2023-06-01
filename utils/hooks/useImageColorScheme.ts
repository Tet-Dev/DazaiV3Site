import { extractColors, FinalColor } from "extract-colors";
import { useEffect, useState } from "react";

export const useImageColorScheme = (url: string) => {
  const [colorScheme, setColorScheme] = useState(null as null | FinalColor[]);
  useEffect(() => {
    let cancel = false;
    extractColors(url, {
      pixels: 12000,
    }).then((colors) => {
      if (cancel) return;
      colors?.sort((a, b) => b.area - a.area);
      setColorScheme(colors);
    });
    return () => {
      cancel = true;
    };
  }, [url]);
  return colorScheme;
};
const HSLToRGB = (h: number, s: number, l: number) => {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [255 * f(0), 255 * f(8), 255 * f(4)];
};
const RGBToHex = (r: number, g: number, b: number) =>
  "#" +
  [r, g, b]
    .map((x) => {
      const hex = Math.round(x).toString(16);
      console.log({ hex });
      return hex.length === 1 ? "0" + hex : hex;
    })
    .join("");
//   const hslToHex = (h: number, s: number, l: number) => {

export const getBackgroundColor = (colorScheme: FinalColor[]) => {
  if (!colorScheme) return "#000000";
  //find a color that is not too dark and not too light
  const primaryColor =
    colorScheme.find(
      (color) => color.lightness > 0.15 && color.lightness < 0.8
    ) || colorScheme[0];
  console.log({ primaryColor });
  return RGBToHex(
    ...(HSLToRGB(
      (primaryColor.hue * 360) % 360,
      Math.min(primaryColor.saturation * 100, 40),
      primaryColor.lightness < 15 ? primaryColor.lightness * 100 : 80
    ) as [number, number, number])
  );
};

export const getComplemetaryColor = (colorScheme: FinalColor[]) => {
  const primaryColor =
    colorScheme.find(
      (color) => color.lightness > 0.15 && color.lightness < 0.8
    ) || colorScheme[0];
  console.log({ primaryColor });
  return RGBToHex(
    ...(HSLToRGB(
      (primaryColor.hue * 360 + 180) % 360,
      Math.min(primaryColor.saturation * 100, 35),
      90
    ) as [number, number, number])
  );
};
export const getEmissiveColor = (colorScheme: FinalColor[]) => {
  const primaryColor =
    colorScheme.find((color) => color.lightness > 0.3) || colorScheme[0];
  console.log("[Emissive]", { primaryColor, colorScheme });

  return RGBToHex(
    ...(HSLToRGB(
      (primaryColor.hue * 360) % 360,
      Math.min(primaryColor.saturation * 100, 40),
      55
    ) as [number, number, number])
  );
};
