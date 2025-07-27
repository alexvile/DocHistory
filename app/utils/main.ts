import { Norm, NormChange } from "~/types";

export function shortId(length: number = 8): string {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = new Uint8Array(length);
  crypto.getRandomValues(values);
  return Array.from(values, (v: number) => charset[v % charset.length]).join("");
}

export function filterStringEntries(obj: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      out[key] = value;
    }
  }
  return out;
}

// MOVE THIS FUNCTION
// todo - move in separate function
const DETAIL_FIELDS = ["title", "assortment", "standard", "unit", "order", "consuption_rate", "consuption_rate_per_item"] as const;

export function diffNorms(oldNorms: Norm[], newNorms: Norm[]): NormChange[] {
  const changes: NormChange[] = [];

  const oldGroupMap = new Map(oldNorms.map((g) => [g.id, g]));
  const newGroupMap = new Map(newNorms.map((g) => [g.id, g]));

  // --- New groups ---
  for (const [id, group] of newGroupMap) {
    if (!oldGroupMap.has(id)) {
      changes.push({ type: "group-added", group });
    }
  }

  // --- Deleted groups (with details) ---
  for (const [id, oldGroup] of oldGroupMap) {
    if (!newGroupMap.has(id)) {
      changes.push({ type: "group-removed", group: oldGroup });
      for (const detail of oldGroup.details) {
        changes.push({
          type: "detail-removed",
          groupId: oldGroup.id,
          groupTitle: oldGroup.title,
          detail,
        });
      }
    }
  }

  // --- Changed groups ---
  for (const [id, newGroup] of newGroupMap) {
    const oldGroup = oldGroupMap.get(id);
    if (!oldGroup) continue;

    // only changed titles in groups
    if (newGroup.title !== oldGroup.title) {
      changes.push({
        type: "group-updated",
        id,
        changes: [{ field: "title", old: oldGroup.title, new: newGroup.title }],
      });
    }

    // --- Details ---
    const oldDetailsMap = new Map(oldGroup.details.map((d) => [d.id, d]));
    const newDetailsMap = new Map(newGroup.details.map((d) => [d.id, d]));

    // new details
    for (const [dId, detail] of newDetailsMap) {
      if (!oldDetailsMap.has(dId)) {
        changes.push({
          type: "detail-added",
          groupId: id,
          groupTitle: newGroup.title,
          detail,
        });
      }
    }

    // deleted details
    for (const [dId, detail] of oldDetailsMap) {
      if (!newDetailsMap.has(dId)) {
        changes.push({
          type: "detail-removed",
          groupId: id,
          groupTitle: oldGroup.title,
          detail,
        });
      }
    }

    // updated details
    for (const [dId, newDetail] of newDetailsMap) {
      const oldDetail = oldDetailsMap.get(dId);
      if (!oldDetail) continue;

      const detailChanges: { field: string; old: any; new: any }[] = [];
      for (const key of DETAIL_FIELDS) {
        if (newDetail[key] !== oldDetail[key]) {
          detailChanges.push({ field: key, old: oldDetail[key], new: newDetail[key] });
        }
      }
      if (detailChanges.length > 0) {
        changes.push({
          type: "detail-updated",
          groupId: id,
          groupTitle: newGroup.title,
          detailId: dId,
          changes: detailChanges,
        });
      }
    }
  }

  return changes;
}
