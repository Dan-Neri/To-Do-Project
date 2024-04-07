/**
 * Defines the User Entity which corresponds to a table in the database.
 */
import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class Password {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column('varchar')
    salt: string;

    @Column('varchar')
    hash: string;
}
