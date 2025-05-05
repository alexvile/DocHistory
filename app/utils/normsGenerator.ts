// refactor??
type DataTypes = "detail" | "group" | "spacing";
type Row = RowSpacing | RowDetail | RowGroup;

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
  groupColor: string;
  order: number;
};

type RowSpacing = {
  id: string;
  title: "";
  type: Extract<DataTypes, "spacing">;
  groupId: string;
};

type RowGroup = {
  id: string;
  groupId: string;
  type: Extract<DataTypes, "group">;
  order: number;
  title: string;
  code: string;
  groupColor: string;
};

type GroupProps = {
  id: string;
  type: Extract<DataTypes, "group">;
  order: string;
  title: string;
  code: string;
  groupColor: string;
  details?: DetailProps[];
};

interface DetailProps {
  id: string;
  order: string;
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
}
interface DetailsWithColor extends DetailProps {
  groupColor: string;
}
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

  private static createDetail(data: DetailsWithColor) {
    const {
      id,
      type,
      title,
      assortment,
      standard,
      unit,
      consuption_rate,
      consuption_rate_per_item,
      groupId,
      groupColor,
      order,
    } = data;
    const row: RowDetail = {
      id,
      type,
      title,
      assortment,
      standard,
      unit,
      order: Number(order),
      consuption_rate: Number(consuption_rate),
      consuption_rate_per_item: Number(consuption_rate_per_item),
      groupId: groupId ? groupId : id,
      groupColor: groupColor ? groupColor : NormsGenerator.getColor(),
    };
    NormsGenerator.rows.push(row);
  }

  private static createGroup(group: GroupProps) {
    console.log("GroupProps", group);
    const groupColor = NormsGenerator.getColor();
    const row: RowGroup = {
      id: group.id,
      groupId: group.id,
      order: Number(group.order),
      code: group.code,
      title: group?.title,
      type: group.type,
      groupColor: groupColor,
    };
    NormsGenerator.rows.push(row);

    if (group?.details?.length) {
      const sortedArray = group.details.sort(
        (a, b) => Number(a.order) - Number(b.order)
      );

      sortedArray.forEach((detail) => {
        if (detail?.type !== "detail") return;
        NormsGenerator.createDetail({
          ...detail,
          groupId: group.id,
          groupColor: groupColor,
        });
      });
    }

    // update spacing logic
    const spacing: RowSpacing = {
      id: "s__" + group.id,
      title: "",
      type: "spacing",
      groupId: group.id,
    };
    NormsGenerator.rows.push(spacing);
  }

  //   todo type for Main Data
  static createRows(data: GroupProps[]) {
    const sortedData = data.sort((a, b) => Number(a.order) - Number(b.order));
    NormsGenerator.rows = [];
    NormsGenerator.colorIndex = 0;
    sortedData.forEach((group) => NormsGenerator.createGroup(group));
    return NormsGenerator.rows;
  }
}
export default NormsGenerator;
