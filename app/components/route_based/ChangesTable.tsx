import { formatDateShortUA } from "~/utils/formatDateUA";
import Table from "../ui/Table";
import { ChangeSetVM, ChangeVM, UserRoleVM } from "~/types";
import translate from "~/utils/translate";
import Status from "../ui/Status";
import { Link } from "@remix-run/react";
import { Icon } from "../ui/Icon";
import { shortenFirstName } from "~/utils/formatName";

type ChangesTableProps = {
  changes: Pick<ChangeVM, "id" | "createdAt" | "status" | "product" | "createdBy" | "approver">[];
  from: number;
  role: UserRoleVM;
};

const STATUS_TONE_MAP: Record<ChangeSetVM["status"], "green" | "yellow" | "blue" | "red"> = {
  DRAFT: "yellow",
  ON_REVIEW: "blue",
  APPROVED: "green",
  REJECTED: "red",
};

export default function ChangesTable({ changes, from, role }: ChangesTableProps) {
  return (
    <Table
      headings={[
        "№",
        "Зміна від",
        "Продукт",
        "Статус",
        "Створено",
        "Відповідальний",
        "Дата рішення",

        ...(role === "VIEWER" ? ["Перегляд"] : []),
      ]}
    >
      {changes.map(({ id, createdAt, status, product, createdBy, approver, decidedAt, views }, index) => (
        <Table.Row key={id}>
          <Table.Cell>{from + index}</Table.Cell>
          <Table.Cell>
            <Link className="link" to={`/home/changes/${id}`} aria-label="Оглянути зміну">
              {formatDateShortUA(createdAt)}
            </Link>
          </Table.Cell>
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
            {(status === "ON_REVIEW" || status === "REJECTED" || status === "APPROVED") && approver
              ? `${shortenFirstName(approver.firstName)} ${approver.lastName}`
              : "—"}
          </Table.Cell>
          <Table.Cell>{decidedAt && formatDateShortUA(decidedAt)}</Table.Cell>

          {role === "VIEWER" ? (
            <Table.Cell>{views.length > 0 ? <Icon name="checkmark" color="green" /> : <Icon name="close" color="red" />}</Table.Cell>
          ) : null}
        </Table.Row>
      ))}
    </Table>
  );
}
