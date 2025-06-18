import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 650;

export function useIsMobile(touchQuery = false) {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    let query = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;
    let onChange: (event: MediaQueryListEvent) => void;

    if (touchQuery) {
      query = "(hover: none)";

      onChange = (event: MediaQueryListEvent) => {
        setIsMobile(event.matches);
      };
    } else {
      onChange = () => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
      };
    }

    const mql = window.matchMedia(query);
    mql.addEventListener("change", onChange);

    onChange(mql as any);

    return () => mql.removeEventListener("change", onChange);
  }, [setIsMobile]);

  return !!isMobile;
}
