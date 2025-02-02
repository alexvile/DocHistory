import { NavLink } from "@remix-run/react";
import { SideMenuProps } from "~/types";
import { Icon } from "./Icon";

export default function SideMenu({ role }: SideMenuProps) {
  return (
    <aside>
      <nav>
        <ul className="side-menu__list">
          {role === "ADMIN" ? (
            <>
              <li className="side-menu__item">
                <NavLink
                  className={({ isActive, isPending }) =>
                    isActive ? "active" : isPending ? "pending" : ""
                  }
                  to={"/home/register"}
                >
                  <Icon name="create-user" /> Реєстрація
                </NavLink>
              </li>
              <li className="side-menu__item">
                <NavLink
                  className={({ isActive, isPending }) =>
                    isActive ? "active" : isPending ? "pending" : ""
                  }
                  to={"/home/users"}
                >
                  <Icon name="users" /> Користувачі
                </NavLink>
              </li>
            </>
          ) : null}
          <li className="side-menu__item">
            <NavLink
              className={({ isActive, isPending }) =>
                isActive ? "active" : isPending ? "pending" : ""
              }
              to={"/home/products"}
            >
              <Icon name="products" /> Продукти
            </NavLink>
          </li>
          <li className="side-menu__item">
            <NavLink
              className={({ isActive, isPending }) =>
                isActive ? "active" : isPending ? "pending" : ""
              }
              to={"/home/changes"}
            >
              <Icon name="changes" /> Зміни
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
