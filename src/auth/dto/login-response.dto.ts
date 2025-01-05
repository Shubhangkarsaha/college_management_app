import { ApiProperty } from '@nestjs/swagger';

class UserResponse {
  @ApiProperty({
    description: 'The unique identifier of the user',
  })
  id: number;

  @ApiProperty({
    description: 'The email address of the user',
  })
  email: string;

  @ApiProperty({
    description: 'The username of the user',
  })
  username: string;

  @ApiProperty({
    description: 'The role of the user',
  })
  role: string;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT access token',
  })
  access_token: string;

  @ApiProperty({
    description: 'User information',
    type: UserResponse,
  })
  user: UserResponse;
}