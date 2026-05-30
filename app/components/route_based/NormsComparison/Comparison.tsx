import { useMemo, useState } from "react";
import { ColumnKey, columns } from "./constants";
import { CanonicalRow } from "~/types";
import ConfigurableNormsTable from "./ConfigurableNormsTable";
import { diffNorms } from "~/utils/comparison";
import { ToggleSwitch } from "~/components/ToggleSwitch";
import styles from "./Comparison.module.css";

type ComparisonProps = {
  currentNorms: CanonicalRow[];
  newNorms: CanonicalRow[];
};

export type DiffRow = {
  type: "added" | "removed" | "changed";
  before?: CanonicalRow;
  after?: CanonicalRow;
  changedFields?: ColumnKey[];
  key: string;
};

// todo - finish norm change - NO CHANGES DETECTED

export default function Comparison({ currentNorms, newNorms }: ComparisonProps) {
  const [visibleColumns, setVisibleColumns] = useState<Set<ColumnKey>>(new Set(columns.map((c) => c.key)));

  const toggleColumn = (key: ColumnKey) => {
    setVisibleColumns((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };
  const diff = useMemo(() => diffNorms(currentNorms, newNorms), [currentNorms, newNorms]);

  const [diffMode, setDiffMode] = useState(false);
  console.log(9997, diff);
  console.log("currentNorms", currentNorms);
  console.log("newNorms", newNorms);

  // todo - finish comparator
  return (
    <div>
      {/* 🔹 Controls */}
      <div className={styles.controls}>
        <div className={styles.columns} role="group" aria-label="Видимі колонки">
          {columns.map((col) => (
            <label key={col.key} className={styles.columnOption}>
              <input
                className="visually-hidden"
                type="checkbox"
                checked={visibleColumns.has(col.key)}
                onChange={() => toggleColumn(col.key)}
              />
              <span>{col.label}</span>
            </label>
          ))}
        </div>
        <ToggleSwitch checked={diffMode} onChange={setDiffMode} label="Показати зміни" />
      </div>

      {/* 🔹 Tables */}
      <div className="flex gap-16 items-start">
        <div className="configurableGroup">
          <h3 className={styles.groupTitle}>Поточне</h3>
          <ConfigurableNormsTable data={currentNorms} visibleColumns={visibleColumns} mode="before" diffMode={diffMode} diff={diff} />
        </div>
        <div className="configurableGroup">
          <h3 className={styles.groupTitle}>Нове</h3>
          <ConfigurableNormsTable data={newNorms} visibleColumns={visibleColumns} mode="after" diffMode={diffMode} diff={diff} />
        </div>
      </div>
    </div>
  );
}
