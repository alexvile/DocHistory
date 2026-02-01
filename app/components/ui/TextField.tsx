import styles from "./TextField.module.css";

type TextFieldProps = {
  name: string;
  label?: string;
  placeholder?: string;
  isRequired?: boolean;
  minLength?: number;
  autoComplete?: React.HTMLInputAutoCompleteAttribute;
  type?: React.HTMLInputTypeAttribute;
};

export default function TextField({ name, label, placeholder, isRequired, minLength, autoComplete, type = "text" }: TextFieldProps) {
  return (
    <label className={styles.field}>
      {label && (
        <span className={styles.label}>
          {label}
          {isRequired && <span aria-hidden="true">*</span>}
        </span>
      )}

      <input
        type={type}
        className={styles.input}
        name={name}
        placeholder={placeholder}
        required={isRequired || undefined}
        minLength={minLength}
        autoComplete={autoComplete}
      />
    </label>
  );
}
