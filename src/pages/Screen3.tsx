import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import useAudioEngine from '@/hooks/useAudioEngine';
import { fadeUp, inView, stagger } from '@/lib/motion';

const MAX_DPR = 1.5;
const MAX_PARTICLES = 220;
const HUE_MIN = 10;
const HUE_MAX = 80;
const HUE_STEP = 5;
const SPRITE_SIZE = 64;

/** Pre-render one soft glow per hue bucket, instead of building a gradient per particle per frame. */
const buildSprites = () => {
  const sprites = new Map<number, HTMLCanvasElement>();
  for (let hue = HUE_MIN; hue <= HUE_MAX; hue += HUE_STEP) {
    const c = document.createElement('canvas');
    c.width = c.height = SPRITE_SIZE;
    const g = c.getContext('2d');
    if (!g) continue;
    const r = SPRITE_SIZE / 2;
    const grad = g.createRadialGradient(r, r, 0, r, r, r);
    grad.addColorStop(0, `hsla(${hue},90%,60%,0.9)`);
    grad.addColorStop(0.2, `hsla(${hue},90%,50%,0.35)`);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);
    sprites.set(hue, c);
  }
  return sprites;
};

const controlButton =
  'inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md border border-red-800/80 bg-red-950/60 text-red-100 ' +
  'text-sm sm:text-base hover:bg-red-800/80 hover:border-red-500 active:scale-95 transition cursor-pointer ' +
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';

const Page3 = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
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
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!section || !canvas || !ctx) return;

    const sprites = buildSprites();
    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    type Particle = { x: number; y: number; vx: number; vy: number; size: number; hue: number };
    const count = Math.min(MAX_PARTICLES, Math.max(60, Math.floor((width * height) / 8000)));
    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      size: 1 + Math.random() * 3,
      hue: HUE_MIN + Math.random() * 40,
    }));

    // Pointer: mouse, touch and pen. Presses only count inside this section.
    const pointer = { x: width / 2, y: height / 2, active: false };
    const toLocal = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const onMove = (e: PointerEvent) => toLocal(e);
    const onDown = (e: PointerEvent) => {
      // Ignore presses on the controls
      if ((e.target as HTMLElement).closest('button, input, label, form')) return;
      toLocal(e);
      pointer.active = true;
    };
    const onUp = () => {
      pointer.active = false;
    };
    section.addEventListener('pointermove', onMove);
    section.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);

    let audioLevel = 0;
    let frame = 0;
    let running = false;
    let data: Uint8Array<ArrayBuffer> | null = null;

    const draw = () => {
      ctx.globalCompositeOperation = 'source-over';
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
        // Smooth the level so the field swells instead of twitching
        audioLevel += (sum / data.length / 255 - audioLevel) * 0.2;
      } else {
        audioLevel *= 0.95;
      }

      for (const p of particles) {
        p.x += p.vx * (1 + audioLevel * 2);
        p.y += p.vy * (1 + audioLevel * 2);

        if (p.x < 0) p.x = width;
        else if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        else if (p.y > height) p.y = 0;

        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = Math.min(80, 120 / dist);
          p.vx += (dx / dist) * force * 0.002;
          p.vy += (dy / dist) * force * 0.002;
        } else {
          p.vx += (Math.random() - 0.5) * 0.01;
          p.vy += (Math.random() - 0.5) * 0.01;
        }
        p.vx *= 0.995;
        p.vy *= 0.995;

        const radius = p.size * 3 * (1 + audioLevel * 3);
        const hue = Math.min(HUE_MAX, Math.round((p.hue + audioLevel * 30) / HUE_STEP) * HUE_STEP);
        const sprite = sprites.get(hue);
        if (sprite) ctx.drawImage(sprite, p.x - radius, p.y - radius, radius * 2, radius * 2);
      }

      frame = requestAnimationFrame(draw);
    };

    const start = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(draw);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    // Only animate while the section is on screen
    const visibility = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    visibility.observe(section);

    return () => {
      stop();
      visibility.disconnect();
      resizeObserver.disconnect();
      section.removeEventListener('pointermove', onMove);
      section.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [analyserRef]);

  const handleSpeak = (e: React.FormEvent) => {
    e.preventDefault();
    speakText(ttsText, scaryVoice);
  };

  return (
    <section
      ref={sectionRef}
      id="nightmares"
      className="relative min-h-dvh w-full overflow-hidden bg-linear-to-br from-black via-gray-950 to-red-950"
    >
      <div className="absolute inset-0 bg-radial from-red-900/10 via-transparent to-black pointer-events-none" />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />

      <div className="relative flex min-h-dvh items-start sm:items-center px-4 sm:px-10 py-20">
        <motion.div
          variants={stagger(0.08)}
          {...inView}
          className="w-full max-w-lg rounded-2xl border border-red-900/60 bg-black/65 p-5 sm:p-8 text-white shadow-2xl"
        >
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-6xl font-black text-red-400 tracking-wider text-glow">
            THE CHAMBER
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-2 sm:mt-3 text-sm sm:text-lg text-gray-300/90">
            An atmospheric room — audio-reactive particles and ambient sound.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-6 flex flex-wrap gap-2 sm:gap-3">
            <button type="button" onClick={toggleAmbient} className={controlButton} aria-pressed={ambientPlaying}>
              {ambientPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {ambientPlaying ? 'Pause' : 'Play'}
            </button>
            <button
              type="button"
              onClick={toggleAmbientMute}
              disabled={!ambientPlaying}
              className={controlButton}
              aria-pressed={ambientMuted}
            >
              {ambientMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              {ambientMuted ? 'Unmute' : 'Mute'}
            </button>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-4">
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-red-300/70">Effects</p>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button type="button" onClick={playScreech} className={controlButton}>Screech</button>
              <button type="button" onClick={playThump} className={controlButton}>Thump</button>
              <button type="button" onClick={playWhisper} className={controlButton}>Whisper</button>
            </div>
          </motion.div>

          <motion.form variants={fadeUp} onSubmit={handleSpeak} className="mt-5">
            <label htmlFor="tts" className="mb-2 block text-xs uppercase tracking-[0.2em] text-red-300/70">
              Speak
            </label>
            <div className="flex gap-2">
              <input
                id="tts"
                value={ttsText}
                onChange={(e) => setTtsText(e.target.value)}
                placeholder="Type something..."
                className="flex-1 min-w-0 px-3 py-2 rounded-md bg-black/60 border border-red-800 text-white text-sm sm:text-base
                placeholder:text-gray-500 focus:border-red-500 focus:outline-none transition-colors"
              />
              <button type="submit" disabled={!ttsText.trim()} className={`${controlButton} bg-red-700/80 shrink-0`}>
                Speak
              </button>
            </div>
            <label className="mt-3 inline-flex items-center gap-2 text-sm text-red-200 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={scaryVoice}
                onChange={(e) => setScaryVoice(e.target.checked)}
                className="accent-red-600 w-4 h-4"
              />
              Scary voice
            </label>
          </motion.form>

          <motion.div variants={fadeUp} className="mt-5 flex items-center gap-3">
            <label htmlFor="master-volume" className="text-xs uppercase tracking-[0.2em] text-red-300/70 shrink-0">
              Volume
            </label>
            <input
              id="master-volume"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={masterVolume}
              onChange={(e) => setMasterGain(Number(e.target.value))}
              className="w-full accent-red-600 cursor-pointer"
            />
          </motion.div>

          <motion.p variants={fadeUp} className="mt-5 text-xs sm:text-sm text-red-200/60 font-mono">
            Tip: press Play, then press and hold anywhere outside this panel to disturb the field.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default Page3;
