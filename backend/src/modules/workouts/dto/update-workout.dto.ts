import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateWorkoutDto {
  @ApiPropertyOptional({ example: '2026-04-18' })
  @IsOptional()
  @IsDateString()
  workoutDate?: string;

  @ApiPropertyOptional({ example: '2026-04-18T18:10:00' })
  @IsOptional()
  @IsDateString()
  startAt?: string;

  @ApiPropertyOptional({ example: '2026-04-18T19:15:00' })
  @IsOptional()
  @IsDateString()
  endAt?: string;

  @ApiPropertyOptional({ example: 'Treino atualizado' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
