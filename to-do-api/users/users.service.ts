/**
 * The UsersService provides all methods referenced by the 
 * UsersController.
 */
import { 
    Injectable, 
    ConflictException, 
    forwardRef, 
    Inject 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDTO } from './CreateUser.dto';
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
    async findById(id: number): Promise<User | null> {
        return await this.usersRepository.findOneBy({ id });
    }
    
    //Return a user with a matching username from the database.
    async findByName(username: string): Promise<User | null> {
        return await this.usersRepository.findOne({ 
            where: { username }
        });
    }
    
    //Create a new user and save it to the database.
    async create(data: CreateUserDTO): Promise<User> {
        const { username, password } = data;
        console.log('in the function');
        if(await this.usersRepository.findOne({
            where: { username }
        })) {
            console.log('user already exists');
            throw new ConflictException(
                'A user with this username already exists'
            );
        }
        //Hash the password, create a new user, and save it to the database.
        console.log(password);
        data.password = await this.hashPass(password);
        const user = this.usersRepository.create(data);
        return await this.usersRepository.save(user);
    }
    
    //Remove a user with a matching id from the database.
    async remove(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }
    
    //Use bcryptjs to hash the password.
    async hashPass(
        pass: string, 
        saltRounds:number = 10
    ): Promise<string> {
        let passHash; 
        try {
            passHash = await bcrypt.hash(pass, saltRounds);
        }
        catch (error) {
            console.error(error);
            throw new Error('Error hashing password');
        }
        return passHash;
    }
}
