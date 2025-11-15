'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function PasswordCheckPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/password-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        // Set cookie and redirect
        router.refresh();
        router.push('/');
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-root flex items-center justify-center px-4">
      <Card className="p-8 max-w-md w-full">
        <h1 className="text-h1 font-semibold text-text-primary mb-4 text-center">
          Password Required
        </h1>
        <p className="text-body text-text-secondary mb-6 text-center">
          This site is password protected. Please enter the password to continue.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            label="Password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            autoFocus
          />
          {error && (
            <div className="p-3 rounded-sm bg-accent-danger/20 text-accent-danger text-body-small">
              {error}
            </div>
          )}
          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? 'Checking...' : 'Continue'}
          </Button>
        </form>
      </Card>
    </div>
  );
}

