const TEST_ERROR_STATUSES = new Set([401, 403, 404, 409, 422, 500]);

function throwTestError(status: number | undefined): void {
  if (process.env.NODE_ENV !== "development" || !status || !TEST_ERROR_STATUSES.has(status)) {
    return;
  }

  throw new Response("Development test error", { status });
}

export function throwDevelopmentLoaderTestError(routeParam: string): void {
  const match = /^test-(\d{3})$/.exec(routeParam);
  throwTestError(match ? Number(match[1]) : undefined);
}

export function throwDevelopmentActionTestError(request: Request): void {
  const status = Number(new URL(request.url).searchParams.get("test-action-error"));
  throwTestError(status);
}
