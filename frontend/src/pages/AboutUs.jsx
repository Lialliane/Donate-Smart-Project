import { useEffect } from "react";

export default function AboutUs() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container">
      <section id="about">
        <div className="container">
          <div className="relative">
            <h2 className="text-3xl md:text-4xl lg:text-5xl mb-9 text-center font-bold tracking-tight">
              About Us
            </h2>

            <div className="flex flex-wrap gap-4 w-full m-auto justify-between">
              {/* Mission */}
              <div className="mx-0 my-4 flex-1 border rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
                <p className="text-gray-700 leading-relaxed">
                  Our mission is to connect donors with verified cases and ensure
                  help reaches those who need it—securely and transparently.
                </p>
              </div>

              {/* Vision */}
              <div className="mx-0 my-4 flex-1 border rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Our Vision</h3>
                <p className="text-gray-700 leading-relaxed">
                  A world where generosity is simple, secure, and visible—fueling
                  trust and impact across communities.
                </p>
              </div>
            </div>

            {/* Story */}
            <div className="mx-0 my-3 border rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Our Story</h3>
              <p className="text-gray-700 leading-relaxed">
                Started in 2025 by a passionate team, our project grew from a
                simple idea: make donations clearer, faster, and safer. We’re
                combining thoughtful design with a modern stack to serve people
                and amplify impact.
              </p>
            </div>

            {/* Team */}
            <div className="mx-0 my-6 border rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-6 text-center">
                Meet the Team
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { name: "Areen", role: "Team leader & Backend" , img: "/images/profile/profile_areen.png" },
                  { name: "Hassan", role: "Frontend & UI", img: "/images/profile/profile_hasan.jpg" },
                  { name: "Mohammad", role: "Presentation & Product", img: "/images/profile/profile_mohammed.jpg"},
                  { name: "Lujain", role: "Frontend & Backend & Testing", img: "/images/profile/profile_lujain.png" },
                ].map((member, idx) => (
                    <div key={idx}
                      className="text-center border rounded-2xl p-4 shadow-sm bg-white">
                    <img src={member.img} alt={member.name} className="w-20 h-20 rounded-full mx-auto mb-4" />
                    <h4 className="font-semibold">{member.name}</h4>
                    <p className="text-gray-600 text-sm">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="text-center my-9">
              <h3 className="text-xl font-semibold mb-8">
                Want to learn more or collaborate?
              </h3>
              <a
                href="/contact"
                className="border leading-none px-10 sm:px-12 text-base sm:text-lg font-medium py-3 sm:py-4 rounded-lg bg-[var(--color-primary)] border-[var(--color-primary)] text-white hover:bg-transparent hover:text-[var(--color-primary)] cursor-pointer"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
