import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('college_placement')
export class CollegePlacement {
  @ApiProperty({ description: 'The unique identifier of the placement record' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The college ID this placement record belongs to' })
  @Column({ name: 'college_id' })
  collegeId: number;

  @ApiProperty({ description: 'The year of the placement record' })
  @Column({ type: 'integer' })
  year: number;

  @ApiProperty({ description: 'The highest placement amount for the year' })
  @Column({ name: 'highest_placement', type: 'decimal', precision: 10, scale: 2, nullable: true })
  highestPlacement: number;

  @ApiProperty({ description: 'The average placement amount for the year' })
  @Column({ name: 'average_placement', type: 'decimal', precision: 10, scale: 2, nullable: true })
  averagePlacement: number;

  @ApiProperty({ description: 'The median placement amount for the year' })
  @Column({ name: 'median_placement', type: 'decimal', precision: 10, scale: 2, nullable: true })
  medianPlacement: number;

  @ApiProperty({ description: 'The placement rate for the year (percentage)' })
  @Column({ name: 'placement_rate', type: 'decimal', precision: 5, scale: 2, nullable: true })
  placementRate: number;

  @ManyToOne('College', 'placements', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'college_id' })
  college: any;
}