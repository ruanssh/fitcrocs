import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class AddWorkoutExerciseDto {
  @ApiProperty({ example: 'Supino reto' })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  exerciseName!: string;

  @ApiPropertyOptional({ example: 'peito' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  bodyPartMock?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  orderIndex?: number;

  @ApiPropertyOptional({ example: 'Foco em tecnica' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  notes?: string;
}
