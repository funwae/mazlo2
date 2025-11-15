export default function TermsPage() {
  return (
    <div className="min-h-screen bg-bg-root">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-h0 font-semibold text-text-primary mb-8">Terms of Service</h1>

        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-h2 font-semibold text-text-primary mb-4">Acceptance of Terms</h2>
            <p className="text-body text-text-secondary">
              By using Chat Ultra, you agree to these Terms of Service. If you do not agree, please do not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-h2 font-semibold text-text-primary mb-4">Service Description</h2>
            <p className="text-body text-text-secondary">
              Chat Ultra is a project-centric AI workspace that provides AI-powered chat functionality, room management, and health tracking features.
            </p>
          </section>

          <section>
            <h2 className="text-h2 font-semibold text-text-primary mb-4">User Responsibilities</h2>
            <p className="text-body text-text-secondary">
              You are responsible for:
            </p>
            <ul className="list-disc list-inside text-body text-text-secondary space-y-2 ml-4">
              <li>Maintaining the security of your account</li>
              <li>Using the service in compliance with applicable laws</li>
              <li>Not using the service for illegal or harmful purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-h2 font-semibold text-text-primary mb-4">Limitation of Liability</h2>
            <p className="text-body text-text-secondary">
              Chat Ultra is provided "as is" without warranties. We are not liable for any damages arising from use of the service.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

