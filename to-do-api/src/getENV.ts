/**
 *   Check to make sure the specified environmental variable exists in 
 *   the .env file and throw an exception otherwise.
 */
 import * as dotenv from 'dotenv';

dotenv.config()

export default function GetENV(key: string): string {
    if (process.env[key] === undefined) {
        throw ReferenceError(`Environmental variable missing: ${key}`);
    }
    return process.env[key] as string;
}