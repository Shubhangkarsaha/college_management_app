import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollegePlacement } from '../entities';
import {
  PlacementAverage,
  PlacementWithTrend,
  PlacementResponse,
} from './interfaces/placement.interface';

@Injectable()
export class PlacementsService {
  constructor(
    @InjectRepository(CollegePlacement)
    private placementRepository: Repository<CollegePlacement>,
  ) {}

  async getCollegePlacements(collegeId: number): Promise<PlacementResponse> {
    // Get placement data excluding null/zero values
    const placements = await this.placementRepository
      .createQueryBuilder('placement')
      .where('placement.collegeId = :collegeId', { collegeId })
      .andWhere('placement.highestPlacement IS NOT NULL')
      .andWhere('placement.highestPlacement != 0')
      .andWhere('placement.averagePlacement IS NOT NULL')
      .andWhere('placement.averagePlacement != 0')
      .andWhere('placement.medianPlacement IS NOT NULL')
      .andWhere('placement.medianPlacement != 0')
      .andWhere('placement.placementRate IS NOT NULL')
      .andWhere('placement.placementRate != 0')
      .orderBy('placement.year', 'DESC')
      .getMany();

    if (placements.length === 0) {
      throw new NotFoundException(
        `No placement data found for college ID ${collegeId}`,
      );
    }

    // Calculate placement trend
    const placementsWithTrend: PlacementWithTrend[] = placements.map(
      (placement, index, array) => {
        if (index === array.length - 1) {
          return placement;
        }

        const currentRate = placement.placementRate;
        const previousRate = array[index + 1].placementRate;

        return {
          ...placement,
          placementTrend: currentRate > previousRate ? 'UP' : 'DOWN',
        };
      },
    );

    return {
      avg_section: await this.calculateAverages(collegeId),
      placement_section: placementsWithTrend,
    };
  }

  private async calculateAverages(collegeId: number): Promise<PlacementAverage[]> {
    const result = await this.placementRepository
      .createQueryBuilder('placement')
      .select('placement.year', 'year')
      .addSelect('AVG(placement.highestPlacement)', 'avgHighestPlacement')
      .addSelect('AVG(placement.averagePlacement)', 'avgAveragePlacement')
      .addSelect('AVG(placement.medianPlacement)', 'avgMedianPlacement')
      .addSelect('AVG(placement.placementRate)', 'avgPlacementRate')
      .where('placement.collegeId = :collegeId', { collegeId })
      .andWhere('placement.highestPlacement IS NOT NULL')
      .andWhere('placement.highestPlacement != 0')
      .andWhere('placement.averagePlacement IS NOT NULL')
      .andWhere('placement.averagePlacement != 0')
      .andWhere('placement.medianPlacement IS NOT NULL')
      .andWhere('placement.medianPlacement != 0')
      .andWhere('placement.placementRate IS NOT NULL')
      .andWhere('placement.placementRate != 0')
      .groupBy('placement.year')
      .orderBy('placement.year', 'DESC')
      .getRawMany();

    return result.map(avg => ({
      year: parseInt(avg.year),
      avgHighestPlacement: parseFloat(avg.avgHighestPlacement),
      avgAveragePlacement: parseFloat(avg.avgAveragePlacement),
      avgMedianPlacement: parseFloat(avg.avgMedianPlacement),
      avgPlacementRate: parseFloat(avg.avgPlacementRate),
    }));
  }
}