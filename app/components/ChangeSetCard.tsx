import { ChangeSetVM } from "~/types";
import { formatDateForUA } from "~/utils/formatDateUA";
import Badge from "./ui/Badge";
import styles from "./ChangeSetCard.module.css";
import { Accordion } from "./ui/Accordion";
import NormsTable from "./NormsTable";
import NormsTableWithChanges from "./NormsTableWithChanges";

export default function ChangeSetCard({ status, createdAt, diff }: ChangeSetVM) {
  return (
    <div className={styles.container}>
      {/* meta */}
      <div>
        <p>Зміна від: Іван</p>
        <p>Дата: {formatDateForUA(createdAt, { withYear: true })}</p>
        <p>Статус: <Badge tone="draft">{status}</Badge></p>
      </div>
      {/* summary */}
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
            <NormsTableWithChanges changes={diff.changed}/>
          </Accordion>
        )}
      </div>
      {/* actions for admin only */}
    </div>
  );
}
