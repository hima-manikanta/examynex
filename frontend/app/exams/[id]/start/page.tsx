"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";

export default function StartExamPage() {
  const { id } = useParams();
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "student") {
      router.replace("/dashboard");
      return;
    }

    init();
  }, []);

  const init = async () => {
    try {
      await api.post(`/exams/${id}/start`);
      await startCamera();

      // go to REAL exam page
      router.replace(`/exams/${id}/attempt`);
    } catch {
      setError("Unable to start exam");
    }
  };

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) videoRef.current.srcObject = stream;
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-xl mb-4">Initializing Proctoring…</h1>

      {error && <p className="bg-red-600 p-3 rounded">{error}</p>}

      <video ref={videoRef} autoPlay muted className="w-64 rounded border" />
    </div>
  );
}
