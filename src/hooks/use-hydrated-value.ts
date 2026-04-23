"use client";

import * as React from "react";

export function useHydratedValue<T>(value: T, fallback: T): T {
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated ? value : fallback;
}
