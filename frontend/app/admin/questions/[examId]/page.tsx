"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type QuestionForm = {
  question_text: string;
  type: "mcq" | "text" | "code";
  options: string[];
  correct_answer: string;
};

export default function AddQuestionsPage() {
  const { examId } = useParams();
  const router = useRouter();

  const [form, setForm] = useState<QuestionForm>({
    question_text: "",
    type: "mcq",
    options: ["", "", "", ""],
    correct_answer: "",
  });

  const [message, setMessage] = useState<string | null>(null);

  /* ================= AUTH GUARD ================= */
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      router.replace("/dashboard");
    }
  }, [router]);

  /* ================= SUBMIT ================= */
const submitQuestion = async () => {
  setMessage(null);

  if (
    form.type === "mcq" &&
    form.options.some(o => o.trim() === "")
  ) {
    setMessage("All 4 MCQ options are required");
    return;
  }

  try {
    await api.post("/questions/", {
      exam_id: Number(examId),
      question_text: form.question_text,
      type: form.type,
      options: form.type === "mcq" ? form.options : null,
      correct_answer: form.correct_answer,
    });

    setForm({
      question_text: "",
      type: "mcq",
      options: ["", "", "", ""],
      correct_answer: "",
    });

    setMessage("Question added successfully");
  } catch (err) {
    setMessage("Failed to add question");
  }
};


  /* ================= UI ================= */
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-semibold">
        Add Questions · Exam #{examId}
      </h1>

      {message && (
        <div className="rounded bg-green-100 p-3 text-green-800">
          {message}
        </div>
      )}

      {/* Question Text */}
      <textarea
        placeholder="Question text"
        value={form.question_text}
        onChange={e =>
          setForm({ ...form, question_text: e.target.value })
        }
        className="w-full rounded border p-3"
      />

      {/* Question Type */}
      <select
        value={form.type}
        onChange={e =>
          setForm({ ...form, type: e.target.value as any })
        }
        className="w-full rounded border p-3"
      >
        <option value="mcq">MCQ</option>
        <option value="text">Text</option>
        <option value="code">Code</option>
      </select>

      {/* MCQ OPTIONS */}
      {form.type === "mcq" && (
        <div className="space-y-3">
          {form.options.map((opt, idx) => (
            <input
              key={idx}
              placeholder={`Option ${String.fromCharCode(65 + idx)}`}
              value={opt}
              onChange={e => {
                const updated = [...form.options];
                updated[idx] = e.target.value;
                setForm({ ...form, options: updated });
              }}
              className="w-full rounded border p-3"
            />
          ))}
        </div>
      )}

      {/* Correct Answer */}
      <input
        placeholder="Correct answer (A / B / C / D or exact value)"
        value={form.correct_answer}
        onChange={e =>
          setForm({ ...form, correct_answer: e.target.value })
        }
        className="w-full rounded border p-3"
      />

      <button
        onClick={submitQuestion}
        className="rounded bg-black px-6 py-3 text-white font-semibold"
      >
        Add Question
      </button>
    </div>
  );
}
