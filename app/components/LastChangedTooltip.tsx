import { Icon } from "./Icon";

type LastChangedProps = {
  date: string | Date;
};

export function LastChanged({ date }: LastChangedProps) {
  const parsed = new Date(date);
  const formatted = parsed.toLocaleString("uk-UA", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="last-changed">
      <button
        type="button"
        className="last-changed__icon"
        aria-label={`Остання зміна: ${formatted}`}
      >
        <Icon name="clock" />
      </button>
      <div className="last-changed__tooltip" role="tooltip">
        {formatted}
      </div>
    </div>
  );
}
