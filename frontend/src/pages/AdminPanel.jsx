import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function AdminPanel() {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser);
  const token = localStorage.getItem("token");

  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);

  const [pendingCases, setPendingCases] = useState([]);
  const [approvedCases, setApprovedCases] = useState([]);
  const [rejectedCases, setRejectedCases] = useState([]);
  const [donations, setDonations] = useState([]);

  // حماية الأدمن
  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") navigate("/");
  }, [currentUser, navigate]);

  // جلب الإحصائيات (Dashboard)
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get("/api/admin/analytics", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnalytics(res.data || null);
      } catch (err) {
        console.log("Analytics error:", err);
      }
    };
    if (currentUser?.role === "admin") fetchAnalytics();
  }, [currentUser, token]);

  // جلب المستخدمين
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data || []);
      } catch (err) {
        console.log("Users error:", err);
      }
    };

    if (currentUser?.role === "admin") fetchUsers();
  }, [currentUser, token]);

  // جلب الحالات (pending فقط) – approved / rejected من الواجهة
  useEffect(() => {
    const fetchPendingCases = async () => {
      try {
        const res = await axios.get("/api/admin/pending-cases", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPendingCases(res.data || []);
      } catch (err) {
        console.error("Pending cases error:", err);
      }
    };

    if (currentUser?.role === "admin") fetchPendingCases();
  }, [currentUser, token]);

  // (اختياري) جلب التبرعات لاحقاً endpoint
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await axios.get("/api/admin/donations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDonations(res.data || []);
      } catch (err) {
        // console.error("Donations error:", err);
      }
    };

    if (currentUser?.role === "admin") fetchDonations();
  }, [currentUser, token]);

  // تحديث حالة Case (Approve / Reject)
  const updateStatus = async (id, newStatus) => {
    try {
      const endpoint =
        newStatus === "approved"
          ? `/api/admin/approve-case/${id}`
          : `/api/admin/reject-case/${id}`;

      await axios.put(
        endpoint,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const caseItem = pendingCases.find((c) => c._id === id);
      setPendingCases((prev) => prev.filter((c) => c._id !== id));

      if (caseItem) {
        const updatedCase = { ...caseItem, status: newStatus };
        if (newStatus === "approved") {
          setApprovedCases((prev) => [updatedCase, ...prev]);
          toast.success("Case approved");
        } else {
          setRejectedCases((prev) => [updatedCase, ...prev]);
          toast("Case rejected", { icon: "⚠️" });
        }
      }
    } catch (err) {
      console.error("Status update error:", err);
      toast.error("Failed to update case status");
    }
  };

  // حذف الحالة
  const deleteCase = async (id) => {
    try {
      await axios.delete(`/api/admin/delete-case/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPendingCases((prev) => prev.filter((c) => c._id !== id));
      setApprovedCases((prev) => prev.filter((c) => c._id !== id));
      setRejectedCases((prev) => prev.filter((c) => c._id !== id));

      toast.success("Case deleted");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete case");
    }
  };

  // تعطيل / تفعيل مستخدم
  const toggleUserStatus = async (id, currentUser) => {
    try {
      // toggle user
      await axios.patch(
        `/api/admin/users/${id}/disable`,
        { disabled: !currentUser },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUsers((prev) =>
        prev.map((u) =>
          u._id === id ? { ...u, isDisabled: !u.isDisabled } : u
        )
      );
      toast.success("User status updated");
    } catch (err) {
      console.error("Toggle user error:", err);
      toast.error("Failed to update user");
    }
  };

  // حذف مستخدم
  const deleteUser = async (id) => {
    try {
      // delete user
      await axios.delete(`/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success("User deleted");
    } catch (err) {
      console.error("Delete user error:", err);
      toast.error("Failed to delete user");
    }
  };

  const stats = {
    totalUsers: analytics?.totalUsers ?? users.length,
    totalCases:
      analytics?.totalCases ??
      pendingCases.length + approvedCases.length + rejectedCases.length,
    totalPending: analytics?.totalPendingCases ?? pendingCases.length,
  };
  // Donation Progress
  const totalDonated = analytics?.totalDonated ?? 0;

  const donationTarget =
    analytics?.donationTarget && analytics.donationTarget > 0
      ? analytics.donationTarget
      : 1;

  const donationPercentage = Math.min(
    Math.round((totalDonated / donationTarget) * 100),
    100
  );



  const getStatusBadgeStyle = (status) => {
    if (status === "pending") return styles.statusPending;
    if (status === "approved") return styles.statusApproved;
    if (status === "rejected") return styles.statusRejected;
    return styles.statusDefault;
  };

  const getUserStatusStyle = (isDisabled) => {
    return isDisabled ? styles.userDisabled : styles.userActive;
  };

  return (
    <div style={styles.page}>
      <style>{mediaQueries}</style>

      {/* Mobile Menu Button */}
      <button
        style={styles.mobileMenuBtn}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="mobile-menu-btn"
      >
        <span style={styles.menuIcon}>{sidebarOpen ? '✕' : '☰'}</span>
      </button>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          style={styles.overlay}
          onClick={() => setSidebarOpen(false)}
          className="mobile-overlay"
        />
      )}

      <div style={styles.layout} className="admin-layout">
        {/* Sidebar */}
        <aside style={{
          ...styles.sidebar,
          ...(sidebarOpen ? styles.sidebarOpen : {})
        }} className="admin-sidebar">
          <div style={styles.sidebarHeader}>
            <div style={styles.logoCircle}>DS</div>
            <div>
              <div style={styles.logoText}>DonateSmart</div>
              <div style={styles.logoSub}>Admin Console</div>
            </div>
          </div>

          <div style={styles.sidebarSectionTitle}>Overview</div>
          <button
            style={activeTab === "dashboard" ? styles.activeTab : styles.tab}
            onClick={() => {
              setActiveTab("dashboard");
              setSidebarOpen(false);
            }}
          >
            Dashboard
          </button>

          <div style={styles.sidebarSectionTitle}>Cases</div>
          <button
            style={activeTab === "pending" ? styles.activeTab : styles.tab}
            onClick={() => {
              setActiveTab("pending");
              setSidebarOpen(false);
            }}
          >
            Pending Cases
            {pendingCases.length > 0 && (
              <span style={styles.badge}>{pendingCases.length}</span>
            )}
          </button>
          <button
            style={activeTab === "approved" ? styles.activeTab : styles.tab}
            onClick={() => {
              setActiveTab("approved");
              setSidebarOpen(false);
            }}
          >
            Approved Cases
            {approvedCases.length > 0 && (
              <span style={styles.badgeMuted}>{approvedCases.length}</span>
            )}
          </button>
          <button
            style={activeTab === "rejected" ? styles.activeTab : styles.tab}
            onClick={() => {
              setActiveTab("rejected");
              setSidebarOpen(false);
            }}
          >
            Rejected Cases
            {rejectedCases.length > 0 && (
              <span style={styles.badgeMuted}>{rejectedCases.length}</span>
            )}
          </button>

          <div style={styles.sidebarSectionTitle}>Management</div>
          <button
            style={activeTab === "users" ? styles.activeTab : styles.tab}
            onClick={() => {
              setActiveTab("users");
              setSidebarOpen(false);
            }}
          >
            Users
          </button>
          <button
            style={activeTab === "donations" ? styles.activeTab : styles.tab}
            onClick={() => {
              setActiveTab("donations");
              setSidebarOpen(false);
            }}
          >
            Donations
          </button>
        </aside>

        {/* Main Content */}
        <main style={styles.main} className="admin-main">
          {/* Header */}
          <div style={styles.mainHeader} className="main-header">
            <div>
              <h1 style={styles.title}>
                {activeTab === "dashboard" && "Dashboard Overview"}
                {activeTab === "pending" && "Pending Cases"}
                {activeTab === "approved" && "Approved Cases"}
                {activeTab === "rejected" && "Rejected Cases"}
                {activeTab === "users" && "User Management"}
                {activeTab === "donations" && "Donations Activity"}
              </h1>
              <p style={styles.subtitle}>
                Manage donation cases, users, and platform activity from one
                place.
              </p>
            </div>
            {currentUser && (
              <div style={styles.adminChip}>
                <span style={styles.adminAvatar}>
                  {currentUser.name?.[0]?.toUpperCase() || "A"}
                </span>
                <div>
                  <div style={styles.adminName}>{currentUser.name}</div>
                  <div style={styles.adminRole}>Administrator</div>
                </div>
              </div>
            )}
          </div>

          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <>
              <div style={styles.sectionCard}>
                <div style={styles.sectionHeader}>
                  <h2 style={styles.sectionTitle}>Key Metrics</h2>
                  <span style={styles.sectionHint}>
                    Overview of platform activity
                  </span>
                </div>
                <div style={styles.cardsRow} className="cards-row">
                  <div style={styles.cardAccent}>
                    <div style={styles.cardLabel}>Total Donations all time </div>

                    <div style={styles.cardNumber}>
                      ${totalDonated.toLocaleString()}
                    </div>

                    <div style={styles.progressBar}>
                      <div
                        style={{
                          ...styles.progressFill,
                          width: `${donationPercentage}%`,
                        }}
                      />
                    </div>
                    
                  </div>

                  <div style={styles.card}>
                    <div style={styles.cardLabel}>Total Users</div>
                    <div style={styles.cardNumber}>{stats.totalUsers}</div>
                    <div style={styles.cardFooter}>
                      Registered on DonateSmart
                    </div>
                  </div>
                  <div style={styles.card}>
                    <div style={styles.cardLabel}>Total Cases</div>
                    <div style={styles.cardNumber}>{stats.totalCases}</div>
                    <div style={styles.cardFooter}>Across all statuses</div>
                  </div>
                  <div style={styles.cardAccent}>
                    <div style={styles.cardLabel}>Pending Cases</div>
                    <div style={styles.cardNumber}>{stats.totalPending}</div>
                    <div style={styles.cardFooter}>
                      Require your review and decision
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ ...styles.sectionCard, marginTop: 20 }}>
                <div style={styles.sectionHeader}>
                  <h2 style={styles.sectionTitle}>Recent Pending Cases</h2>
                  <span style={styles.sectionHint}>
                    Latest cases submitted by users
                  </span>
                </div>
                {pendingCases.length === 0 ? (
                  <p style={styles.emptyText}>
                    No pending cases at the moment.
                  </p>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.th}>Title</th>
                          <th style={styles.th}>Category</th>
                          <th style={styles.th}>Created By</th>
                          <th style={styles.th}>Status</th>
                          <th style={styles.th}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingCases.slice(0, 3).map((c) => (
                          <tr key={c._id} style={styles.tr}>
                            <td style={styles.td}>{c.title}</td>
                            <td style={styles.td}>{c.category}</td>
                            <td style={styles.td}>
                              {c.createdBy?.name} ({c.createdBy?.email})
                            </td>
                            <td style={styles.td}>
                              <span
                                style={{
                                  ...styles.statusBadge,
                                  ...getStatusBadgeStyle(c.status),
                                }}
                              >
                                {c.status}
                              </span>
                            </td>
                            <td style={styles.td}>
                              <div style={styles.actionBtns} className="action-btns">
                                <button
                                  style={styles.approve}
                                  onClick={() => updateStatus(c._id, "approved")}
                                >
                                  Approve
                                </button>
                                <button
                                  style={styles.reject}
                                  onClick={() => updateStatus(c._id, "rejected")}
                                >
                                  Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* PENDING CASES */}
          {activeTab === "pending" && (
            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>Pending Cases</h2>
                <span style={styles.sectionHint}>
                  Review cases before they appear to donors.
                </span>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Title</th>
                      <th style={styles.th}>Category</th>
                      <th style={styles.th}>Created By</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingCases.map((c) => (
                      <tr key={c._id} style={styles.tr}>
                        <td style={styles.td}>{c.title}</td>
                        <td style={styles.td}>{c.category}</td>
                        <td style={styles.td}>
                          {c.createdBy?.name} ({c.createdBy?.email})
                        </td>
                        <td style={styles.td}>
                          <span
                            style={{
                              ...styles.statusBadge,
                              ...getStatusBadgeStyle(c.status),
                            }}
                          >
                            {c.status}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.actionBtns} className="action-btns">
                            <button
                              style={styles.approve}
                              onClick={() => updateStatus(c._id, "approved")}
                            >
                              Approve
                            </button>
                            <button
                              style={styles.reject}
                              onClick={() => updateStatus(c._id, "rejected")}
                            >
                              Reject
                            </button>
                            <button
                              style={styles.delete}
                              onClick={() => deleteCase(c._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {pendingCases.length === 0 && (
                      <tr>
                        <td style={styles.td} colSpan={5}>
                          <span style={styles.emptyText}>No pending cases.</span>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* APPROVED CASES */}
          {activeTab === "approved" && (
            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>Approved Cases</h2>
                <span style={styles.sectionHint}>
                  These cases are visible to donors.
                </span>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Title</th>
                      <th style={styles.th}>Category</th>
                      <th style={styles.th}>Created By</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvedCases.map((c) => (
                      <tr key={c._id} style={styles.tr}>
                        <td style={styles.td}>{c.title}</td>
                        <td style={styles.td}>{c.category}</td>
                        <td style={styles.td}>
                          {c.createdBy?.name} ({c.createdBy?.email})
                        </td>
                        <td style={styles.td}>
                          <span
                            style={{
                              ...styles.statusBadge,
                              ...getStatusBadgeStyle(c.status),
                            }}
                          >
                            {c.status}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <button
                            style={styles.delete}
                            onClick={() => deleteCase(c._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}

                    {approvedCases.length === 0 && (
                      <tr>
                        <td style={styles.td} colSpan={5}>
                          <span style={styles.emptyText}>
                            No approved cases yet.
                          </span>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* REJECTED CASES */}
          {activeTab === "rejected" && (
            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>Rejected Cases</h2>
                <span style={styles.sectionHint}>
                  Cases that were not accepted for publishing.
                </span>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Title</th>
                      <th style={styles.th}>Category</th>
                      <th style={styles.th}>Created By</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rejectedCases.map((c) => (
                      <tr key={c._id} style={styles.tr}>
                        <td style={styles.td}>{c.title}</td>
                        <td style={styles.td}>{c.category}</td>
                        <td style={styles.td}>
                          {c.createdBy?.name} ({c.createdBy?.email})
                        </td>
                        <td style={styles.td}>
                          <span
                            style={{
                              ...styles.statusBadge,
                              ...getStatusBadgeStyle(c.status),
                            }}
                          >
                            {c.status}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <button
                            style={styles.delete}
                            onClick={() => deleteCase(c._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}

                    {rejectedCases.length === 0 && (
                      <tr>
                        <td style={styles.td} colSpan={5}>
                          <span style={styles.emptyText}>
                            No rejected cases yet.
                          </span>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* USERS */}
          {activeTab === "users" && (
            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>Users</h2>
                <span style={styles.sectionHint}>
                  Manage registered users and their access.
                </span>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Email</th>
                      <th style={styles.th}>Role</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} style={styles.tr}>
                        <td style={styles.td}>{u.name}</td>
                        <td style={styles.td}>{u.email}</td>
                        <td style={styles.td}>{u.role}</td>
                        <td style={styles.td}>
                          <span
                            style={{
                              ...styles.statusBadge,
                              ...getUserStatusStyle(u.isDisabled),
                            }}
                          >
                            {u.isDisabled ? "Disabled" : "Active"}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.actionBtns} className="action-btns">
                            <button
                              style={styles.reject}
                              onClick={() => toggleUserStatus(u._id, u.isDisabled)}
                            >
                              {u.isDisabled ? "Enable" : "Disable"}
                            </button>
                            <button
                              style={styles.delete}
                              onClick={() => deleteUser(u._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {users.length === 0 && (
                      <tr>
                        <td style={styles.td} colSpan={5}>
                          <span style={styles.emptyText}>No users found.</span>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* DONATIONS */}
          {activeTab === "donations" && (
            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>Donations Activity</h2>
                <span style={styles.sectionHint}>
                  Monitor donation flow for active cases.
                </span>
              </div>
              {(!donations || donations.length === 0) && (
                <p style={styles.emptyText}>
                  Donations management will appear here once the backend
                  endpoint is ready.
                </p>
              )}
              {donations && donations.length > 0 && (
                <div style={{ overflowX: "auto" }}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Case</th>
                        <th style={styles.th}>Donor</th>
                        <th style={styles.th}>Amount</th>
                        <th style={styles.th}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donations.map((d) => (
                        <tr key={d._id} style={styles.tr}>
                          <td style={styles.td}>{d.caseTitle}</td>
                          <td style={styles.td}>{d.userName}</td>
                          <td style={styles.td}>${d.amount}</td>
                          <td style={styles.td}>{d.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#F5F7FA",
    padding: "16px",
  },
  layout: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    gap: "24px",
  },
  sidebar: {
    width: "260px",
    background: "#ffffff",
    borderRadius: "24px",
    padding: "20px",
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.12)",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    transition: "transform 0.3s ease",
  },
  sidebarOpen: {
    transform: "translateX(0)",
  },
  sidebarHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "12px",
  },
  logoCircle: {
    width: "36px",
    height: "36px",
    borderRadius: "999px",
    background:
      "linear-gradient(135deg, #7FDB34 0%, #6BC428 40%, #90EE90 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
    fontWeight: "700",
    fontSize: "16px",
  },
  logoText: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#1A202C",
  },
  logoSub: {
    fontSize: "12px",
    color: "#A0AEC0",
  },
  sidebarSectionTitle: {
    marginTop: "14px",
    marginBottom: "4px",
    fontSize: "11px",
    fontWeight: "600",
    color: "#A0AEC0",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  tab: {
    padding: "10px 12px",
    borderRadius: "14px",
    border: "none",
    background: "transparent",
    color: "#4A5568",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    transition: "background 0.15s ease, transform 0.1s ease",
  },
  activeTab: {
    padding: "10px 12px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(90deg,#7FDB34,#6BC428)",
    color: "#fff",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 12px 26px rgba(127,219,52,0.35)",
    transform: "translateY(-1px)",
  },
  badge: {
    padding: "2px 8px",
    borderRadius: "999px",
    background: "#ffffff",
    color: "#38A169",
    fontSize: "11px",
    fontWeight: "600",
  },
  badgeMuted: {
    padding: "2px 8px",
    borderRadius: "999px",
    background: "#EDF2F7",
    color: "#4A5568",
    fontSize: "11px",
    fontWeight: "600",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  mainHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: "4px",
  },
  subtitle: {
    fontSize: "13px",
    color: "#718096",
  },
  adminChip: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px 12px",
    borderRadius: "20px",
    background: "#FFFFFF",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.12)",
  },
  adminAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "999px",
    background: "#EDF2F7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "14px",
    color: "#2D3748",
  },
  adminName: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#2D3748",
  },
  adminRole: {
    fontSize: "11px",
    color: "#A0AEC0",
  },
  sectionCard: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "18px 18px 20px",
    boxShadow:
      "12px 12px 28px rgba(15, 23, 42, 0.12), -12px -12px 28px rgba(255,255,255,0.9)",
  },
  sectionHeader: {
    marginBottom: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#2D3748",
  },
  sectionHint: {
    fontSize: "12px",
    color: "#A0AEC0",
  },
  cardsRow: {
    display: "flex",
    gap: "14px",
    marginTop: "8px",
    flexWrap: "wrap",
  },
  card: {
    flex: 1,
    minWidth: "220px",
    background: "#F7FAFC",
    borderRadius: "18px",
    padding: "14px",
    border: "1px solid #E2E8F0",
  },
  cardAccent: {
    flex: 1,
    minWidth: "220px",
    background:
      "linear-gradient(135deg, rgba(127,219,52,0.12), rgba(107,196,40,0.18))",
    borderRadius: "18px",
    padding: "14px",
    border: "1px solid rgba(127,219,52,0.4)",
  },
  cardLabel: {
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#A0AEC0",
    fontWeight: "600",
  },
  cardNumber: {
    fontSize: "24px",
    fontWeight: "700",
    marginTop: "6px",
    color: "#2D3748",
  },
  cardFooter: {
    marginTop: "4px",
    fontSize: "12px",
    color: "#718096",
  },
  progressBar: {
    marginTop: "8px",
    width: "100%",
    height: "8px",
    background: "#E2E8F0",
    borderRadius: "999px",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #7FDB34, #6BC428)",
    borderRadius: "999px",
    transition: "width 0.3s ease",
  },

  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
    marginTop: "6px",
    borderRadius: "16px",
    overflow: "hidden",
  },
  th: {
    padding: "10px",
    textAlign: "left",
    fontWeight: "600",
    fontSize: "13px",
    background: "#F7FAFC",
    borderBottom: "1px solid #E2E8F0",
    color: "#4A5568",
  },
  tr: {
    background: "#fff",
  },
  td: {
    padding: "10px",
    fontSize: "13px",
    borderBottom: "1px solid #EDF2F7",
    color: "#2D3748",
    whiteSpace: "nowrap",
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "3px 10px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  statusPending: {
    background: "rgba(237, 137, 54, 0.12)",
    color: "#DD6B20",
  },
  statusApproved: {
    background: "rgba(72, 187, 120, 0.12)",
    color: "#38A169",
  },
  statusRejected: {
    background: "rgba(245, 101, 101, 0.12)",
    color: "#E53E3E",
  },
  statusDefault: {
    background: "#EDF2F7",
    color: "#4A5568",
  },
  userActive: {
    background: "rgba(72, 187, 120, 0.12)",
    color: "#2F855A",
  },
  userDisabled: {
    background: "rgba(245, 101, 101, 0.12)",
    color: "#C53030",
  },
  emptyText: {
    fontSize: "13px",
    color: "#A0AEC0",
    paddingTop: "4px",
  },
  actionBtns: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
  },
  approve: {
    background: "linear-gradient(90deg, #7FDB34 0%, #6BC428 100%)",
    color: "white",
    padding: "6px 12px",
    border: "none",
    borderRadius: "999px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    boxShadow: "0 8px 18px rgba(127,219,52,0.35)",
  },
  reject: {
    background: "rgba(251, 146, 60, 0.12)",
    color: "#DD6B20",
    padding: "6px 12px",
    border: "1px solid rgba(251, 146, 60, 0.6)",
    borderRadius: "999px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
  },
  delete: {
    background: "rgba(254, 178, 178, 0.2)",
    color: "#C53030",
    padding: "6px 12px",
    border: "1px solid rgba(229, 62, 62, 0.7)",
    borderRadius: "999px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
  },
  mobileMenuBtn: {
    display: "none",
    position: "inherit",
    top: "20px",
    left: "20px",
    zIndex: 1001,
    background: "#ffffff",
    border: "none",
    borderRadius: "12px",
    padding: "10px 14px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
  menuIcon: {
    fontSize: "20px",
    color: "#2D3748",
  },
  overlay: {
    display: "none",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
  },
};

const mediaQueries = `
  @media (max-width: 992px) {
    .admin-layout {
      flex-direction: column;
    }
    
    .admin-sidebar {
      position: fixed !important;
      top: 0;
      left: 0;
      bottom: 0;
      width: 280px !important;
      max-width: 85vw;
      z-index: 1000;
      transform: translateX(-100%);
      box-shadow: 4px 0 20px rgba(0, 0, 0, 0.2) !important;
      border-radius: 0 !important;
    }
    
    .mobile-menu-btn {
      display: block !important;
    }
    
    .mobile-overlay {
      display: block !important;
    }
    
    .admin-main {
      width: 100%;
    }
  }
  
  @media (max-width: 768px) {
    .cards-row {
      flex-direction: column;
    }
    
    .cards-row > div {
      min-width: 100% !important;
    }
    
    .main-header {
      flex-direction: column;
      align-items: flex-start !important;
    }
    
    .action-btns {
      flex-direction: column;
      align-items: stretch;
    }
    
    .action-btns button {
      width: 100%;
    }
  }
  
  @media (max-width: 640px) {
    body {
      font-size: 14px;
    }
    
    table {
      font-size: 11px !important;
    }
    
    th, td {
      padding: 8px 6px !important;
    }
    
    h1 {
      font-size: 20px !important;
    }
    
    h2 {
      font-size: 16px !important;
    }
  }
`;