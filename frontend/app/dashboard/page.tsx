"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import NavBar from "@/components/NavBar";
import ExamCard from "@/components/ExamCard";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { api } from "@/lib/api";

type Exam = {
  id: number;
  title: string;
  description: string;
  duration_minutes: number;
};

export default function DashboardPage() {
  const { role, ready } = useAuthGuard();

  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExams = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get<Exam[]>("/exams/");
      setExams(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load exams", err);
      setError("Unable to load exams. Backend is unreachable or unauthorized.");
      setExams([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    fetchExams();
  }, [ready, fetchExams]);

  const featuredExam = useMemo(() => {
    if (exams.length === 0) return null;
    return exams.reduce((a, b) => (a.id < b.id ? a : b));
  }, [exams]);

  // ✅ CRITICAL FIX: wait until auth is resolved
  if (!ready || !role) {
    return null; // or a loading skeleton
  }

  return (
    <div className="min-h-screen bg-[#f4f5f0] px-4 py-8 text-neutral-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <NavBar role={role} />

        <section className="rounded-[40px] bg-white/90 p-8 shadow-xl">
          {/* Header */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-neutral-500">
                Dashboard
              </p>
              <h1 className="mt-3 text-4xl font-semibold">
                {role === "admin" ? "Admin overview" : "Exam assignments"}
              </h1>
              <p className="mt-2 text-sm text-neutral-500">
                Exams stream directly from the secured GET /exams endpoint.
              </p>
            </div>

            <div className="flex gap-3 text-sm">
              {role === "admin" && (
                <Link
                  href="/admin"
                  className="rounded-full bg-neutral-900 px-5 py-2 font-semibold text-white hover:bg-black"
                >
                  Create exam
                </Link>
              )}

              <button
                onClick={fetchExams}
                disabled={loading}
                className="rounded-full border px-5 py-2 font-semibold hover:bg-neutral-900 hover:text-white disabled:opacity-50"
              >
                {loading ? "Refreshing…" : "Refresh"}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Catalog */}
            <div className="rounded-3xl border bg-white p-6">
              <h2 className="text-2xl font-semibold">Active exams</h2>

              {error && (
                <div className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">
                  {error}
                </div>
              )}

              {!loading && exams.length === 0 && (
                <p className="mt-6 text-sm text-neutral-500">
                  No published exams yet.
                </p>
              )}

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {exams.map((exam) => (
                  <Link
                    key={exam.id}
                    href={`/exams/${exam.id}`}
                    className="group block rounded-3xl hover:ring-1 hover:ring-neutral-900/20"
                  >
                    <ExamCard
                      title={exam.title}
                      description={exam.description}
                    />
                    <div className="flex justify-between px-1 pt-3 text-xs text-neutral-400">
                      <span>Exam #{exam.id}</span>
                      <span className="font-semibold group-hover:text-neutral-900">
                        Open →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Featured */}
            <aside className="rounded-3xl border bg-white p-6">
              <p className="text-xs uppercase tracking-widest text-neutral-400">
                Pinned exam
              </p>

              {featuredExam ? (
                <div className="mt-5 space-y-4">
                  <h3 className="text-2xl font-semibold">
                    {featuredExam.title}
                  </h3>
                  <p className="text-sm text-neutral-500">
                    {featuredExam.description}
                  </p>
                  <p className="text-xs text-neutral-400">
                    Duration: {featuredExam.duration_minutes} minutes
                  </p>
                  <Link
                    href={`/exams/${featuredExam.id}`}
                    className="inline-flex w-full justify-center rounded-full bg-neutral-900 px-5 py-2 text-white hover:bg-black"
                  >
                    Resume exam
                  </Link>
                </div>
              ) : (
                <p className="mt-4 text-sm text-neutral-500">
                  Once an exam is published it will surface here.
                </p>
              )}
            </aside>
          </div>
        </section>
      </div>
    </div>
  );
}
