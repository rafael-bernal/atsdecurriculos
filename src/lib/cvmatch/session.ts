import { useCallback, useEffect, useState } from "react";
import type { SessionState } from "./types";

const KEY = "cvmatch.session.v1";

export const emptySession: SessionState = {
  resume: "",
  jobDescription: "",
  hasJob: false,
  analyses: [],
  result: null,
};

/** Anonymous, browser-only session. No account, no backend, no tracking. */
export function useSession() {
  const [state, setState] = useState<SessionState>(emptySession);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(KEY);
      if (raw) setState({ ...emptySession, ...(JSON.parse(raw) as SessionState) });
    } catch {
      /* ignore corrupt session */
    }
    setHydrated(true);
  }, []);

  const update = useCallback((patch: Partial<SessionState>) => {
    setState((prev) => {
      const next = { ...prev, ...patch };
      try {
        window.sessionStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* storage may be unavailable */
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    try {
      window.sessionStorage.removeItem(KEY);
    } catch {
      /* noop */
    }
    setState(emptySession);
  }, []);

  return { state, update, reset, hydrated };
}
