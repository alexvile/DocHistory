import { Link, useLocation, useMatches } from "@remix-run/react";
import { formatDateShortUA } from "~/utils/formatDateUA";
import styles from "./Breadcrumbs.module.css";

type Breadcrumb = {
  label: string;
  to?: string;
};

type ProductData = {
  product?: {
    title?: string;
  };
};

type ChangeData = {
  changeSet?: {
    createdAt?: string | Date;
    product?: {
      title?: string;
    };
  };
};

function hasProductData(data: unknown): data is ProductData {
  return typeof data === "object" && data !== null && "product" in data;
}

function hasChangeData(data: unknown): data is ChangeData {
  return typeof data === "object" && data !== null && "changeSet" in data;
}

function getProductTitle(matches: ReturnType<typeof useMatches>) {
  let productData: ProductData | undefined;
  let changeData: ChangeData | undefined;

  for (const match of matches) {
    if (hasProductData(match.data) && match.data.product?.title) {
      productData = match.data;
      break;
    }
  }

  for (const match of matches) {
    if (hasChangeData(match.data) && match.data.changeSet?.product?.title) {
      changeData = match.data;
      break;
    }
  }

  return productData?.product?.title ?? changeData?.changeSet?.product?.title;
}

function getChangeLabel(matches: ReturnType<typeof useMatches>, changeId?: string) {
  let changeData: ChangeData | undefined;

  for (const match of matches) {
    if (hasChangeData(match.data) && match.data.changeSet) {
      changeData = match.data;
      break;
    }
  }

  const createdAt = changeData?.changeSet?.createdAt;

  if (createdAt) {
    return `Зміна від ${formatDateShortUA(createdAt).split(",")[0]}`;
  }

  return changeId ? `Зміна ${changeId}` : "Зміна";
}

function buildBreadcrumbs(pathname: string, matches: ReturnType<typeof useMatches>): Breadcrumb[] {
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";
  const breadcrumbs: Breadcrumb[] = [{ label: "Домашня", to: "/home" }];

  if (normalizedPath === "/home") {
    return [{ label: "Домашня" }];
  }

  if (normalizedPath.startsWith("/home/uikit")) {
    return [];
  }

  if (normalizedPath.startsWith("/home/help")) {
    return [...breadcrumbs, { label: "Допомога" }];
  }

  if (normalizedPath.startsWith("/home/changes")) {
    const changeMatch = normalizedPath.match(/^\/home\/changes\/([^/]+)/);

    if (!changeMatch) {
      return [...breadcrumbs, { label: "Зміни" }];
    }

    return [...breadcrumbs, { label: "Зміни", to: "/home/changes" }, { label: getChangeLabel(matches, changeMatch[1]) }];
  }

  if (normalizedPath.startsWith("/home/products")) {
    const productMatch = normalizedPath.match(/^\/home\/products\/([^/]+)/);

    if (!productMatch) {
      return [...breadcrumbs, { label: "Продукти" }];
    }

    const productId = productMatch[1];
    const productLabel = productId === "new" ? "Новий продукт" : getProductTitle(matches) ?? productId;

    return [...breadcrumbs, { label: "Продукти", to: "/home/products" }, { label: productLabel }];
  }

  return breadcrumbs;
}

export default function Breadcrumbs() {
  const location = useLocation();
  const matches = useMatches();
  const breadcrumbs = buildBreadcrumbs(location.pathname, matches);

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav className={styles.breadcrumbs} aria-label="Breadcrumbs">
      <ol className={`${styles.list} list-unstyled`}>
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li className={styles.item} key={`${breadcrumb.label}-${index}`}>
              {index > 0 && <span className={styles.separator} aria-hidden="true">&gt;</span>}
              {breadcrumb.to && !isLast ? (
                <Link className={styles.link} to={breadcrumb.to}>
                  {breadcrumb.label}
                </Link>
              ) : (
                <span className={styles.current} aria-current={isLast ? "page" : undefined}>
                  {breadcrumb.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
