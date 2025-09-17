import { StatusCodes } from "http-status-codes";
import CustomError from "./CustomError.js";

export default class NotFoundError extends CustomError {
  constructor(message: string) {
    super(message, StatusCodes.NOT_FOUND);
    
    this.name = "NotFoundError";
  }
}
