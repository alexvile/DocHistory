# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Bootstrap super admin

The bootstrap command creates the first and only `SUPER_ADMIN`. Run it once after configuring the database. Stop the development server before generating the Prisma client:

```bash
npx prisma generate
```

### Local development or production SSH shell

Set temporary environment variables in Bash, run the command, and remove the variables from the shell session:

```bash
export SUPER_ADMIN_EMAIL="owner@example.com"
export SUPER_ADMIN_PASSWORD="replace-with-a-strong-password"
export SUPER_ADMIN_FIRST_NAME="Super"
export SUPER_ADMIN_LAST_NAME="Admin"

npm run bootstrap:super-admin

unset SUPER_ADMIN_EMAIL SUPER_ADMIN_PASSWORD SUPER_ADMIN_FIRST_NAME SUPER_ADMIN_LAST_NAME
```

The command fails if a super admin already exists. The super admin can create `ADMIN` users in the application. Administrators can create `APPROVER`, `COMMITTER`, and `VIEWER` users.

### Vercel or hosting without SSH

Run the bootstrap script locally against the production database. Create a temporary `.env.production-bootstrap` file:

```env
DATABASE_URL="production-mongodb-url"
SUPER_ADMIN_EMAIL="owner@example.com"
SUPER_ADMIN_PASSWORD="replace-with-a-strong-password"
SUPER_ADMIN_FIRST_NAME="Super"
SUPER_ADMIN_LAST_NAME="Admin"
```

Run the script and remove the temporary file immediately:

```bash
node --env-file=.env.production-bootstrap scripts/create-super-admin.mjs
rm .env.production-bootstrap
```

Do not commit `.env.production-bootstrap`.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/server`
- `build/client`
