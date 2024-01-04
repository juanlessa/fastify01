import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
	root: fileURLToPath(new URL("./", import.meta.url)),
	test: {
		include: ["src/**/*.spec.ts"],
		environment: "node",
	},
	resolve: {
		alias: [{ find: "@", replacement: fileURLToPath(new URL("./src/", import.meta.url)) }],
	},
});
