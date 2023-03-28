import { useState, useEffect } from "react";

export const useScroll = () => {
  const [scroll, setScroll] = useState(0);
  useEffect(() => {
    const func = () => setScroll(window.scrollY);
    window.addEventListener("scroll", func);
    return () => {
      window.removeEventListener("scroll", func);
    };
  }, []);
  return scroll;
};
