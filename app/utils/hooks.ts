import { RefObject, useEffect, useState } from "react";

export function useHasHydrated() {
  const [hasHydrated, setHasHydrated] = useState(false);
  useEffect(() => {
    setHasHydrated(true);
  }, []);
  return hasHydrated;
}

export function useFormSnapshotOnVisible(
  ref: RefObject<HTMLFormElement>,
  shouldTake: boolean
) {
  const [snapshot, setSnapshot] = useState<FormData | null>(null);

  useEffect(() => {
    if (!shouldTake || !ref.current) return;

    const timeout = setTimeout(() => {
      setSnapshot(new FormData(ref.current!));
    }, 0);

    return () => clearTimeout(timeout);
  }, [shouldTake, ref]);

  return snapshot;
}
