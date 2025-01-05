import { DataSource } from 'typeorm';
import { State, City, College, CollegePlacement, CollegeWiseCourse } from '../../entities';

export class InitialDatabaseSeed {
  constructor(private dataSource: DataSource) {}

  async run() {
    // Create states
    const states = await this.createStates();
    
    // Create cities
    const cities = await this.createCities(states);
    
    // Create colleges
    const colleges = await this.createColleges(cities);
    
    // Create placements
    await this.createPlacements(colleges);
    
    // Create courses
    await this.createCourses(colleges);
  }

  private async createStates(): Promise<State[]> {
    const stateNames = [
      'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi', 
      'Uttar Pradesh', 'Gujarat', 'West Bengal', 'Telangana'
    ];

    const states = stateNames.map(name => {
      const state = new State();
      state.name = name;
      return state;
    });

    return this.dataSource.getRepository(State).save(states);
  }

  private async createCities(states: State[]): Promise<City[]> {
    const cityData = [
      { name: 'Mumbai', state: states[0] },
      { name: 'Pune', state: states[0] },
      { name: 'Bangalore', state: states[1] },
      { name: 'Mysore', state: states[1] },
      { name: 'Chennai', state: states[2] },
      { name: 'Coimbatore', state: states[2] },
      { name: 'New Delhi', state: states[3] },
      { name: 'Lucknow', state: states[4] },
      { name: 'Ahmedabad', state: states[5] },
      { name: 'Kolkata', state: states[6] },
      { name: 'Hyderabad', state: states[7] }
    ];

    const cities = cityData.map(({ name, state }) => {
      const city = new City();
      city.name = name;
      city.state = state;
      return city;
    });

    return this.dataSource.getRepository(City).save(cities);
  }

  private async createColleges(cities: City[]): Promise<College[]> {
    const collegeNames = [
      'Technical Institute of Engineering',
      'National College of Technology',
      'Institute of Advanced Studies',
      'University of Technology',
      'College of Engineering Sciences',
      'Metropolitan University',
      'Institute of Technology and Management',
      'College of Applied Sciences'
    ];

    const colleges = [];
    for (const name of collegeNames) {
      for (const city of cities) {
        const college = new College();
        college.name = `${city.name} ${name}`;
        college.score = Math.floor(Math.random() * 900) + 100; // 100-1000
        college.city = city;
        college.state = city.state;
        colleges.push(college);
      }
    }

    return this.dataSource.getRepository(College).save(colleges);
  }

  private async createPlacements(colleges: College[]) {
    const placements = [];
    const currentYear = new Date().getFullYear();
    const years = [currentYear - 2, currentYear - 1, currentYear];

    for (const college of colleges) {
      for (const year of years) {
        const placement = new CollegePlacement();
        placement.college = college;
        placement.year = year;
        placement.highestPlacement = Math.floor(Math.random() * 3000000) + 1000000; // 1M-4M
        placement.averagePlacement = Math.floor(Math.random() * 1000000) + 500000; // 500K-1.5M
        placement.medianPlacement = Math.floor(Math.random() * 800000) + 600000; // 600K-1.4M
        placement.placementRate = Math.floor(Math.random() * 40) + 60; // 60-100%
        placements.push(placement);
      }
    }

    return this.dataSource.getRepository(CollegePlacement).save(placements);
  }

  private async createCourses(colleges: College[]) {
    const courseData = [
      { name: 'Computer Science Engineering', duration: 4, baseFee: 200000 },
      { name: 'Electronics Engineering', duration: 4, baseFee: 180000 },
      { name: 'Mechanical Engineering', duration: 4, baseFee: 170000 },
      { name: 'Civil Engineering', duration: 4, baseFee: 160000 },
      { name: 'Information Technology', duration: 4, baseFee: 190000 },
      { name: 'Data Science', duration: 2, baseFee: 250000 },
      { name: 'Artificial Intelligence', duration: 2, baseFee: 280000 },
      { name: 'Robotics Engineering', duration: 4, baseFee: 220000 }
    ];

    const courses = [];
    for (const college of colleges) {
      for (const course of courseData) {
        const collegeWiseCourse = new CollegeWiseCourse();
        collegeWiseCourse.college = college;
        collegeWiseCourse.courseName = course.name;
        collegeWiseCourse.courseDuration = course.duration;
        // Vary course fee by ±20% for each college
        const variation = (Math.random() * 0.4) - 0.2;
        collegeWiseCourse.courseFee = Math.round(course.baseFee * (1 + variation));
        courses.push(collegeWiseCourse);
      }
    }

    return this.dataSource.getRepository(CollegeWiseCourse).save(courses);
  }
}