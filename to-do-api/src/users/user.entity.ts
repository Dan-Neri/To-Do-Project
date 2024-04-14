/**
 * Defines the User entity which corresponds to a table in the database.
 */
import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn,
    OneToMany
} from 'typeorm';
import { Project } from '../project/project.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column('varchar')
    firstName: string;

    @Column('varchar')
    lastName: string;
  
    @Column('varchar')
    username: string;
    
    @Column('varchar')
    email: string;
    
    @Column('varchar')
    password: string;
    
    @OneToMany((type) => Project, (project) => project.user)
    projects: Project[];
    
    @Column({type: 'bool', default: true })
    isActive: boolean;
}
