import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sellers')
export class SellerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  user_id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  country: string;
}
