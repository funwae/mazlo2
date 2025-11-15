'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/Badge';
import { TraceView } from '@/components/mazlo/TraceView';
import { Skeleton } from '@/components/ui/Skeleton';

interface MazloPanelProps {
  roomSummary?: string;
  activePins?: Array<{ id: string; title: string; tag: string }>;
  selectedMessageId?: string;
}

export function MazloPanel({ roomSummary, activePins, selectedMessageId }: MazloPanelProps) {
  const [activeTab, setActiveTab] = useState<'trace' | 'tools' | 'context'>('context');
  const [traceData, setTraceData] = useState<any>(null);
  const [loadingTrace, setLoadingTrace] = useState(false);

  useEffect(() => {
    if (selectedMessageId) {
      setActiveTab('trace');
      fetchTrace();
    }
  }, [selectedMessageId]);

  const fetchTrace = async () => {
    if (!selectedMessageId) return;
    setLoadingTrace(true);
    try {
      const res = await fetch(`/api/messages/${selectedMessageId}/trace`);
      if (res.ok) {
        const data = await res.json();
        setTraceData(data);
      }
    } catch (error) {
      console.error('Error fetching trace:', error);
    } finally {
      setLoadingTrace(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-border-default">
        {(['trace', 'tools', 'context'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              flex-1 px-4 py-2 text-label font-medium transition-colors
              ${activeTab === tab
                ? 'text-accent-primary border-b-2 border-accent-primary'
                : 'text-text-secondary hover:text-text-primary'
              }
            `}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'trace' && (
          <div>
            {loadingTrace ? (
              <div className="space-y-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : traceData ? (
              <TraceView
                steps={traceData.steps || traceData.stepsJson || []}
                tokenUsage={traceData.tokenUsage || traceData.tokenUsageJson}
                showFullTraceButton={true}
              />
            ) : (
              <p className="text-body-small text-text-muted">
                {selectedMessageId
                  ? 'No trace data available for this message'
                  : 'Select a message to view its trace'}
              </p>
            )}
          </div>
        )}

        {activeTab === 'tools' && (
          <div>
            <h4 className="text-h4 font-semibold text-text-primary mb-3">Available Tools</h4>
            <div className="space-y-2">
              <div className="p-3 rounded-sm bg-bg-surface-soft">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-body-small font-medium text-text-primary">OpenAI</span>
                  <Badge variant="active">Available</Badge>
                </div>
                <p className="text-label text-text-muted">GPT-4, GPT-3.5</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'context' && (
          <div className="space-y-4">
            {roomSummary && (
              <div>
                <h4 className="text-h4 font-semibold text-text-primary mb-2">Room Summary</h4>
                <p className="text-body-small text-text-secondary">{roomSummary}</p>
              </div>
            )}

            {activePins && activePins.length > 0 && (
              <div>
                <h4 className="text-h4 font-semibold text-text-primary mb-2">Active Pins</h4>
                <div className="space-y-2">
                  {activePins.map((pin) => (
                    <div key={pin.id} className="p-2 rounded-sm bg-bg-surface-soft">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="language">{pin.tag}</Badge>
                        <span className="text-body-small text-text-primary">{pin.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

