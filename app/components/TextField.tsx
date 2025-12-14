import styles from "./TextField.module.css";

type TextFieldProps = {
  name: string;
  label?: string;
  placeholder?: string;
  isRequired?: boolean;
  minLength?: number;
};

export default function TextField({ name, label, placeholder, isRequired, minLength }: TextFieldProps) {
  return (
    <label className={styles.field}>
      {label && (
        <span className={styles.label}>
          {label}
          {isRequired && <span aria-hidden="true">*</span>}
        </span>
      )}

      <input
        type="text"
        className={styles.input}
        name={name}
        placeholder={placeholder}
        required={isRequired || undefined}
        minLength={minLength}
      />
    </label>
  );
}
