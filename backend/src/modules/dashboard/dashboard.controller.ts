import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { AuthenticatedRequest } from '../auth/authenticated-request.type';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DashboardPeriodDto } from './dto/dashboard-period.dto';
import { TopExercisesQueryDto } from './dto/top-exercises-query.dto';
import { DashboardService } from './dashboard.service';

@ApiTags('dashboard')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboard: DashboardService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Resumo de treinos por periodo de meses' })
  @ApiOkResponse({ description: 'Resumo retornado com sucesso' })
  getSummary(
    @Req() req: AuthenticatedRequest,
    @Query() query: DashboardPeriodDto,
  ) {
    return this.dashboard.getSummary(BigInt(req.user.sub), query);
  }

  @Get('top-exercises')
  @ApiOperation({ summary: 'Exercicios mais feitos no periodo' })
  @ApiOkResponse({ description: 'Ranking retornado com sucesso' })
  getTopExercises(
    @Req() req: AuthenticatedRequest,
    @Query() query: TopExercisesQueryDto,
  ) {
    return this.dashboard.getTopExercises(BigInt(req.user.sub), query);
  }

  @Get('heatmap')
  @ApiOperation({ summary: 'Heatmap diario estilo GitHub no periodo' })
  @ApiOkResponse({ description: 'Heatmap retornado com sucesso' })
  getHeatmap(
    @Req() req: AuthenticatedRequest,
    @Query() query: DashboardPeriodDto,
  ) {
    return this.dashboard.getHeatmap(BigInt(req.user.sub), query);
  }
}
