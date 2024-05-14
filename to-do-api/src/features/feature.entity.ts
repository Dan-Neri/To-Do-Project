/**
 * Defines the Feature entity which corresponds to a table in the 
 * database and represents a group of related actions that can be
 * performed in the project workflow.
 */
import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn,
    PrimaryColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
    Unique
} from 'typeorm';
import { List } from '../lists/list.entity';
import { UserStory } from '../user-stories/user-story.entity';

@Entity()
@Unique(['list', 'position'])
export class Feature {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne((type) => List, (list) => list.features)
    @JoinColumn({ name: 'listID'})
    list: List;
    
    @Column('varchar')
    title: string;
    
    @Column({ type: 'varchar', nullable: true })
    description: string;
    
    @Column('int')
    position: number;

    @OneToMany((type) => UserStory, (userStory) => userStory.feature)
    userStories: UserStory[];
}