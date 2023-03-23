import { useEffect, useState } from "react";

// either ref or element ID
export const useElementSizeCalculation = (
  ref: React.RefObject<HTMLElement> | string
) => {
  const [size, setSize] = useState<DOMRect | null>(null);
  useEffect(() => {
    if (!window) return;
    if (!ref) return;
    const element =
      typeof ref === "string" ? document.getElementById(ref) : ref.current;
    console.log(element);
    if (element) {
      setSize(element.getBoundingClientRect());
    }
    // add on resize listener
    const resizeListener = () => {
      if (element) {
        setSize(element.getBoundingClientRect());
      }
    };
    // when the element changes size, update the state. Use observer to do this
    const observer = new ResizeObserver(resizeListener);
    observer.observe(element!);

    window.addEventListener("resize", resizeListener);
    return () => {
      window.removeEventListener("resize", resizeListener);
      observer.disconnect();
    };
  }, [ref]);
  return size;
};
