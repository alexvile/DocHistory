import { UserVM } from "~/types";
import { Icon } from "../ui/Icon";
import styles from "./UserBar.module.css";
import translate from "~/utils/translate";
import { Form } from "@remix-run/react";

type UserBarProps = {
  user: UserVM;
};

export default function UserBar({ user }: UserBarProps) {
  return (
    <div className={styles.container}>
      <div>
        Роль:
        {translate("ROLES", user.role)}
      </div>
      <div>
        Вітаю, {user.firstName} {user.lastName}
      </div>
      <Form action="/logout" method="post">
        <button type="submit" aria-label="Logout" className={styles.logout}>
          <Icon name="logout" />
        </button>
      </Form>
    </div>
  );
}
