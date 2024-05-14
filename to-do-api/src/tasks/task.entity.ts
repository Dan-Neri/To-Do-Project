/**
 * Defines the Task Entity which corresponds to a table in the 
 * database and represents a single task which must be completed in
 * order to implement a specific user story in the project workflow.
 */
import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn,
    PrimaryColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { UserStory } from '../user-stories/user-story.entity';

@Entity()
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne((type) => UserStory, (userStory) => userStory.tasks)
    @JoinColumn({ name: 'userStoryID'})
    userStory: UserStory;
    
    @Column('varchar')
    content: string;
    
    @Column('boolean')
    completed: boolean;
}