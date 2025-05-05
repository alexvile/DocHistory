import { TableAction } from "~/types";
import { Icon } from "./Icon";
import Popup from "./Popup";

// todo - show group borders
export default function NewElement({ action }: { action: any }) {
  // const [type, fn] = action
  console.log(action)
const type = 'group'
  // function registerHandler<T>(handler: HandlerTuple<T>, value: T) {
  //   const [name, fn] = handler;
  //   console.log(`Registering handler for ${name}`);
  //   fn(value);
  // }
  return (
    <Popup>
      <div>
        <ul className="new-element__list">
           {type === "group" ? (
            <li>
              <button type="button" className="new-element__button" onClick={action(1)}>
                <Icon name="group" />
                Група
              </button>
            </li>
          ) : null}

          {type === "detail" ? (
            <li>
              <button type="button" className="new-element__button" >
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
