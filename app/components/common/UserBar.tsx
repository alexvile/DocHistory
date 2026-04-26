import { UserVM } from "~/types";
import { Icon } from "../ui/Icon";
import styles from "./UserBar.module.css";
import translate from "~/utils/translate";

type UserBarProps = {
  user: UserVM;
};

export default function UserBar({ user }: UserBarProps) {
  return (
    <div className={styles.container}>
      {/* add gravatar */}
      <Icon name="account" />
      <div>
        <p className={styles.name}>
          {user.firstName} {user.lastName}
        </p>
        <p className={styles.role}>
          <span className="visually-hidden">Роль:</span>
          {translate("ROLES", user.role)}
        </p>
      </div>
    </div>
  );
}
