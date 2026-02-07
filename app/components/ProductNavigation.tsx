import { NavLink } from "@remix-run/react";

export default function ProductNavigation() {
  return (
    <nav className="product-nav" aria-label="Product sections">
      <ul className="list-unstyled product-nav__list">
        <li className="product-nav__item">
          <NavLink to="overview" className={({ isActive, isPending }) => (isActive ? "active" : isPending ? "pending" : "")}>
            Огляд
          </NavLink>
        </li>
        <li className="product-nav__item">
          <NavLink to="changes" className={({ isActive, isPending }) => (isActive ? "active" : isPending ? "pending" : "")}>
            Останні зміни
          </NavLink>
        </li>
        <li className="product-nav__item">
          <NavLink to="history" className={({ isActive, isPending }) => (isActive ? "active" : isPending ? "pending" : "")}>
            Історія
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
