import { useEffect, useRef, useState } from 'react';

export default function useAudioEngine(initialMaster = 0.6) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [masterVolume, setMasterVolume] = useState<number>(initialMaster);

  useEffect(() => {
    // If audio element is present, try to hook it up lazily on mount
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
      } catch (e) {
        // ignore
      }
    };

    setupAudio();
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

  // simple procedural sfx
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

  // TTS layering (keeps simple API)
  const createReverb = (ctx: AudioContext, duration = 2.5, decay = 2.0) => {
    const rate = ctx.sampleRate;
    const length = rate * duration;
    const impulse = ctx.createBuffer(2, length, rate);
    for (let i = 0; i < 2; i++) {
      const channel = impulse.getChannelData(i);
      for (let j = 0; j < length; j++) {
        channel[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / length, decay);
      }
    }
    const convolver = ctx.createConvolver();
    convolver.buffer = impulse;
    return convolver;
  };

  const createDelay = (ctx: AudioContext, time = 0.28, feedback = 0.45) => {
    const delay = ctx.createDelay();
    delay.delayTime.value = time;
    const fb = ctx.createGain();
    fb.gain.value = feedback;
    delay.connect(fb);
    fb.connect(delay);
    return { delay, fb };
  };

  const speakText = async (text: string, scary = true) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (!scary) {
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.95;
      utter.pitch = 0.95;
      utter.volume = 1.0;
      window.speechSynthesis.speak(utter);
      return;
    }

    await ensureAudioContext();
    const ctx = audioCtxRef.current!;

    // drone + mild distortion
    const drone = ctx.createOscillator();
    drone.type = 'sawtooth';
    drone.frequency.value = 55 + Math.random() * 18;
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.0001;
    const waveshaper = ctx.createWaveShaper();
    const curve = new Float32Array(32768);
    for (let i = 0; i < curve.length; i++) {
      const x = (i / (curve.length - 1)) * 2 - 1;
      curve[i] = Math.tanh(x * 3);
    }
    waveshaper.curve = curve;

    const convolver = createReverb(ctx, 3.0, 3.0);
    const { delay } = createDelay(ctx, 0.28, 0.5);

    drone.connect(waveshaper);
    waveshaper.connect(droneGain);
    droneGain.connect(convolver);
    convolver.connect(masterGainRef.current!);
    droneGain.connect(delay);
    delay.connect(masterGainRef.current!);

    const now = ctx.currentTime;
    drone.start(now);
    droneGain.gain.exponentialRampToValueAtTime(0.45, now + 0.25);

    // procedural bed
    playWhisper();
    setTimeout(() => playThump(), 80);

    // layered utterances
    const base = new SpeechSynthesisUtterance(text);
    base.rate = 0.86;
    base.pitch = 0.6;
    base.volume = 1.0;

    const low = new SpeechSynthesisUtterance(text);
    low.rate = 0.8;
    low.pitch = 0.45;
    low.volume = 0.75;

    const thin = new SpeechSynthesisUtterance(text);
    thin.rate = 1.18;
    thin.pitch = 1.4;
    thin.volume = 0.28;

    let remaining = 3;
    const stopDrone = () => {
      try {
        const t = ctx.currentTime;
        droneGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.0);
        drone.stop(t + 1.05);
      } catch (e) {}
    };

    base.onend = () => {
      remaining -= 1;
      if (remaining <= 0) stopDrone();
    };
    low.onend = () => {
      remaining -= 1;
      if (remaining <= 0) stopDrone();
    };
    thin.onend = () => {
      remaining -= 1;
      if (remaining <= 0) stopDrone();
    };

    window.speechSynthesis.speak(base);
    setTimeout(() => window.speechSynthesis.speak(low), 40 + Math.random() * 40);
    setTimeout(() => window.speechSynthesis.speak(thin), 120 + Math.random() * 80);
  };

  return {
    audioRef,
    analyserRef,
    ensureAudioContext,
    setMasterGain,
    masterVolume,
    playScreech,
    playThump,
    playWhisper,
    speakText,
  };
}
