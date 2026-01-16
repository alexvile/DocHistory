import { ChangeSetVM } from "~/types";
import { formatDateForUA } from "~/utils/formatDateUA";
import Badge from "./ui/Badge";
import styles from "./ChangeSetCard.module.css";
import { Accordion } from "./ui/Accordion";
import NormsTable from "./NormsTable";
import NormsTableWithChanges from "./NormsTableWithChanges";

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

type ChangeSetCardSummaryProps = Pick<ChangeSetVM, "diff">;

function ChangeSetCardSummary({ diff }: ChangeSetCardSummaryProps) {
  return (
    <div className={styles.summaryContainer}>
      {diff?.added?.length && (
        <Accordion title={`+ ${diff?.added?.length} додано`}>
          <NormsTable normsJson={diff?.added} />
        </Accordion>
      )}
      {diff?.removed?.length && (
        <Accordion title={`- ${diff?.removed?.length} видалено`}>
          <NormsTable normsJson={diff?.removed} />
        </Accordion>
      )}
      {diff?.changed?.length && (
        <Accordion title={`~ ${diff?.changed?.length} змінено`}>
          <NormsTableWithChanges changes={diff.changed} />
        </Accordion>
      )}
    </div>
  );
}

export default function ChangeSetCard({ status, createdAt, diff, createdBy }: ChangeSetVM) {
  return (
    <div className={styles.container}>
      <ChangeSetCardMeta createdBy={createdBy} createdAt={createdAt} status={status} />
      <ChangeSetCardSummary diff={diff} />
      {/* actions for admin only */}
    </div>
  );
}
