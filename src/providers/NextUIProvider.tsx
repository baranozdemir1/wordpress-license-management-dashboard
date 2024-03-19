"use client";

import { NextUIProvider as NextUIProviderFrom } from "@nextui-org/react";

export function NextUIProvider({ children }: { children: React.ReactNode }) {
  return <NextUIProviderFrom>{children}</NextUIProviderFrom>;
}
