export default function ProdutosLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="skeleton h-3 w-20" />
          <div className="skeleton mt-2 h-7 w-40" />
        </div>
        <div className="skeleton h-10 w-36 rounded-lg" />
      </div>

      <div className="mt-8 surface overflow-hidden">
        <div className="border-b border-[var(--border)] bg-[var(--border-soft)]/60 px-5 py-3">
          <div className="grid grid-cols-12 gap-4">
            <div className="skeleton col-span-4 h-3" />
            <div className="skeleton col-span-2 h-3" />
            <div className="skeleton col-span-2 h-3" />
            <div className="skeleton col-span-3 h-3" />
            <div className="col-span-1" />
          </div>
        </div>
        <ul>
          {Array.from({ length: 6 }).map((_, i) => (
            <li
              key={i}
              className="border-b border-[var(--border-soft)] px-5 py-3 last:border-0"
            >
              <div className="grid grid-cols-12 items-center gap-4">
                <div className="col-span-4 flex items-center gap-3">
                  <div className="skeleton h-10 w-10 shrink-0 rounded-lg" />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="skeleton h-3.5 w-3/4" />
                    <div className="skeleton h-3 w-1/2" />
                  </div>
                </div>
                <div className="col-span-2"><div className="skeleton h-5 w-20 rounded-full" /></div>
                <div className="col-span-2"><div className="skeleton h-4 w-16" /></div>
                <div className="col-span-3"><div className="skeleton h-3 w-24" /></div>
                <div className="col-span-1 flex justify-end"><div className="skeleton h-7 w-16 rounded-md" /></div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
