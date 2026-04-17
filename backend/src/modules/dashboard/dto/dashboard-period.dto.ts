import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Matches } from 'class-validator';

const YEAR_MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

export class DashboardPeriodDto {
  @ApiPropertyOptional({ example: '2026-01' })
  @IsOptional()
  @Matches(YEAR_MONTH_PATTERN, {
    message: 'from deve estar no formato YYYY-MM',
  })
  from?: string;

  @ApiPropertyOptional({ example: '2026-12' })
  @IsOptional()
  @Matches(YEAR_MONTH_PATTERN, { message: 'to deve estar no formato YYYY-MM' })
  to?: string;
}
