type ExtenderProps = {
  action: () => void;
  ariaLabel?: string;
  customClass?: string;
};

export default function Extender({ action, ariaLabel, customClass }: ExtenderProps) {
  return (
    <div className={`extender${customClass ? ' ' + customClass: ''}`}>
      <span className="extender__line"></span>
      <button
        type="button"
        className="extender__button"
        onClick={action}
        title={ariaLabel}
        aria-label={ariaLabel}
      >
        +
      </button>
    </div>
  );
}
