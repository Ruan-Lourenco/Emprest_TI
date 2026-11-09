import { describe, expect, it } from "vitest";
import { runtimeDatabaseUrl } from "./database-url";

describe("runtimeDatabaseUrl", () => {
  it("uses Supavisor transaction mode without prepared statements", () => {
    const input = "postgresql://postgres.example:placeholder@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?sslmode=require";
    const result = new URL(runtimeDatabaseUrl(input)!);

    expect(result.searchParams.get("pgbouncer")).toBe("true");
    expect(result.searchParams.get("connection_limit")).toBe("1");
    expect(result.searchParams.get("sslmode")).toBe("require");
  });

  it("corrects conflicting parameters on the transaction pooler", () => {
    const input = "postgresql://postgres.example:placeholder@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=false&connection_limit=8";
    const result = new URL(runtimeDatabaseUrl(input)!);

    expect(result.searchParams.get("pgbouncer")).toBe("true");
    expect(result.searchParams.get("connection_limit")).toBe("1");
  });

  it("leaves direct and local connections untouched", () => {
    const direct = "postgresql://postgres:placeholder@db.example.supabase.co:5432/postgres";
    const local = "postgresql://postgres:placeholder@localhost:5432/postgres";
    expect(runtimeDatabaseUrl(direct)).toBe(direct);
    expect(runtimeDatabaseUrl(local)).toBe(local);
  });
});
