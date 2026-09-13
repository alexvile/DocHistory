import { useId, useMemo, useState } from "react";
import * as Ariakit from "@ariakit/react";
import { ColumnKey, columns } from "./constants";
import { CanonicalRow } from "~/types";
import ConfigurableNormsTable from "./ConfigurableNormsTable";
import { diffNorms } from "~/utils/comparison";
import { ToggleSwitch } from "~/components/ToggleSwitch";
import styles from "./Comparison.module.css";
import { Icon } from "~/components/ui/Icon";

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
  const helpId = useId();
  const tooltip = Ariakit.useTooltipStore({ placement: "bottom-end" });
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
        <div className={styles.actions}>
          <ToggleSwitch checked={diffMode} onChange={setDiffMode} label="Показати зміни" />
          <Ariakit.TooltipAnchor
            store={tooltip}
            render={<button type="button" />}
            className="button button--icon rounded-full"
            aria-label="Як користуватися порівнянням норм"
            aria-describedby={helpId}
            onClick={tooltip.show}
          >
            <Icon name="question" />
          </Ariakit.TooltipAnchor>
          <Ariakit.Tooltip store={tooltip} id={helpId} className={styles.tooltip}>
            <p>Фільтри колонок показують або приховують відповідні колонки в обох таблицях. Самі дані не змінюються.</p>
            <p>Увімкніть «Показати зміни», щоб залишити лише змінені, додані та видалені рядки й позначити відмінності кольором.</p>
            <p>Якщо перемикач вимкнений, відображаються всі поточні й нові рядки без підсвічування відмінностей, з урахуванням вибраних колонок.</p>
            <p>Якщо приховати колонку зі зміненим значенням, його підсвічування також не буде видно.</p>
            <div className={styles.legend} role="group" aria-label="Легенда змін">
              <strong>Позначення в режимі «Показати зміни»:</strong>
              <span><span className="norm-diff--changed">Жовтий</span> — змінене значення</span>
              <span><span className="norm-diff--added">Зелений</span> — доданий рядок у «Нове»</span>
              <span><span className="norm-diff--removed line-through opacity-70">Червоний, перекреслений</span> — видалений рядок у «Поточне»</span>
            </div>
          </Ariakit.Tooltip>
        </div>
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
