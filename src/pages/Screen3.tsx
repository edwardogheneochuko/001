import { useEffect, useRef, useState } from 'react';
import useAudioEngine from '@/hooks/useAudioEngine';

type AudioControlProps = {
  playing: boolean;
  muted: boolean;
  onTogglePlay: () => void;
  onToggleMute: () => void;
};

const AudioControl = ({ playing, muted, onTogglePlay, onToggleMute }: AudioControlProps) => (
  <div className="flex flex-wrap gap-2 sm:gap-4">
    <button
      type="button"
      onClick={onTogglePlay}
      className="px-3 sm:px-4 py-2 bg-red-900/60 hover:bg-red-800 text-red-100 rounded-md border border-red-700 text-sm sm:text-base cursor-pointer"
    >
      {playing ? 'Pause' : 'Play'}
    </button>
    <button
      type="button"
      onClick={onToggleMute}
      disabled={!playing}
      className="px-3 py-2 bg-red-900/40 hover:bg-red-800 text-red-200 rounded-md border border-red-700 text-sm sm:text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {muted ? 'Unmute' : 'Mute'}
    </button>
  </div>
);

const fxButton =
  'px-2 sm:px-3 py-2 bg-red-800/60 hover:bg-red-700 text-white rounded-md border border-red-700 text-sm sm:text-base cursor-pointer';

const Page3 = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const {
    analyserRef,
    masterVolume,
    setMasterGain,
    ambientPlaying,
    ambientMuted,
    toggleAmbient,
    toggleAmbientMute,
    playScreech,
    playThump,
    playWhisper,
    speakText,
  } = useAudioEngine(0.6);
  const [ttsText, setTtsText] = useState('');
  const [scaryVoice, setScaryVoice] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let width = (canvas.width = canvas.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.clientHeight || window.innerHeight);

    const resize = () => {
      width = canvas.width = canvas.clientWidth || window.innerWidth;
      height = canvas.height = canvas.clientHeight || window.innerHeight;
    };
    window.addEventListener('resize', resize);

    type Particle = { x: number; y: number; vx: number; vy: number; size: number; hue: number };
    const COUNT = Math.max(60, Math.floor((width * height) / 8000));
    const particles: Particle[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      size: 1 + Math.random() * 3,
      hue: 10 + Math.random() * 40,
    }));

    // Pointer events cover mouse, touch and pen
    const pointer = { x: width / 2, y: height / 2, active: false };
    const toLocal = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const onMove = (e: PointerEvent) => toLocal(e);
    const onDown = (e: PointerEvent) => {
      toLocal(e);
      pointer.active = true;
    };
    const onUp = () => {
      pointer.active = false;
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);

    let audioLevel = 0;
    let frame = 0;
    let data: Uint8Array<ArrayBuffer> | null = null;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      const analyser = analyserRef.current;
      if (analyser) {
        if (!data || data.length !== analyser.frequencyBinCount) {
          data = new Uint8Array(analyser.frequencyBinCount);
        }
        analyser.getByteFrequencyData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) sum += data[i];
        audioLevel = sum / data.length / 255;
      } else {
        audioLevel *= 0.95;
      }

      for (const p of particles) {
        p.x += p.vx * (1 + audioLevel * 2);
        p.y += p.vy * (1 + audioLevel * 2);

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        if (pointer.active) {
          const force = Math.min(80, 120 / dist);
          p.vx += (dx / dist) * force * 0.002;
          p.vy += (dy / dist) * force * 0.002;
        } else {
          p.vx += (Math.random() - 0.5) * 0.01;
          p.vy += (Math.random() - 0.5) * 0.01;
        }
        // light damping so particles don't accelerate forever
        p.vx *= 0.995;
        p.vy *= 0.995;

        const size = p.size * (1 + audioLevel * 3);
        const hue = p.hue + audioLevel * 30;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 4);
        grad.addColorStop(0, `hsla(${hue},90%,60%,0.9)`);
        grad.addColorStop(0.2, `hsla(${hue},90%,50%,0.35)`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [analyserRef]);

  const handleSpeak = (e: React.FormEvent) => {
    e.preventDefault();
    speakText(ttsText, scaryVoice);
  };

  return (
    <div
      id="nightmares"
      className="w-screen h-screen relative overflow-hidden bg-linear-to-br from-black via-gray-950 to-red-950"
    >
      <div className="absolute inset-0 bg-radial from-red-900/10 via-transparent to-black pointer-events-none" />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <div className="absolute left-4 sm:left-8 top-8 sm:top-12 max-w-full sm:max-w-lg text-white pr-4">
        <h1 className="text-3xl sm:text-6xl font-black text-red-400 tracking-wider drop-shadow-lg">THE CHAMBER</h1>
        <p className="mt-2 sm:mt-4 text-sm sm:text-lg text-gray-300/90">
          An atmospheric room — audio-reactive particles and ambient sound.
        </p>

        <div className="mt-4 flex flex-col gap-3">
          <AudioControl
            playing={ambientPlaying}
            muted={ambientMuted}
            onTogglePlay={toggleAmbient}
            onToggleMute={toggleAmbientMute}
          />

          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button type="button" onClick={playScreech} className={fxButton}>Screech</button>
            <button type="button" onClick={playThump} className={fxButton}>Thump</button>
            <button type="button" onClick={playWhisper} className={fxButton}>Whisper</button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <form onSubmit={handleSpeak} className="flex flex-nowrap gap-2 mr-5">
              <input
                value={ttsText}
                onChange={(e) => setTtsText(e.target.value)}
                placeholder="Type something..."
                aria-label="Text to speak"
                className="flex-1 min-w-0 px-2 sm:px-3 py-2 rounded-md bg-black/40 border border-red-700 text-white text-sm sm:text-base"
              />
              <button
                type="submit"
                disabled={!ttsText.trim()}
                className="px-2 sm:px-3 py-2 cursor-pointer bg-red-700 hover:bg-red-600 text-white rounded-md border
                 border-red-600 text-sm sm:text-base flex-shrink-0 duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Speak
              </button>
            </form>
            <label className="flex items-center gap-2 text-sm text-red-200">
              <input type="checkbox" checked={scaryVoice} onChange={(e) => setScaryVoice(e.target.checked)} />
              Scary Voice
            </label>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <label htmlFor="master-volume" className="text-sm text-red-200/70">Master Volume</label>
            <input
              id="master-volume"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={masterVolume}
              onChange={(e) => setMasterGain(Number(e.target.value))}
              className="w-2/4 sm:w-40"
            />
          </div>
        </div>

        <div className="mt-4 text-xs sm:text-sm text-red-200/70 font-mono">
          Tip: press Play, then click (or touch) and hold to disturb the field. Use the buttons to trigger noises or type and Speak.
        </div>
      </div>
    </div>
  );
};

export default Page3;
