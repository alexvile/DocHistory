type ExtenderProps = {
  action: () => void;
  ariaLabel?: string;
};

export default function Extender({ action, ariaLabel }: ExtenderProps) {
  return (
    <div className="extender">
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
