import { Icon } from "./Icon";
import Popup from "./Popup";

// todo - show group borders
export default function NewElement() {
  return (
    <Popup>
      <div>
        <ul className="new-element__list">
          <li>
            <button type="button" className="new-element__button">
              <Icon name="vindent" />
              Відступ
            </button>
          </li>
          <li>
            <button type="button" className="new-element__button">
              <Icon name="heading" />
              Заголовок
            </button>
          </li>
        </ul>
      </div>
    </Popup>
  );
}
