import { UserBarProps } from "~/types";
import { Icon } from "./Icon";

export default function UserBar({ user }: UserBarProps) {
  return (
    <div className="userbar">
      <div>Role: {user.role}</div>
      <div>Welcome, {user.firstName} {user.lastName}</div>
      <form action="/logout" method="post">
        <button type="submit" aria-label="Logout" className="userbar__logout">
          <Icon name="logout"/>
        </button>
      </form>
    </div>
  );
}
