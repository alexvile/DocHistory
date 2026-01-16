import { NormsTableProps } from "~/types";
import Table from "./ui/Table";

export default function NormsTable({ normsJson }: NormsTableProps) {
  return (
    <Table headings={["№", "Назва", "Сортамент", "ДСТУ", "Од.", "Норма", "Норма на од.", "Примітки"]}>
      {normsJson.map(({ businessKey, name, assortment, dstu, unit, consumption, consumptionPerUnit, notes }, index) => (
        <Table.Row key={businessKey}>
          <Table.Cell>{index}</Table.Cell>
          <Table.Cell>{name}</Table.Cell>
          <Table.Cell>{assortment}</Table.Cell>
          <Table.Cell>{dstu}</Table.Cell>
          <Table.Cell>{unit}</Table.Cell>
          <Table.Cell>{consumption}</Table.Cell>
          <Table.Cell>{consumptionPerUnit}</Table.Cell>
          <Table.Cell>{notes}</Table.Cell>
        </Table.Row>
      ))}
    </Table>
  );
}
