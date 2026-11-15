const FullScreenLoader = () => (
  <div
    role="status"
    aria-live="polite"
    className="flex h-dvh w-full items-center justify-center bg-black text-red-500 font-mono tracking-[0.3em] animate-breathe"
  >
    LOADING…
  </div>
);

export default FullScreenLoader;
