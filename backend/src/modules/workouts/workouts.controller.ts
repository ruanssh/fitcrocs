import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { AuthenticatedRequest } from '../auth/authenticated-request.type';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AddWorkoutExerciseDto } from './dto/add-workout-exercise.dto';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { ListWorkoutsDto } from './dto/list-workouts.dto';
import { UpdateWorkoutExerciseDto } from './dto/update-workout-exercise.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { WorkoutsService } from './workouts.service';

@ApiTags('workouts')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('workouts')
export class WorkoutsController {
  constructor(private readonly workouts: WorkoutsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar treino do usuario autenticado' })
  @ApiCreatedResponse({ description: 'Treino criado com sucesso' })
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateWorkoutDto) {
    return this.workouts.create(BigInt(req.user.sub), dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar treinos do usuario autenticado' })
  @ApiOkResponse({ description: 'Treinos listados com sucesso' })
  list(@Req() req: AuthenticatedRequest, @Query() query: ListWorkoutsDto) {
    return this.workouts.list(BigInt(req.user.sub), query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhar treino por id' })
  @ApiOkResponse({ description: 'Treino encontrado com sucesso' })
  findOne(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.workouts.findOne(BigInt(req.user.sub), BigInt(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar treino por id' })
  @ApiOkResponse({ description: 'Treino atualizado com sucesso' })
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateWorkoutDto,
  ) {
    return this.workouts.update(BigInt(req.user.sub), BigInt(id), dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir treino por id' })
  @ApiOkResponse({ description: 'Treino removido com sucesso' })
  remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.workouts.remove(BigInt(req.user.sub), BigInt(id));
  }

  @Post(':id/exercises')
  @ApiOperation({ summary: 'Adicionar exercicio no treino' })
  @ApiCreatedResponse({ description: 'Exercicio adicionado com sucesso' })
  addExercise(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: AddWorkoutExerciseDto,
  ) {
    return this.workouts.addExercise(BigInt(req.user.sub), BigInt(id), dto);
  }

  @Patch(':id/exercises/:exerciseId')
  @ApiOperation({ summary: 'Atualizar exercicio do treino' })
  @ApiOkResponse({ description: 'Exercicio atualizado com sucesso' })
  updateExercise(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Param('exerciseId') exerciseId: string,
    @Body() dto: UpdateWorkoutExerciseDto,
  ) {
    return this.workouts.updateExercise(
      BigInt(req.user.sub),
      BigInt(id),
      BigInt(exerciseId),
      dto,
    );
  }

  @Delete(':id/exercises/:exerciseId')
  @ApiOperation({ summary: 'Excluir exercicio do treino' })
  @ApiOkResponse({ description: 'Exercicio removido com sucesso' })
  removeExercise(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Param('exerciseId') exerciseId: string,
  ) {
    return this.workouts.removeExercise(
      BigInt(req.user.sub),
      BigInt(id),
      BigInt(exerciseId),
    );
  }
}
