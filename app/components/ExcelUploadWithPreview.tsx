import { useEffect, useState } from "react";
import { ExcelUploadForm } from "./ExcelUploadForm";

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
    <div>
      <ExcelUploadForm
        onParsed={handleParsed}
        onClear={handleClear}
      />

      {rows && (
        <div>
          <button
            type="button"
            onClick={() => setShowPreview((v) => !v)}
          >
            {showPreview ? "Сховати" : "Показати"}
          </button>

          {showPreview && (
            <pre>{JSON.stringify(rows.slice(0, 5), null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
}
