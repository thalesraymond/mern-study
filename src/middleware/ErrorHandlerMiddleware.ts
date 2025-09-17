import { StatusCodes } from "http-status-codes";

export default class ErrorHandlerMiddleware {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static errorHandler(err: any, _req: any, res: any, next: any) {
    console.log(err);

    const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

    const msg = err.message || "Something went wrong, try again later";

    return res.status(statusCode).json({ msg });
  }

}