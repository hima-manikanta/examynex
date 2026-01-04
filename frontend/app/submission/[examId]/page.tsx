"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";

type Confidence = {
  confidence_score: number;
  total_violations: number;
  violations: { type: string; penalty: number }[];
};

export default function SubmissionResultPage() {
  const { examId } = useParams<{ examId: string }>();
  const router = useRouter();

  const [data, setData] = useState<Confidence | null>(null);

  useEffect(() => {
    api
      .get(`/proctor/confidence/${examId}`)
      .then(res => setData(res.data))
      .catch(() => alert("Failed to load proctor confidence"));
  }, []);

  if (!data) return <div className="p-10">Loading…</div>;

  const color =
    data.confidence_score >= 80
      ? "text-green-600"
      : data.confidence_score >= 60
      ? "text-yellow-600"
      : "text-red-600";

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">Exam Result</h1>

      <div className={`text-5xl font-bold ${color}`}>
        {data.confidence_score}%
      </div>

      <p className="text-gray-600">
        Proctor Confidence Score
      </p>

      <div className="border rounded p-4">
        <h2 className="font-semibold mb-2">Violation Summary</h2>

        {data.violations.length === 0 ? (
          <p className="text-green-600">No violations detected 🎉</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {data.violations.map((v, i) => (
              <li key={i}>
                ❌ {v.type} (−{v.penalty})
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={() => router.replace("/dashboard")}
        className="bg-black text-white px-6 py-2 rounded"
      >
        Back to Dashboard
      </button>
    </div>
  );
}
