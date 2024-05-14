/**
 * Defines the UserStory entity which corresponds to a table in the 
 * database and represents one task that the user can complete within
 * the project.
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
import { Feature } from '../features/feature.entity';
import { Task } from '../tasks/task.entity';

@Entity()
export class UserStory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne((type) => Feature, (feature) => feature.userStories)
    @JoinColumn({ name: 'FeatureID'})
    feature: Feature;
    
    @Column('varchar')
    title: string;
    
    @Column({ type: 'varchar', nullable: true })
    description: string;

    @OneToMany((type) => Task, (task) => task.userStory)
    tasks: Task[];
}