import { StatusCodes } from "http-status-codes";
import CustomError from "./CustomError.js";

export default class UnauthorizedError extends CustomError {
    constructor(message: string) {
        super(message, StatusCodes.FORBIDDEN);

        this.name = "UnauthorizedError";
    }
}
