import { LoaderFunction } from "@remix-run/node";
import { getUserId, requireUserRole } from "~/server/auth.server";
import { ChangeSetStatus, Prisma } from "@prisma/client";
import { getFilteredChangeSets, getTotalChangesCount, getViewerChangesCount, getViewerChangeSets } from "~/server/changes.server";
import changesSortConfig from "./changesSortConfig";
import { getAllProducts } from "~/server/products.server";

export const loader: LoaderFunction = async ({ request }) => {
  const role = await requireUserRole(request);
  const userId = await getUserId(request);

  const url = new URL(request.url);
  // todo - can be optimized in future
  const products = await getAllProducts();

  const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
  const take = Math.max(1, Number(url.searchParams.get("limit") ?? 10));
  const skip = (page - 1) * take;

  const defaultSort = changesSortConfig.default;
  const dir = url.searchParams.get("dir") ?? defaultSort.split(":")[1];
  const direction: Prisma.SortOrder = dir === "asc" ? "asc" : "desc";
  const orderBy: Prisma.ChangeSetOrderByWithRelationInput = {
    createdAt: direction,
  };
  // фільтри
  const productId = url.searchParams.get("productId"); // з комбобокса
  const statusParam = url.searchParams.get("status"); // DRAFT | APPROVED | REJECTED
  const fromParam = url.searchParams.get("from");
  const toParam = url.searchParams.get("to");
  const myOnly = url.searchParams.get("my") === "1"; // admin and committer only
  const onlyUnread = url.searchParams.get("unread") === "1"; // viewer only

  let createdAtFilter: Prisma.DateTimeFilter | undefined;

  if (fromParam || toParam) {
    createdAtFilter = {
      ...(fromParam && { gte: new Date(fromParam) }),
      ...(toParam && {
        // щоб включити весь день "to"
        lte: new Date(new Date(toParam).setHours(23, 59, 59, 999)),
      }),
    };
  }
  // where формується динамічно
  const where: Prisma.ChangeSetWhereInput = {
    ...(productId && { productId }),
    ...(statusParam && { status: statusParam as ChangeSetStatus }),
    ...(createdAtFilter && { createdAt: createdAtFilter }),
  };

  if (myOnly) {
    // todo - fix warning
    if (role === "ADMIN") {
      where.approverId = userId;
    }

    if (role === "COMMITTER") {
      where.createdById = userId;
    }
  }

  let totalCount;

  if (role === "VIEWER") {
    totalCount = await getViewerChangesCount({
      where,
      userId,
      onlyUnread,
    });
  } else {
    totalCount = await getTotalChangesCount(where);
  }
  const totalPages = Math.ceil(totalCount / take);

  let changes;
  if (role === "VIEWER") {
    changes = await getViewerChangeSets({
      where,
      orderBy,
      skip,
      take,
      userId,
      onlyUnread,
    });
  } else {
    changes = await getFilteredChangeSets(where, orderBy, skip, take);
  }

  return {
    products,
    changes,
    page,
    totalPages,
    totalCount,
    fromPagination: skip + 1,
    toPagination: Math.min(skip + take, totalCount),
    role,
    onlyUnread,
  };
};
// todo - rewrite all to future responses

// todo - create can commiter or ADMIN
// todo - show all norms
