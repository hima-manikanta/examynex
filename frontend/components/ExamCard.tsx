type ExamCardProps = {
  title: string;
  description: string;
};

export default function ExamCard({ title, description }: ExamCardProps) {
  return (
    <article className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
      <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
      <p className="mt-2 text-sm text-neutral-500">{description}</p>
    </article>
  );
}
