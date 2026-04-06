import { Link, useNavigate } from "@remix-run/react";
import { Icon } from "../ui/Icon";

type BackControlsProps = {
  ariaLabelBack?: string;
  ariaLabelUp?: string;
};

export default function BackControls({ ariaLabelBack = "Назад", ariaLabelUp = "На рівень вище" }: BackControlsProps) {
  const navigate = useNavigate();

  function handleBack() {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/"); // fallback
    }
  }

  return (
    <div className="flex gap-8">
      <Link to=".." relative="path" aria-label={ariaLabelUp} className="button button--icon">
        <Icon name="arrow-up" />
      </Link>
      <button onClick={handleBack} aria-label={ariaLabelBack} className="button button--icon">
        <Icon name="back" />
      </button>
    </div>
  );
}
