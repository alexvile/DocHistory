import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { register, requireUserRole } from "~/server/auth.server";
import { RegisterForm } from "~/server/types.server";
import { validateEmail, validateName, validatePassword } from "~/server/validators.server";
import { Role } from "@prisma/client";
import translate from "~/utils/translate";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import TextField from "~/components/ui/TextField";

const ADMIN_REGISTERABLE_ROLES = [Role.APPROVER, Role.COMMITTER, Role.VIEWER] as const;
const SUPER_ADMIN_REGISTERABLE_ROLES = [Role.ADMIN] as const;

function getRegisterableRoles(role: Role): readonly Role[] {
  if (role === Role.SUPER_ADMIN) {
    return SUPER_ADMIN_REGISTERABLE_ROLES;
  }
  if (role === Role.ADMIN) {
    return ADMIN_REGISTERABLE_ROLES;
  }
  return [];
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const role = await requireUserRole(request);
  const registerableRoles = getRegisterableRoles(role);
  if (registerableRoles.length === 0) {
    throw new Response("Forbidden: Access denied", { status: 403 });
  }
  return { registerableRoles };
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const currentUserRole = await requireUserRole(request);
  const registerableRoles = getRegisterableRoles(currentUserRole);
  if (registerableRoles.length === 0) {
    throw new Response("Forbidden: Access denied", { status: 403 });
  }

  // invariant(params.contactId, "Missing contactId param");
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  // ts as FormdataProps and refactor
  const { firstName, lastName, email, password, role } = data as RegisterForm;
  if (!registerableRoles.includes(role)) {
    throw new Response("Invalid role", { status: 400 });
  }
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
      { status: 400 },
    );
  // todo - ts check
  const result = await register({
    email,
    password,
    firstName,
    lastName,
    role,
  });
  if (result instanceof Response) {
    return result;
  }
  return redirect("/home/users");
};

export default function Register() {
  const { registerableRoles } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <>
      <h2>Register (only for admin)</h2>

      {actionData && "error" in actionData && <div className="alert alert-warning">{actionData.error}</div>}

      <Form method="post" className="form form--register">
        <TextField label="Ім'я" name="firstName" isRequired />
        <TextField label="Прізвище" name="lastName" isRequired />
        <TextField type="email" label="Email" name="email" isRequired autoComplete="off" />
        <TextField type="password" label="Пароль" name="password" isRequired autoComplete="off" />
        <div className="form__field">
          <label htmlFor="role" className="p-label">Роль</label>
          <select className="p-select" name="role" id="role">
            {registerableRoles.map((role) => (
              <option key={role} value={role}>
                {translate("ROLES", role)}
              </option>
            ))}
          </select>
        </div>
        <button className="button button--primary">Submit</button>
      </Form>
    </>
  );
}
