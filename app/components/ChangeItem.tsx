import { NormChange } from "~/types";
import { Icon } from "./Icon";

// todo - rename changes insde change
type ChangeItemProps = {
  change: NormChange;
};

function ChangeTitle({ type, text }) {
  return (
    <h5 className="change-item__title">
      {(type === "detail-added" || type === "group-added") && <Icon name="change-added" color="#2ea44f" />}
      {(type === "detail-removed" || type === "group-removed") && <Icon name="change-removed" color="#cb2431" />}
      {(type === "detail-updated" || type === "group-updated") && <Icon name="change-updated" color="#1f72eb" />}
      {text}
    </h5>
  );
}
function FieldChanges({ changes }: { changes: { field: string; old: string; new: string }[] }) {
  return (
    <div className="table__wrapper">
      <table className="table">
        <thead className="table__head">
          <tr>
            <th className="table__heading-cell">Поле</th>
            <th className="table__heading-cell">До</th>
            <th className="table__heading-cell">Після</th>
          </tr>
        </thead>
        <tbody>
          {changes.map((item, id) => (
            <tr key={id} className="table__row">
              <td className="table__cell">{item.field}</td>
              <td className="table__cell">
                <p className="field-change__old">{item.old}</p>
              </td>
              <td className="table__cell">
                <p className="field-change__new">{item.new}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
const renderers: Record<NormChange["type"], (change: NormChange) => JSX.Element> = {
  "group-added": (change) => (
    <>
      <ChangeTitle type="group-added" text="Створено групу" />
    </>
  ),
  "group-removed": (change) => (
    <>
      <ChangeTitle type="group-removed" text="Видалено групу та деталі" />
    </>
  ),
  "group-updated": (change) => (
    <>
      <ChangeTitle type="group-updated" text="Оновлено групу" />
      <FieldChanges changes={change.changes} />
    </>
  ),
  "detail-added": (change) => (
    <>
      <ChangeTitle type="detail-added" text="Створено деталь" />
      <p>
        "{change.detail.title}" в групі "{change.groupTitle}"
      </p>
    </>
  ),
  "detail-removed": (change) => (
    <>
      <ChangeTitle type="detail-removed" text="Видалено деталь" />
      <p>
          "{change.detail.title}" з групи "{change.groupTitle}"
      </p>
    </>
  ),
  "detail-updated": (change) => (
    <>
      <ChangeTitle type="detail-updated" text="Оновлено деталь" />
      <FieldChanges changes={change.changes} />
    </>
  ),
};
export default function ChangeItem({ change }: ChangeItemProps) {
  return <li className="changeslist__item">{renderers[change.type](change)}</li>;
}
