import type { NextFunction, Request, Response } from "express";
import { logger } from "@/utils/logger.js";
import { AppError } from "@/utils/AppError.js";

const handleErrors = (error: unknown, req: Request, res: Response, _next: NextFunction) => {
	const status = error instanceof AppError ? error.status || 500 : 500;
	const message = error instanceof AppError ? error.message : "Server error";
	const service = error instanceof AppError ? error.service : "unknownService";
	const method = error instanceof AppError ? error.method : "unknownMethod";
	const errorStack = error instanceof Error ? error.stack : undefined;
	const errorDetails =
		error instanceof AppError
			? error.details
			: {
					path: req.originalUrl,
					requestMethod: req.method,
					errorName: error instanceof Error ? error.name : typeof error,
					errorMessage: error instanceof Error ? error.message : String(error),
				};
	logger.error({
		message: message,
		service: service,
		method: method,
		stack: errorStack,
		details: errorDetails,
	});
	res.status(status).json({
		status,
		msg: message,
	});
};

export { handleErrors };
