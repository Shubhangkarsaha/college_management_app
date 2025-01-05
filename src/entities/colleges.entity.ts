import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, Check, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('colleges')
@Index(['cityId', 'stateId']) // Index for faster filtering
export class College {
  @ApiProperty({ description: 'The unique identifier of the college' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The name of the college' })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ description: 'The score of the college (1-1000)' })
  @Column({ type: 'integer' })
  @Check('score >= 1 AND score <= 1000')
  score: number;

  @ApiProperty({ description: 'The city ID this college belongs to' })
  @Column({ name: 'city_id' })
  cityId: number;

  @ApiProperty({ description: 'The state ID this college belongs to' })
  @Column({ name: 'state_id' })
  stateId: number;

  @ManyToOne('City', 'colleges', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'city_id' })
  city: any;

  @ManyToOne('State', 'colleges', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'state_id' })
  state: any;

  @OneToMany('CollegePlacement', 'college')
  placements: any[];

  @OneToMany('CollegeWiseCourse', 'college')
  courses: any[];
}