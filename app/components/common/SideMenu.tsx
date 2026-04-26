import { Form, Link, NavLink } from "@remix-run/react";
import { Icon } from "../ui/Icon";
import styles from "./SideMenu.module.css";
import UserBar from "./UserBar";
import { UserVM } from "~/types";

type SideMenuProps = {
  user: UserVM;
  count: number;
};

export default function SideMenu({ user, count }: SideMenuProps) {
  return (
    <aside className="aside">
      <UserBar user={user} />
      <nav aria-label="Main navigation">
        <ul className={styles.sideMenuList}>
          {user.role === "ADMIN" ? (
            <>
              <li className={styles.sideMenuItem}>
                <NavLink className={({ isActive, isPending }) => (isActive ? "active" : isPending ? "pending" : "")} to={"register"}>
                  <Icon name="create-user" /> Реєстрація
                </NavLink>
              </li>
              <li className={styles.sideMenuItem}>
                <NavLink className={({ isActive, isPending }) => (isActive ? "active" : isPending ? "pending" : "")} to={"users"}>
                  <Icon name="users" /> Користувачі
                </NavLink>
              </li>
            </>
          ) : null}
          <li className={styles.sideMenuItem}>
            <NavLink className={({ isActive, isPending }) => (isActive ? "active" : isPending ? "pending" : "")} to={"products"}>
              <Icon name="products" /> Продукти
            </NavLink>
          </li>
          <li className={styles.sideMenuItem}>
            <div className={styles.changesLinkWrapper}>
              <NavLink className={({ isActive, isPending }) => (isActive ? "active" : isPending ? "pending" : "")} to={"changes"}>
                <Icon name="changes" />
                Всі зміни
              </NavLink>
              {user.role === "VIEWER" && count > 0 && (
                <Link to="changes?unread=1&status=APPROVED" className={styles.linkForViewer}>
                  <span className={styles.viewerCircle}>{count}</span>
                </Link>
              )}
            </div>
          </li>
          <li className={styles.sideMenuItem}>
            <NavLink className={({ isActive, isPending }) => (isActive ? "active" : isPending ? "pending" : "")} to={"help"}>
              <Icon name="help" />
              Допомога
            </NavLink>
          </li>
          <li className={styles.sideMenuItem}>
            <NavLink className={({ isActive, isPending }) => (isActive ? "active" : isPending ? "pending" : "")} to={"uikit"}>
              <Icon name="no-icon" />
              UI kit
            </NavLink>
          </li>
        </ul>
      </nav>
      <Form className="logoutForm" action="/logout" method="post">
        <button type="submit" aria-label="Вийти" className="logout">
          <Icon name="logout" /> Вийти
        </button>
      </Form>
    </aside>
  );
}
