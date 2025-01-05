import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { InitialDatabaseSeed } from './initial.seed';
import { State, City, College, CollegePlacement, CollegeWiseCourse } from '../../entities';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_NAME', 'college_management'),
        entities: [State, City, College, CollegePlacement, CollegeWiseCourse],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: 'SEEDER',
      useFactory: async (dataSource: DataSource) => {
        const seeder = new InitialDatabaseSeed(dataSource);
        try {
          console.log('Starting database seed...');
          await seeder.run();
          console.log('Database seed completed successfully');
        } catch (error) {
          console.error('Error during database seed:', error);
          throw error;
        }
      },
      inject: [DataSource],
    },
  ],
})
export class SeederModule {}