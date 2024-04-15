/**
 * Defines the Feature Entity which corresponds to a table in the 
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
import { Project } from '../project/project.entity';
import { UserStory } from '../user-story/userStory.entity';

@Entity()
export class Feature {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @ManyToOne((type) => Project, (project) => project.features)
    @JoinColumn({ name: 'projectID'})
    project: Project;
    
    @Column('varchar')
    title: string;
    
    @Column('varchar')
    Description: string;
    
    @Column({ type: 'int', unique: true })
    position: number;

    @OneToMany((type) => UserStory, (userStory) => userStory.feature)
    userStories: UserStory[];
}