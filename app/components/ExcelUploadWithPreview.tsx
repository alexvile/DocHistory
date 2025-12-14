import { useState } from "react";
import { ExcelUploadForm } from "./ExcelUploadForm";
import NormsTable from "./NormsTable";
import styles from "./ExcelUploadWithPreview.module.css";
import { ToggleSwitch } from "./ToggleSwitch";

export function ExcelUploadWithPreview({ onChange }: { onChange?: (rows: any[]) => void }) {
  const [rows, setRows] = useState<any[] | null>(null);
  const [showPreview, setShowPreview] = useState(true);

  function handleParsed(parsed: any[]) {
    setRows(parsed);
    setShowPreview(true);
    onChange?.(parsed);
  }

  function handleClear() {
    setRows(null);
    setShowPreview(false);
    onChange?.([]);
  }

  return (
    <div className={styles.main}>
      <ExcelUploadForm onParsed={handleParsed} onClear={handleClear} isParsed={!!rows} />
      {rows && (
        <div>
          <div className={styles.topBar}>
            <p className={styles.heading}>Попередній перегляд</p>
            <div className={styles.controls}>
              <ToggleSwitch checked={showPreview} onChange={setShowPreview} />
            </div>
          </div>
          {showPreview && (
            <div className={styles.previewContainer}>
              <NormsTable normsJson={rows} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
