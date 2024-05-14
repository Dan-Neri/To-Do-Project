/**
 * Defines the Project Entity which corresponds to a table in the 
 * database and represents a project to be created, geared towards
 * software engineering projects.
 */
import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn,
    PrimaryColumn,
    OneToMany,
    ManyToOne,
    JoinColumn,
    Unique
} from 'typeorm';
import { User } from '../users/user.entity';
import { List } from '../lists/list.entity';

@Entity()
export class Project {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne((type) => User, (user) => user.projects)
    @JoinColumn({ name: 'userID'})
    user: User;
    
    @Column('varchar')
    title: string;
    
    @Column({ type: 'varchar', nullable: true })
    description: string;

    @OneToMany((type) => List, (list) => list.project)
    lists: List[];
}