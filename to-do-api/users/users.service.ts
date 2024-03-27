/**
 * The UsersService provides all methods referenced by the 
 * UsersController.
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDTO } from './CreateUser.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) {}

    //Return all users in the database.
    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    //Return a user with a matching id from the database.
    findOne(id: number): Promise<User | null> {
        return this.usersRepository.findOneBy({ id });
    }
    
    //Create a new user and save it to the database.
    async create(data: Partial<User>): Promise<User> {
        const user = await this.usersRepository.create(data);
        return await this.usersRepository.save(user);
    }
    
    //Remove a user with a matching id from the database.
    async remove(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }
}
