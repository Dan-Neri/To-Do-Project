/**
 * Defines the List entity which corresponds to a table in the 
 * database and represents a status column in the project workflow.
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
import { Project } from '../projects/project.entity';
import { Feature } from '../features/feature.entity';

@Entity()
export class List {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne((type) => Project, (project) => project.lists)
    @JoinColumn({ name: 'projectID'})
    project: Project;
    
    @Column('varchar')
    title: string;
    
    @Column('int')
    position: number;
    
    @OneToMany((type) => Feature, (feature) => feature.list)
    features: Feature[];
}