import { Form, Link, NavLink, useNavigation } from "@remix-run/react";
import * as Ariakit from "@ariakit/react";
import { Icon } from "../ui/Icon";
import styles from "./SideMenu.module.css";
import UserBar from "./UserBar";
import { UserVM } from "~/types";

type SideMenuProps = {
  user: UserVM;
  count: number;
};

export default function SideMenu({ user, count }: SideMenuProps) {
  const dialog = Ariakit.useDialogStore();
  const navigation = useNavigation();
  const isLoggingOut = navigation.state !== "idle" && navigation.formAction === "/logout";

  return (
    <aside className="aside">
      <UserBar user={user} />
      <nav aria-label="Main navigation">
        <ul className={styles.sideMenuList}>
          {user.role === "SUPER_ADMIN" || user.role === "ADMIN" ? (
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
      <div className="logoutForm">
        <Ariakit.DialogDisclosure store={dialog} type="button" aria-label="Вийти" className="logout">
          <Icon name="logout" /> Вийти
        </Ariakit.DialogDisclosure>
      </div>
      <Ariakit.Dialog store={dialog} backdrop={<div className="backdrop" />} className="dialog">
        <Ariakit.DialogHeading className="heading">Вийти з облікового запису?</Ariakit.DialogHeading>
        <Ariakit.DialogDescription className="text-md margin-0">Ви точно впевнені?</Ariakit.DialogDescription>
        <div className="flex justify-end gap-12">
          <Ariakit.DialogDismiss type="button" disabled={isLoggingOut} className="button button--secondary">
            Скасувати
          </Ariakit.DialogDismiss>
          <Form action="/logout" method="post">
            <button type="submit" disabled={isLoggingOut} className="button button--primary">
              {isLoggingOut ? "Виходимо…" : "Вийти"}
            </button>
          </Form>
        </div>
      </Ariakit.Dialog>
    </aside>
  );
}
