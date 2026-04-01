
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

console.log("Gemini API Key:", process.env.GEMINI_API_KEY);


const CATEGORIES = [
  "medical",
  "educational",
  "emergency",
  "social",
  "housing",
  "food",
  "orphan",
  "disabled",
  "other"
];

export async function analyzeCase({ title, description }) {
const prompt = `
You are an assistant for a donation platform.
Summarize the following case in 2–3 sentences only.
Then classify it into exactly one category from this list: ${CATEGORIES.join(", ")}.

Return valid JSON only, no extra text:
{"summary":"...", "category":"..."}

Case:
Title: ${title}
Description: ${description}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
console.log("AI raw response:", text);


    // حاولِ تفكيك JSON من الاستجابة
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    const jsonStr = start !== -1 && end !== -1 ? text.slice(start, end + 1) : "";
    const parsed = jsonStr ? JSON.parse(jsonStr) : {};
console.log("Parsed JSON:", parsed);
    let summary = (parsed.summary || "").trim();
    let category = (parsed.category || "").toLowerCase().trim();

    // تنظيف وتحقق من القيم
    if (!summary) {
      // fallback بسيط لو الـ AI فشل
      summary = (description || "").split("\n").slice(0, 2).join(" ").slice(0, 300);
    }

    if (!CATEGORIES.includes(category)) {
      category = "other";
    }

    return { summary, category };
  } catch (err) {
    // لا تخلي فشل الـ AI يوقف إضافة الحالات
    const fallbackSummary = (description || "").slice(0, 300);
    return { summary: fallbackSummary, category: "other", error: err.message };
  }
}
