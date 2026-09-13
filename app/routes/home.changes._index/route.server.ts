import { LoaderFunction } from "@remix-run/node";
import { requireUserId, requireUserRole } from "~/server/auth.server";
import { ChangeSetStatus, Prisma } from "@prisma/client";
import { getFilteredChangeSets, getTotalChangesCount, getViewerChangeSets } from "~/server/changes.server";
import changesSortConfig from "./changesSortConfig";
import { getAllProducts } from "~/server/products.server";
import { parsePaginationParams } from "~/utils/pagination.server";
import { prisma } from "~/server/prisma.server";

export const loader: LoaderFunction = async ({ request }) => {
  const role = await requireUserRole(request);
  const userId = await requireUserId(request);

  const url = new URL(request.url);
  const personFilters: { key: "createdById" | "approverId"; label: string }[] = [];
  const personWhere: Prisma.ChangeSetWhereInput = {};
  for (const key of ["createdById", "approverId"] as const) {
    const id = url.searchParams.get(key);
    if (id === null) continue;
    if (!/^[a-f\d]{24}$/i.test(id)) {
      throw new Response("Некоректний ідентифікатор користувача", { status: 400 });
    }
    const person = await prisma.user.findUnique({
      where: { id },
      select: { firstName: true, lastName: true },
    });
    if (!person) {
      throw new Response("Користувача не знайдено", { status: 404 });
    }
    personWhere[key] = id;
    personFilters.push({
      key,
      label: `${key === "createdById" ? "Автор" : "Погоджувач"}: ${person.firstName} ${person.lastName}`,
    });
  }
  // todo - can be optimized in future
  const products = await getAllProducts();

  const { page, take, skip } = parsePaginationParams(url.searchParams);

  const defaultSort = changesSortConfig.default;
  const dir = url.searchParams.get("dir") ?? defaultSort.split(":")[1];
  const sort = url.searchParams.get("sort") ?? "createdAt";
  const direction: Prisma.SortOrder = dir === "asc" ? "asc" : "desc";

  const allowedSortFields = ["createdAt", "decidedAt"] as const;
  type SortField = (typeof allowedSortFields)[number];

  const safeSort: SortField = allowedSortFields.includes(sort as SortField) ? (sort as SortField) : "createdAt";

  const orderBy: Prisma.ChangeSetOrderByWithRelationInput = {
    [safeSort]: direction,
  };
  // фільтри
  const productId = url.searchParams.get("productId"); // з комбобокса
  const statusParam = url.searchParams.get("status"); // DRAFT | APPROVED | REJECTED
  const fromParam = url.searchParams.get("from");
  const toParam = url.searchParams.get("to");
  const myOnly = url.searchParams.get("my") === "1"; // approver and committer only
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

  // 🔥 базовий where
  const where: Prisma.ChangeSetWhereInput = {
    AND: [personWhere],
    ...(productId && { productId }),
    ...(role === "VIEWER"
      ? { status: ChangeSetStatus.APPROVED }
      : statusParam && { status: statusParam as ChangeSetStatus }),
    ...(createdAtFilter && { createdAt: createdAtFilter }),
  };

  // 🔥 myOnly
  if (myOnly) {
    if (role === "APPROVER") {
      where.approverId = userId;
    }

    if (role === "COMMITTER") {
      where.createdById = userId;
    }
  }

  // 🔥 ВАЖЛИВО: onlyUnread прямо в where
  if (role === "VIEWER" && onlyUnread) {
    where.views = {
      none: {
        userId,
      },
    };
  }

  const totalCount = await getTotalChangesCount(where);
  const totalPages = Math.ceil(totalCount / take);

  let changes;
  if (role === "VIEWER") {
    changes = await getViewerChangeSets({
      where,
      orderBy,
      skip,
      take,
      userId,
    });
  } else {
    changes = await getFilteredChangeSets(where, orderBy, skip, take);
  }

  return {
    personFilters,
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
