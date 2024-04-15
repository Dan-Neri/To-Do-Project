/**
 * Defines the Task Entity which corresponds to a table in the 
 * database.
 */
import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn,
    PrimaryColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { UserStory } from '../user-story/userStory.entity';

@Entity()
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @ManyToOne((type) => UserStory, (userStory) => userStory.tasks)
    @JoinColumn({ name: 'userStoryID'})
    userStory: UserStory;
    
    @Column('varchar')
    Content: string;
    
    @Column('boolean')
    completed: boolean;
    
    @Column({ type: 'int', unique: true })
    position: number;
}