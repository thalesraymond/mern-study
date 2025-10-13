import { StatusCodes } from "http-status-codes";

/**
 * Middleware class for handling errors in an Express application.
 *
 * @remarks
 * This middleware captures errors thrown in the request pipeline,
 * logs them to the console, and sends a standardized JSON response
 * with the appropriate HTTP status code and error message.
 *
 * @example
 * ```typescript
 * import ErrorHandlerMiddleware from './middleware/ErrorHandlerMiddleware';
 * app.use(ErrorHandlerMiddleware.errorHandler);
 * ```
 */
export default class ErrorHandlerMiddleware {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public static errorHandler(err: any, _req: any, res: any, next: any) {

        const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

        const msg = err.message || "Something went wrong, try again later";

        return res.status(statusCode).json({ msg });
    }
}
