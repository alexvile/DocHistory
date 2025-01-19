import {
  ActionFunctionArgs,
  json,
  LoaderFunction,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { register, requireUserRole } from "~/server/auth.server";
import { RegisterForm } from "~/server/types.server";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "~/server/validators.server";

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  const role = await requireUserRole(request);
  if (role !== "ADMIN") {
    throw new Response("Forbidden: Access denied", { status: 403 });
  }
  return null;
};
export const action = async ({ request }: ActionFunctionArgs) => {
  // invariant(params.contactId, "Missing contactId param");
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  // ts as FormdataProps and refactor
  const { firstName, lastName, email, password, role } = data as RegisterForm;
  // todo - etc
  // if (typeof email !== "string" || typeof password !== "string" || typeof firstName !== "string") {
  //   return json({ error: `Invalid Form Data`, form: action }, { status: 400 });
  // }
  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
    firstName: validateName((firstName as string) || ""),
    lastName: validateName((lastName as string) || ""),
  };
  if (Object.values(errors).some(Boolean))
    return json(
      {
        errors,
        fields: { email, password, firstName, lastName },
        form: action,
      },
      { status: 400 }
    );
  // todo - ts check
  await register({
    email,
    password,
    firstName,
    lastName,
    role,
  });
};

export default function Register() {
  return (
    <>
      <h2>Register (only for admin)</h2>
      <form method="post" className="form form--register">
        <div className="form__field">
          <label htmlFor="firstName">First name</label>
          <input type="text" id="firstName" name="firstName" />
        </div>

        <div className="form__field">
          <label htmlFor="lastName">Last name</label>
          <input type="text" id="lastName" name="lastName" />
        </div>
        <div className="form__field">
          <label htmlFor="email-1">Email</label>
          <input type="text" id="email" name="email" autoComplete="off" />
        </div>
        <div className="form__field">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            autoComplete="off"
          />
        </div>
        <div className="form__field">
          {/* todo - only superadmin can create ADMIN */}
          <label htmlFor="role">Role</label>
          <select name="role" id="role">
            <option value="ADMIN">Admin</option>
            <option value="COMMITER">Commiter</option>
            <option value="VIEWER">Viewer</option>
          </select>
        </div>
        <button>Submit</button>
      </form>
    </>
  );
}
