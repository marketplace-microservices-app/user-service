import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('buyers')
export class BuyerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  user_id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;
}
