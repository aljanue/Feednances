export const metadata = {
  title: "Terms of Service | Feednances",
  description: "Terms of Service and usage conditions for Feednances.",
};

export default function TermsOfServicePage() {
  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-20">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using Feednances, you accept and agree to be bound by the terms and provision of this agreement. Our service provides expense tracking, subscription management, and related financial notification services via integrated platforms like Telegram and iOS Shortcuts.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground leading-relaxed">
              Feednances provides users with tools to log expenses, track recurring subscriptions, and receive notifications regarding upcoming charges. We do not provide financial advice, and our service is fundamentally an organizational tool.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Accounts</h2>
            <p className="text-muted-foreground leading-relaxed">
              To use certain features of the Service (such as the Telegram Bot or iOS Shortcuts integration), you must register for an account. You are responsible for maintaining the confidentiality of your account information, including your password and Secret Key (userKey).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Third-Party Integrations</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our service interacts with third-party platforms, namely Telegram for notifications and Apple's iOS ecosystem for Shortcuts. Your use of these third-party platforms is subject to their respective terms of service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Disclaimer of Warranties</h2>
            <p className="text-muted-foreground leading-relaxed">
              The service is provided on an "as is" and "as available" basis. We make no warranties regarding the absolute accuracy of calculated financial metrics, the uninterrupted uptime of our notification bots, or the permanent storage of your expense records.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
