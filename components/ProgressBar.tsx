import { useEffect, useRef } from "react";
import { configureColor } from "../utils/nprogress";

export const ProgressBar = () => {
  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    configureColor(divRef.current!.className);
  }, [divRef]);
  return (
    <div
      className={`!bg-gradient-to-r !from-pink-300 !via-purple-300 !to-indigo-400`}
      ref={divRef}
      role="bar"
      style={{
        position: "fixed",
        zIndex: 9999,
        display: "none!important",
      }}
    ></div>
    // null
  );
};
export default ProgressBar
