import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "../redux/userSlice";
import toast from 'react-hot-toast'

export default function EditProfile() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [isLoading, setIsLoading] = useState(false);
  const isUnchanged =
    name.trim() === currentUser?.name &&
    email.trim() === currentUser?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!name.trim() || !email.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("No authentication token found");
        navigate("/login");
        return;
      }

      const res = await axios.put(
        "/api/auth/update",
        { name: name.trim(), email: email.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      dispatch(setUser(res.data.user));
      toast.success("Profile updated successfully");
      navigate("/profile");

    } catch (err) {
      const message = err.response?.data?.message || err.message || "Update failed";
      console.error("Update error:", err);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-soft)] flex flex-col items-center">
      <div className="w-full max-w-md px-4">

        <h1 className="text-2xl font-bold mt-8 mb-6 text-center">
          Update Profile
        </h1>

      <form
        onSubmit={handleSubmit}
        className="w-11/12 md:w-1x1 bg-white p-9 shadow-md rounded-md"
      >
        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full text-base px-4 rounded-xl py-3 border-solid border transition-all duration-500 focus:border-[var(--color-primary)] focus:outline-0 mt-1 disabled:bg-gray-100 disabled:cursor-not-allowed"

          />
        </label>

        <label className="block mb-6 text-base">
          <span className="text-gray-700 font-medium">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full text-base px-4 rounded-md py-3 border-solid border transition-all duration-500 focus:border-[var(--color-primary)] focus:outline-0 mt-1 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </label>

        <button
          type="submit"
          disabled={isLoading || isUnchanged}
          className={`w-full py-3 text-18 rounded-lg font-medium border  transition duration-300 ease-in-out
            ${isLoading || isUnchanged
              ? "bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300"
              : "bg-[var(--color-primary)] text-white border-[var(--color-primary)] hover:bg-transparent hover:text-[var(--color-primary)] hover:cursor-pointer"
            }`}>
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/profile")}
          className="w-full mt-3 mb-4 py-3 rounded-lg border text-gray-600 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
      </form>
      </div>
    </div>
  );
}