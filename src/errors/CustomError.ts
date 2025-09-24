import { StatusCodes } from "http-status-codes";

export default abstract class CustomError extends Error {
    statusCode: StatusCodes;

    constructor(message: string, statusCode: StatusCodes) {
        super(message);

        this.statusCode = statusCode;
    }
}
