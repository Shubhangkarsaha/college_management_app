import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('college_wise_course')
export class CollegeWiseCourse {
  @ApiProperty({ description: 'The unique identifier of the course' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The college ID this course belongs to' })
  @Column({ name: 'college_id' })
  collegeId: number;

  @ApiProperty({ description: 'The name of the course' })
  @Column({ name: 'course_name', type: 'varchar', length: 255 })
  courseName: string;

  @ApiProperty({ description: 'The duration of the course in years' })
  @Column({ name: 'course_duration', type: 'decimal', precision: 3, scale: 1 })
  courseDuration: number;

  @ApiProperty({ description: 'The fee for the course' })
  @Column({ name: 'course_fee', type: 'decimal', precision: 10, scale: 2 })
  courseFee: number;

  @ManyToOne('College', 'courses', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'college_id' })
  college: any;
}