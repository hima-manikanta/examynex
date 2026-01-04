"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";

type ReportRow = {
  user_id: number;
  confidence_score: number;
  total_violations: number;
  violations: string[];
};

export default function AdminExamReportPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [rows, setRows] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      router.replace("/dashboard");
      return;
    }

    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      const res = await api.get(`/proctor/admin/report/${id}`);
      setRows(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load admin report");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-10">Loading admin report…</div>;
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        Admin · Exam Integrity Report
      </h1>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border p-3">Student ID</th>
            <th className="border p-3">Confidence</th>
            <th className="border p-3">Violations</th>
            <th className="border p-3">Status</th>
          </tr>
        </thead>

        <tbody>
          {rows.map(r => {
            const status =
              r.confidence_score >= 80
                ? "CLEAR"
                : r.confidence_score >= 60
                ? "REVIEW"
                : "SUSPICIOUS";

            return (
              <tr key={r.user_id}>
                <td className="border p-3">{r.user_id}</td>
                <td className="border p-3 font-semibold">
                  {r.confidence_score}%
                </td>
                <td className="border p-3">
                  {r.total_violations}
                  <ul className="text-xs text-gray-600">
                    {r.violations.map((v, i) => (
                      <li key={i}>• {v}</li>
                    ))}
                  </ul>
                </td>
                <td
                  className={`border p-3 font-semibold ${
                    status === "CLEAR"
                      ? "text-green-600"
                      : status === "REVIEW"
                      ? "text-orange-600"
                      : "text-red-600"
                  }`}
                >
                  {status}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
