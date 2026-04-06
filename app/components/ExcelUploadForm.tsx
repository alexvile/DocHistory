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
        <div className="flex flex-col gap-4 mt-8">
          <div className="flex gap-4 items-center">
            <p className="text-sm margin-0 italic">Завантажено файл</p>{" "}
            {hasFile ? <Icon name={"checkmark"} color="#0b6623" /> : <Icon name="close" color="#ac1616" />}
          </div>
          <div className="flex gap-4 items-center">
            <p className="text-sm margin-0 italic">Парсинг в JSON</p>{" "}
            {isParsed ? <Icon name={"checkmark"} color="#0b6623" /> : <Icon name="close" color="#ac1616" />}
          </div>
        </div>
      </div>

      <div className={styles.fileUploadGroup}>
        <div className={`${styles.fileUploadContainer} ${hasFile ? styles.hasFile : ""}`}>
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
              Парсинг
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleClear}
              className={clsx("button button--secondary full-width", isSubmitting && "is-loading")}
            >
              Відміна
            </button>
          </div>
        )}
      </div>
    </fetcher.Form>
  );
}
