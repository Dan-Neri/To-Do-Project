/**
 * Defines the User Entity which corresponds to a table in the database.
 */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column('varchar')
  firstName: string;

  @Column('varchar')
  lastName: string;
  
  @Column('varchar')
  username: string;

  @Column({type: 'bool', default: true })
  isActive: boolean;
}
