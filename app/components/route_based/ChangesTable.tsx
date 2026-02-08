import { formatDateForUA } from "~/utils/formatDateUA";
import Table from "../ui/Table";
import { ChangeSetVM, ChangeVM } from "~/types";
import translate from "~/utils/translate";
import Status from "../ui/Status";

type ChangesTableProps = {
  changes: Pick<ChangeVM, "id" | "createdAt" | "status" | "product" | "createdBy" | "approver">[];
};

function shortenFirstName(firstName?: string) {
  return firstName ? `${firstName.charAt(0)}.` : "";
}
const STATUS_TONE_MAP: Record<ChangeSetVM["status"], "green" | "yellow" | "blue" | "red"> = {
  DRAFT: "yellow",
  ON_REVIEW: "blue",
  APPROVED: "green",
  REJECTED: "red",
};

export default function ChangesTable({ changes }: ChangesTableProps) {
  return (
    <Table headings={["№", "Продукт", "Статус", "Створено", "Відповідальний", "Дата"]}>
      {changes.map(({ id, createdAt, status, product, createdBy, approver }, index) => (
        <Table.Row key={id}>
          <Table.Cell>{index + 1}</Table.Cell>
          <Table.Cell>{product.title}</Table.Cell>
          <Table.Cell>
            <p className="tableChangeStatus">
              <Status tone={STATUS_TONE_MAP[status]} />
              {translate("CHANGE_STATUS", status)}
            </p>
          </Table.Cell>
          <Table.Cell>
            {shortenFirstName(createdBy.firstName)} {createdBy.lastName}
          </Table.Cell>
          <Table.Cell>
            {(status === "ON_REVIEW" || status === "REJECTED") && approver
              ? `${shortenFirstName(approver.firstName)} ${approver.lastName}`
              : "—"}
          </Table.Cell>
          <Table.Cell>{formatDateForUA(createdAt, { withYear: true })}</Table.Cell>
        </Table.Row>
      ))}
    </Table>
  );
}
