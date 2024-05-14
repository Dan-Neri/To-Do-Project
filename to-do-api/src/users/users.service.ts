/**
 * The UsersService provides all methods referenced by the 
 * UsersController. It also provides 4 find methods for looking up User
 * account information with various keys.
 */
import { 
    Injectable, 
    ConflictException, 
    forwardRef, 
    Inject,
    BadRequestException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDTO } from './create-user.dto';
import { UpdateUserDTO } from './update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    //Return all users in the database.
    async findAll(): Promise<User[]> {
        return await this.usersRepository.find();
    }

    //Return a user with a matching id from the database.
    async findById(id: string): Promise<User> {
        const user = await this.usersRepository.findOne({
            where: { id: id }
        });
        if(!user) {
            throw new BadRequestException('User Not Found');
        }
        return user;
    }
    
    //Return a user with a matching username from the database.
    async findByName(username: string): Promise<User> {
        const user =  await this.usersRepository.findOne({ 
            where: { username: username.toLowerCase() }
        });
        if(!user) {
            throw new BadRequestException('User Not Found');
        }
        return user;
    }
    
    //Return a user with a matching email address from the database.
    async findByEmail(email: string): Promise<User> {
        const user = await this.usersRepository.findOne({ 
            where: { email: email.toLowerCase() }
        });
        if(!user) {
            throw new BadRequestException('User Not Found');
        }
        return user;
    }
    
    /*Take a user id and return the account information for the matching
    account. Throw an error if a matching user is not found.*/
    async getAccount(id: string): Promise<Partial<User> | null> {
        let userData = null;
        const user = await this.findById(id);
        if (user) {
            const { password, isActive, ...rest } = user;
            userData = rest;
        } else {
            throw new BadRequestException('User not found');
        }
        return userData;
    }
    
    /*Take new user information and create a corresponding user object
    from it. Then save that object in the database and return it. Throw 
    an error if the provided username or email address is already in 
    use.*/
    async create(DTO: CreateUserDTO): Promise<Partial<User>> {
        if(await this.usersRepository.findOne({
            where: { username: DTO.username.toLowerCase() }
        })) {
            throw new ConflictException(
                'Username already taken'
            );
        }
        if(await this.usersRepository.findOne({
            where: { email: DTO.email.toLowerCase() }
        })) {
            throw new ConflictException(
                'Email address already in use'
            );
        }
        //Hash the password, create a new user, and save it to the database.
        const hash = await this.hashPass(DTO.password);
        const userData = {
            firstName: DTO.firstName,
            lastName: DTO.lastName,
            email: DTO.email,
            username: DTO.username,
            password: hash,
            projects: [],
            projectCount: 0
        };
        const user = this.usersRepository.create(userData);
        const newUser = await this.usersRepository.save(user);
        const { password: newPassword, isActive, ...rest } = newUser;
        return rest;
    }
    
    /*Take a user id and any user account information. Update the
    matching account with the provided information. Throw an error if
    the provided username or email address is already in use.*/
    async update(
        userID: string, 
        DTO: UpdateUserDTO
    ): Promise<Partial<User>> {
        const user = await this.findById(userID);
        const update: { [key: string]: any } = {};
        if(!user) {
            throw new BadRequestException('User Not Found');
        }
        for (let [key, value] of Object.entries(DTO)) {
            if (key === 'firstName') {
                user.firstName = value as string;
                user.firstName = user.firstName[0].toUpperCase() + 
                    user.firstName.substring(1).toLowerCase();
            }
            if (key === 'lastName') {
                user.lastName = value as string;
                user.lastName = user.lastName[0].toUpperCase() +  
                    user.lastName.substring(1).toLowerCase();
            }
            if (key === 'username') {
                if(await this.findByName(value as string)) {
                    throw new ConflictException('Username already taken');
                } else {
                    user.username = value as string;
                    user.username = user.username.toLowerCase();
                }
            }
            if (key === 'email') {
                if (await this.findByEmail(value as string)) {
                    throw new ConflictException('Email already in use');
                } else {
                    user.email = value as string;
                    user.email = user.email.toLowerCase();
                }
            }
            if (key === 'password') {
                const hash = await this.hashPass(value as string);
                user.password = hash;
            }
            if (key === 'projectCount') {
                user.projectCount = value as number;
            }
        }
        const updatedUser = await this.usersRepository.save(user);
        const { password, isActive, ...rest } = updatedUser;
        return rest;
    }
    
    //Remove a user with a matching id from the database.
    async remove(id: string): Promise<void> {
        await this.usersRepository.delete(id);
    }
    
    //Use bcrypt to hash the password.
    async hashPass(
        pass: string, 
        saltRounds:number = 10
    ): Promise<string> {
        let passHash; 
        try {
            passHash = await bcrypt.hash(pass, saltRounds);
        }
        catch (error) {
            throw new Error('Error hashing password');
        }
        return passHash;
    }
}
