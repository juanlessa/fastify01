import { config } from "dotenv";
import { z } from "zod";

if (process.env.NODE_ENV === "test") {
	config({ path: ".env.testing" });
} else {
	config();
}

const envSchema = z.object({
	DATABASE_URL: z.string(),
	DATABASE_CLIENT: z.enum(["sqlite", "pg"]),
	NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
	PORT: z.coerce.number().default(3333),
});

export const env = envSchema.parse(process.env);
