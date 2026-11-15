const FullScreenLoader = () => (
  <div
    role="status"
    aria-live="polite"
    className="flex h-screen w-screen items-center justify-center bg-black text-red-500 font-mono tracking-[0.3em] animate-pulse"
  >
    LOADING…
  </div>
);

export default FullScreenLoader;
