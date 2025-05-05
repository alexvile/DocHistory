import { useModal } from "./ModalProvider";
import NewElement from "./NewElementPopup";

export default function ExtenderWithModal({ action }: {action: any}) {
  const { setModal } = useModal();

  return (
    <div className="extender">
      <span className="extender__line"></span>
      <button
        type="button"
        className="extender__button"
        onClick={() => setModal(<NewElement action={action} />)}
      >
        +
      </button>
    </div>
  );
}
