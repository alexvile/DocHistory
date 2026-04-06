import { useFetcher } from "@remix-run/react";
import { useEffect, useId, useRef, useState } from "react";
import styles from "./ExcelUploadForm.module.css";
import { Icon } from "./ui/Icon";
import clsx from "clsx";

type ExcelUploadFormProps<T = unknown> = {
  onParsed: (rows: T[]) => void;
  onClear: () => void;
  isParsed: boolean;
};

export function ExcelUploadForm({ onParsed, onClear, isParsed }: ExcelUploadFormProps) {
  const fetcher = useFetcher<{ rows: any[] }>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handledRef = useRef(false);
  const [hasFile, setHasFile] = useState(false);
  const id = useId();

  const isSubmitting = fetcher.state === "submitting";

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
  // todo - error if cann't be parsed

  return (
    <fetcher.Form method="post" action="/parse-excel" encType="multipart/form-data" onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.heading}>
        <label htmlFor={id} className={styles.label}>
          Завантажте Excel-файл з нормами
        </label>
        {isParsed && <Icon name={"checkmark"} color="#0b6623" />}
      </div>

      <div className={styles.fileUploadGroup}>
        <div className={styles.fileUploadContainer}>
          <input
            id={id}
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
            <button
              type="submit"
              disabled={isParsed || isSubmitting}
              className={clsx("button button--primary", isSubmitting && "is-loading")}
            >
              Завантажити
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleClear}
              className={clsx("button button--secondary full-width", isSubmitting && "is-loading")}
            >
              Очистити
            </button>
          </div>
        )}
      </div>
    </fetcher.Form>
  );
}
