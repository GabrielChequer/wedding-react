import { useEffect, useCallback, useReducer } from "react";
import { getFamily } from "../../api";
import { Family } from "../../types";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "not_found" }
  | { status: "error" }
  | { status: "success"; family: Family };

function reducer(_prev: State, next: State): State {
  return next;
}

interface UseRSVPResult {
  state: State;
  lookup: (code: string) => void;
  reset: () => void;
}

// network call delegated to src/api/rsvp.ts -> getFamily()

export function useRSVP(initialCode: string | null): UseRSVPResult {
  const [state, dispatch] = useReducer(reducer, {
    status: initialCode ? "loading" : "idle",
  });

  const fetchAndSet = useCallback(async (code: string) => {
    dispatch({ status: "loading" });
    try {
      const family = await getFamily(code);
      dispatch({ status: "success", family });
    } catch (err) {
      const e = err as any;
      if (e?.response?.status === 404) {
        dispatch({ status: "not_found" });
      } else {
        dispatch({ status: "error" });
      }
    }
  }, []);

  // Auto-fetch on mount if code came from URL
  useEffect(() => {
    if (!initialCode) return;
    fetchAndSet(initialCode);
  }, [initialCode, fetchAndSet]);

  const lookup = useCallback((code: string) => {
    fetchAndSet(code.trim());
  }, [fetchAndSet]);

  const reset = useCallback(() => {
    dispatch({ status: "idle" });
  }, []);

  return { state, lookup, reset };
}
