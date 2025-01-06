# College Management API

A NestJS-based backend application for managing college-related data with PostgreSQL. This application provides secure endpoints for managing college information, placement data, and course details.

## Features

- JWT-based authentication
- College data management
- Placement statistics with trend analysis
- Course management with fee-based sorting
- City and state-based filtering
- Swagger API documentation

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd college-management-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the root directory with the following variables:
```env
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=college_management

# JWT
JWT_SECRET=your-super-secret-jwt-key-that-should-be-changed-in-production
JWT_EXPIRATION=1d
```

4. Run database migrations:
```bash
npm run typeorm migration:run
```

5. Start the application:
```bash
npm run start:dev
```

## API Documentation

The API documentation is available at `/api` when the server is running. You can explore and test the endpoints using Swagger UI.

### Authentication Endpoints

- POST `/auth/register` - Register a new user
- POST `/auth/login` - Login and get JWT token

### College Endpoints

All college endpoints require JWT authentication. Include the JWT token in the Authorization header:
\`Authorization: Bearer <your-token>\`

#### College Placements
- GET `/college_data/:collegeId`
  - Returns placement statistics and trends
  - Includes average calculations and placement rate trends

#### College Courses
- GET `/college_courses/:collegeId`
  - Returns course information sorted by fee
  - Includes course duration and fee details

#### College Filtering
- GET `/colleges`
  - Query Parameters:
    - city (optional): Filter by city ID
    - state (optional): Filter by state ID
  - Returns colleges sorted by score (1-1000)

## Database Schema

### Tables

1. States
   - id (Primary Key)
   - name (unique)

2. Cities
   - id (Primary Key)
   - name
   - state_id (Foreign Key)

3. Colleges
   - id (Primary Key)
   - name
   - score (1-1000)
   - city_id (Foreign Key)
   - state_id (Foreign Key)

4. College_Placement
   - id (Primary Key)
   - college_id (Foreign Key)
   - year
   - highest_placement
   - average_placement
   - median_placement
   - placement_rate

5. College_Wise_Course
   - id (Primary Key)
   - college_id (Foreign Key)
   - course_name
   - course_duration
   - course_fee

## Deployment

### Deploying to Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the following:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:prod`
4. Add Environment Variables in Render dashboard
5. Deploy the service

### Database Setup on Render

1. Create a new PostgreSQL database on Render
2. Use the provided connection details in your environment variables
3. Run migrations during deployment

## Testing

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## API Examples

### Login Request
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Get College Placements
```bash
curl -X GET http://localhost:3000/college_data/1 \
  -H "Authorization: Bearer <your-token>"
```

### Get College Courses
```bash
curl -X GET http://localhost:3000/college_courses/1 \
  -H "Authorization: Bearer <your-token>"
```

### Filter Colleges by City
```bash
curl -X GET "http://localhost:3000/colleges?city=1" \
  -H "Authorization: Bearer <your-token>"
```
