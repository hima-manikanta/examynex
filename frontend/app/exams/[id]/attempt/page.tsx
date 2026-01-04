"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";

type Question = {
  id: number;
  text: string;
  question_type: "mcq" | "text";
  options?: string[];
};

type ExamMeta = {
  duration_minutes: number;
};

export default function AttemptExamPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [sessionId, setSessionId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // ⏱ TIMER
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  /* ================= INIT ================= */
  useEffect(() => {
    init();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const init = async () => {
    try {
      await startCamera();
      await startProctor();
      await loadExamMeta();     // ⬅️ TIMER SOURCE
      await loadQuestions();
    } catch (e) {
      console.error(e);
      setError("Failed to initialize proctored exam");
    }
  };

  /* ================= CAMERA ================= */
  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (!videoRef.current) return;
    videoRef.current.srcObject = stream;
    await videoRef.current.play();
  };

  /* ================= CAPTURE FRAME ================= */
  const captureFrame = (): Promise<Blob> =>
    new Promise((resolve, reject) => {
      const video = videoRef.current!;
      const canvas = canvasRef.current!;

      if (video.videoWidth === 0) {
        reject("Camera not ready");
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(video, 0, 0);

      canvas.toBlob(blob => {
        if (!blob) reject("Empty frame");
        else resolve(blob);
      }, "image/jpeg");
    });

  /* ================= START PROCTOR ================= */
  const startProctor = async () => {
    const frame = await captureFrame();

    const form = new FormData();
    form.append("exam_id", id);
    form.append("frame", frame, "frame.jpg");

    const res = await api.post("/proctor/start", form);
    setSessionId(res.data.session_id);
  };

  /* ================= LOAD EXAM META (TIMER) ================= */
  const loadExamMeta = async () => {
    const res = await api.get<ExamMeta>(`/exams/${id}`);
    const seconds = res.data.duration_minutes * 60;
    setTimeLeft(seconds);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null) return prev;
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          autoSubmit(); // ⬅️ AUTO SUBMIT
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  /* ================= LOAD QUESTIONS ================= */
  const loadQuestions = async () => {
    const res = await api.get(`/questions/${id}`);
    setQuestions(res.data);
  };

  /* ================= STREAM FRAMES ================= */
  useEffect(() => {
    if (!sessionId) return;
    const interval = setInterval(sendFrame, 2000);
    return () => clearInterval(interval);
  }, [sessionId]);

  const sendFrame = async () => {
    if (!sessionId) return;
    const frame = await captureFrame();

    const form = new FormData();
    form.append("session_id", String(sessionId));
    form.append("frame", frame, "frame.jpg");

    await api.post("/proctor/frame", form);
  };

  /* ================= SAVE ANSWER ================= */
  const saveAnswer = async (questionId: number, value: string) => {
  // Always update local state
  setAnswers(prev => ({ ...prev, [questionId]: value }));

  // 🚫 DO NOT send empty answers to backend
  if (!value || value.trim() === "") {
    return;
  }

  try {
    await api.post("/submissions/answer", {
      exam_id: Number(id),
      question_id: questionId,
      selected_option: value,
    });
  } catch (err) {
    console.error("Save answer failed:", err);
  }
};


  /* ================= AUTO SUBMIT ================= */
  const autoSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      await api.post("/submissions/submit", { exam_id: Number(id) });
      alert("Time is up. Exam auto-submitted.");
      router.replace("/dashboard");
    } catch (e) {
      console.error(e);
    }
  };

  /* ================= MANUAL SUBMIT ================= */
  const submitExam = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      await api.post("/submissions/submit", { exam_id: Number(id) });
      alert("Exam submitted successfully");
      router.replace("/dashboard");
    } catch (e) {
      console.error(e);
      alert("Failed to submit exam");
      setSubmitting(false);
    }
  };

  /* ================= UI ================= */
  if (error) {
    return <div className="p-10 text-red-600">{error}</div>;
  }

  return (
    <div className="grid grid-cols-[1fr_300px] gap-6 p-6">
      {/* QUESTIONS */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Exam</h1>
          {timeLeft !== null && (
            <span className="text-red-600 font-semibold">
              ⏱ {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
            </span>
          )}
        </div>

        {questions.map(q => (
          <div key={q.id} className="mb-4 border p-4 rounded">
            <p className="font-semibold">{q.text}</p>

            {q.question_type === "mcq" &&
              q.options?.map(opt => (
                <label key={opt} className="block mt-2">
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    checked={answers[q.id] === opt}
                    onChange={() => saveAnswer(q.id, opt)}
                  />{" "}
                  {opt}
                </label>
              ))}

            {q.question_type === "text" && (
              <textarea
                className="w-full border mt-2 p-2"
                value={answers[q.id] || ""}
                onChange={e => saveAnswer(q.id, e.target.value)}
              />
            )}
          </div>
        ))}

        <button
          onClick={submitExam}
          disabled={submitting}
          className="mt-6 bg-black text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Exam"}
        </button>
      </div>

      {/* PROCTOR PANEL */}
      <div className="bg-black p-4 rounded text-white">
        <p className="text-sm mb-2">Live Proctoring</p>
        <video ref={videoRef} autoPlay muted className="w-full rounded" />
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
