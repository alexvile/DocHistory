// refactor??

// type RowTypes = "detail" | "group" | "heading";

type DataTypes = "detail" | "group" | "heading" | "spacing";

type Row = RowHeading | RowSpacing | RowDetail;
// type RowProps = {
//     id: string;
//     title?:

// }

type RowDetail = {
  id: string;
  type: Extract<DataTypes, "detail">;
  title: string;
  assortment?: string;
  standard?: string;
  unit: string;
  consuption_rate: number;
  consuption_rate_per_item: number;
  price?: number;
  sum?: number;
  notes?: number;
};

type RowHeading = {
  id: string;
  title: string;
  type: Extract<DataTypes, "heading">;
};
type RowSpacing = {
  id: string;
  title: "";
  type: Extract<DataTypes, "spacing">;
};

type GroupProps = {
  id: string;
  type: "main" | "group";
  title: string;
  code: string;
  detail_order: string[];
  details?: Record<string, DetailProps>;
} & (
  | { type: "main"; modification?: string }
  | { type: "group"; modification?: never }
);

type HeadingProps = {
  id: string;
  title: string;
  type: Extract<DataTypes, "heading">;
};

type SpacingProps = {
  id: string;
  type: Extract<DataTypes, "spacing">;
  title: "";
};

type DetailProps = {
  id: string;
  type: Extract<DataTypes, "detail">;
  title: string;
  assortment?: string;
  standard?: string;
  unit: string;
  consuption_rate: string;
  consuption_rate_per_item: string;
  price?: string;
  sum?: string;
  notes?: string;
};
// inside group can be only the details
class NormsGenerator {
  static rows: Row[] = [];

  private static createDetail(data: DetailProps) {
    const row: RowDetail = {
      id: data.id,
      type: data.type,
      title: data?.title,
      unit: data?.unit,
      consuption_rate: Number(data?.consuption_rate),
      consuption_rate_per_item: Number(data?.consuption_rate_per_item),
    };
    NormsGenerator.rows.push(row);
  }

  private static createGroup(group: GroupProps) {
    const row = { id: group.id, title: group?.title, type: group.type };
    NormsGenerator.rows.push(row);

    if (!group?.details || !group?.detail_order) return;
    group.detail_order.forEach((itemKey: string) => {
      const nestedElement = group.details?.[itemKey];
      if (nestedElement?.type !== "detail") return;
      NormsGenerator.createDetail(nestedElement);
    });
  }

  private static createHeading(data: HeadingProps) {
    const row: RowHeading = { id: data.id, title: data?.title, type: data?.type };
    NormsGenerator.rows.push(row);
  }
  private static createSpacing(data: SpacingProps) {
    const row: RowSpacing = { id: data.id, title: "", type: data?.type };
    NormsGenerator.rows.push(row);
  }

  //   todo type for Main Data
  static createRows(data) {
    NormsGenerator.rows = [];
    data.order.forEach((itemKey: string) => {
      const item = data[itemKey];
      switch (item.type) {
        case "main":
          NormsGenerator.createGroup(item);
          break;
        case "group":
          NormsGenerator.createGroup(item);
          break;
        case "heading":
          NormsGenerator.createHeading(item);
          break;
        case "spacing":
          NormsGenerator.createSpacing(item);
          break;
        case "detail":
          NormsGenerator.createDetail(item);
          break;
        default:
          console.error(`Unexpected item type: ${item?.type}`, item);
          break;
      }
    });
    return NormsGenerator.rows;
  }
}
export default NormsGenerator;
