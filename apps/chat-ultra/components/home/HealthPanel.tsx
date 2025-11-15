'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface HealthStats {
  total_minutes: number;
  daily_average: number;
  focus_streak_days: number;
  completed_tasks: number;
  chart_data: Array<{ date: string; minutes: number }>;
}

export function HealthPanel() {
  const [stats, setStats] = useState<HealthStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/health/stats?period=week');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching health stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <p className="text-body text-text-secondary">Loading health data...</p>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className="p-6">
        <p className="text-body text-text-secondary">No health data available</p>
      </Card>
    );
  }

  const healthStatus = stats.total_minutes < 120 ? 'good' : stats.total_minutes < 240 ? 'moderate' : 'high';

  // Simple bar chart component
  const maxMinutes = Math.max(...stats.chart_data.map((d) => d.minutes), 1);

  return (
    <Card className="p-6">
      <h3 className="text-h3 font-semibold text-text-primary mb-4">Health Overview</h3>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-body-small text-text-secondary">This Week</span>
            <Badge
              variant={healthStatus === 'good' ? 'active' : healthStatus === 'moderate' ? 'paused' : 'paused'}
            >
              {healthStatus === 'good' ? 'Good' : healthStatus === 'moderate' ? 'Moderate' : 'High'}
            </Badge>
          </div>
          <p className="text-h2 font-semibold text-text-primary">{stats.total_minutes} min</p>
          <p className="text-body-small text-text-muted">Daily average: {stats.daily_average} min</p>
        </div>

        {/* Weekly Chart */}
        {stats.chart_data.length > 0 && (
          <div className="pt-4 border-t border-border-default">
            <p className="text-label text-text-muted mb-3">Daily Usage</p>
            <div className="flex items-end gap-2 h-24">
              {stats.chart_data.map((day, index) => {
                const height = (day.minutes / maxMinutes) * 100;
                const date = new Date(day.date);
                const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex items-end justify-center" style={{ height: '80px' }}>
                      <div
                        className="w-full bg-accent-primary rounded-t-sm transition-all hover:bg-accent-primary/80"
                        style={{ height: `${height}%`, minHeight: day.minutes > 0 ? '4px' : '0' }}
                        title={`${day.minutes} min`}
                      />
                    </div>
                    <span className="text-body-tiny text-text-muted">{dayLabel}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-border-default">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-label text-text-muted mb-1">Focus Streak</p>
              <p className="text-body font-medium text-text-primary">
                {stats.focus_streak_days} {stats.focus_streak_days === 1 ? 'day' : 'days'}
              </p>
            </div>
            <div>
              <p className="text-label text-text-muted mb-1">Tasks Completed</p>
              <p className="text-body font-medium text-text-primary">{stats.completed_tasks}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

