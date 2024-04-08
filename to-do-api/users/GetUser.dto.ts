/**
 * A class declaration for the data transfer object that will be used to
 * retrieve user information.
 */
export class GetUserDTO {
    _id?: number;
    username?: string;
    access_token: string;
}