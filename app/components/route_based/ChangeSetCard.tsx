import { ChangeSetVM, UserRoleVM } from "~/types";
import { formatDateForUA } from "~/utils/formatDateUA";
import Badge from "../ui/Badge";
import styles from "./ChangeSetCard.module.css";
import { Accordion } from "../ui/Accordion";
import NormsTable from "../NormsTable";
import NormsTableWithChanges from "../NormsTableWithChanges";
import { Icon } from "../ui/Icon";
import {  ApproverSelect } from "./ApproverCombobox";

type ChangeSetCardMetaProps = Pick<ChangeSetVM, "createdBy" | "createdAt" | "status">;

function ChangeSetCardMeta({ createdBy, createdAt, status }: ChangeSetCardMetaProps) {
  return (
    <div className={styles.changeSetCardMetaContainer}>
      <div className={styles.changeSetCardMetaTop}>
        <p className={styles.changeSetCardMetaField}>
          <strong>Зміна від:</strong> {createdBy.firstName} {createdBy.lastName}
        </p>
        <Badge tone="draft">{status}</Badge>
      </div>
      <p className={styles.changeSetCardMetaField}>
        <strong>Дата внесення:</strong> {formatDateForUA(createdAt, { withYear: true })}
      </p>
    </div>
  );
}

type ChangeType = "added" | "removed" | "changed";

function renderSummaryCard(type: ChangeType, items?: any[]) {
  if (!items || items.length === 0) return null;

  let icon: React.ReactNode;
  let label: React.ReactNode;
  let content: React.ReactNode;

  const count = items.length;

  switch (type) {
    case "added":
      icon = <Icon name="change-added" color="#2ea44f" />;
      label = <>Додано ({count})</>;
      content = <NormsTable normsJson={items} />;
      break;

    case "removed":
      icon = <Icon name="change-removed" color="#cb2431" />;
      label = <>Видалено ({count})</>;
      content = <NormsTable normsJson={items} />;
      break;

    case "changed":
      icon = <Icon name="change-modified" color="#1f72eb" />;
      label = <>Змінено ({count})</>;
      content = <NormsTableWithChanges changes={items} />;
      break;

    default:
      return null;
  }

  return (
    <Accordion>
      <Accordion.Summary>
        <span className={styles.summaryTitle}>
          {icon}
          {label}
        </span>
      </Accordion.Summary>

      <Accordion.Content>{content}</Accordion.Content>
    </Accordion>
  );
}

type ChangeSetCardSummaryProps = Pick<ChangeSetVM, "diff">;

function ChangeSetCardSummary({ diff }: ChangeSetCardSummaryProps) {
  return (
    <div className={styles.summaryContainer}>
      {diff?.added?.length && renderSummaryCard("added", diff?.added)}
      {diff?.removed?.length && renderSummaryCard("removed", diff?.removed)}
      {diff?.changed?.length && renderSummaryCard("changed", diff?.changed)}
    </div>
  );
}

function AdminActions() {
  return (
    <div role="group" aria-label="Admin actions">
      <button type="button">Approve</button>

      <button type="button">Reject</button>

      <button type="button" aria-label="Delete change set">
        🗑
      </button>
    </div>
  );
}

function CommitterActions() {
  return (
    <div role="group" aria-label="Commiter actions">
      Комбо з вибором
      <ApproverSelect name={"aaa"} />
      <button type="button">Надіслати</button>
      <button type="button" aria-label="Delete change set">
        🗑
      </button>
    </div>
  );
}

function ViewerActions() {
  return <div role="group" aria-label="Admin actions"></div>;
}

function ChangeSetCardActions({ role }: { role: UserRoleVM }) {
  switch (role) {
    case "ADMIN":
      return <AdminActions />;

    case "COMMITTER":
      return <CommitterActions />;

    case "VIEWER":
    default:
      return <ViewerActions />;
  }
}

type ChangeSetCardProps = ChangeSetVM & {
  role: UserRoleVM;
};
export default function ChangeSetCard({ status, createdAt, diff, createdBy, role }: ChangeSetCardProps) {
  return (
    <div className={styles.container}>
      <ChangeSetCardMeta createdBy={createdBy} createdAt={createdAt} status={status} />
      <ChangeSetCardSummary diff={diff} />
      <ChangeSetCardActions role="COMMITTER" />
    </div>
  );
}
