import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { usageSessions } from '@/db/schema';
import { eq, and, gte, sql } from 'drizzle-orm';
import { tasks } from '@/db/schema';

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const period = url.searchParams.get('period') || 'week';

    let startDate: Date;
    const now = new Date();

    switch (period) {
      case 'day':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      default:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
    }

    // Get total minutes
    const sessions = await db
      .select()
      .from(usageSessions)
      .where(
        and(
          eq(usageSessions.userId, session.user.id),
          gte(usageSessions.startedAt, startDate),
          sql`${usageSessions.endedAt} IS NOT NULL`
        )
      );

    const totalSeconds = sessions.reduce((sum, s) => sum + (s.totalSeconds || 0), 0);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const dailyAverage = period === 'week' ? Math.floor(totalMinutes / 7) : totalMinutes;

    // Calculate focus streak (consecutive days with sessions)
    const sessionDates = new Set(
      sessions.map((s) => s.startedAt.toISOString().split('T')[0])
    );
    let streakDays = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      if (sessionDates.has(dateStr)) {
        streakDays++;
      } else if (i > 0) {
        // Break streak if gap found (but allow today to be missing)
        break;
      }
    }

    // Get completed tasks count
    const { tasks } = await import('@/db/schema');
    const completedTasks = await db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.userId, session.user.id),
          eq(tasks.status, 'done'),
          gte(tasks.updatedAt, startDate)
        )
      );

    // Generate chart data grouped by date
    const chartDataMap = new Map<string, number>();
    sessions.forEach((s) => {
      const date = s.startedAt.toISOString().split('T')[0];
      const minutes = Math.floor((s.totalSeconds || 0) / 60);
      chartDataMap.set(date, (chartDataMap.get(date) || 0) + minutes);
    });

    // Fill in missing dates with 0
    const chartData: Array<{ date: string; minutes: number }> = [];
    for (let i = 0; i < (period === 'week' ? 7 : period === 'month' ? 30 : 1); i++) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      chartData.unshift({
        date: dateStr,
        minutes: chartDataMap.get(dateStr) || 0,
      });
    }

    return NextResponse.json({
      total_minutes: totalMinutes,
      daily_average: dailyAverage,
      focus_streak_days: streakDays,
      completed_tasks: completedTasks.length,
      chart_data: chartData,
    });
  } catch (error: any) {
    console.error('Error fetching health stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

