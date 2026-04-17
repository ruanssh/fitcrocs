import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateWorkoutExerciseDto {
  @ApiPropertyOptional({ example: 'Supino inclinado' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  exerciseName?: string;

  @ApiPropertyOptional({ example: 'peito' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  bodyPartMock?: string;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt()
  @Min(1)
  orderIndex?: number;

  @ApiPropertyOptional({ example: 'Alterado no app' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  notes?: string;
}
