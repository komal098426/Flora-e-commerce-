"use client";

import { AnimatePresence } from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { dresses } from "@/lib/dresses";
import { trackEvent } from "@/lib/analytics";
import DressDetailModal from "./DressDetailModal";

type DressDetailContextValue = {
  open: (dressId: string, source: string) => void;
};

const DressDetailContext = createContext<DressDetailContextValue | null>(null);

export function useDressDetail() {
  const ctx = useContext(DressDetailContext);
  if (!ctx) {
    throw new Error("useDressDetail must be used within a DressDetailProvider");
  }
  return ctx;
}

function setDressParam(dressId: string | null) {
  const url = new URL(window.location.href);
  if (dressId) {
    url.searchParams.set("dress", dressId);
  } else {
    url.searchParams.delete("dress");
  }
  window.history.replaceState(window.history.state, "", url);
}

export default function DressDetailProvider({ children }: { children: ReactNode }) {
  const [activeDressId, setActiveDressId] = useState<string | null>(null);
  const [source, setSource] = useState<string>("unknown");

  const open = useCallback((dressId: string, openSource: string) => {
    setActiveDressId(dressId);
    setSource(openSource);
    setDressParam(dressId);
    trackEvent("dress_detail_opened", { dressId, source: openSource });
  }, []);

  const close = useCallback(() => {
    setActiveDressId(null);
    setDressParam(null);
  }, []);

  // Resolve a shared/returning link (?dress=<id>) after mount. This can't be
  // computed during render (e.g. via a useState lazy initializer) because
  // `window.location.search` is unavailable during SSR — reading it there
  // would make the server's first paint (no modal) diverge from the client's
  // first paint (modal open), a hydration mismatch. Deferring to an effect
  // keeps both initial paints in sync and applies the URL state right after.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedId = params.get("dress");
    if (sharedId && dresses.some((d) => d.id === sharedId)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveDressId(sharedId);
      setSource("shared_link");
      trackEvent("dress_detail_opened", { dressId: sharedId, source: "shared_link" });
    }
  }, []);

  const activeDress = useMemo(
    () => dresses.find((d) => d.id === activeDressId) ?? null,
    [activeDressId],
  );

  const value = useMemo(() => ({ open }), [open]);

  return (
    <DressDetailContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {activeDress && (
          <DressDetailModal dress={activeDress} source={source} onClose={close} />
        )}
      </AnimatePresence>
    </DressDetailContext.Provider>
  );
}
