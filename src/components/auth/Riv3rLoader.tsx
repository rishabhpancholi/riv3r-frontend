export default function Riv3rLoader() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-t from-blue-100 via-blue-50 to-zinc-50 px-6">
      <h1 className="bg-clip-text text-6xl font-extrabold tracking-tight text-transparent [background-image:linear-gradient(90deg,#38bdf8,#6366f1,#a855f7,#ec4899)] md:text-7xl">
        RIV3R
      </h1>
      <div className="h-1 w-48 overflow-hidden rounded-full bg-blue-100/80">
        <div className="h-full rounded-full [background-image:linear-gradient(90deg,#38bdf8,#6366f1,#a855f7,#ec4899)] animate-[loading-bar-fill_1.2s_ease-out_forwards]" />
      </div>
    </main>
  );
}
