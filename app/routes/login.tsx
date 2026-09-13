import { ActionFunctionArgs, json, LoaderFunction, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, useNavigation } from "@remix-run/react";
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
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== "idle";
  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-heading">
        <div className="login-brand">
          {/* Add the enterprise logo here when the asset is available. */}
          <p className="login-brand__name">Контроль виробничих норм</p>
        </div>
        <h1 id="login-heading" className="login-heading">Вхід до системи</h1>
        <p className="login-description">Увійдіть у свій обліковий запис.</p>
        <Form method="post" className="login-form">
          <TextField label="Email" type="email" name="email" autoComplete="username" size="big" isRequired fullWidth />
          <TextField label="Пароль" type="password" name="password" autoComplete="current-password" size="big" isRequired fullWidth />
          <button type="submit" className="button button--primary button--brand button-big full-width" disabled={isSubmitting}>
            {isSubmitting ? "Входимо…" : "Увійти"}
          </button>
        </Form>
        <p className="login-help">Для отримання доступу зверніться до адміністратора.</p>
      </section>
    </main>
  );
}
