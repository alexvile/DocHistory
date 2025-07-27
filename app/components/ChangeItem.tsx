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
      {(type === "detail-updated" || type === "group-updated") && <Icon name="change-updated" />}
      {text}
    </h5>
  );
}

function FieldChanges({ changes }: { changes: { field: string; old: string; new: string }[] }) {
  return (
    <div className="field-changes">
      {changes.map((item, id) => (
        <ul key={id} className="field-change">
          <li>
            <div className="field-change__field">Поле: {item.field}</div>
            <p className="field-change__old">-{item.old}</p>
            <p className="field-change__new">+{item.new}</p>
          </li>
        </ul>
      ))}
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
        "{change.detail.title}" до групи "{change.groupTitle}"
      </p>
    </>
  ),
  "detail-removed": (change) => (
    <>
      <ChangeTitle type="detail-removed" text="Видалено деталь" />
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
