import { useModal } from "./ModalProvider";
import NewElement from "./NewElementPopup";

export default function Extender() {
  const { setModal } = useModal();

  return (
    <div className="extender">
      <span className="extender__line"></span>
      <button
        type="button"
        className="extender__button"
        onClick={() => setModal(<NewElement />)}
      >
        +
      </button>
    </div>
  );
}
