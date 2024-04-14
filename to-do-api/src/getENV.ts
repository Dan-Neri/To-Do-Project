/**
 * The GetENV method provides and easy way to ensure that the required
 * enviromental variables exist in the .env file. This method is
 * exported to be used across the API for .env variable loads.
 */
 import * as dotenv from 'dotenv';

dotenv.config()

export default function GetENV(key: string): string {
    if (process.env[key] === undefined) {
        throw ReferenceError(`Environmental variable missing: ${key}`);
    }
    return process.env[key] as string;
}