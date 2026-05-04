export default function EditCategoryLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:py-12">
      <div className="skeleton h-4 w-16" />
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="skeleton h-3 w-20" />
          <div className="skeleton h-7 w-56" />
          <div className="skeleton h-3 w-32" />
        </div>
        <div className="skeleton h-10 w-24 rounded-lg" />
      </div>
      <div className="mt-8 surface space-y-5 p-6 md:p-8">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i}>
            <div className="skeleton h-3 w-24" />
            <div className="skeleton mt-2 h-10 w-full rounded-lg" />
          </div>
        ))}
        <div>
          <div className="skeleton h-3 w-28" />
          <div className="skeleton mt-2 h-20 w-full rounded-lg" />
        </div>
        <div className="flex gap-3 border-t border-[var(--border)] pt-5">
          <div className="skeleton h-10 w-40 rounded-lg" />
          <div className="skeleton h-10 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
