export default function Riv3rLoader() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-canvas px-6" aria-busy="true" aria-label="Loading RIV3R">
      <div className="text-center"><p className="text-2xl font-bold tracking-[-.04em]">RIV3R</p><p className="mt-2 text-sm text-muted">Preparing your workspace</p></div>
      <div className="h-1 w-40 overflow-hidden rounded-full bg-primary-soft">
        <div className="h-full origin-left rounded-full bg-primary animate-[loading-bar-fill_1.2s_ease-out_forwards]" />
      </div>
    </main>
  );
}
