import {
  ActionFunctionArgs,
  json,
  LoaderFunction,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { getUserId, login } from "~/server/auth.server";
import { LoginForm } from "~/server/types.server";
import { validateEmail, validatePassword } from "~/server/validators.server";

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
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
      { status: 400 }
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
      <h2>Login Route</h2>
      <form method="post" className="form">
        <div className="form__field">
          <label htmlFor="email">Email</label>
          <input type="text" id="email" name="email" />
        </div>
        <div className="form__field">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" />
        </div>

        <button>Submit</button>
      </form>
    </>
  );
}
