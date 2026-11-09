/** Supavisor transaction mode cannot keep Prisma's prepared statements. */
export function runtimeDatabaseUrl(value: string | undefined): string | undefined {
  if (!value) return value;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return value;
  }

  if (url.port !== "6543" || !url.hostname.toLowerCase().endsWith(".pooler.supabase.com")) return value;

  url.searchParams.set("pgbouncer", "true");
  url.searchParams.set("connection_limit", "1");
  return url.toString();
}
