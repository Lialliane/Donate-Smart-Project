import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Icon } from "@iconify/react";
// import { CaseCard } from "../components/Common/CaseCard";
// import CourseDetailSkeleton from "../components/Skeleton/CaseDetail/CaseDetailSkeleton";
import { useNavigate } from "react-router-dom";

const userData = {
  name: "Sarah Johnson",
  email: "sarah.johnson@email.com",
  joinDate: "January 15, 2025",
  totalDonated: 5420,
  casesSupported: 8,
};

export function ProfilePage() {
  const [myCases, setMyCases] = useState([]);
  const [joinDate, setJoinDate] = useState("'January 1, 2000'");
  const [, setLoading] = useState(true);
  const currentUser = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
    if (currentUser)
      setJoinDate(
        new Date(currentUser.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
    const fetchCases = async () => {
      try {
        const res = await axios.get("/api/cases/my-cases", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res && res.data) setMyCases(res.data);
      } catch (err) {
        console.error(
          "Error fetching cases:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen bg-[var(--color-bg-soft)]">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-3xl p-8 shadow-[12px_12px_24px_rgba(0,0,0,0.1),-12px_-12px_24px_rgba(255,255,255,0.9)] mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center text-white shadow-lg">
                <span className="text-2xl md:text-3xl">
                  {currentUser && currentUser.name.charAt(0)}
                </span>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h2 className="text-3xl md:text-4xl lg:text-5xl text-[var(--color-text-dark)] mb-2">
                  {currentUser && currentUser.name}
                </h2>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[var(--color-text-light)]">
                    <Icon icon="lucide:mail" className="w-4 h-4" />
                    <span>{currentUser && currentUser.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--color-text-light)]">
                    <Icon icon="lucide:calendar" className="w-4 h-4" />
                    <span>Joined {joinDate}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-row gap-3">
                <button
                  onClick={() => navigate("/edit-profile")}
                  className='flex flex-row items-center bg-transparent text-[var(--color-primary)] border hover:bg-[var(--color-primary)] border-[var(--color-primary)] hover:text-white duration-300 px-6 py-2 rounded-full hover:cursor-pointer shadow-md hover:shadow-lg'
                >
                  <Icon icon="lucide:edit" className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Stats
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-3xl p-6 shadow-[12px_12px_24px_rgba(0,0,0,0.1),-12px_-12px_24px_rgba(255,255,255,0.9)]">
              <div className="text-sm text-[var(--color-text-light)] mb-2">Total Donated</div>
              <div className="text-3xl text-[var(--color-primary)]">${userData.totalDonated.toLocaleString()}</div>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-[12px_12px_24px_rgba(0,0,0,0.1),-12px_-12px_24px_rgba(255,255,255,0.9)]">
              <div className="text-sm text-[var(--color-text-light)] mb-2">Cases Supported</div>
              <div className="text-3xl text-[var(--color-primary)]">{userData.casesSupported}</div>
            </div>
          </div> */}
          {/* 🔥 My Cases — يظهر فقط إذا كان المستخدم NOT admin */}
          {currentUser && currentUser.role !== "admin" && (
            <>
              <h3 className="text-lg font-semibold text-[var(--color-text-dark)] mb-6">
                My Cases
              </h3>

              {myCases.length === 0 ? (
                <div className="bg-white rounded-3xl p-6 shadow-[12px_12px_24px_rgba(0,0,0,0.1),-12px_-12px_24px_rgba(255,255,255,0.9)] text-center">
                  <p className="text-[var(--color-text-light)] text-lg">
                    You haven't added any cases yet.
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {myCases.map((c) => (
                    <div
                      key={c._id}
                      className="bg-white rounded-3xl p-6 shadow-[12px_12px_24px_rgba(0,0,0,0.1),-12px_-12px_24px_rgba(255,255,255,0.9)]"
                    >
                      <h4 className="text-xl font-semibold text-[var(--color-text-dark)] mb-2">
                        {c.title}
                      </h4>
                      <p className="text-[var(--color-text-light)] mb-1">
                        <strong>Category:</strong> {c.category}
                      </p>
                      <p className="text-[var(--color-text-light)] mb-4">
                        <strong>Status:</strong>{" "}
                        <span
                          className={`font-bold ${
                            c.status === "Approved"
                              ? "text-green-600"
                              : "text-orange-500"
                          }`}
                        >
                          {c.status}
                        </span>
                      </p>

                      <button
                        className='bg-[var(--color-primary)] text-white text-base font-medium hover:bg-transparent duration-300 hover:text-[var(--color-primary)] border border-[var(--color-primary)] px-4 py-2 rounded-xl hover:cursor-pointer shadow-md transition-all hover:shadow-lg'
                        onClick={() => navigate(`/case/${c._id}`)}
                      >
                        View Case
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Supported Cases
          {currentUser && 
          currentUser.role === "user" &&
            <div>
              <h3 className="text-[var(--color-text-dark)] mb-6">Previously Supported Cases</h3>
                <div className="grid md:grid-cols-3 gap-8">
                  {loading?
                  (
                    Array.from({ length: 3 }).map((_, i) => (
                      <CourseDetailSkeleton key={i} />))
                  ): myCases.length > 0 ? 
                    myCases.map((caseItem) => (
                      <CaseCard caseItem={caseItem} buttonText={"Donate Now"} /> )
                    ): 
                  (<div className="text-center py-20">
                      <p className="text-[var(--color-text-light)] text-lg">No cases.</p>
                  </div>)
                }
                </div>
            </div>
          } */}
        </div>
      </div>
    </div>
  );
}
