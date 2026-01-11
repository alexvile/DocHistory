import { useState } from "react";
import { ExcelUploadForm } from "./ExcelUploadForm";
import NormsTable from "./NormsTable";
import styles from "./ExcelUploadContainer.module.css";
import { ToggleSwitch } from "./ToggleSwitch";

type ExcelRow = Record<string, unknown>;

type ExcelUploadContainerProps = {
  onChange?: (rows: ExcelRow[]) => void;
  preview?: boolean;
};
export function ExcelUploadContainer({ onChange, preview = true }: ExcelUploadContainerProps) {
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
      {preview && rows && (
        <div>
          <div className={styles.topBar}>
            <p className={styles.heading}>Попередній перегляд</p>
            <div className={styles.controls}>
              <ToggleSwitch checked={showPreview} onChange={setShowPreview} />
            </div>
          </div>
          {showPreview && (
            <div className={styles.previewContainer}>
              <p>Перевірте правильність сформованих даних</p>
              <NormsTable normsJson={rows} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
