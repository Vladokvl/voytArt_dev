"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type BreadcrumbContextType = {
  dynamicTitle: string | null;
  setDynamicTitle: (title: string | null) => void;
};

const BreadcrumbContext = createContext<BreadcrumbContextType>({
  dynamicTitle: null,
  setDynamicTitle: () => undefined,
});

export function BreadcrumbProvider({ children }: { children: React.ReactNode }) {
  const [dynamicTitle, setDynamicTitle] = useState<string | null>(null);

  return (
    <BreadcrumbContext.Provider value={{ dynamicTitle, setDynamicTitle }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumb() {
  return useContext(BreadcrumbContext);
}

export function useSetBreadcrumb(title: string | undefined | null) {
  const { setDynamicTitle } = useBreadcrumb();

  useEffect(() => {
    if (title) {
      setDynamicTitle(title);
    }
    return () => {
      setDynamicTitle(null);
    };
  }, [title, setDynamicTitle]);
}
