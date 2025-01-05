import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('cities')
export class City {
  @ApiProperty({ description: 'The unique identifier of the city' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The name of the city' })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty({ description: 'The state ID this city belongs to' })
  @Column({ name: 'state_id' })
  stateId: number;

  @ManyToOne('State', 'cities', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'state_id' })
  state: any;

  @OneToMany('College', 'city')
  colleges: any[];
}