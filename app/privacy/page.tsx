export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg-root">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-h0 font-semibold text-text-primary mb-8">Privacy Policy</h1>

        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-h2 font-semibold text-text-primary mb-4">Data Collection</h2>
            <p className="text-body text-text-secondary">
              Chat Ultra collects and stores the following data:
            </p>
            <ul className="list-disc list-inside text-body text-text-secondary space-y-2 ml-4">
              <li>User account information (email, display name)</li>
              <li>Rooms, threads, and messages</li>
              <li>Usage sessions for health tracking</li>
              <li>Pins, tasks, and traces</li>
            </ul>
          </section>

          <section>
            <h2 className="text-h2 font-semibold text-text-primary mb-4">Data Usage</h2>
            <p className="text-body text-text-secondary">
              Your data is used solely to provide the Chat Ultra service. We do not share your data with third parties except as necessary to provide the service (e.g., OpenAI for AI responses).
            </p>
          </section>

          <section>
            <h2 className="text-h2 font-semibold text-text-primary mb-4">Your Rights</h2>
            <p className="text-body text-text-secondary">
              Under GDPR, you have the right to:
            </p>
            <ul className="list-disc list-inside text-body text-text-secondary space-y-2 ml-4">
              <li>Access your data</li>
              <li>Export your data</li>
              <li>Delete your account and data</li>
              <li>Request data portability</li>
            </ul>
          </section>

          <section>
            <h2 className="text-h2 font-semibold text-text-primary mb-4">Contact</h2>
            <p className="text-body text-text-secondary">
              For privacy-related inquiries, please contact us at privacy@chatultra.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

