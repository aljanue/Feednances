export const metadata = {
  title: "Cookie Policy | Feednances",
  description: "Cookie Policy for Feednances.",
};

export default function CookiePolicyPage() {
  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-20">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Cookie Policy</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. What Are Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Cookies are small pieces of text sent to your web browser by a website you visit. A cookie file is stored in your web browser and allows the Service or a third-party to recognize you and make your next visit easier and the Service more useful to you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. How Feednances Uses Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              When you use and access the Service, we may place a number of cookies files in your web browser. We use cookies primarily for authentication purposes. Specifically, we utilize NextAuth.js (Auth.js) session cookies to maintain your login state securely across different pages of the dashboard.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Essential Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              The vast majority of the cookies we use are "essential" or "strictly necessary" cookies. Without these cookies, services you have asked for, such as maintaining a logged-in session to view your private financial dashboard, cannot be provided. 
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Third-Party Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Currently, Feednances minimizes the use of third-party tracking cookies. However, some functional integrations (such as basic Vercel analytics, if enabled) may set their own anonymized cookies to help us understand how the service is being used so we can improve the platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. What Are Your Choices Regarding Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser. Please note, however, that if you delete essential authentication cookies or refuse to accept them, you might not be able to log in or use your private dashboard.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
