import { useState } from "react";
import { ExcelUploadForm } from "./ExcelUploadForm";
import NormsTable from "./NormsTable";
import styles from "./ExcelUploadContainer.module.css";
import { ToggleSwitch } from "./ToggleSwitch";
import { CanonicalRow } from "~/types";

type ExcelUploadContainerProps = {
  onChange?: (rows: CanonicalRow[]) => void;
  preview?: boolean;
};
export default function ExcelUploadContainer({ onChange, preview = true }: ExcelUploadContainerProps) {
  const [rows, setRows] = useState<CanonicalRow[] | null>(null);
  const [showPreview, setShowPreview] = useState(true);

  function handleParsed(parsed: CanonicalRow[]) {
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
