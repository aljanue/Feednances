export const metadata = {
  title: "Privacy Policy | Feednances",
  description: "Privacy Policy for Feednances.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-20">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed">
              We collect information you provide directly to us when you create an account, such as your name, email address, password, and chosen local currency/timezone. Additionally, when you utilize our core services, we store your expense logs, category preferences, and recurring subscription data securely in our database.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Integration Data</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you link your account to Telegram, we store your Telegram Chat ID (`telegramChatId`) solely for the purpose of sending you authorized bot notifications about your upcoming subscriptions. We utilize a secure Secret Key (`secretKey`) mechanism to authenticate requests coming from your personal iOS Shortcuts.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use the collected data strictly to operate, maintain, and provide the features of Feednances. Your financial expense data is private and is used EXCLUSIVELY to generate your personal dashboard reports and KPI calculations. We do NOT sell your financial data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement industry-standard security measures, including bcrypt password hashing and secure HTTPS protocols, to protect your personal information from unauthorized access or alteration. However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed">
              You have the right to access, update, or permanently delete your account and all associated financial data at any time from your Dashboard Settings. Upon deletion, your historical expense records and subscription data are irretrievably purged from our systems.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
