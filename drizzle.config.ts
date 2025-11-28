import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle/migrations",
  schema: './src/lib/db/schema/index.ts',
  dialect: 'postgresql',
  migrations: {
    table: 'drizzle_migrations',
    schema: 'public',
  },
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});