import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollegeWiseCourse } from '../entities';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(CollegeWiseCourse)
    private courseRepository: Repository<CollegeWiseCourse>,
  ) {}

  async getCollegeCourses(collegeId: number) {
    const courses = await this.courseRepository
      .createQueryBuilder('course')
      .where('course.collegeId = :collegeId', { collegeId })
      .orderBy('course.courseFee', 'DESC') // Sort by course fee in descending order
      .getMany();

    if (courses.length === 0) {
      throw new NotFoundException(
        `No courses found for college ID ${collegeId}`,
      );
    }

    return courses;
  }

  async findOne(id: number) {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['college'],
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  async create(createCourseDto: any) {
    const course = this.courseRepository.create(createCourseDto);
    return this.courseRepository.save(course);
  }

  async update(id: number, updateCourseDto: any) {
    const course = await this.findOne(id);
    this.courseRepository.merge(course, updateCourseDto);
    return this.courseRepository.save(course);
  }

  async remove(id: number) {
    const course = await this.findOne(id);
    return this.courseRepository.remove(course);
  }

  async findByFeeRange(minFee: number, maxFee: number) {
    return this.courseRepository
      .createQueryBuilder('course')
      .where('course.courseFee BETWEEN :minFee AND :maxFee', { minFee, maxFee })
      .orderBy('course.courseFee', 'DESC')
      .getMany();
  }

  async findByDuration(duration: number) {
    return this.courseRepository
      .createQueryBuilder('course')
      .where('course.courseDuration = :duration', { duration })
      .orderBy('course.courseFee', 'DESC')
      .getMany();
  }
}