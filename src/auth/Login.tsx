import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { AnimatePresence, motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { auth, googleProvider } from "@/lib/firebase";
import { EASE_OUT } from "@/lib/motion";
import homepage from "@/assets/purple.jpg";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/wrong-password": "Incorrect email or password.",
  "auth/user-not-found": "No account found with that email.",
  "auth/invalid-email": "That email address isn't valid.",
  "auth/email-already-in-use": "An account with that email already exists. Try logging in.",
  "auth/weak-password": "Password is too weak. Use at least 6 characters.",
  "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  "auth/network-request-failed": "Network error. Check your connection and try again.",
  "auth/popup-blocked": "The sign-in popup was blocked. Allow popups for this site and try again.",
  "auth/user-disabled": "This account has been disabled.",
};

const getAuthErrorMessage = (err: unknown): string | null => {
  if (err instanceof FirebaseError) {
    // User closed the Google popup themselves: not an error worth showing
    if (err.code === "auth/popup-closed-by-user" || err.code === "auth/cancelled-popup-request") {
      return null;
    }
    return AUTH_ERROR_MESSAGES[err.code] ?? "Something went wrong. Please try again.";
  }
  return "Something went wrong. Please try again.";
};

const inputBase =
  "w-full pl-10 pr-3 py-3 rounded-lg bg-black/50 text-white placeholder:text-gray-500 border outline-none transition-colors " +
  "focus:border-red-500 focus:bg-black/70";

const FieldError = ({ message }: { message?: string }) => (
  <AnimatePresence initial={false}>
    {message && (
      <motion.p
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.2 }}
        className="text-red-400 text-xs mt-1.5 overflow-hidden"
      >
        {message}
      </motion.p>
    )}
  </AnimatePresence>
);

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Already signed in? Skip the login screen.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/001", { replace: true });
    });
    return unsubscribe;
  }, [navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({ resolver: zodResolver(loginSchema) });

  const busy = isSubmitting || googleLoading;

  const onSubmit = async (data: LoginFormInputs) => {
    setError("");
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, data.email.trim(), data.password);
      } else {
        await signInWithEmailAndPassword(auth, data.email.trim(), data.password);
      }
      navigate("/001", { replace: true });
    } catch (err) {
      setError(getAuthErrorMessage(err) ?? "");
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/001", { replace: true });
    } catch (err) {
      setError(getAuthErrorMessage(err) ?? "");
    } finally {
      setGoogleLoading(false);
    }
  };

  const switchMode = (signup: boolean) => {
    setIsSignup(signup);
    setError("");
  };

  return (
    <div className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-black px-4 py-16 text-white">
      {/* Static background layers: no full-screen flicker */}
      <img src={homepage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
      <div className="absolute inset-0 bg-linear-to-b from-black/85 via-black/40 to-black/90" />
      <div className="absolute top-1/4 left-[10%] h-64 w-64 rounded-full bg-red-800/25 blur-3xl animate-float will-change-transform pointer-events-none" />

      <Link
        to="/"
        className="absolute top-5 left-5 z-10 inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
        className="relative z-10 w-full max-w-md rounded-2xl border border-red-800/50 bg-black/70 p-6 sm:p-10 shadow-2xl backdrop-blur-md"
      >
        <h1 className="text-center text-3xl sm:text-4xl font-black tracking-[0.2em] text-red-500 text-glow">001</h1>
        <p className="mt-2 mb-8 text-center text-sm text-gray-400">
          {isSignup ? "Create an account to step inside." : "Welcome back. Step inside."}
        </p>

        {/* Login / Sign up switch */}
        <div role="tablist" className="relative mb-8 grid grid-cols-2 rounded-full bg-white/5 p-1 text-sm font-semibold">
          {[
            { label: "Login", value: false },
            { label: "Sign up", value: true },
          ].map((tab) => {
            const selected = isSignup === tab.value;
            return (
              <button
                key={tab.label}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => switchMode(tab.value)}
                className={`relative rounded-full py-2 cursor-pointer transition-colors ${selected ? "text-white" : "text-gray-400 hover:text-gray-200"}`}
              >
                {selected && (
                  <motion.span
                    layoutId="auth-tab"
                    className="absolute inset-0 rounded-full bg-red-700"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs uppercase tracking-widest text-gray-400">
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
                {...register("email")}
                className={`${inputBase} ${errors.email ? "border-red-500" : "border-white/10"}`}
              />
            </div>
            <FieldError message={errors.email?.message} />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs uppercase tracking-widest text-gray-400">
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete={isSignup ? "new-password" : "current-password"}
                aria-invalid={!!errors.password}
                {...register("password")}
                className={`${inputBase} pr-11 ${errors.password ? "border-red-500" : "border-white/10"}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-gray-400 hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <FieldError message={errors.password?.message} />
          </div>

          <AnimatePresence initial={false}>
            {error && (
              <motion.p
                role="alert"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-lg border border-red-800/60 bg-red-950/60 px-3 py-2 text-sm text-red-300"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={busy}
            whileTap={{ scale: 0.98 }}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-red-700 px-6 py-3 font-bold text-white
            shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:bg-red-600 hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]
            disabled:opacity-60 disabled:cursor-not-allowed transition cursor-pointer"
          >
            {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" />}
            {isSubmitting
              ? isSignup ? "Creating account..." : "Logging in..."
              : isSignup ? "Create account" : "Login"}
          </motion.button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-gray-500">
          <span className="h-px flex-1 bg-white/10" /> or <span className="h-px flex-1 bg-white/10" />
        </div>

        <motion.button
          type="button"
          onClick={handleGoogleLogin}
          disabled={busy}
          whileTap={{ scale: 0.98 }}
          className="flex w-full items-center justify-center gap-3 rounded-full bg-white px-6 py-3 font-semibold text-gray-900
          hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed transition cursor-pointer"
        >
          {googleLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <FcGoogle className="text-xl" />}
          Continue with Google
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Login;
