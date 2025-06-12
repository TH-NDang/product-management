import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { db, getPoolStatus } from "./db";
import { auth } from "./lib/auth";

const app = new Hono();

const log = {
	info: (message: string, data?: unknown) => {
		console.log(`🟢 [INFO] ${new Date().toISOString()} - ${message}`);
		if (data) console.log(data);
	},
	error: (message: string, error?: unknown) => {
		console.error(`🔴 [ERROR] ${new Date().toISOString()} - ${message}`);
		if (error) console.error(error);
	},
	warn: (message: string, data?: unknown) => {
		console.warn(`🟡 [WARN] ${new Date().toISOString()} - ${message}`);
		if (data) console.warn(data);
	},
	success: (message: string, data?: unknown) => {
		console.log(`✅ [SUCCESS] ${new Date().toISOString()} - ${message}`);
		if (data) console.log(data);
	},
};

const validateEnvironment = () => {
	log.info("🔧 Validating environment configuration...");

	const requiredEnvVars = {
		DATABASE_URL: process.env.DATABASE_URL,
		CORS_ORIGIN: process.env.CORS_ORIGIN,
	};

	log.info("Environment variables:", {
		DATABASE_URL: process.env.DATABASE_URL ? "✅ Set" : "❌ Missing",
		CORS_ORIGIN: process.env.CORS_ORIGIN
			? `✅ ${process.env.CORS_ORIGIN}`
			: "❌ Missing",
		NODE_ENV: process.env.NODE_ENV || "development",
		PORT: process.env.PORT || "3000",
	});

	const missingVars = Object.entries(requiredEnvVars)
		.filter(([key, value]) => !value)
		.map(([key]) => key);

	if (missingVars.length > 0) {
		log.warn("Missing environment variables:", missingVars);
	} else {
		log.success("All required environment variables are set");
	}
};

const testDatabaseConnection = async () => {
	log.info("🗄️ Testing database connection...");

	try {
		await db.execute("SELECT 1");
		log.success("Database connection successful!");
		return true;
	} catch (error) {
		log.error("Database connection failed:", error);
		return false;
	}
};

app.use(
	logger((message, ...rest) => {
		const timestamp = new Date().toISOString();
		console.log(`🌐 [${timestamp}] ${message}`, ...rest);
	}),
);

app.use("*", async (c, next) => {
	const start = Date.now();
	const method = c.req.method;
	const url = c.req.url;

	log.info(`📥 Incoming ${method} request to ${url}`);

	// Log request headers in development
	if (process.env.NODE_ENV !== "production") {
		log.info(
			"Request headers:",
			Object.fromEntries(c.req.raw.headers.entries()),
		);
	}

	await next();

	const duration = Date.now() - start;
	const status = c.res.status;

	if (status >= 200 && status < 300) {
		log.success(`📤 ${method} ${url} - ${status} (${duration}ms)`);
	} else if (status >= 400) {
		log.error(`📤 ${method} ${url} - ${status} (${duration}ms)`);
	} else {
		log.info(`📤 ${method} ${url} - ${status} (${duration}ms)`);
	}
});

app.use(
	"/*",
	cors({
		origin: process.env.CORS_ORIGIN || "",
		allowMethods: ["GET", "POST", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	}),
);

log.info(
	"🚀 CORS configured with origin:",
	process.env.CORS_ORIGIN || "Not set",
);

// Better Auth handler - specific routes
app.all("/api/auth/sign-up", async (c) => {
	log.info(`🔐 Sign-up endpoint accessed: ${c.req.method} ${c.req.url}`);
	try {
		const response = await auth.handler(c.req.raw);
		log.success(`🔐 Auth response: ${response.status}`);
		return response;
	} catch (error) {
		log.error("🔐 Auth handler error:", error);
		return c.json({ error: "Auth handler failed" }, 500);
	}
});

app.all("/api/auth/sign-in", async (c) => {
	log.info(`🔐 Sign-in endpoint accessed: ${c.req.method} ${c.req.url}`);
	try {
		const response = await auth.handler(c.req.raw);
		log.success(`🔐 Auth response: ${response.status}`);
		return response;
	} catch (error) {
		log.error("🔐 Auth handler error:", error);
		return c.json({ error: "Auth handler failed" }, 500);
	}
});

app.all("/api/auth/session", async (c) => {
	log.info(`🔐 Session endpoint accessed: ${c.req.method} ${c.req.url}`);
	try {
		const response = await auth.handler(c.req.raw);
		log.success(`🔐 Auth response: ${response.status}`);
		return response;
	} catch (error) {
		log.error("🔐 Auth handler error:", error);
		return c.json({ error: "Auth handler failed" }, 500);
	}
});

app.all("/api/auth/sign-out", async (c) => {
	log.info(`🔐 Sign-out endpoint accessed: ${c.req.method} ${c.req.url}`);
	try {
		const response = await auth.handler(c.req.raw);
		log.success(`🔐 Auth response: ${response.status}`);
		return response;
	} catch (error) {
		log.error("🔐 Auth handler error:", error);
		return c.json({ error: "Auth handler failed" }, 500);
	}
});

// Catch-all for other auth routes
app.all("/api/auth/*", async (c) => {
	log.info(`🔐 Auth wildcard endpoint accessed: ${c.req.method} ${c.req.url}`);
	try {
		const response = await auth.handler(c.req.raw);
		log.success(`🔐 Auth response: ${response.status}`);
		return response;
	} catch (error) {
		log.error("🔐 Auth handler error:", error);
		return c.json({ error: "Auth handler failed" }, 500);
	}
});

app.get("/", (c) => {
	log.info("✅ Health check endpoint accessed");
	return c.text("OK");
});

// Debug auth configuration
app.get("/api/debug/auth", (c) => {
	log.info("🔍 Auth debug endpoint accessed");
	return c.json({
		message: "Auth debug info",
		baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
		corsOrigin: process.env.CORS_ORIGIN,
		hasSecret: !!process.env.BETTER_AUTH_SECRET,
		timestamp: new Date().toISOString(),
	});
});

app.get("/health", async (c) => {
	log.info("🏥 Detailed health check requested");

	const dbConnected = await testDatabaseConnection();
	const poolStatus = getPoolStatus();

	const healthData = {
		status: "ok",
		timestamp: new Date().toISOString(),
		database: dbConnected ? "connected" : "disconnected",
		environment: process.env.NODE_ENV || "development",
		version: "1.0.0",
		connectionPool: {
			total: poolStatus.totalCount,
			idle: poolStatus.idleCount,
			waiting: poolStatus.waitingCount,
			active: poolStatus.totalCount - poolStatus.idleCount,
		},
	};

	log.info("Health check result:", healthData);

	return c.json(healthData);
});

app.onError((err, c) => {
	log.error("🚨 Unhandled error occurred:", {
		message: err.message,
		stack: err.stack,
		url: c.req.url,
		method: c.req.method,
	});

	return c.json(
		{
			error: "Internal Server Error",
			message:
				process.env.NODE_ENV === "development"
					? err.message
					: "Something went wrong",
		},
		500,
	);
});

const startServer = async () => {
	log.info(`🚀 Starting server on port ${process.env.PORT || 3000}`);
	log.info("=".repeat(50));

	validateEnvironment();
	await testDatabaseConnection();

	log.info("=".repeat(50));
	log.success("Server initialization completed!");
	log.info("🌍 Server is ready to accept connections");
	log.info("📡 Auth endpoints available at /api/auth/**");
	log.info("🏥 Health check available at /health");
	log.info("=".repeat(50));
};

startServer().catch((error) => {
	log.error("Failed to start server:", error);
	process.exit(1);
});

export default app;
