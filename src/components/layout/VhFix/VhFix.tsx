"use client";

import { useEffect } from "react";

export default function VhFix() {
  useEffect(() => {
    function setVhProperty() {
      const vh = window.visualViewport?.height
        ? window.visualViewport.height * 0.01
        : window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    }

    setVhProperty();

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", setVhProperty);
    } else {
      window.addEventListener("resize", setVhProperty);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", setVhProperty);
      } else {
        window.removeEventListener("resize", setVhProperty);
      }
    };
  }, []);

  return null;
}
