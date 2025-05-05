// app/utils/composeLinks.ts
import type { LinkDescriptor } from "@remix-run/react";

/**
 * Об'єднує кілька `links()` функцій у одну.
 */
export function composeLinks(...linkFns: Array<() => LinkDescriptor[]>) {
  return () =>
    linkFns.flatMap((fn) => {
      try {
        return fn();
      } catch {
        return [];
      }
    });
}
