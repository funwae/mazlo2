'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface TraceStep {
  step_number: number;
  action_type: string;
  description: string;
}

interface TokenUsage {
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
}

interface TraceViewProps {
  steps: TraceStep[] | any[];
  tokenUsage?: TokenUsage | any;
  showFullTraceButton?: boolean;
}

export function TraceView({ steps, tokenUsage, showFullTraceButton = true }: TraceViewProps) {
  const [showFullTrace, setShowFullTrace] = useState(false);

  // Handle different data formats
  const normalizedSteps: TraceStep[] = Array.isArray(steps)
    ? steps.map((step: any) => ({
        step_number: step.step_number || step.stepNumber || 0,
        action_type: step.action_type || step.actionType || 'Unknown',
        description: step.description || step.content || '',
      }))
    : [];

  const normalizedTokenUsage: TokenUsage | undefined = tokenUsage
    ? {
        prompt_tokens: tokenUsage.prompt_tokens || tokenUsage.promptTokens,
        completion_tokens: tokenUsage.completion_tokens || tokenUsage.completionTokens,
        total_tokens: tokenUsage.total_tokens || tokenUsage.totalTokens,
      }
    : undefined;

  if (!normalizedSteps || normalizedSteps.length === 0) {
    return (
      <div className="p-4">
        <p className="text-body-small text-text-muted">No trace data available</p>
      </div>
    );
  }

  const renderTraceContent = () => (
    <div className="space-y-4">
      <div>
        <h4 className="text-h4 font-semibold text-text-primary mb-3">Reasoning Steps</h4>
        <div className="space-y-3">
          {normalizedSteps.map((step, index) => (
            <div key={step.step_number || index} className="p-3 rounded-sm bg-bg-surface-soft">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-label font-medium text-accent-primary">
                    {step.step_number || index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-label font-medium text-accent-primary">
                      {step.action_type}
                    </span>
                  </div>
                  <p className="text-body-small text-text-secondary">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {normalizedTokenUsage && (
        <div className="pt-4 border-t border-border-default">
          <h4 className="text-h4 font-semibold text-text-primary mb-3">Token Usage</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-label text-text-muted mb-1">Prompt</p>
              <p className="text-body font-medium text-text-primary">
                {normalizedTokenUsage.prompt_tokens?.toLocaleString() || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-label text-text-muted mb-1">Completion</p>
              <p className="text-body font-medium text-text-primary">
                {normalizedTokenUsage.completion_tokens?.toLocaleString() || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-label text-text-muted mb-1">Total</p>
              <p className="text-body font-medium text-text-primary">
                {normalizedTokenUsage.total_tokens?.toLocaleString() || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="p-4">
        {renderTraceContent()}
        {showFullTraceButton && normalizedSteps.length > 3 && (
          <div className="mt-4 pt-4 border-t border-border-default">
            <Button
              variant="secondary"
              onClick={() => setShowFullTrace(true)}
              className="w-full"
            >
              Open Full Trace
            </Button>
          </div>
        )}
      </div>

      {showFullTrace && (
        <Modal
          isOpen={showFullTrace}
          onClose={() => setShowFullTrace(false)}
          title="Full Trace"
          size="lg"
        >
          <div className="max-h-[70vh] overflow-y-auto">
            {renderTraceContent()}
          </div>
        </Modal>
      )}
    </>
  );
}

