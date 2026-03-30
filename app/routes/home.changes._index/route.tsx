import { Outlet, useLoaderData } from "@remix-run/react";
import { SortAndFilterBar } from "~/components/common/SortAndFilter/SortAndFilterBar";
import { Pagination } from "~/components/common/Pagination";
import ChangesTable from "~/components/route_based/ChangesTable";
import changesSortConfig from "./changesSortConfig";
import { loader } from "./route.server";
export { loader };


export default function Changes() {
  const data = useLoaderData<typeof loader>();
  // console.log(111, data);

  return (
    <>
      <SortAndFilterBar
        sortConfig={changesSortConfig}
        showChangeStatusFilter={true}
        showMyFilter={data.role === "ADMIN" || data.role === "COMMITTER"}
        productOptions={data?.products}
        showCalendar={true}
      />
      <div>
        <ChangesTable changes={data?.changes} from={data.fromPagination}/>
      </div>
      {data?.changes?.length > 0 && (
        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          fromPagination={data.fromPagination}
          toPagination={data.toPagination}
          totalCount={data.totalCount}
        />
      )}
      <Outlet />
    </>
  );
}
