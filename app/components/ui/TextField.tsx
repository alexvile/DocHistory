import clsx from "clsx";
import { useState } from "react";
import { Icon } from "./Icon";

type TextFieldProps = {
  name: string;
  label?: string;
  placeholder?: string;
  isRequired?: boolean;
  minLength?: number;
  autoComplete?: React.HTMLInputAutoCompleteAttribute;
  type?: React.HTMLInputTypeAttribute;
  fullWidth?: boolean;
};

export default function TextField({
  name,
  label,
  placeholder,
  isRequired,
  minLength,
  autoComplete,
  type = "text",
  fullWidth = false,
}: TextFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <label
      className={clsx({
        "full-width": fullWidth,
      })}
    >
      {label && (
        <span className="p-label">
          {label}
          {isRequired && <span aria-hidden="true">*</span>}
        </span>
      )}

      {isPassword ? (
        <div className="input-wrapper">
          <input
            type={inputType}
            className={clsx("p-input", {
              "full-width": fullWidth,
            })}
            name={name}
            placeholder={placeholder}
            required={isRequired || undefined}
            minLength={minLength}
            autoComplete={autoComplete}
          />

          <button
            type="button"
            className="password-toggle inline-flex items-center justify-center"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
          >
            {showPassword ? <Icon name="eye-closed" /> : <Icon name="eye" />}
          </button>
        </div>
      ) : (
        <input
          type={type}
          className={clsx("p-input", {
            "full-width": fullWidth,
          })}
          name={name}
          placeholder={placeholder}
          required={isRequired || undefined}
          minLength={minLength}
          autoComplete={autoComplete}
        />
      )}
    </label>
  );
}
