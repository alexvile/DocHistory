import { NormsTableProps } from "~/types";
import Table from "./ui/Table";

const COLUMNS_COUNT = 8;

export default function NormsTable({ normsJson }: NormsTableProps) {
  let currentGroupName: string | undefined;

  return (
    <Table headings={["№", "Назва", "Сортамент", "ДСТУ", "Од.", "Норма", "Норма на од.", "Примітки"]} stickyHeader>
      {normsJson.flatMap(({ businessKey, groupName, name, assortment, dstu, unit, consumption, consumptionPerUnit, notes }, index) => {
        const rows = [];

        if (groupName && groupName !== currentGroupName) {
          currentGroupName = groupName;
          rows.push(
            <Table.Row key={`group-${groupName}-${businessKey}`} className="tableGroupRow">
              <Table.Cell className="tableGroupCell" colSpan={COLUMNS_COUNT}>
                {groupName}
              </Table.Cell>
            </Table.Row>,
          );
        }

        rows.push(
          <Table.Row key={businessKey}>
            <Table.Cell>{index}</Table.Cell>
            <Table.Cell>{name}</Table.Cell>
            <Table.Cell>{assortment}</Table.Cell>
            <Table.Cell>{dstu}</Table.Cell>
            <Table.Cell>{unit}</Table.Cell>
            <Table.Cell>{consumption}</Table.Cell>
            <Table.Cell>{consumptionPerUnit}</Table.Cell>
            <Table.Cell>{notes}</Table.Cell>
          </Table.Row>,
        );

        return rows;
      })}
    </Table>
  );
}
