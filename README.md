# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Bootstrap super admin

Stop the development server before generating the Prisma client on Windows:

```powershell
npm.cmd exec prisma generate
```

Create the first and only super admin:

```powershell
$env:SUPER_ADMIN_EMAIL="owner@example.com"
$env:SUPER_ADMIN_PASSWORD="replace-with-a-strong-password"
$env:SUPER_ADMIN_FIRST_NAME="Super"
$env:SUPER_ADMIN_LAST_NAME="Admin"
npm.cmd run bootstrap:super-admin
Remove-Item Env:SUPER_ADMIN_EMAIL, Env:SUPER_ADMIN_PASSWORD, Env:SUPER_ADMIN_FIRST_NAME, Env:SUPER_ADMIN_LAST_NAME
```

The command fails if a super admin already exists. The super admin can create `ADMIN` users in the application. Administrators can create `APPROVER`, `COMMITTER`, and `VIEWER` users.

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
