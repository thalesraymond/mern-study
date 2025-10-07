import { StatusCodes } from "http-status-codes";
import CustomError from "./CustomError.js";

export default class UnauthenticatedError extends CustomError {
    constructor(message: string) {
        super(message, StatusCodes.FORBIDDEN);

        this.name = "UnauthenticatedError";
    }
}
