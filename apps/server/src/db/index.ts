import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	max: 20,
	min: 2,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 10000,
	ssl:
		process.env.NODE_ENV === "production"
			? { rejectUnauthorized: false }
			: false,
});

pool.on("connect", (client) => {
	console.log("🔗 New client connected to PostgreSQL");
});

pool.on("error", (err, client) => {
	console.error("🚨 Unexpected error on idle client", err);
});

pool.on("acquire", (client) => {
	console.log("📤 Client acquired from pool");
});

pool.on("release", (client) => {
	console.log("📥 Client released back to pool");
});

export const db = drizzle({ client: pool });

export { pool };

export const getPoolStatus = () => {
	return {
		totalCount: pool.totalCount,
		idleCount: pool.idleCount,
		waitingCount: pool.waitingCount,
	};
};
