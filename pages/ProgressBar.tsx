import { useEffect, useRef } from "react";
import { configureColor } from "../utils/nprogress";

export const ProgressBar = () => {
  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    configureColor(divRef.current!.className);
  }, [divRef]);
  return (
    <div
      className={`bar`}
      ref={divRef}
      role="bar"
      style={{
        position: "fixed",
        zIndex: 9999,
        display: "none!important",
      }}
    ></div>
  );
};
// export default ProgressBar
