import { useFetcher } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import styles from "./ExcelUploadForm.module.css";

type ExcelUploadFormProps<T = unknown> = {
  onParsed: (rows: T[]) => void;
  onClear: () => void;
};

export function ExcelUploadForm({ onParsed, onClear }: ExcelUploadFormProps) {
  const fetcher = useFetcher<{ rows: any[] }>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handledRef = useRef(false);
  const [hasFile, setHasFile] = useState(false);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.rows && !handledRef.current) {
      handledRef.current = true;
      onParsed(fetcher.data.rows);
    }
  }, [fetcher.state, fetcher.data, onParsed]);

  function handleSubmit() {
    handledRef.current = false;
  }

  function handleClear() {
    handledRef.current = true; // блокуємо повторний onParsed
    if (fileInputRef.current) fileInputRef.current.value = "";
    setHasFile(false);
    onClear();
  }

  return (
    <fetcher.Form method="post" action="/parse-excel" encType="multipart/form-data" onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.fileUploadGroup}>
        <div className={styles.fileUploadContainer}>
          <input
            ref={fileInputRef}
            type="file"
            name="file"
            accept=".xlsx"
            className={styles.fileUploadInput}
            onChange={(e) => setHasFile(!!e.currentTarget.files?.length)}
            required
          />
        </div>
        {hasFile && (
          <div className={styles.fileUploadButtons}>
            <button type="submit" className="button button--primary">
              Завантажити
            </button>
            <button type="button" onClick={handleClear} className="button button--secondary">
              Очистити
            </button>
          </div>
        )}
      </div>
    </fetcher.Form>
  );
}
