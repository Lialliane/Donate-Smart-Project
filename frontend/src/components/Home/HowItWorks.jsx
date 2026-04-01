import { Icon } from '@iconify/react';

const steps = [
  {
    icon: "lucide:user-plus",
    title: 'Create Account',
    description: 'Sign up in seconds with your email or social media account.',
    step: '01',
  },
  {
    icon: "lucide:search",
    title: 'Browse Cases',
    description: 'Explore verified causes and find one that resonates with you.',
    step: '02',
  },
  {
    icon: "lucide:heart",
    title: 'Donate',
    description: 'Make a secure donation and track the impact of your contribution.',
    step: '03',
  },
];

export function HowItWorks() {
  return (
    <section id='howitworks' className="container mx-auto px-4 py-10 sm:px-6 sm:py-20 ">
      <div className="text-center mb-8 sm:mb-20">
        <h2 className="text-3xl sm:text-5xl text-[var(--color-text-dark)] mb-4">How It Works</h2>
        <p className="text-[var(--color-text-light)] max-w-2xl mx-auto">
          Start making a difference in just three simple steps
        </p>
      </div>

      <div className="grid grid-cols-3 gap-12 max-w-5xl mx-auto">
        {steps.map((step, index) => {
          return (
            <div key={index} className="text-center lg:space-y-4 relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-20 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-[var(--color-primary)] to-transparent" />
              )}
              
              {/* Icon Circle */}
              <div className="relative mx-auto mb-2 md:mb-0 w-16 h-16 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-white shadow-[inset_1px_5px_12px_rgba(255,255,255,0.9),8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.9)] flex items-center justify-center">
                <div className="w-10 h-10 sm:w-[4.5rem] sm:h-[4.5rem] md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center shadow-lg">
                  <Icon icon={step.icon} className="w-7 h-7 sm:w-10 sm:h-10 text-white" />
                </div>
                {/* Step Number */}
                <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-[var(--color-text-dark)] text-white flex items-center justify-center text-sm shadow-lg">
                  {step.step}
                </div>
              </div>

              {/* Content */}
              <h3 className="mb-2 md:mb-0 text-base sm:text-lg md:text-2xl text-[var(--color-text-dark)] mt-6">{step.title}</h3>
              <p className=" text-sm sm:text-base text-[var(--color-text-light)]">{step.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
