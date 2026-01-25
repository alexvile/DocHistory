import { UserVM } from "~/types";
import { Icon } from "../ui/Icon";
import styles from "./UserBar.module.css";

type UserBarProps = {
  user: UserVM;
};

export default function UserBar({ user }: UserBarProps) {
  return (
    <div className={styles.container}>
      <div>Role: {user.role}</div>
      <div>
        Welcome, {user.firstName} {user.lastName}
      </div>
      <form action="/logout" method="post">
        <button type="submit" aria-label="Logout" className={styles.logout}>
          <Icon name="logout" />
        </button>
      </form>
    </div>
  );
}
