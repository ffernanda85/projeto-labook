import { BaseError } from "./BaseError";

export class BadRequestError extends BaseError{
    constructor(
        message: string = 'invalid request'
    ) {
        super(400,message)
    }
}