import { UserBarProps } from "~/types";

export default function UserBar({ user }: UserBarProps) {
  return (
    <div>
      <div>Role: {user.role}</div>
      <div>Welcome, {user.firstName} {user.lastName}</div>
      <form action="/logout" method="post">
        <button type="submit">Logout</button>
      </form>
    </div>
  );
}
