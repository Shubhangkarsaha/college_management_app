import { CollegePlacement } from '../../entities';
import { College } from '../../entities';

export interface PlacementAverage {
  year: number;
  avgHighestPlacement: number;
  avgAveragePlacement: number;
  avgMedianPlacement: number;
  avgPlacementRate: number;
}

export interface PlacementWithTrend extends Omit<CollegePlacement, 'college'> {
  placementTrend?: 'UP' | 'DOWN';
  college?: College;
}

export interface PlacementResponse {
  avg_section: PlacementAverage[];
  placement_section: PlacementWithTrend[];
}

export interface PlacementTrendResponse {
  trend: 'UP' | 'DOWN';
  currentRate: number;
  previousRate: number;
  year: number;
  previousYear: number;
}