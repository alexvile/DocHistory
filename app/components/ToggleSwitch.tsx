import styles from "./ToggleSwitch.module.css";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function ToggleSwitch({
  checked,
  onChange,
  label,
  disabled,
}: ToggleSwitchProps) {
  return (
    <label className={styles.wrapper}>
      <span className={styles.switch}>
        <input
          type="checkbox"
          className={styles.input}
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className={styles.track}>
          <span className={styles.thumb} />
        </span>
      </span>

      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}
