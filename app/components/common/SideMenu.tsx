import { NavLink } from "@remix-run/react";
import { SideMenuProps } from "~/types";
import { Icon } from "../ui/Icon";
import styles from "./SideMenu.module.css";

export default function SideMenu({ role }: SideMenuProps) {
  return (
    <aside>
      <nav aria-label="Main navigation">
        <ul className={styles.sideMenuList}>
          {role === "ADMIN" ? (
            <>
              <li className={styles.sideMenuItem}>
                <NavLink
                  className={({ isActive, isPending }) =>
                    isActive ? "active" : isPending ? "pending" : ""
                  }
                  to={"register"}
                >
                  <Icon name="create-user" /> Реєстрація
                </NavLink>
              </li>
              <li className={styles.sideMenuItem}>
                <NavLink
                  className={({ isActive, isPending }) =>
                    isActive ? "active" : isPending ? "pending" : ""
                  }
                  to={"users"}
                >
                  <Icon name="users" /> Користувачі
                </NavLink>
              </li>
            </>
          ) : null}
          <li className={styles.sideMenuItem}>
            <NavLink
              className={({ isActive, isPending }) =>
                isActive ? "active" : isPending ? "pending" : ""
              }
              to={"products"}
            >
              <Icon name="products" /> Продукти
            </NavLink>
          </li>
          <li className={styles.sideMenuItem}>
            <NavLink
              className={({ isActive, isPending }) =>
                isActive ? "active" : isPending ? "pending" : ""
              }
              to={"changes"}
            >
              <Icon name="changes" /> !!! Мої Зміни (draft)
            </NavLink>
          </li>
             <li className={styles.sideMenuItem}>
            <NavLink
              className={({ isActive, isPending }) =>
                isActive ? "active" : isPending ? "pending" : ""
              }
              to={"help"}
            >
              <Icon name="help" />Допомога
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
