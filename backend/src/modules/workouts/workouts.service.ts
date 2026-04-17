import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AddWorkoutExerciseDto } from './dto/add-workout-exercise.dto';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { ListWorkoutsDto } from './dto/list-workouts.dto';
import { UpdateWorkoutExerciseDto } from './dto/update-workout-exercise.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';

@Injectable()
export class WorkoutsService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: bigint, dto: CreateWorkoutDto) {
    this.validateTimeRange(dto.startAt, dto.endAt);

    return this.prisma.workout.create({
      data: {
        userId,
        workoutDate: new Date(dto.workoutDate),
        startAt: dto.startAt ? new Date(dto.startAt) : null,
        endAt: dto.endAt ? new Date(dto.endAt) : null,
        notes: dto.notes,
      },
      include: { workoutExercises: { orderBy: { orderIndex: 'asc' } } },
    });
  }

  list(userId: bigint, query: ListWorkoutsDto) {
    const where: Prisma.WorkoutWhereInput = { userId };

    if (query.fromDate || query.toDate) {
      where.workoutDate = {};
      if (query.fromDate) where.workoutDate.gte = new Date(query.fromDate);
      if (query.toDate) where.workoutDate.lte = new Date(query.toDate);
    }

    return this.prisma.workout.findMany({
      where,
      orderBy: [{ workoutDate: 'desc' }, { createdAt: 'desc' }],
      include: { workoutExercises: { orderBy: { orderIndex: 'asc' } } },
    });
  }

  async findOne(userId: bigint, workoutId: bigint) {
    const workout = await this.prisma.workout.findFirst({
      where: { id: workoutId, userId },
      include: { workoutExercises: { orderBy: { orderIndex: 'asc' } } },
    });

    if (!workout) throw new NotFoundException('Treino nao encontrado');
    return workout;
  }

  async update(userId: bigint, workoutId: bigint, dto: UpdateWorkoutDto) {
    await this.ensureWorkoutOwner(userId, workoutId);

    this.validateTimeRange(dto.startAt, dto.endAt);

    return this.prisma.workout.update({
      where: { id: workoutId },
      data: {
        workoutDate: dto.workoutDate ? new Date(dto.workoutDate) : undefined,
        startAt: dto.startAt ? new Date(dto.startAt) : undefined,
        endAt: dto.endAt ? new Date(dto.endAt) : undefined,
        notes: dto.notes,
      },
      include: { workoutExercises: { orderBy: { orderIndex: 'asc' } } },
    });
  }

  async remove(userId: bigint, workoutId: bigint) {
    await this.ensureWorkoutOwner(userId, workoutId);
    await this.prisma.workout.delete({ where: { id: workoutId } });

    return { success: true };
  }

  async addExercise(
    userId: bigint,
    workoutId: bigint,
    dto: AddWorkoutExerciseDto,
  ) {
    await this.ensureWorkoutOwner(userId, workoutId);

    const orderIndex =
      dto.orderIndex ??
      (await this.prisma.workoutExercise.count({ where: { workoutId } })) + 1;

    return this.prisma.workoutExercise.create({
      data: {
        workoutId,
        exerciseName: dto.exerciseName,
        bodyPartMock: dto.bodyPartMock,
        orderIndex,
        notes: dto.notes,
      },
    });
  }

  async updateExercise(
    userId: bigint,
    workoutId: bigint,
    exerciseId: bigint,
    dto: UpdateWorkoutExerciseDto,
  ) {
    await this.ensureWorkoutOwner(userId, workoutId);

    const exercise = await this.prisma.workoutExercise.findFirst({
      where: { id: exerciseId, workoutId },
    });

    if (!exercise) throw new NotFoundException('Exercicio nao encontrado');

    return this.prisma.workoutExercise.update({
      where: { id: exerciseId },
      data: {
        exerciseName: dto.exerciseName,
        bodyPartMock: dto.bodyPartMock,
        orderIndex: dto.orderIndex,
        notes: dto.notes,
      },
    });
  }

  async removeExercise(userId: bigint, workoutId: bigint, exerciseId: bigint) {
    await this.ensureWorkoutOwner(userId, workoutId);

    const exercise = await this.prisma.workoutExercise.findFirst({
      where: { id: exerciseId, workoutId },
    });

    if (!exercise) throw new NotFoundException('Exercicio nao encontrado');

    await this.prisma.workoutExercise.delete({ where: { id: exerciseId } });

    return { success: true };
  }

  private validateTimeRange(startAt?: string, endAt?: string) {
    if (!startAt || !endAt) return;

    if (new Date(endAt).getTime() < new Date(startAt).getTime()) {
      throw new BadRequestException('endAt deve ser maior ou igual a startAt');
    }
  }

  private async ensureWorkoutOwner(userId: bigint, workoutId: bigint) {
    const workout = await this.prisma.workout.findFirst({
      where: { id: workoutId, userId },
      select: { id: true },
    });

    if (!workout) throw new NotFoundException('Treino nao encontrado');
  }
}
