/**
 * Defines the UserStory Entity which corresponds to a table in the 
 * database.
 */
import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn,
    PrimaryColumn,
    ManyToOne,
    OneToMany,
    JoinColumn
} from 'typeorm';
import { Feature } from '../feature/feature.entity';
import { Task } from '../task/task.entity';

@Entity()
export class UserStory {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @ManyToOne((type) => Feature, (feature) => feature.userStories)
    @JoinColumn({ name: 'FeatureID'})
    feature: Feature;
    
    @Column('varchar')
    title: string;
    
    @Column('varchar')
    Description: string;
    
    @Column({ type: 'int', unique: true })
    position: number;

    @OneToMany((type) => Task, (task) => task.userStory)
    tasks: Task[];
}