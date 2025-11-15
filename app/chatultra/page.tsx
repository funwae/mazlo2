import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-root">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-h0 font-semibold text-text-primary mb-6">
          Chat Ultra with Mazlo
        </h1>
        <p className="text-h3 text-text-secondary mb-8 max-w-2xl mx-auto">
          A project-centric AI workspace for heavy users who live in chat all day.
        </p>
        <Link href="/login">
          <Button variant="primary" className="text-lg px-8 py-3">
            Get Started
          </Button>
        </Link>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-h1 font-semibold text-text-primary text-center mb-12">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="p-6">
            <h3 className="text-h3 font-semibold text-text-primary mb-3">Rooms</h3>
            <p className="text-body text-text-secondary">
              Persistent project containers that combine chat history, tasks, and context.
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-h3 font-semibold text-text-primary mb-3">Mazlo</h3>
            <p className="text-body text-text-secondary">
              Transparent AI operator showing models, tools, and reasoning traces.
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-h3 font-semibold text-text-primary mb-3">Bridge Mode</h3>
            <p className="text-body text-text-secondary">
              Native bilingual collaboration with translation and tone control.
            </p>
          </Card>
        </div>
      </section>

      {/* Health Banner */}
      <section className="container mx-auto px-4 py-16">
        <Card className="p-8 bg-bg-surface-soft border border-accent-primary/20">
          <h3 className="text-h2 font-semibold text-text-primary mb-4">
            Built-in Health Guardrails
          </h3>
          <p className="text-body text-text-secondary">
            Time tracking, daily/weekly caps, reminders, and Room parking features help you
            maintain healthy boundaries with AI tools.
          </p>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-border-default">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-body-small text-text-muted">
            © 2024 Chat Ultra. Built for heavy users.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-body-small text-text-secondary hover:text-text-primary">
              Privacy
            </Link>
            <Link href="/terms" className="text-body-small text-text-secondary hover:text-text-primary">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

