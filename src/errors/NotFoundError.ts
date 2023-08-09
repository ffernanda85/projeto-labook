import { BaseError } from "./BaseError";

export class NotFoundError extends BaseError{
    constructor(
        message: string = 'resource not found'
    ) {
        super(404, message)
    }
}