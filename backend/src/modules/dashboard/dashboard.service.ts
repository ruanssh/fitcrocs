import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { DashboardPeriodDto } from './dto/dashboard-period.dto';
import { TopExercisesQueryDto } from './dto/top-exercises-query.dto';

type PeriodRange = {
  fromMonth: string;
  toMonth: string;
  startDateTime: Date;
  endDateTime: Date;
  startDate: string;
  endDate: string;
};

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(userId: bigint, query: DashboardPeriodDto) {
    const period = this.resolvePeriod(query);

    const [totalWorkouts, activeMonthsRaw, totalExercisesRaw] =
      await Promise.all([
        this.prisma.workout.count({
          where: {
            userId,
            workoutDate: {
              gte: period.startDateTime,
              lte: period.endDateTime,
            },
          },
        }),
        this.prisma.$queryRaw<
          Array<{ activeMonths: bigint | number }>
        >(Prisma.sql`
          SELECT COUNT(DISTINCT DATE_FORMAT(w.workout_date, '%Y-%m')) AS activeMonths
          FROM workouts w
          WHERE w.user_id = ${userId}
            AND w.workout_date >= ${period.startDate}
            AND w.workout_date <= ${period.endDate}
        `),
        this.prisma.$queryRaw<
          Array<{ totalExercises: bigint | number }>
        >(Prisma.sql`
          SELECT COUNT(*) AS totalExercises
          FROM workout_exercises we
          INNER JOIN workouts w ON w.id = we.workout_id
          WHERE w.user_id = ${userId}
            AND w.workout_date >= ${period.startDate}
            AND w.workout_date <= ${period.endDate}
        `),
      ]);

    const activeMonths = Number(activeMonthsRaw[0]?.activeMonths ?? 0);
    const totalExercisesLogged = Number(
      totalExercisesRaw[0]?.totalExercises ?? 0,
    );

    return {
      period: {
        from: period.fromMonth,
        to: period.toMonth,
      },
      totalWorkouts,
      activeMonths,
      totalExercisesLogged,
      avgWorkoutsPerActiveMonth:
        activeMonths > 0
          ? Number((totalWorkouts / activeMonths).toFixed(2))
          : 0,
    };
  }

  async getTopExercises(userId: bigint, query: TopExercisesQueryDto) {
    const period = this.resolvePeriod(query);
    const limit = query.limit ?? 10;

    const rows = await this.prisma.$queryRaw<
      Array<{ exerciseName: string; total: bigint | number }>
    >(Prisma.sql`
      SELECT
        we.exercise_name AS exerciseName,
        COUNT(*) AS total
      FROM workout_exercises we
      INNER JOIN workouts w ON w.id = we.workout_id
      WHERE w.user_id = ${userId}
        AND w.workout_date >= ${period.startDate}
        AND w.workout_date <= ${period.endDate}
      GROUP BY we.exercise_name
      ORDER BY total DESC, we.exercise_name ASC
      LIMIT ${limit}
    `);

    const totalAll = rows.reduce((acc, item) => acc + Number(item.total), 0);

    return {
      period: {
        from: period.fromMonth,
        to: period.toMonth,
      },
      limit,
      totalTrackedExercises: totalAll,
      items: rows.map((item) => {
        const count = Number(item.total);

        return {
          exerciseName: item.exerciseName,
          count,
          percentage:
            totalAll > 0 ? Number(((count / totalAll) * 100).toFixed(2)) : 0,
        };
      }),
    };
  }

  async getHeatmap(userId: bigint, query: DashboardPeriodDto) {
    const period = this.resolvePeriod(query);

    const rows = await this.prisma.$queryRaw<
      Array<{ workoutDate: string; total: bigint | number }>
    >(Prisma.sql`
      SELECT
        DATE_FORMAT(w.workout_date, '%Y-%m-%d') AS workoutDate,
        COUNT(*) AS total
      FROM workouts w
      WHERE w.user_id = ${userId}
        AND w.workout_date >= ${period.startDate}
        AND w.workout_date <= ${period.endDate}
      GROUP BY DATE_FORMAT(w.workout_date, '%Y-%m-%d')
      ORDER BY workoutDate ASC
    `);

    const countByDate = new Map(
      rows.map((row) => [row.workoutDate, Number(row.total)]),
    );
    const days = this.enumerateDays(period.startDate, period.endDate).map(
      (date) => {
        const count = countByDate.get(date) ?? 0;

        return {
          date,
          count,
          level: this.resolveLevel(count),
        };
      },
    );

    return {
      period: {
        from: period.fromMonth,
        to: period.toMonth,
        startDate: period.startDate,
        endDate: period.endDate,
      },
      timezone: 'UTC',
      legend: [
        { level: 0, min: 0, max: 0 },
        { level: 1, min: 1, max: 1 },
        { level: 2, min: 2, max: 2 },
        { level: 3, min: 3, max: 3 },
        { level: 4, min: 4, max: null },
      ],
      days,
    };
  }

  private resolvePeriod(query: DashboardPeriodDto): PeriodRange {
    const hasFrom = Boolean(query.from);
    const hasTo = Boolean(query.to);

    if (hasFrom !== hasTo) {
      throw new BadRequestException(
        'Informe from e to juntos ou nenhum dos dois',
      );
    }

    if (!query.from || !query.to) {
      const now = new Date();
      const currentYear = now.getUTCFullYear();

      return this.buildPeriod(currentYear, 1, currentYear, 12);
    }

    const from = this.parseYearMonth(query.from);
    const to = this.parseYearMonth(query.to);

    return this.buildPeriod(from.year, from.month, to.year, to.month);
  }

  private buildPeriod(
    fromYear: number,
    fromMonth: number,
    toYear: number,
    toMonth: number,
  ): PeriodRange {
    const startDateTime = new Date(
      Date.UTC(fromYear, fromMonth - 1, 1, 0, 0, 0),
    );
    const endDateTime = new Date(Date.UTC(toYear, toMonth, 0, 23, 59, 59));

    if (endDateTime.getTime() < startDateTime.getTime()) {
      throw new BadRequestException('to deve ser maior ou igual a from');
    }

    const totalMonths = (toYear - fromYear) * 12 + (toMonth - fromMonth) + 1;

    if (totalMonths > 24) {
      throw new BadRequestException('Periodo maximo permitido: 24 meses');
    }

    const startDate = `${fromYear.toString().padStart(4, '0')}-${fromMonth
      .toString()
      .padStart(2, '0')}-01`;
    const endDay = new Date(Date.UTC(toYear, toMonth, 0)).getUTCDate();
    const endDate = `${toYear.toString().padStart(4, '0')}-${toMonth
      .toString()
      .padStart(2, '0')}-${endDay.toString().padStart(2, '0')}`;

    return {
      fromMonth: `${fromYear.toString().padStart(4, '0')}-${fromMonth
        .toString()
        .padStart(2, '0')}`,
      toMonth: `${toYear.toString().padStart(4, '0')}-${toMonth
        .toString()
        .padStart(2, '0')}`,
      startDateTime,
      endDateTime,
      startDate,
      endDate,
    };
  }

  private parseYearMonth(value: string) {
    const [yearText, monthText] = value.split('-');
    const year = Number(yearText);
    const month = Number(monthText);

    return { year, month };
  }

  private enumerateDays(startDate: string, endDate: string) {
    const result: string[] = [];
    let cursor = new Date(`${startDate}T00:00:00.000Z`);
    const end = new Date(`${endDate}T00:00:00.000Z`);

    while (cursor.getTime() <= end.getTime()) {
      result.push(cursor.toISOString().slice(0, 10));
      cursor = new Date(cursor.getTime() + 86_400_000);
    }

    return result;
  }

  private resolveLevel(count: number) {
    if (count <= 0) return 0;
    if (count === 1) return 1;
    if (count === 2) return 2;
    if (count === 3) return 3;
    return 4;
  }
}
