"use client";

export default function AdminPlaceholderPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold">{title}</h1>
        <p className="text-sm text-muted">{description}</p>
      </div>
      <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center shadow-sm">
        <p className="text-muted">
          Demo placeholder — full {title.toLowerCase()} module ships in production build.
        </p>
      </div>
    </div>
  );
}
