const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const ALLOWED_LIMITS = [5, 10, 20, 50] as const;

function parsePositiveInteger(value: string | null, fallback: number) {
  if (!value) return fallback;

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    return fallback;
  }

  return parsed;
}

export function parsePaginationParams(searchParams: URLSearchParams) {
  const page = parsePositiveInteger(searchParams.get("page"), DEFAULT_PAGE);
  const requestedLimit = parsePositiveInteger(searchParams.get("limit"), DEFAULT_LIMIT);
  const take = ALLOWED_LIMITS.includes(requestedLimit as (typeof ALLOWED_LIMITS)[number]) ? requestedLimit : DEFAULT_LIMIT;
  const skip = (page - 1) * take;

  return { page, take, skip };
}
