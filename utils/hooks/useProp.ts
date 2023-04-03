import { useState, useEffect, useCallback } from "react";
import { fetcher } from "../discordFetcher";
import { getGuildShardURL } from "../ShardLib";

/**
 *
 * @param prop Prop Type
 * @returns value. undefined = unloaded, null=404, T=prop
 */
export const useAPIProp = <T>(
  APIPath?: string,
  guildID?: string,
  requestInit?: RequestInit
) => {
  const [value, setValue] = useState(undefined as null | undefined | T);
  const [error, setError] = useState(undefined as null | undefined | string);
  const update = useCallback(async () => {
    if (!APIPath) return null;
    const guildURL = await getGuildShardURL(guildID);
    const resp = await fetcher(`${guildURL}${APIPath}`, requestInit).catch(
      (e) => {
        console.error(e);
        return null;
      }
    );
    if (!resp) return setValue(null);
    if (!resp.ok) {
      setError(`${resp.status} ${await resp.text()}`);
      return setValue(null);
    }
    const json = await resp.json();
    setValue(json);
  }, [APIPath, requestInit]);

  useEffect(() => {
    update();
  }, [APIPath, requestInit]);
  return [value, update, error] as [
    null | undefined | T,
    () => Promise<void>,
    null | undefined | string
  ];
};