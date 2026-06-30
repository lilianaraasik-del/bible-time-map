import { useEffect, useState } from "react";

function detect(): boolean {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent || "";
  const isMobileUA = /Android|iPhone|iPad|iPod|Mobile|Tablet|Silk|Kindle|Opera Mini|IEMobile/i.test(ua);
  const coarsePointer = window.matchMedia?.("(pointer: coarse)").matches ?? false;
  const standalone =
    window.matchMedia?.("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true;
  const narrow = window.innerWidth < 1024;
  // PWA standalone always counts as mobile (it is installed)
  if (standalone) return true;
  // Mobile/tablet UA + (coarse pointer OR narrow viewport)
  return isMobileUA && (coarsePointer || narrow);
}

export function useIsMobileOrTablet(): boolean {
  const [val, setVal] = useState<boolean>(() => detect());
  useEffect(() => {
    const onChange = () => setVal(detect());
    window.addEventListener("resize", onChange);
    window.addEventListener("orientationchange", onChange);
    return () => {
      window.removeEventListener("resize", onChange);
      window.removeEventListener("orientationchange", onChange);
    };
  }, []);
  return val;
}

export default useIsMobileOrTablet;
