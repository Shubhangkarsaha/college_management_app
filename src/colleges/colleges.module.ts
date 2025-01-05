import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  College,
  CollegePlacement,
  CollegeWiseCourse,
  City,
  State,
} from '../entities';
import { CollegesService } from './colleges.service';
import { CollegesController } from './colleges.controller';
import { PlacementsService } from './placements.service';
import { CoursesService } from './courses.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      College,
      CollegePlacement,
      CollegeWiseCourse,
      City,
      State,
    ]),
  ],
  providers: [CollegesService, PlacementsService, CoursesService],
  controllers: [CollegesController],
  exports: [CollegesService, PlacementsService, CoursesService],
})
export class CollegesModule {}