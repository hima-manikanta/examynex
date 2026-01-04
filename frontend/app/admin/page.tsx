"use client";

import { api } from "@/lib/api";
import { AxiosError } from "axios";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Exam = {
  id: number;
  title: string;
  description: string;
  duration_minutes: number;
};

type Banner = {
  tone: "success" | "error";
  message: string;
} | null;

export default function AdminPage() {
  const router = useRouter();

  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState<Banner>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    duration_minutes: 60,
  });

  /* ================= FETCH EXAMS ================= */
  const fetchExams = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<Exam[]>("/exams/");
      setExams(Array.isArray(data) ? data : []);
    } catch {
      setBanner({
        tone: "error",
        message: "Unable to reach backend. Is FastAPI running?",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  /* ================= AUTH GUARD ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      router.replace("/login");
      return;
    }

    if (role !== "admin") {
      router.replace("/dashboard");
      return;
    }

    fetchExams();
  }, [fetchExams, router]);

  /* ================= CREATE EXAM ================= */
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setBanner(null);

    try {
      const { data } = await api.post<Exam>("/exams/", form);

      setForm({
        title: "",
        description: "",
        duration_minutes: 60,
      });

      setExams(prev => [data, ...prev]);

      setBanner({
        tone: "success",
        message: "Exam published successfully.",
      });
    } catch (err) {
      const e = err as AxiosError<{ detail?: string }>;
      setBanner({
        tone: "error",
        message:
          e.response?.data?.detail ??
          "Exam creation failed. Check inputs & admin role.",
      });
    }
  };

  /* ================= UI ================= */
  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        Loading admin console…
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-2xl">
      <header>
        <h1 className="text-4xl font-semibold">
          Admin · Publish Exams
        </h1>
      </header>

      {banner && (
        <div
          className={`rounded-xl p-4 ${
            banner.tone === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {banner.message}
        </div>
      )}

      {/* ================= CREATE EXAM ================= */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          required
          placeholder="Exam title"
          value={form.title}
          onChange={e =>
            setForm({ ...form, title: e.target.value })
          }
          className="w-full rounded border p-3"
        />

        <textarea
          required
          placeholder="Exam description"
          value={form.description}
          onChange={e =>
            setForm({ ...form, description: e.target.value })
          }
          className="w-full rounded border p-3"
        />

        <input
          type="number"
          min={1}
          required
          value={form.duration_minutes}
          onChange={e =>
            setForm({
              ...form,
              duration_minutes: Number(e.target.value),
            })
          }
          className="w-full rounded border p-3"
          placeholder="Duration (minutes)"
        />

        <button
          type="submit"
          className="rounded bg-black px-6 py-3 font-semibold text-white"
        >
          Publish Exam
        </button>
      </form>

      {/* ================= EXAM LIST ================= */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Published exams</h2>

        {exams.length === 0 ? (
          <p className="text-neutral-500 text-sm">
            No exams published yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {exams.map(exam => (
              <li
                key={exam.id}
                className="rounded border p-4 text-sm flex justify-between items-center"
              >
                <div>
                  <strong>{exam.title}</strong>
                  <div className="text-neutral-500">
                    {exam.duration_minutes} minutes
                  </div>
                </div>

                {/* ✅ ADMIN ACTIONS */}
                <div className="flex gap-2">
                  <Link
                    href={`/admin/questions/${exam.id}`}
                    className="rounded bg-blue-600 px-4 py-2 text-white text-xs font-semibold hover:bg-blue-700"
                  >
                    Add Questions
                  </Link>

                  <Link
                    href={`/admin/exams/${exam.id}`}
                    className="rounded bg-black px-4 py-2 text-white text-xs font-semibold hover:bg-gray-800"
                  >
                    Integrity Report
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
