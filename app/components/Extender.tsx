import { useModal } from "./ModalProvider";
import NewElement from "./NewElementPopup";
type ExtenderProps = {
  elements: string[];
};
export default function Extender({ elements }: ExtenderProps) {
  const { setModal } = useModal();

  return (
    <div className="extender">
      <span className="extender__line"></span>
      <button
        type="button"
        className="extender__button"
        onClick={() => setModal(<NewElement type={elements[0]} />)}
      >
        +
      </button>
    </div>
  );
}
