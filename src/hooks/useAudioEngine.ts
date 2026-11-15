import { useCallback, useEffect, useRef, useState } from 'react';

type AudioContextCtor = typeof AudioContext;

const getAudioContextCtor = (): AudioContextCtor | undefined =>
  window.AudioContext ??
  (window as Window & { webkitAudioContext?: AudioContextCtor }).webkitAudioContext;

type Ambient = {
  gain: GainNode;
  sources: AudioScheduledSourceNode[];
};

/**
 * Web Audio engine for "The Chamber".
 *
 * Graph: [sfx / ambient / drone] -> analyser -> master -> destination
 * Everything feeds the analyser so the particle field reacts to all sound.
 *
 * The AudioContext is created lazily from a user gesture (ensureAudioContext),
 * because browsers start contexts created without one in a suspended state.
 */
export default function useAudioEngine(initialMaster = 0.6) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const ambientRef = useRef<Ambient | null>(null);
  const masterVolumeRef = useRef(initialMaster);

  const [masterVolume, setMasterVolume] = useState(initialMaster);
  const [ambientPlaying, setAmbientPlaying] = useState(false);
  const [ambientMuted, setAmbientMuted] = useState(false);

  const ensureAudioContext = useCallback(async (): Promise<AudioContext | null> => {
    if (!audioCtxRef.current) {
      const Ctor = getAudioContextCtor();
      if (!Ctor) return null;
      try {
        const ctx = new Ctor();
        const master = ctx.createGain();
        master.gain.value = masterVolumeRef.current;
        master.connect(ctx.destination);

        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.connect(master);

        audioCtxRef.current = ctx;
        masterGainRef.current = master;
        analyserRef.current = analyser;
      } catch (err) {
        console.warn('Web Audio unavailable:', err);
        return null;
      }
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') await ctx.resume();
    return ctx;
  }, []);

  // Tear everything down on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      audioCtxRef.current?.close();
      audioCtxRef.current = null;
      masterGainRef.current = null;
      analyserRef.current = null;
      ambientRef.current = null;
    };
  }, []);

  const setMasterGain = (v: number) => {
    masterVolumeRef.current = v;
    setMasterVolume(v);
    if (masterGainRef.current) masterGainRef.current.gain.value = v;
  };

  const createNoiseBuffer = (ctx: AudioContext, seconds: number, amp = 1) => {
    const length = Math.floor(ctx.sampleRate * seconds);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * amp;
    return buffer;
  };

  // ---------- Ambient bed (procedural, no audio file needed) ----------

  const AMBIENT_LEVEL = 0.35;

  const startAmbient = async () => {
    const ctx = await ensureAudioContext();
    if (!ctx || !analyserRef.current || ambientRef.current) return;
    const now = ctx.currentTime;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(ambientMuted ? 0.0001 : AMBIENT_LEVEL, now + 2);
    gain.connect(analyserRef.current);

    // Low detuned drone through a slowly sweeping low-pass filter
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 280;
    lowpass.Q.value = 6;
    lowpass.connect(gain);

    const droneA = ctx.createOscillator();
    droneA.type = 'sawtooth';
    droneA.frequency.value = 55;
    const droneB = ctx.createOscillator();
    droneB.type = 'sawtooth';
    droneB.frequency.value = 55.7;
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.5;
    droneA.connect(droneGain);
    droneB.connect(droneGain);
    droneGain.connect(lowpass);

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoDepth = ctx.createGain();
    lfoDepth.gain.value = 180;
    lfo.connect(lfoDepth);
    lfoDepth.connect(lowpass.frequency);

    // Airy wind: looping band-passed noise with a wandering center frequency
    const wind = ctx.createBufferSource();
    wind.buffer = createNoiseBuffer(ctx, 4, 0.5);
    wind.loop = true;
    const band = ctx.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.value = 700;
    band.Q.value = 0.8;
    const windGain = ctx.createGain();
    windGain.gain.value = 0.25;
    wind.connect(band);
    band.connect(windGain);
    windGain.connect(gain);

    const windLfo = ctx.createOscillator();
    windLfo.frequency.value = 0.13;
    const windLfoDepth = ctx.createGain();
    windLfoDepth.gain.value = 400;
    windLfo.connect(windLfoDepth);
    windLfoDepth.connect(band.frequency);

    const sources = [droneA, droneB, lfo, wind, windLfo];
    sources.forEach((s) => s.start(now));

    ambientRef.current = { gain, sources };
    setAmbientPlaying(true);
  };

  const stopAmbient = () => {
    const ctx = audioCtxRef.current;
    const ambient = ambientRef.current;
    if (!ctx || !ambient) return;
    const now = ctx.currentTime;
    ambient.gain.gain.cancelScheduledValues(now);
    ambient.gain.gain.setValueAtTime(Math.max(ambient.gain.gain.value, 0.0001), now);
    ambient.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
    ambient.sources.forEach((s) => s.stop(now + 0.9));
    ambientRef.current = null;
    setAmbientPlaying(false);
  };

  const toggleAmbient = () => (ambientRef.current ? stopAmbient() : startAmbient());

  const toggleAmbientMute = () => {
    const next = !ambientMuted;
    setAmbientMuted(next);
    const ctx = audioCtxRef.current;
    const ambient = ambientRef.current;
    if (!ctx || !ambient) return;
    const now = ctx.currentTime;
    ambient.gain.gain.cancelScheduledValues(now);
    ambient.gain.gain.setTargetAtTime(next ? 0 : AMBIENT_LEVEL, now, 0.1);
  };

  // ---------- One-shot effects ----------

  const playScreech = async () => {
    const ctx = await ensureAudioContext();
    if (!ctx || !analyserRef.current) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 400;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(analyserRef.current);

    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(2000, now + 0.9);
    gain.gain.exponentialRampToValueAtTime(0.9, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    osc.start(now);
    osc.stop(now + 1.4);
  };

  const playThump = async () => {
    const ctx = await ensureAudioContext();
    if (!ctx || !analyserRef.current) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 200;
    const gain = ctx.createGain();

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(analyserRef.current);

    osc.frequency.setValueAtTime(90, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.5);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.9, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

    osc.start(now);
    osc.stop(now + 0.8);
  };

  const playWhisper = async () => {
    const ctx = await ensureAudioContext();
    if (!ctx || !analyserRef.current) return;
    const now = ctx.currentTime;

    const src = ctx.createBufferSource();
    src.buffer = createNoiseBuffer(ctx, 1.2, 0.4);
    const band = ctx.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.value = 1200;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);

    src.connect(band);
    band.connect(gain);
    gain.connect(analyserRef.current);

    gain.gain.exponentialRampToValueAtTime(0.6, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    src.start(now);
    src.stop(now + 1.4);
  };

  // ---------- Text to speech ----------

  const createReverb = (ctx: AudioContext, duration = 2.5, decay = 2.0) => {
    const length = Math.floor(ctx.sampleRate * duration);
    const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const channel = impulse.getChannelData(c);
      for (let i = 0; i < length; i++) {
        channel[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      }
    }
    const convolver = ctx.createConvolver();
    convolver.buffer = impulse;
    return convolver;
  };

  const speakText = async (text: string, scary = true) => {
    const trimmed = text.trim();
    if (!trimmed || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (!scary) {
      const utter = new SpeechSynthesisUtterance(trimmed);
      utter.rate = 0.95;
      utter.pitch = 0.95;
      window.speechSynthesis.speak(utter);
      return;
    }

    // Browsers queue utterances rather than mixing them, so the scary voice is a
    // single low, slow utterance layered over a Web Audio drone.
    const utter = new SpeechSynthesisUtterance(trimmed);
    utter.rate = 0.8;
    utter.pitch = 0.3;

    const ctx = await ensureAudioContext();
    if (ctx && analyserRef.current) {
      // Distorted drone with reverb + echo under the voice
      const drone = ctx.createOscillator();
      drone.type = 'sawtooth';
      drone.frequency.value = 55 + Math.random() * 18;
      const shaper = ctx.createWaveShaper();
      const curve = new Float32Array(4096);
      for (let i = 0; i < curve.length; i++) {
        const x = (i / (curve.length - 1)) * 2 - 1;
        curve[i] = Math.tanh(x * 3);
      }
      shaper.curve = curve;
      const droneGain = ctx.createGain();
      const now = ctx.currentTime;
      droneGain.gain.setValueAtTime(0.0001, now);
      droneGain.gain.exponentialRampToValueAtTime(0.35, now + 0.25);

      const reverb = createReverb(ctx, 3, 3);
      const delay = ctx.createDelay();
      delay.delayTime.value = 0.28;
      const feedback = ctx.createGain();
      feedback.gain.value = 0.45;
      delay.connect(feedback);
      feedback.connect(delay);

      drone.connect(shaper);
      shaper.connect(droneGain);
      droneGain.connect(reverb);
      droneGain.connect(delay);
      reverb.connect(analyserRef.current);
      delay.connect(analyserRef.current);
      drone.start(now);

      // Fade the drone when speech ends; the timeout is a fallback because
      // some browsers never fire onend/onerror.
      let stopped = false;
      const stopDrone = () => {
        if (stopped || ctx.state === 'closed') return;
        stopped = true;
        const t = ctx.currentTime;
        droneGain.gain.cancelScheduledValues(t);
        droneGain.gain.setValueAtTime(Math.max(droneGain.gain.value, 0.0001), t);
        droneGain.gain.exponentialRampToValueAtTime(0.0001, t + 1);
        drone.stop(t + 1.1);
      };
      utter.onend = stopDrone;
      utter.onerror = stopDrone;
      setTimeout(stopDrone, Math.min(30, 3 + trimmed.length * 0.12) * 1000);

      playWhisper();
      setTimeout(() => playThump(), 80);
    }

    window.speechSynthesis.speak(utter);
  };

  return {
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
  };
}
