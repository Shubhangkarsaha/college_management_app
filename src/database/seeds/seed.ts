import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeder.module';

async function bootstrap() {
  try {
    const app = await NestFactory.createApplicationContext(SeederModule, {
      logger: ['error', 'warn'],
    });

    // The seeder will run automatically due to the provider factory
    await app.close();
    process.exit(0);
  } catch (error) {
    console.error('Error during database seed:', error);
    process.exit(1);
  }
}

bootstrap();