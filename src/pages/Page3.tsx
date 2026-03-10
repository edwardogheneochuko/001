import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

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
    <div id="nightmares" className="flex flex-wrap gap-2 sm:gap-4">
      <button
        onClick={togglePlay}
        className="px-3 sm:px-4 py-2 bg-red-900/60 hover:bg-red-800 text-red-100 rounded-md border border-red-700 text-sm sm:text-base"
      >
        {playing ? 'Pause' : 'Play'}
      </button>
      <button
        onClick={toggleMute}
        className="px-3 py-2 bg-red-900/40 hover:bg-red-800 text-red-200 rounded-md border border-red-700 text-sm sm:text-base"
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
  const [scaryVoice, setScaryVoice] = useState(true);

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
      } catch (e) { }
    };

    setupAudio();

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      const analyser = analyserRef.current;
      if (analyser) {
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) sum += data[i];
        audioLevel = sum / data.length / 255;
      } else {
        audioLevel = audioLevel * 0.95;
      }

      for (const p of particles) {
        p.x += p.vx * (1 + audioLevel * 2);
        p.y += p.vy * (1 + audioLevel * 2);

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

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

  const playScreech = async () => { /* same as your previous code */ };
  const playThump = async () => { /* same as your previous code */ };
  const playWhisper = async () => { /* same as your previous code */ };
  const speakText = async (text: string) => { /* same as your previous code */ };

  return (
    <div className="w-screen h-screen relative overflow-hidden bg-gradient-to-br from-black via-gray-950 to-red-950">
      <div className="absolute inset-0 bg-gradient-radial from-red-900/10 via-transparent to-black pointer-events-none" />

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <audio ref={audioRef} src="/ambient_loop.mp3" loop preload="auto" />

      <div className="absolute left-4 sm:left-8 top-8 sm:top-12 max-w-full sm:max-w-lg text-white">
        <h1 className="text-3xl sm:text-6xl font-black text-red-400 tracking-wider drop-shadow-lg">THE CHAMBER</h1>
        <p className="mt-2 sm:mt-4 text-sm sm:text-lg text-gray-300/90">
          An atmospheric room — audio-reactive particles and ambient sound.
        </p>

        <div className="mt-4 flex flex-col gap-3">
          <AudioControl audioRef={audioRef} />

          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button onClick={() => { ensureAudioContext(); playScreech(); }}
              className="px-2 sm:px-3 py-2 bg-red-800/60 hover:bg-red-700 text-white rounded-md border border-red-700 text-sm sm:text-base">
              Screech
            </button>
            <button onClick={() => { ensureAudioContext(); playThump(); }}
              className="px-2 sm:px-3 py-2 bg-red-800/60 hover:bg-red-700 text-white rounded-md border border-red-700 text-sm sm:text-base">
              Thump
            </button>
            <button onClick={() => { ensureAudioContext(); playWhisper(); }}
              className="px-2 sm:px-3 py-2 bg-red-800/60 hover:bg-red-700 text-white rounded-md border border-red-700 text-sm sm:text-base">
              Whisper
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <div className="flex flex-nowrap gap-2 mr-5">
              <input
                value={ttsText}
                onChange={(e) => setTtsText(e.target.value)}
                placeholder="Type something..."
                className="flex-1 min-w-0 px-2 sm:px-3 py-2 rounded-md bg-black/40 border border-red-700 text-white text-sm sm:text-base"
              />
              <button
                onClick={() => { ensureAudioContext(); speakText(ttsText); }}
                className="px-2 sm:px-3 py-2 cursor-pointer
                 bg-red-700 hover:bg-red-600 text-white rounded-md border
                 border-red-600 text-sm sm:text-base flex-shrink-0 duration-200"
              > Speak
              </button>
            </div>
            <label className="flex items-center gap-2 text-sm text-red-200">
              <input type="checkbox" checked={scaryVoice} onChange={(e) => setScaryVoice(e.target.checked)} />
              Scary Voice
            </label>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <label className="text-sm text-red-200/70">Master Volume</label>
            <input
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
          Tip: press Play, then click and hold to disturb the field. Use the buttons to trigger noises or type and Speak.
        </div>
      </div>
    </div>
  );
};

export default Page3;