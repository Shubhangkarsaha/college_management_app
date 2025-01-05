import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';

@Entity('users')
export class User {
  @ApiProperty({ description: 'The unique identifier of the user' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The username of the user' })
  @Column({ type: 'varchar', length: 100, unique: true })
  username: string;

  @ApiProperty({ description: 'The email of the user' })
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @ApiProperty({ description: 'The role of the user' })
  @Column({ type: 'varchar', length: 20, default: 'user' })
  role: string;

  @ApiProperty({ description: 'Whether the user is active' })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @BeforeInsert()
  async hashPassword() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}