import { Icon } from "./Icon";
import Popup from "./Popup";

// todo - show group borders
export default function NewElement({ type }: { type: "group" | "detail" }) {
  return (
    <Popup>
      <div>
        <ul className="new-element__list">
          {type === "group" ? (
            <li>
              <button type="button" className="new-element__button">
                <Icon name="group" />
                Група
              </button>
            </li>
          ) : null}

          {type === "detail" ? (
            <li>
              <button type="button" className="new-element__button">
                <Icon name="vindent" />
                Деталь
              </button>
            </li>
          ) : null}
        </ul>
      </div>
    </Popup>
  );
}
