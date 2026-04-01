import { Icon } from '@iconify/react';
import { ImageWithFallback } from '../../Common/ImageWithFallback';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const goToCases = () => {
    navigate('/cases');
  }

  return (
    <section id='Home' className="px-4 sm:px-6 container mx-auto  py-10  sm:py-20">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[var(--color-text-dark)]">
            Make a Difference,
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[#6BC428]">
              One Donation at a Time
            </span>
          </h1>
          <p className="text-[var(--color-text-light)] text-base sm:text-lg max-w-lg">
            Join thousands of compassionate donors supporting verified causes worldwide. 
            Every contribution creates meaningful change in someone's life.
          </p>
          <div className="flex gap-4 pt-4">
            <button onClick={goToCases}
              className="h-fit px-3 py-2 text-base sm:px-4 sm:py-3 sm:text-lg bg-[var(--color-primary)] text-white rounded-2xl shadow-md border border-[var(--color-primary)] hover:bg-transparent hover:shadow-lg duration-300 hover:text-[var(--color-primary)] transition-all hover:cursor-pointer">
              Explore Cases
              <Icon className="inline ml-2 w-4 h-4" icon="tabler:arrow-right" />
            </button>
            <a href='#howitworks'>
              <button
              className="h-fit px-3 py-2 text-base sm:px-4 sm:py-3 sm:text-lg rounded-2xl border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white duration-300 transition-all hover:cursor-pointer shadow-md hover:shadow-lg">
              How It Works
            </button>
            </a>
          </div>
          
          {/* Stats */}
          <div className="flex gap-8 pt-4 sm:pt-8">
            <div className="bg-white rounded-2xl px-6 py-4 shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.9)]">
              <div className="text-[var(--color-primary)]">$2.4M+</div>
              <div className="text-sm text-[var(--color-text-light)]">Donated</div>
            </div>
            <div className="bg-white rounded-2xl px-6 py-4 shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.9)]">
              <div className="text-[var(--color-primary)]">15K+</div>
              <div className="text-sm text-[var(--color-text-light)]">Donors</div>
            </div>
            <div className="bg-white rounded-2xl px-6 py-4 shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.9)]">
              <div className="text-[var(--color-primary)]">500+</div>
              <div className="text-sm text-[var(--color-text-light)]">Cases</div>
            </div>

          </div>
        </div>

        {/* Right Image */}
        <div className="hidden sm:block relative">
          <div className="bg-gradient-to-br from-[#7FDB34]/20 to-[#6BC428]/20 rounded-[2rem] p-8 shadow-[12px_12px_24px_rgba(0,0,0,0.1),-12px_-12px_24px_rgba(255,255,255,0.9)]">
            <ImageWithFallback
              src="/images/banner/main__hero_img.jpg"
              alt="Charity donation helping hands"
              className="w-full h-auto rounded-2xl object-cover"
            />
          </div>
          {/* Floating Badge */}
          <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl px-6 py-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[#6BC428] flex items-center justify-center">
                <span className="text-white">✓</span>
              </div>
              <div>
                <div className="text-sm text-[var(--color-text-dark)]">100% Verified</div>
                <div className="text-xs text-[var(--color-text-light)]">Trusted Platform</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero
