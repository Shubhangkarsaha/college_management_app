import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CollegesService } from './colleges.service';
import { PlacementsService } from './placements.service';
import { CoursesService } from './courses.service';
import { College, CollegeWiseCourse } from '../entities';
import { PlacementResponse } from './interfaces/placement.interface';
import { PlacementResponseDto } from './dto/placement-response.dto';

@ApiTags('Colleges')
@Controller()
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class CollegesController {
  constructor(
    private readonly collegesService: CollegesService,
    private readonly placementsService: PlacementsService,
    private readonly coursesService: CoursesService,
  ) {}

  @Get('college_data/:collegeId')
  @ApiOperation({ summary: 'Get college placement data with trends' })
  @ApiResponse({
    status: 200,
    description: 'Returns placement data with averages and trends',
    type: PlacementResponseDto,
  })
  @ApiResponse({ status: 404, description: 'College not found' })
  async getCollegePlacementData(
    @Param('collegeId', ParseIntPipe) collegeId: number,
  ): Promise<PlacementResponse> {
    await this.collegesService.findOne(collegeId); // Verify college exists
    return this.placementsService.getCollegePlacements(collegeId);
  }

  @Get('college_courses/:collegeId')
  @ApiOperation({ summary: 'Get college courses sorted by fee' })
  @ApiResponse({
    status: 200,
    description: 'Returns courses sorted by fee in descending order',
    type: [CollegeWiseCourse],
  })
  @ApiResponse({ status: 404, description: 'College not found' })
  async getCollegeCourses(
    @Param('collegeId', ParseIntPipe) collegeId: number,
  ): Promise<CollegeWiseCourse[]> {
    await this.collegesService.findOne(collegeId); // Verify college exists
    return this.coursesService.getCollegeCourses(collegeId);
  }

  @Get('colleges')
  @ApiOperation({ summary: 'Get colleges filtered by city and/or state' })
  @ApiQuery({ name: 'city', required: false, type: Number })
  @ApiQuery({ name: 'state', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Returns filtered colleges sorted by score',
    type: [College],
  })
  async getColleges(
    @Query('city') cityId?: number,
    @Query('state') stateId?: number,
  ): Promise<College[]> {
    if (cityId && stateId) {
      return this.collegesService.findAll(cityId, stateId);
    } else if (cityId) {
      return this.collegesService.findByCity(cityId);
    } else if (stateId) {
      return this.collegesService.findByState(stateId);
    }
    return this.collegesService.findAll();
  }

  @Get('colleges/:id')
  @ApiOperation({ summary: 'Get college by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the college details',
    type: College,
  })
  @ApiResponse({ status: 404, description: 'College not found' })
  async getCollege(@Param('id', ParseIntPipe) id: number): Promise<College> {
    return this.collegesService.findOne(id);
  }
}