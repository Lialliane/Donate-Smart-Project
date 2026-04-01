import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from "axios";
import { CaseCard } from '../Common/CaseCard';
import CourseDetailSkeleton from '../Skeleton/CaseDetail/CaseDetailSkeleton'


const dummycases = [
  {
    id: 1,
    title: 'Education for Underprivileged Children',
    description: 'Help provide books, supplies, and educational resources to children in rural communities who lack access to quality education.',
    category: 'Education',
    image: 'photo1.jpg',
    donations: 12500,
    goal: 20000,
    progress: 62.5,
  },
  {
    id: 2,
    title: 'Clean Water Access Initiative',
    description: 'Build wells and water filtration systems to provide clean drinking water to communities affected by water scarcity.',
    category: 'Health',
    image: 'photo2.jpg',
    donations: 8300,
    goal: 15000,
    progress: 55.3,
  },
  {
    id: 3,
    title: 'Medical Support for Families',
    description: 'Support families facing medical emergencies with treatment costs, medications, and essential healthcare services.',
    category: 'Medical',
    image: 'photo3.jpg',
    donations: 18700,
    goal: 25000,
    progress: 74.8,
  },
];

export function FeaturedCases() {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true)

  const goToCases = () => {
    navigate('/cases');
  }

  useEffect(() => 
  {
    const fetchCases = async () => {
      try {
        const res = await axios.get("/api/cases");
        if(res.data && res.data.length < 3)
          setCases(dummycases);
        else
          setCases(res.data.slice(0 , 3));
      } catch (err) {
        console.error("Error fetching cases:", err.response?.data || err.message);
      }
        finally {
          setLoading(false);
        }
    };

    fetchCases();
  }, []);

  return (
    <section className="container mx-auto px-4 py-10 sm:px-6 sm:py-20">
      <div className="text-center mb-8 sm:mb-16">
        <h2 className="text-3xl sm:text-5xl text-[var(--color-text-dark)] mb-4">Featured Cases</h2>
        <p className="text-[var(--color-text-light)] max-w-2xl mx-auto">
          Discover verified causes that need your support today
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 lg:gap-8 px-5 lg:px-10 md:px-0">
        {loading? (
              Array.from({ length: 3 }).map((_, i) => (
                <CourseDetailSkeleton key={i} />
              ))
            ): cases.map((caseItem) => (
          <CaseCard caseItem={caseItem} buttonText={"Donate Now"} />
        ))}
      </div>

      <div className="text-center mt-12">
        <button onClick={goToCases} className="h-fit px-6 py-3 rounded-2xl border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white duration-300 transition-all hover:cursor-pointer shadow-md hover:shadow-lg">
          View All Cases
        </button>
      </div>
    </section>
  );
}
