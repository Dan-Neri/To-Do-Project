/**
 * Defines the Project Entity which corresponds to a table in the 
 * database.
 */
import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn,
    PrimaryColumn,
    OneToMany,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { User } from '../users/user.entity';
import { Feature } from '../feature/feature.entity';

@Entity()
export class Project {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @ManyToOne((type) => User, (user) => user.projects)
    @JoinColumn({ name: 'userID'})
    user: User;
    
    @Column({ type:'varchar', unique: true })
    title: string;
    
    @Column({ type: 'int', unique: true })
    position: number;

    @OneToMany((type) => Feature, (feature) => feature.project)
    features: Feature[];
}