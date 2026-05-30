import * as XLSX from "xlsx";
import { CanonicalRow } from "~/types";

// // Канонічний рядок під твої колонки
// export type CanonicalRow = {
//   businessKey: string;          // NAME+ASSORTMENT+DSTU+UNIT (нормалізовані)
//   name?: string;                // Назва
//   assortment?: string;          // Сортамент
//   dstu?: string;                // ДСТУ
//   unit?: string;                // Од. виміру
//   consumption?: number;         // Норма розходу
//   consumptionPerUnit?: number;  // Норма розходу на одиницю
//   notes?: string;               // Нотатки / Примітки
// };

// Нормалізація заголовків: нижній регістр, без крапок і зайвих пробілів
function normHeader(h: string) {
  return h.toLowerCase().replace(/\./g, "").replace(/\s+/g, " ").trim();
}

// Допустимі назви колонок → канонічні поля
const HEADER_MAP: Record<string, keyof CanonicalRow | "SKIP"> = {
  назва: "name",
  сортамент: "assortment",
  дсту: "dstu",
  "од. виміру": "unit",
  "одиниця виміру": "unit",
  "норма розходу": "consumption",
  "норма розходу на одиницю": "consumptionPerUnit",
  "норма розходу на од.": "consumptionPerUnit",
  нотатки: "notes",
  примітки: "notes",
};

// Парсери значень
const asNumber = (v: unknown): number | undefined => {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const s = v.trim().replace(/\s+/g, "").replace(",", ".");
    const n = Number(s);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
};
const asString = (v: unknown): string | undefined => {
  if (v == null) return undefined;
  const s = String(v).trim();
  return s || undefined;
};

// Бізнес-ключ: стабільний ID рядка
function makeBusinessKey(r: Partial<CanonicalRow>) {
  const groupName = (r.groupName ?? "").toUpperCase().trim();
  const name = (r.name ?? "").toUpperCase().trim();
  const assortment = (r.assortment ?? "").toUpperCase().trim();
  const dstu = (r.dstu ?? "").toUpperCase().trim();
  return `GROUP:${groupName}|NAME:${name}|ASSORTMENT:${assortment}|DSTU:${dstu}`;
}

function isGroupRow(r: Partial<CanonicalRow>) {
  return Boolean(
    r.name &&
      !r.assortment &&
      !r.dstu &&
      !r.unit &&
      r.consumption == null &&
      r.consumptionPerUnit == null &&
      !r.notes,
  );
}

// Знайти рядок заголовків у перших N рядках (де збігається 3+ відомих колонок)
function detectHeaderRow(ws: XLSX.WorkSheet, maxScan = 10) {
  const rows = XLSX.utils.sheet_to_json<any[]>(ws, { header: 1, raw: true }) as any[][];
  let bestIdx = 0;
  let bestScore = -1;

  for (let i = 0; i < Math.min(rows.length, maxScan); i++) {
    const row = rows[i] ?? [];
    let score = 0;
    for (const cell of row) {
      if (typeof cell !== "string") continue;
      const h = normHeader(cell);
      if (HEADER_MAP[h] && HEADER_MAP[h] !== "SKIP") score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestIdx = i;
    }
  }
  // Вважаємо валідним заголовком, якщо знайшли хоча б 3 колонки
  return bestScore >= 3 ? bestIdx : 0;
}

function normalizeHeader(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/\u00A0/g, " ") // NBSP
    .replace(/\s+/g, " ")
    .replace(/[.,]/g, ""); // крапки і коми → геть
}

// Основний парсер
export function parseXlsxToRows(buf: Buffer) {
  const wb = XLSX.read(buf, { type: "buffer" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  if (!ws) throw new Error("Не знайдено аркуш у файлі");

  // 1) Автовизначаємо рядок заголовків
  const headerRowIndex = detectHeaderRow(ws);

  // 2) Збираємо мапу "очікуваний заголовок" → "фактична назва колонки в файлі"
  const headerRow = (XLSX.utils.sheet_to_json<any[]>(ws, { header: 1, raw: true }) as any[][])[headerRowIndex] ?? [];
  const originalHeaders = headerRow.map((h) => (typeof h === "string" ? h : ""));
  const normToOriginal = new Map<string, string>();
  for (const oh of originalHeaders) {
    if (!oh) continue;
    normToOriginal.set(normHeader(oh), oh);
  }

  // 3) Перетворюємо лист у масив об'єктів, вважаючи обраний рядок — заголовками
  const table = XLSX.utils.sheet_to_json<Record<string, any>>(ws, {
    defval: null,
    raw: true,
    range: headerRowIndex, // дані під заголовком
  });

  // 4) Будуємо канонічні рядки
  const out: CanonicalRow[] = [];
  let currentGroupName: string | undefined;

  for (const row of table) {
    const c: any = {};

    // витягуємо потрібні колонки
    for (const [rawKey, target] of Object.entries(HEADER_MAP)) {
      if (target === "SKIP") continue;

      const normKey = normalizeHeader(rawKey);
      const originalHeader = normToOriginal.get(normKey);

      // const originalHeader = normToOriginal.get(normKey);
      if (!originalHeader) continue;
      const v = row[originalHeader];

      switch (target) {
        case "consumption":
        case "consumptionPerUnit":
          c[target] = asNumber(v);
          break;
        case "name":
        case "assortment":
        case "dstu":
        case "unit":
        case "notes":
          c[target] = asString(v);
          break;
      }
    }
    // пропускаємо "сміттєві" рядки (усе порожнє)
    const allEmpty = !c.name && !c.assortment && !c.dstu && !c.unit && c.consumption == null && c.consumptionPerUnit == null && !c.notes;
    if (allEmpty) continue;

    if (isGroupRow(c)) {
      currentGroupName = c.name;
      continue;
    }

    c.groupName = currentGroupName;
    const businessKey = makeBusinessKey(c);
    out.push({ ...c, businessKey });
  }

  return { rows: out };
}
