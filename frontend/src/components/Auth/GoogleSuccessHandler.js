import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/userSlice";

export default function GoogleSuccessHandler() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);

      axios.get("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        dispatch(setUser(res.data));
      })
      .catch(() => {
        toast.error("Failed to login!");
        localStorage.setItem("token", "");
      });
    } else {
      toast.error("Failed to login!");
    }
    navigate("/");
  }, [navigate]);

  return null;
}
