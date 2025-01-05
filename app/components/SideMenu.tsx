import { NavLink } from "@remix-run/react";

export default function SideMenu() {
  return (
    <aside>
      <nav>
        Sidebar
        <ul>
          <li>
            <NavLink
              className={({ isActive, isPending }) =>
                isActive ? "active" : isPending ? "pending" : ""
              }
              to={"/login"}
            >
              Login
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive, isPending }) =>
                isActive ? "active" : isPending ? "pending" : ""
              }
              to={"/register"}
            >
              Register
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
