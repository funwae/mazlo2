'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-bg-root flex items-center justify-center px-4">
          <div className="text-center">
            <h2 className="text-h1 font-semibold text-text-primary mb-4">
              Something went wrong!
            </h2>
            <button
              onClick={reset}
              className="px-4 py-2 bg-accent-primary text-text-invert rounded-full"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

