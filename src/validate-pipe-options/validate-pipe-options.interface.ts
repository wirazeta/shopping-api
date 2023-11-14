import { ValidationError } from "@nestjs/common";
import { ValidatorOptions } from "class-validator";

export interface ValidatePipeOptions extends ValidatorOptions {
    transform?: boolean;
    disableErrorMessage?: boolean;
    exceptionFactory?: (error: ValidationError) => any;
}
