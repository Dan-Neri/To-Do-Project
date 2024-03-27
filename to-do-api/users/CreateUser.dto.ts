/**
 * A class declaration for the data transfer object that will be used to
 * pass user information from the UI to the API.
 */
export class CreateUserDTO {
    _id?: number;
    firstName: string;
    lastName: string;
    username: string;
    isActive?: boolean;
}