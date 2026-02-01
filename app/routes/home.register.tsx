import { ActionFunctionArgs, json, LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { register, requireUserRole } from "~/server/auth.server";
import { RegisterForm } from "~/server/types.server";
import { validateEmail, validateName, validatePassword } from "~/server/validators.server";
import { Role } from "@prisma/client";
import translate from "~/utils/translate";
import { Form } from "@remix-run/react";
import TextField from "~/components/ui/TextField";

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
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
      { status: 400 },
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

      <Form method="post" className="form form--register">
        <TextField label="Ім'я" name="firstName" isRequired />
        <TextField label="Прізвище" name="lastName" isRequired />
        <TextField type="email" label="Email" name="email" isRequired autoComplete="off" />
        <TextField type="password" label="Пароль" name="password" isRequired autoComplete="off" />
        <div className="form__field">
          {/* todo - only superadmin can create ADMIN */}
          <label htmlFor="role">Роль</label>
          <select className="select" name="role" id="role">
            {Object.values(Role).map((role) => (
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
