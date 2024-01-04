import { transactionsRoutes } from "./routes/transactionts";
import fastify from "fastify";
import cookie from "@fastify/cookie";
import { env } from "./env";

const app = fastify();

app.register(cookie);
app.register(transactionsRoutes, { prefix: "transactions" });

export { app };
