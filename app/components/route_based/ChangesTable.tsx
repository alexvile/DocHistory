import { formatDateShortUA } from "~/utils/formatDateUA";
import Table from "../ui/Table";
import { ChangeSetVM, ChangeVM } from "~/types";
import translate from "~/utils/translate";
import Status from "../ui/Status";
import { Link } from "@remix-run/react";

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
    <Table headings={["№", "Продукт", "Статус", "Створено", "Відповідальний", "Дата", ""]}>
      {changes.map(({ id, createdAt, status, product, createdBy, approver }, index) => (
        <Table.Row key={id}>
          <Table.Cell>{index + 1}</Table.Cell>
          <Table.Cell>
            <Link className="link" to={`/home/products/${product.id}`}>
              {product.title}
            </Link>
          </Table.Cell>
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
          <Table.Cell>{formatDateShortUA(createdAt)}</Table.Cell>
          <Table.Cell>
            <Link className="link" to={`/home/changes/${id}`} aria-label="Оглянути зміну">
              лінка →
            </Link>
          </Table.Cell>
        </Table.Row>
      ))}
    </Table>
  );
}
