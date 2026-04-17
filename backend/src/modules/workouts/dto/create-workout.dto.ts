import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateWorkoutDto {
  @ApiProperty({ example: '2026-04-17' })
  @IsDateString()
  workoutDate!: string;

  @ApiPropertyOptional({ example: '2026-04-17T18:05:00' })
  @IsOptional()
  @IsDateString()
  startAt?: string;

  @ApiPropertyOptional({ example: '2026-04-17T19:12:00' })
  @IsOptional()
  @IsDateString()
  endAt?: string;

  @ApiPropertyOptional({ example: 'Treino de peito e triceps' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
