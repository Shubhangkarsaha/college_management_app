import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { College, City, State } from '../entities';

@Injectable()
export class CollegesService {
  constructor(
    @InjectRepository(College)
    private collegeRepository: Repository<College>,
    @InjectRepository(City)
    private cityRepository: Repository<City>,
    @InjectRepository(State)
    private stateRepository: Repository<State>,
  ) {}

  async findAll(cityId?: number, stateId?: number) {
    const queryBuilder = this.collegeRepository
      .createQueryBuilder('college')
      .leftJoinAndSelect('college.city', 'city')
      .leftJoinAndSelect('college.state', 'state')
      .orderBy('college.score', 'DESC'); // Sort by score as per requirements

    if (cityId) {
      queryBuilder.andWhere('college.cityId = :cityId', { cityId });
    }

    if (stateId) {
      queryBuilder.andWhere('college.stateId = :stateId', { stateId });
    }

    const colleges = await queryBuilder.getMany();

    if (colleges.length === 0) {
      throw new NotFoundException(
        'No colleges found with the specified criteria',
      );
    }

    return colleges;
  }

  async findOne(id: number) {
    const college = await this.collegeRepository.findOne({
      where: { id },
      relations: ['city', 'state'],
    });

    if (!college) {
      throw new NotFoundException(`College with ID ${id} not found`);
    }

    return college;
  }

  async findByCity(cityId: number) {
    const city = await this.cityRepository.findOne({
      where: { id: cityId },
    });

    if (!city) {
      throw new NotFoundException(`City with ID ${cityId} not found`);
    }

    return this.findAll(cityId);
  }

  async findByState(stateId: number) {
    const state = await this.stateRepository.findOne({
      where: { id: stateId },
    });

    if (!state) {
      throw new NotFoundException(`State with ID ${stateId} not found`);
    }

    return this.findAll(undefined, stateId);
  }

  async create(createCollegeDto: any) {
    const college = this.collegeRepository.create(createCollegeDto);
    return this.collegeRepository.save(college);
  }

  async update(id: number, updateCollegeDto: any) {
    const college = await this.findOne(id);
    this.collegeRepository.merge(college, updateCollegeDto);
    return this.collegeRepository.save(college);
  }

  async remove(id: number) {
    const college = await this.findOne(id);
    return this.collegeRepository.remove(college);
  }
}