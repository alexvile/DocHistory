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
  groupId: string;
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
  groupId?: string;
};
// inside group can be only the details
class NormsGenerator {
  static rows: Row[] = [];
  static colorIndex = 0;
  static colorPreset = [
    "#FF6347",
    "#FFD700",
    "#32CD32",
    "#1E90FF",
    "#FF69B4",
    "#8A2BE2",
    "#FF4500",
    "#00FA9A",
    "#9932CC",
    "#FF8C00", // 10
    "#FF1493",
    "#ADFF2F",
    "#F08080",
    "#E0FFFF",
    "#20B2AA",
    "#7FFF00",
    "#FFDAB9",
    "#FF7F50",
    "#FF6347",
    "#8B4513", // 20
    "#DAA520",
    "#4B0082",
    "#008080",
    "#FFFF00",
    "#800080",
    "#C71585",
    "#90EE90",
    "#D3D3D3",
    "#FF1493",
    "#FFFFE0", // 30
    "#A52A2A",
    "#00BFFF",
    "#D2691E",
    "#F0E68C",
    "#BDB76B",
    "#FF00FF",
    "#C71585",
    "#D3D3D3",
    "#98FB98",
    "#8FBC8F", // 40
    "#FFB6C1",
    "#00008B",
    "#556B2F",
    "#FFD700",
    "#20B2AA",
    "#8B008B",
    "#FA8072",
    "#FF4500",
    "#D2B48C",
    "#8A2BE2", // 50
  ];

  private static generateRandomColor = () =>
    `#${Math.floor(Math.random() * 16777215).toString(16)}`;

  private static getColor = () => {
    if (NormsGenerator.colorIndex < NormsGenerator.colorPreset.length) {
      return NormsGenerator.colorPreset[NormsGenerator.colorIndex++];
    } else {
      return NormsGenerator.generateRandomColor();
    }
  };

  private static createDetail(data: DetailProps) {
    const row: RowDetail = {
      id: data.id,
      type: data.type,
      title: data?.title,
      unit: data?.unit,
      consuption_rate: Number(data?.consuption_rate),
      consuption_rate_per_item: Number(data?.consuption_rate_per_item),
      groupId: data.groupId ? data.groupId : data.id,
      groupColor: data.groupColor ? data.groupColor : NormsGenerator.getColor(),
    };
    NormsGenerator.rows.push(row);
  }

  private static createGroup(group: GroupProps) {
    const groupColor = NormsGenerator.getColor();
    console.log(groupColor);

    const row = {
      id: group.id,
      title: group?.title,
      type: group.type,
      groupId: group.id,
      groupColor: groupColor,
    };
    NormsGenerator.rows.push(row);

    if (!group?.details || !group?.detail_order) return;
    group.detail_order.forEach((itemKey: string) => {
      const nestedElement = group.details?.[itemKey];
      if (nestedElement?.type !== "detail") return;
      NormsGenerator.createDetail({
        ...nestedElement,
        groupId: group.id,
        groupColor: groupColor,
      });
    });
  }

  private static createHeading(data: HeadingProps) {
    const row: RowHeading = {
      id: data.id,
      title: data?.title,
      type: data?.type,
    };
    NormsGenerator.rows.push(row);
  }
  private static createSpacing(data: SpacingProps) {
    const row: RowSpacing = { id: data.id, title: "", type: data?.type };
    NormsGenerator.rows.push(row);
  }

  //   todo type for Main Data
  static createRows(data) {
    NormsGenerator.rows = [];
    NormsGenerator.colorIndex = 0;

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
