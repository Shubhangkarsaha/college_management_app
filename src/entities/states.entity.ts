import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('states')
export class State {
  @ApiProperty({ description: 'The unique identifier of the state' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The name of the state' })
  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @OneToMany('City', 'state')
  cities: any[];

  @OneToMany('College', 'state')
  colleges: any[];
}