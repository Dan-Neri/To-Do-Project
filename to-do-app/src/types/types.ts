/**
 * This file contains types which are used by multiple other front-end 
 * files.
 */
 export type StatusType = (
    'success' | 
    'error' | 
    'warning' | 
    'info' | 
    'loading' | 
    undefined
);

export interface UpdateUserDTO {
    [key: string]: string | undefined;
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
    password?: string;
    confirmPass?: string;
} 