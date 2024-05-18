/**
 * This file contains types which are used by multiple other front-end 
 * files.
 */
 
 //A type for the Axios response status.
export type StatusType = (
    'success' | 
    'error' | 
    'warning' | 
    'info' | 
    'loading' | 
    undefined
);

/*An interface describing the outlet context object used to update the
logged in status and username.*/
export interface outletContextType {
    setLoggedIn: (loggedIn: boolean) => void;
    setUsername: (username: string) => void;
}

//An interface describing the transfer object used to reset a user's password.
export interface ResetPasswordDTO {
    token: string;
    userID: string;
    password: string;
}

//An interface describing a user.
export interface User {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    projects: Project[];
}

//An interface describing the transfer object used to create a new User.
export interface CreateUserDTO {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
}

//An interface describing the transfer object used to update an existing User.
export interface UpdateUserDTO {
    [key: string]: string | undefined;
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
    password?: string;
}

//An interface describing a project.
export interface Project {
    id: string;
    title: string;
    description: string;
    lists: List[];
}

//An interface describing the transfer object used to create a new project.
export interface CreateProjectDTO {
    title: string;
    description?: string;
}

/*An interface describing the transfer object used to update an existing 
project.*/
export interface UpdateProjectDTO {
    id: string;
    title?: string;
    description?: string;
    lists?: List[];
}

//An interface describing a list.
export interface List {
    id: string;
    title: string;
    position: number;
    features: Feature[];
}

//An interface describing the transfer object used to create a new list.
export interface CreateListDTO {
    projectID: string;
    title?: string;
    description?: string;
}

//An interface describing the transfer object used to update an existing list.
export interface UpdateListDTO {
    id: string;
    projectID: string;
    title?: string;
    features?: Feature[];
}

//An interface describing a feature.
export interface Feature {
    id: string;
    title: string;
    description: string;
    position: number;
    userStories: UserStory[];
}

//An interface describing the transfer object used to create a new feature.
export interface CreateFeatureDTO {
    projectID: string;
    listID: string;
    title: string;
    description?: string;
    userStories?: UserStory[];
}

/*An interface describing the transfer object used to update an existing 
feature.*/
export interface UpdateFeatureDTO {
    id: string;
    projectID: string;
    listID: string;
    title?: string;
    description?: string;
    position?: number;
    userStories?: UserStory[];
}

//An interface describing a user story.
export interface UserStory {
    id: string;
    title: string;
    description: string;
    tasks: Task[];
}

//An interface describing the transfer object used to create a new feature.
export interface CreateUserStoryDTO {
    projectID: string;
    listID: string;
    featureID: string;
    title: string;
    description?: string;
}

/*An interface describing the transfer object used to update an existing 
user story.*/
export interface UpdateUserStoryDTO {
    id: string;
    projectID: string;
    listID: string;
    featureID: string;
    title?: string;
    description?: string;
    position?: number;
    tasks?: Task[];
}

//An interface describing a task.
export interface Task {
    id: string;
    content: string;
    completed: boolean;
}

//An interface describing the transfer object used to create a new task.
export interface CreateTaskDTO {
    projectID: string;
    listID: string;
    featureID: string;
    userStoryID: string;
    content?: string;
    completed?: boolean;
}

//An interface describing the transfer object used to update an existing task.
export interface UpdateTaskDTO {
    id: string;
    projectID: string;
    listID: string;
    featureID: string;
    userStoryID: string;
    content?: string;
    completed?: boolean;
}