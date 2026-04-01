import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

export default function ContactUS() {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phnumber: "",
    Message: "",
  });

  const [errors, setErrors] = useState({});
  const [showThanks, setShowThanks] = useState(false);
  const [loader, setLoader] = useState(false);

  const refs = {
    firstname: useRef(null),
    lastname: useRef(null),
    email: useRef(null),
    phnumber: useRef(null),
    Message: useRef(null),
  };

  useEffect(() => {
    if (currentUser?.role === "admin") navigate("/");
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstname.trim()) {
      newErrors.firstname = "First name is required";
    }

    if (!formData.lastname.trim()) {
      newErrors.lastname = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // ✅ Phone OPTIONAL
    if (
      formData.phnumber.trim() &&
      !/^[0-9+]{8,15}$/.test(formData.phnumber)
    ) {
      newErrors.phnumber = "Please enter a valid phone number";
    }

    if (!formData.Message.trim()) {
      newErrors.Message = "Message is required";
    }

    setErrors(newErrors);

    const firstErrorField = Object.keys(newErrors)[0];
    if (firstErrorField) {
      refs[firstErrorField].current.focus();
      return false;
    }

    return true;
  };

  const reset = () => {
    setFormData({
      firstname: "",
      lastname: "",
      email: "",
      phnumber: "",
      Message: "",
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoader(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/contact",
        formData
      );

      if (res.data?.success) {
        setShowThanks(true);
        reset();

        setTimeout(() => {
          setShowThanks(false);
        }, 5000);
      }
    } catch (error) {
      console.error(
        "Error submitting contact form:",
        error.response?.data || error.message
      );
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="container">
      <section id="contact">
        <div className="container">
          <div className="relative">
            <h2 className="text-3xl md:text-4xl lg:text-5xl mb-9 text-center font-bold tracking-tight">
              Get in Touch
            </h2>

            <form
              onSubmit={handleSubmit}
              className="flex flex-wrap w-full m-auto justify-between"
            >
              <div className="sm:flex gap-3 w-full">
                <div className="mx-0 my-2.5 flex-1">
                  <label className="pb-3 inline-block text-base">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstname"
                    ref={refs.firstname}
                    value={formData.firstname}
                    onChange={handleChange}
                    placeholder="Fname"
                    className="w-full text-base px-4 rounded-2xl py-2.5 border transition-all focus:border-[var(--color-primary)] focus:outline-0"
                  />
                  {errors.firstname && (
                    <p className="text-red-500 text-sm">
                      {errors.firstname}
                    </p>
                  )}
                </div>

                <div className="mx-0 my-2.5 flex-1">
                  <label className="pb-3 inline-block text-base">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastname"
                    ref={refs.lastname}
                    value={formData.lastname}
                    onChange={handleChange}
                    placeholder="Lname"
                    className="w-full text-base px-4 rounded-2xl py-2.5 border transition-all focus:border-[var(--color-primary)] focus:outline-0"
                  />
                  {errors.lastname && (
                    <p className="text-red-500 text-sm">
                      {errors.lastname}
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:flex gap-3 w-full">
                <div className="mx-0 my-2.5 flex-1">
                  <label className="pb-3 inline-block text-base">
                    Email address
                  </label>
                  <input
                    type="email"
                    name="email"
                    ref={refs.email}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="YourName@example.com"
                    className="w-full text-base px-4 rounded-2xl py-2.5 border transition-all focus:border-[var(--color-primary)] focus:outline-0"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="mx-0 my-2.5 flex-1">
                  <label className="pb-3 inline-block text-base">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phnumber"
                    ref={refs.phnumber}
                    value={formData.phnumber}
                    onChange={handleChange}
                    placeholder="+1234567890"
                    className="w-full text-base px-4 rounded-2xl py-2.5 border transition-all focus:border-[var(--color-primary)] focus:outline-0"
                  />
                  {errors.phnumber && (
                    <p className="text-red-500 text-sm">
                      {errors.phnumber}
                    </p>
                  )}
                </div>
              </div>

              <div className="w-full mx-0 my-2.5 flex-1">
                <label className="text-base inline-block">
                  Message
                </label>
                <textarea
                  name="Message"
                  ref={refs.Message}
                  value={formData.Message}
                  onChange={handleChange}
                  placeholder="Feel free to write your message here..."
                  className="w-full mt-2 rounded-2xl px-5 py-3 border transition-all focus:border-[var(--color-primary)] focus:outline-0"
                />
                {errors.Message && (
                  <p className="text-red-500 text-sm">
                    {errors.Message}
                  </p>
                )}
              </div>

              <div className="text-center my-2.5 w-full">
                <button
                  type="submit"
                  disabled={loader}
                  className={`border leading-none px-10 sm:px-12 text-base sm:text-lg font-medium py-3 sm:py-4 rounded-lg  ${
                    loader
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[var(--color-primary)] border-[var(--color-primary)] text-white hover:bg-transparent hover:text-[var(--color-primary)] cursor-pointer"
                  }`}>
                  {loader ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>

            {showThanks && (
              <div className="text-white bg-[var(--color-primary)] rounded-full px-4 text-lg absolute mt-2 flex items-center gap-2">
                Thank you for contacting us! We will get back to you soon.
                <div className="w-3 h-3 rounded-full animate-spin border-2 border-white border-t-transparent"></div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
