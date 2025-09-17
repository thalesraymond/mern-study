import { StatusCodes } from "http-status-codes";
import CustomError from "./CustomError.js";

export default class UnauthenticatedError extends CustomError {
  constructor(message: string) {
    super(message, StatusCodes.UNAUTHORIZED);

    this.name = "UnauthenticatedError";
  }
}
