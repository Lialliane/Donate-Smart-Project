import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/Common/select';
import axios from "axios";
import toast from "react-hot-toast";

export default function AddCase() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [summary, setSummary] = useState("");
  const [goal, setGoal] = useState();
  const [image, setImage] = useState(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser);
  const [aiError, setAiError] = useState("");

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    setAiError("");
    setSummary("");

    try {
      const res = await fetch("http://localhost:5000/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description })
      });

      const json = await res.json();

      // إذا رجع ملخص، اعرضه مباشرة
      if (json.success && json.data?.summary) {
        setSummary(json.data.summary);
      } else {
        // إذا ما فيه ملخص، اعرض الخطأ
        setAiError(json.data?.error || "AI request failed");
      }
    } catch (e) {
      setAiError(e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // حماية الصفحة
  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);



  // ✅ validation لكل الحقول المطلوبة
  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "Title is required.";
    } else if (title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters.";
    }

    if (!category) {
      newErrors.category = "Category is required.";
    }

    const numericGoal = Number(goal);
    console.log(numericGoal, numericGoal < 100);
    if (!goal) {
      newErrors.goal = "Funding goal is required.";
    } else if (Number.isNaN(numericGoal) || numericGoal <= 0) {
      newErrors.goal = "Funding goal must be a positive number.";
    } else if (numericGoal < 100) {
      newErrors.goal = "Funding goal must be at least $100!"
    } else if (numericGoal > 100000000) {
      newErrors.goal = "Funding goal must not exeeed $100.000.000!"
    }

    if (!description.trim()) {
      newErrors.description = "Description is required.";
    } else if (description.trim().length < 20) {
      newErrors.description = "Description must be at least 20 characters.";
    }

    if (!image) {
      newErrors.image = "Case image is required.";
    } else {
      if (!image.type.startsWith("image/")) {
        newErrors.image = "Only image files are allowed.";
      } else if (image.size > 10 * 1024 * 1024) {
        newErrors.image = "Image must be smaller than 10MB.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    setErrors((prev) => ({ ...prev, image: undefined }));

    if (!file) {
      setImage(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        image: "Only image files are allowed.",
      }));
      setImage(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: "Image must be smaller than 10MB.",
      }));
      setImage(null);
      return;
    }

    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const isValid = validateForm();
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("goal", Number(goal));
    formData.append("category", category);
    formData.append("summary", summary);
    formData.append("image", image); // ✅ صار required من الـ validation

    try {
      const res = await axios.post("/api/cases", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Submitted case:", res.data);
      toast.success("Case submitted successfully!");
      navigate("/profile");
    } catch (err) {
      console.error(
        "Error submitting case:",
        err.response?.data || err.message
      );
      toast.error(
        err.response?.data?.message || "Failed to submit case. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Page Header */}
        <div style={styles.header}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl" style={styles.title}>Start a New Case</h1>
          <p style={styles.subtitle}>
            Create a fundraising campaign to support a cause that matters to you.
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} style={styles.formCard}>
          {/* Title */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Case Title *</label>
            <input
              type="text"
              placeholder="Enter a title for your case"
              style={styles.input}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors((prev) => ({ ...prev, title: undefined }));
              }}
            />
            {errors.title && (
              <p style={styles.errorText}>{errors.title}</p>
            )}
          </div>

          {/* Category with custom arrow */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Category *</label>
            <Select value={category} onValueChange=
              {(e) => {
                setCategory(e);
                setErrors((prev) => ({ ...prev, category: undefined }));
              }}>
              <SelectTrigger className="rounded-2xl bg-white h-12 border-2 border-gray-200 focus:border-[var(--color-primary)]">
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
            {errors.category && (
              <p style={styles.errorText}>{errors.category}</p>
            )}
          </div>

          {/* Funding Goal */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Funding Goal ($) *</label>
            <input
              type="number"
              placeholder="Enter your funding goal"
              style={styles.input}
              value={goal}
              min={0}
              step="1"
              onKeyDown={(e) => {
                if (["e", "E", "+", "-"].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                const value = e.target.value;

                if (value !== "" && Number(value) < 0) return;
                setGoal(value === "" ? "" : Number(value));
                setErrors((prev) => ({ ...prev, goal: undefined }));
              }}
            />

            {errors.goal && (
              <p style={styles.errorText}>{errors.goal}</p>
            )}
          </div>

          {/* Description */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Full Description *</label>
            <textarea
              placeholder="Describe your case in detail. Explain why this cause is important, how the funds will be used, and the impact it will have."
              style={styles.textarea}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setErrors((prev) => ({ ...prev, description: undefined }));
              }}
            ></textarea>
            {errors.description && (
              <p style={styles.errorText}>{errors.description}</p>
            )}
          </div>

          {/* Image Upload */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Case Image *</label>
            <div style={styles.uploadBox}>
              <input
                type="file"
                accept="image/*"
                style={styles.fileInput}
                onChange={handleImageChange}
              />
              <p style={styles.uploadHint}>
                Click to upload or drag and drop. PNG, JPG up to 10MB.
              </p>
            </div>
            {errors.image && (
              <p style={styles.errorText}>{errors.image}</p>
            )}
          </div>

          {/* AI Summary section */}
          <div style={styles.aiSection}>
            <div style={styles.aiHeader}>
              <span style={styles.label}>AI-Generated Summary</span>
              <button
                type="button"
                onClick={handleGenerateSummary}
                disabled={isGenerating || !title}
                style={{
                  ...styles.aiButton,
                  opacity: isGenerating || !title ? 0.7 : 1,
                  cursor: isGenerating || !title ? "not-allowed" : "pointer",
                }}
              >
                {isGenerating ? "Generating..." : "Generate with AI"}
              </button>
            </div>

            {summary && (
              <div style={styles.summaryBox}>
                <p style={styles.summaryText}>{summary}</p>
              </div>
            )}
          </div>
          {aiError && (
            <div style={{ marginTop: 8, color: "tomato" }}>
              <strong>Note:</strong> {aiError} (showing fallback if AI failed)
            </div>
          )}
          {/* Submit */}
          <button
            type="submit"
            className='lg:block bg-[var(--color-primary)] text-white font-medium hover:bg-transparent duration-300 hover:text-[var(--color-primary)] border border-[var(--color-primary)] rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed'
            style={{
              ...styles.submitButton,
              opacity: isSubmitting ? 0.7 : 1,
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
            disabled={isSubmitting}

          >
            {isSubmitting ? "Submitting..." : "Submit Case for Review"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#F5F7FA",
    padding: "30px 16px",
  },
  container: {
    maxWidth: "900px",
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    marginBottom: "24px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#718096",
  },
  formCard: {
    background: "#FFFFFF",
    borderRadius: "24px",
    padding: "28px 24px 32px",
    boxShadow:
      "12px 12px 24px rgba(0,0,0,0.08), -12px -12px 24px rgba(255,255,255,0.9)",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#2D3748",
  },
  input: {
    padding: "12px 14px",
    borderRadius: "16px",
    border: "2px solid #E2E8F0",
    fontSize: "14px",
    outline: "none",
  },
  textarea: {
    padding: "12px 14px",
    borderRadius: "16px",
    border: "2px solid #E2E8F0",
    fontSize: "14px",
    outline: "none",
    minHeight: "180px",
    resize: "vertical",
  },
  selectWrapper: {
    position: "relative",
    width: "100%",
    background: "white",
    height: "3rem",
  },
  select: {
    width: "100%",
    padding: "12px 14px",
    paddingRight: "40px",
    borderRadius: "16px",
    border: "2px solid #E2E8F0",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "white",
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
    cursor: "pointer",
  },
  arrow: {
    position: "absolute",
    right: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "18px",
    color: "#666",
    pointerEvents: "none",
  },
  uploadBox: {
    border: "2px dashed #CBD5E0",
    borderRadius: "18px",
    padding: "16px",
    background: "#FFFFFF",
  },
  fileInput: {
    width: "100%",
    marginBottom: "6px",
  },
  uploadHint: {
    fontSize: "12px",
    color: "#718096",
  },
  aiSection: {
    background:
      "linear-gradient(135deg, rgba(127,219,52,0.12), rgba(107,196,40,0.12))",
    borderRadius: "18px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  aiHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  aiButton: {
    padding: "10px 16px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(90deg, #7FDB34 0%, #6BC428 100%)",
    color: "white",
    fontWeight: "600",
    fontSize: "14px",
  },
  summaryBox: {
    background: "#FFFFFF",
    borderRadius: "12px",
    border: "2px solid rgba(127,219,52,0.35)",
    padding: "12px",
  },
  summaryText: {
    fontSize: "13px",
    color: "#4A5568",
    margin: 0,
    lineHeight: 1.5,
  },
  submitButton: {
    marginTop: "10px",
    width: "100%",
    padding: "16px",
    borderRadius: "20px",
    fontWeight: "600",
    fontSize: "16px",
    cursor: "pointer",
  },
  errorText: {
    fontSize: "12px",
    color: "#E53E3E",
    margin: "2px 2px 0",
  },
};
