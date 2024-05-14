/**
 * Defines the User entity which corresponds to a table in the database
 * and represent a single user account in the app.
 */
import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn,
    OneToMany
} from 'typeorm';
import { Project } from '../projects/project.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

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
    
    @Column({ type: 'int', nullable: true })
    projectCount: number;
    
    @Column({type: 'boolean', default: true })
    isActive: boolean;
}
