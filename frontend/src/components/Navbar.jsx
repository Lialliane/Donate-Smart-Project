import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/userSlice";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.user.currentUser);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo} onClick={() => navigate("/")}>
        DonateSmart
      </h2>

      <div style={styles.links}>
        <Link style={styles.link} to="/">
          Home
        </Link>

        {currentUser && currentUser.role !=="admin" && (
          <Link style={styles.link} to="/add-case">
            Add Case
          </Link>
        )}

        {currentUser && (
          <Link style={styles.link} to="/profile">
            Profile
          </Link>
        )}

        {!currentUser && (
          <>
            <Link style={styles.link} to="/login">
              Login
            </Link>
            <Link style={styles.link} to="/register">
              Register
            </Link>
          </>
        )}
        {currentUser?.role === "admin" && (
          <Link style={styles.link} to="/admin">
            Admin Panel
          </Link>
        )}

        {currentUser && (
          <button style={styles.logout} onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    borderRadius: "0 0 22px 22px",
    padding: "0px 25px",
    background: "#7fdb34ff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "white",
  },
  logo: {
    cursor: "pointer",
  },
  links: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontWeight: "bold",
  },
  logout: {
    background: "white",
    color: "#7fdb34ff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
