"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";

type Exam = {
  id: number;
  title: string;
  description: string;
  duration_minutes: number;
};

export default function ExamOverviewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/exams/${id}`).then(res => {
      setExam(res.data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div>Loading…</div>;
  if (!exam) return null;

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold">{exam.title}</h1>
      <p className="mt-4">{exam.description}</p>

      <button
        onClick={() => router.push(`/exams/${exam.id}/attempt`)}
        className="mt-6 bg-black text-white px-6 py-3 rounded"
      >
        Start Exam
      </button>
    </div>
  );
}
