import { Icon } from '@iconify/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/Common/select';
import { CaseCard } from '../components/Common/CaseCard';
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import CourseDetailSkeleton from '../components/Skeleton/CaseDetail/CaseDetailSkeleton'

const allCasesDummy = [
  {
    _id: 1,
    title: 'Education for Underprivileged Children',
    description: 'Help provide books, supplies, and educational resources to children in rural communities.',
    category: 'Education',
    image: 'photo1.jpg',
    raised: 12500,
    goal: 20000,
    progress: 62.5,
  },
  {
    _id: 2,
    title: 'Clean Water Access Initiative',
    description: 'Build wells and water filtration systems to provide clean drinking water.',
    category: 'Health',
    image: 'photo2.jpg',
    raised: 8300,
    goal: 15000,
    progress: 55.3,
  },
  {
    _id: 3,
    title: 'Medical Support for Families',
    description: 'Support families facing medical emergencies with treatment costs and medications.',
    category: 'Medical',
    image: 'photo3.jpg',
    raised: 18700,
    goal: 25000,
    progress: 74.8,
  },
  {
    _id: 4,
    title: 'Community Food Program',
    description: 'Provide nutritious meals to families struggling with food insecurity.',
    category: 'Food',
    image: 'photo4.jpg',
    raised: 5200,
    goal: 10000,
    progress: 52,
  },
  {
    _id: 5,
    title: 'Disaster Relief Fund',
    description: 'Emergency assistance for communities affected by natural disasters.',
    category: 'Emergency',
    image: 'photo5.jpg',
    raised: 28500,
    goal: 50000,
    progress: 57,
  },
  {
    _id: 6,
    title: 'Senior Care Support',
    description: 'Helping elderly individuals with healthcare, daily needs, and companionship.',
    category: 'Health',
    image: 'photo6.jpg',
    raised: 15800,
    goal: 30000,
    progress: 52.7,
  },
];

export function AllCases() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(6);
  const currentUser = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await axios.get("/api/cases");
        let activeCases = res.data;
        //console.log(res.data);
        if(currentUser && currentUser.role !== "admin")
          activeCases = res.data.filter(c => c.donations < c.goal);
        setCases(activeCases || allCasesDummy);
      } catch (err) {
        console.error("Error fetching cases:", err.response, err.response?.data || err.message);
      }
      finally {
        setLoading(false)
      }
    };

    fetchCases();
  }, []);

  useEffect(() => {
    if (cases) {
      setFilteredCases(
        cases.filter((caseItem) => {
          const matchesSearch =
            caseItem.title?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
            caseItem.description?.toLowerCase().includes(searchTerm?.toLowerCase());

          const matchesCategory =
            selectedCategory === 'all' || caseItem.category === selectedCategory;

          return matchesSearch && matchesCategory;
        })
      );

      setVisibleCount(6);
    }
  }, [cases, searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-[var(--color-bg-soft)]">
      <div className="container mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[var(--color-text-dark)] mb-4">Browse Cases</h1>
          <p className="text-[var(--color-text-light)] max-w-2xl mx-auto">
            Discover verified causes and make a meaningful impact with your donation
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-3xl p-6 shadow-[12px_12px_24px_rgba(0,0,0,0.1),-12px_-12px_24px_rgba(255,255,255,0.9)] mb-12 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Icon icon="lucide:search" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-light)]" />
              <input
                type="text"
                placeholder="Search cases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="file:text-black placeholder:text-gray-400 selection:bg-[var(--color-primary)] selection:text-white dark:bg-[--color-bg-soft] border-input flex h-9 w-full min-w-0 px-3 py-1 text-base bg-input-background outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-12 rounded-2xl border-2 border-gray-200 focus:border-[var(--color-primary)] transition-colors"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="rounded-2xl border-2 border-gray-200 focus:border-[var(--color-primary)]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Health">Health</SelectItem>
                <SelectItem value="Medical">Medical</SelectItem>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Cases Grid */}
        <div className="px-10 sm:px-0 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <CourseDetailSkeleton key={i} />
            ))) : filteredCases.length > 0 ?
            (filteredCases
              .slice(0, visibleCount)
              .map((caseItem) => (
                <CaseCard
                  key={caseItem._id}
                  caseItem={caseItem}
                  buttonText={"View Details"}
                />
              )))
            :
            (<div className="text-center py-20">
              <p className="text-[var(--color-text-light)] text-lg text-center">No cases found matching your search criteria.</p>
            </div>)
          }
        </div>
        {!loading && filteredCases.length > visibleCount && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="px-8 py-3 rounded-full bg-[var(--color-primary)] text-white hover:opacity-90 transition"
            >
              Load More
            </button>
          </div>
        )}

        {/* No Results
        {filteredCases.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[var(--color-text-light)] text-lg">No cases found matching your search criteria.</p>
          </div>
        )} */}
      </div>
    </div>
  );
}
