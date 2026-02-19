import { useEffect, useRef, useState, RefObject } from 'react';

const AudioControl = ({ audioRef }: { audioRef: RefObject<HTMLAudioElement | null> }) => {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play();
      setPlaying(true);
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={togglePlay}
        className="px-4 py-2 bg-red-900/60 hover:bg-red-800 text-red-100 rounded-md border border-red-700"
      >
        {playing ? 'Pause' : 'Play'}
      </button>
      <button
        onClick={toggleMute}
        className="px-3 py-2 bg-red-900/40 hover:bg-red-800 text-red-200 rounded-md border border-red-700"
      >
        {muted ? 'Unmute' : 'Mute'}
      </button>
    </div>
  );
};

const Page3 = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const [ttsText, setTtsText] = useState('');
  const [masterVolume, setMasterVolume] = useState(0.6);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);

    type Particle = { x: number; y: number; vx: number; vy: number; size: number; hue: number };
    const particles: Particle[] = [];
    const COUNT = Math.max(60, Math.floor((width * height) / 8000));

    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        size: 1 + Math.random() * 3,
        hue: 10 + Math.random() * 40,
      });
    }

    const mouse = { x: width / 2, y: height / 2, active: false };
    const mousemoveHandler = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const mousedownHandler = () => (mouse.active = true);
    const mouseupHandler = () => (mouse.active = false);

    window.addEventListener('mousemove', mousemoveHandler);
    window.addEventListener('mousedown', mousedownHandler);
    window.addEventListener('mouseup', mouseupHandler);

    let audioLevel = 0;

    const setupAudio = async () => {
      try {
        const audio = audioRef.current;
        if (!audio) return;
        const AudioContext = (window.AudioContext || (window as any).webkitAudioContext);
        if (!AudioContext) return;
        const ctxAudio = new AudioContext();
        audioCtxRef.current = ctxAudio;

        // master gain to control all procedural + media audio
        const master = ctxAudio.createGain();
        master.gain.value = masterVolume;
        master.connect(ctxAudio.destination);
        masterGainRef.current = master;

        const src = ctxAudio.createMediaElementSource(audio);
        const analyser = ctxAudio.createAnalyser();
        analyser.fftSize = 256;
        src.connect(analyser);
        analyser.connect(master);
        analyserRef.current = analyser;
      } catch (e) {
        // ignore audio errors
      }
    };

    setupAudio();

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      // get audio level
      const analyser = analyserRef.current;
      if (analyser) {
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) sum += data[i];
        audioLevel = sum / data.length / 255; // 0..1
      } else {
        audioLevel = audioLevel * 0.95; // slowly decay if no audio
      }

      for (const p of particles) {
        // simple movement
        p.x += p.vx * (1 + audioLevel * 2);
        p.y += p.vy * (1 + audioLevel * 2);

        // wrap
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // mouse influence
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = Math.min(80, 120 / dist);
        if (mouse.active) {
          p.vx += (dx / dist) * force * 0.002;
          p.vy += (dy / dist) * force * 0.002;
        } else {
          p.vx += (Math.random() - 0.5) * 0.01;
          p.vy += (Math.random() - 0.5) * 0.01;
        }

        // draw
        const size = p.size * (1 + audioLevel * 3);
        const hue = p.hue + audioLevel * 30;
        ctx.beginPath();
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 4);
        grad.addColorStop(0, `hsla(${hue},90%,60%,0.9)`);
        grad.addColorStop(0.2, `hsla(${hue},90%,50%,0.35)`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.arc(p.x, p.y, size * 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', mousemoveHandler);
      window.removeEventListener('mousedown', mousedownHandler);
      window.removeEventListener('mouseup', mouseupHandler);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Ensure audio context exists and is resumed (must be user gesture)
  const ensureAudioContext = async () => {
    if (!audioCtxRef.current) {
      try {
        const AudioContext = (window.AudioContext || (window as any).webkitAudioContext);
        if (!AudioContext) return null;
        const ctx = new AudioContext();
        audioCtxRef.current = ctx;
        const master = ctx.createGain();
        master.gain.value = masterVolume;
        master.connect(ctx.destination);
        masterGainRef.current = master;
        return ctx;
      } catch (e) {
        return null;
      }
    }
    if (audioCtxRef.current.state === 'suspended') await audioCtxRef.current.resume();
    return audioCtxRef.current;
  };

  const setMasterGain = (v: number) => {
    setMasterVolume(v);
    if (masterGainRef.current) masterGainRef.current.gain.value = v;
  };

  // Procedural scary sounds
  const playScreech = async () => {
    const ctx = await ensureAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 400;
    const gain = ctx.createGain();
    gain.gain.value = 0.0001;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGainRef.current!);

    // sweep frequency
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(2000, now + 0.9);
    gain.gain.exponentialRampToValueAtTime(0.9, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    osc.start(now);
    osc.stop(now + 1.4);
  };

  const playThump = async () => {
    const ctx = await ensureAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    const gain = ctx.createGain();
    gain.gain.value = 0;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 200;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGainRef.current!);

    osc.frequency.setValueAtTime(90, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.9, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

    osc.start(now);
    osc.stop(now + 0.8);
  };

  const playWhisper = async () => {
    const ctx = await ensureAudioContext();
    if (!ctx) return;
    const bufferSize = ctx.sampleRate * 1.2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (Math.random() * 0.4);

    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const band = ctx.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.value = 1200;
    const gain = ctx.createGain();
    gain.gain.value = 0.0001;

    src.connect(band);
    band.connect(gain);
    gain.connect(masterGainRef.current!);

    const now = ctx.currentTime;
    gain.gain.exponentialRampToValueAtTime(0.6, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    src.start(now);
    src.stop(now + 1.4);
  };

  // Text-to-speech
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.95;
    utter.pitch = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  return (
    <div id="chamber" className="w-screen h-screen relative overflow-hidden bg-gradient-to-br from-black via-gray-950 to-red-950">
      <div className="absolute inset-0 bg-gradient-radial from-red-900/10 via-transparent to-black pointer-events-none" />

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <audio ref={audioRef} src="/ambient_loop.mp3" loop preload="auto" />

      <div className="absolute left-8 top-12 max-w-lg text-white">
        <h1 className="text-6xl font-black text-red-400 tracking-wider drop-shadow-lg">THE CHAMBER</h1>
        <p className="mt-4 text-lg text-gray-300/90">An atmospheric room — audio-reactive particles and ambient sound.</p>

        <div className="mt-6">
          <AudioControl audioRef={audioRef} />
        </div>

        <div className="mt-4 text-sm text-red-200/70 font-mono">
          Tip: press Play, then click and hold to disturb the field.
        </div>
      </div>
    </div>
  );
};

export default Page3;
