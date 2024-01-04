import crypto from "node:crypto";
import { FastifyInstance } from "fastify";
import { knex } from "@/database";
import { z } from "zod";
import { checkSessionId } from "@/middlewares/checkSessionId";

export const transactionsRoutes = async (app: FastifyInstance) => {
	app.get("/", { preHandler: [checkSessionId] }, async (request, reply) => {
		const { sessionId } = request.cookies;

		const transactions = await knex("transactions").where("session_id", sessionId).select();

		return reply.send({ transactions });
	});

	app.get("/:id", { preHandler: [checkSessionId] }, async (request) => {
		const getTransactionParamsSchema = z.object({ id: z.string().uuid() });
		const { id } = getTransactionParamsSchema.parse(request.params);
		const { sessionId } = request.cookies;

		const transaction = await knex("transactions").where({ session_id: sessionId, id }).first();
		return { transaction };
	});

	app.get("/summary", { preHandler: [checkSessionId] }, async (request) => {
		const { sessionId } = request.cookies;

		const summary = await knex("transactions")
			.where("session_id", sessionId)
			.sum("amount", { as: "amount" })
			.first();

		return { summary };
	});

	app.post("/", async (request, reply) => {
		const createTransactionBodySchema = z.object({
			title: z.string(),
			amount: z.number(),
			type: z.enum(["credit", "debit"]),
		});
		const { amount, title, type } = createTransactionBodySchema.parse(request.body);

		let sessionId = request.cookies.sessionId;

		if (!sessionId) {
			sessionId = crypto.randomUUID();
			reply.cookie("sessionId", sessionId, {
				path: "/",
				maxAge: 1000 * 60 * 60 * 7, // 7 days
			});
		}

		await knex("transactions").insert({
			id: crypto.randomUUID(),
			title: title,
			amount: type === "credit" ? amount : amount * -1,
			session_id: sessionId,
		});

		reply.status(201).send();
	});
};
