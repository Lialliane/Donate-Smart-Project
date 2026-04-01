import { Icon } from '@iconify/react';

const features = [
  {
    icon: "lucide:sparkles",
    title: 'AI-Powered Insights',
    description: 'Smart summaries help you understand each case quickly and make informed donation decisions.',
  },
  {
    icon: "lucide:shield",
    title: 'Secure & Verified',
    description: 'Every case is thoroughly verified. Your donations are protected with bank-level security.',
  },
  {
    icon: "lucide:send",
    title: 'Easy Submission',
    description: 'Create and share your cause in minutes. Simple, fast, and completely transparent process.',
  },
];

export function WhyChooseUs() {
  return (
    <section className="container mx-auto px-4 py-10 sm:px-6 sm:py-20">
      <div className="text-center mb-8 sm:mb-16">
        <h2 className="text-3xl sm:text-5xl text-[var(--color-text-dark)] mb-4">Why Choose DonateSmart</h2>
        <p className="text-[var(--color-text-light)] max-w-2xl mx-auto">
          We combine technology with compassion to create the most trusted and efficient donation platform
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          return (
            <div
              key={index}
              className="bg-white rounded-3xl px-6 py-4 sm:p-8 shadow-[12px_12px_24px_rgba(0,0,0,0.1),-12px_-12px_24px_rgba(255,255,255,0.9)] hover:shadow-[16px_16px_32px_rgba(0,0,0,0.15),-16px_-16px_32px_rgba(255,255,255,0.9)] transition-all duration-300 hover:-translate-y-2"
            >
              <div className=" w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center mb-6 shadow-lg">
                <Icon icon={feature.icon} className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl mb-2 text-[var(--color-text-dark)] sm:text-2xl sm:mb-3">{feature.title}</h3>
              <p className="text-[var(--color-text-light)]">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}