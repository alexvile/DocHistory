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
    <label className="">
      {label && (
        <span className="p-label">
          {label}
          {isRequired && <span aria-hidden="true">*</span>}
        </span>
      )}

      <input
        type={type}
        className="p-input"
        name={name}
        placeholder={placeholder}
        required={isRequired || undefined}
        minLength={minLength}
        autoComplete={autoComplete}
      />
    </label>
  );
}
