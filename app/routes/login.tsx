import { ActionFunctionArgs, json, LoaderFunction, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import TextField from "~/components/ui/TextField";
import { getUserId, login } from "~/server/auth.server";
import { LoginForm } from "~/server/types.server";
import { validateEmail, validatePassword } from "~/server/validators.server";

import loginStyles from "~/styles/login.css?url";

export function links() {
  return [{ rel: "stylesheet", href: loginStyles }];
}

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
  const userIdFromSession = await getUserId(request);
  if (userIdFromSession) {
    return redirect("/home");
  }
  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const { email, password } = data as LoginForm;
  // const redirectTo = validateUrl(form.get("redirectTo") || "/dashboard");
  // const redirectTo = "/"
  // todo - etc
  // if (typeof email !== "string" || typeof password !== "string" || typeof firstName !== "string") {
  //   return json({ error: `Invalid Form Data`, form: action }, { status: 400 });
  // }
  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
  };
  if (Object.values(errors).some(Boolean))
    return json(
      {
        errors,
        fields: { email, password },
        form: action,
      },
      { status: 400 },
    );
  // todo - ts check
  await login({ email, password });
  // console.log(121, user)
  // console.log({ user });
  // if (!user) {
  //   return json(
  //     {
  //       fieldErrors: null,
  //       fields: { email, password },
  //       formError: `Username/Password combination is incorrect`,
  //     },
  //     { status: 400 }
  //   );
  // }
  return null;
};

export default function Login() {
  return (
    <>
      <h1 className="text-center">Логін</h1>
      <main>
        <Form method="post" className="form form--vertical">
          <TextField label="Email" type="email" name="email" autoComplete="username" isRequired fullWidth />
          <TextField label="Пароль" type="password" name="password" autoComplete="current-password" isRequired fullWidth />
          <button className="button button--primary">Відправити</button>
        </Form>
      </main>
    </>
  );
}
