import type Lenis from "lenis";

declare global {
  interface Window {
    /** Істанс Lenis (окремий ключ, бо пакет lenis вже оголошує Window.lenis для опцій) */
    __lenis?: Lenis;
    ScrollTrigger?: { refresh: () => void };
  }
}

export {};
