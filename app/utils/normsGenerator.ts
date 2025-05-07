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
};

type GroupProps = {
  id: string;
  type: Extract<DataTypes, "group">;
  order: string;
  title: string;
  code: string;
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

// inside group can be only the details
class NormsGenerator {
  static rows: Row[] = [];

  private static createDetail(data: DetailProps) {
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
    };
    NormsGenerator.rows.push(row);
  }

  private static createGroup(group: GroupProps) {
    console.log("GroupProps", group);
    const row: RowGroup = {
      id: group.id,
      groupId: group.id,
      order: Number(group.order),
      code: group.code,
      title: group?.title,
      type: group.type,
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
    sortedData.forEach((group) => NormsGenerator.createGroup(group));
    return NormsGenerator.rows;
  }
}
export default NormsGenerator;
