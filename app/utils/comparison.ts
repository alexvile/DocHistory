import { CanonicalRow, NormDiff } from "~/types";

function isEqual(a: unknown, b: unknown) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function hasChanges(diff: NormDiff) {
  return diff.added.length > 0 || diff.removed.length > 0 || diff.changed.length > 0;
}

export function diffNorms(oldRows: CanonicalRow[], newRows: CanonicalRow[]): NormDiff {
  const oldMap = new Map(oldRows.map((r) => [r.businessKey, r]));
  const newMap = new Map(newRows.map((r) => [r.businessKey, r]));

  const added: CanonicalRow[] = [];
  const removed: CanonicalRow[] = [];
  const changed: NormDiff["changed"] = [];

  for (const [key, newRow] of newMap) {
    const oldRow = oldMap.get(key);

    if (!oldRow) {
      added.push(newRow);
      continue;
    }

    if (!isEqual(oldRow, newRow)) {
      const fields = Object.keys(newRow).filter((f) => !isEqual(oldRow[f], newRow[f]));

      changed.push({
        key,
        before: oldRow,
        after: newRow,
        fields,
      });
    }
  }

  for (const [key, oldRow] of oldMap) {
    if (!newMap.has(key)) {
      removed.push(oldRow);
    }
  }

  return { added, removed, changed };
}
