import { NavLink } from "@remix-run/react";
import { SideMenuProps } from "~/types";

export default function SideMenu({ role }: SideMenuProps) {
  return (
    <aside>
      <nav>
        <ul>
          {role === "ADMIN" ? (
            <>
              <li>
                <NavLink
                  className={({ isActive, isPending }) =>
                    isActive ? "active" : isPending ? "pending" : ""
                  }
                  to={"/home/register"}
                >
                  Register
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive, isPending }) =>
                    isActive ? "active" : isPending ? "pending" : ""
                  }
                  to={"/home/users"}
                >
                  Users
                </NavLink>
              </li>
            </>
          ) : null}
        </ul>
      </nav>
    </aside>
  );
}