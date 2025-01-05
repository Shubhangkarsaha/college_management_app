import { ApiProperty } from '@nestjs/swagger';
import { PlacementResponse, PlacementAverage, PlacementWithTrend } from '../interfaces/placement.interface';
import { College } from '../../entities';

export class PlacementAverageDto implements PlacementAverage {
  @ApiProperty({ description: 'The year of the placement data' })
  year: number;

  @ApiProperty({ description: 'Average of highest placements for the year' })
  avgHighestPlacement: number;

  @ApiProperty({ description: 'Average of average placements for the year' })
  avgAveragePlacement: number;

  @ApiProperty({ description: 'Average of median placements for the year' })
  avgMedianPlacement: number;

  @ApiProperty({ description: 'Average placement rate for the year' })
  avgPlacementRate: number;
}

export class PlacementWithTrendDto implements Omit<PlacementWithTrend, 'college'> {
  @ApiProperty({ description: 'Unique identifier for the placement record' })
  id: number;

  @ApiProperty({ description: 'College ID this placement record belongs to' })
  collegeId: number;

  @ApiProperty({ description: 'Year of the placement record' })
  year: number;

  @ApiProperty({ description: 'Highest placement amount' })
  highestPlacement: number;

  @ApiProperty({ description: 'Average placement amount' })
  averagePlacement: number;

  @ApiProperty({ description: 'Median placement amount' })
  medianPlacement: number;

  @ApiProperty({ description: 'Placement rate percentage' })
  placementRate: number;

  @ApiProperty({ description: 'Trend direction compared to previous year', enum: ['UP', 'DOWN'] })
  placementTrend?: 'UP' | 'DOWN';

  @ApiProperty({ description: 'College relationship', type: () => College, required: false })
  college?: College;
}

export class PlacementResponseDto implements PlacementResponse {
  @ApiProperty({
    description: 'Average placement statistics by year',
    type: [PlacementAverageDto],
  })
  avg_section: PlacementAverageDto[];

  @ApiProperty({
    description: 'Detailed placement records with trends',
    type: [PlacementWithTrendDto],
  })
  placement_section: PlacementWithTrendDto[];
}