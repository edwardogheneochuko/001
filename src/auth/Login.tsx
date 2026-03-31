import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { MdEmail } from "react-icons/md";
import { auth, googleProvider } from "@/lib/firebase";
import homepage from '@/assets/purple.jpg';

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setError("");
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, data.email.trim(), data.password);
      } else {
        await signInWithEmailAndPassword(auth, data.email.trim(), data.password);
      }
      navigate("/001");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/001");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center h-screen w-screen text-white overflow-hidden"
      style={{ backgroundImage: `url(${homepage})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <motion.div
        className="absolute top-1/4 left-10 w-64 h-64 rounded-full bg-red-900/20 blur-3xl"
        animate={{ y: [0, 40, 0], x: [0, 20, -10, 0], scale: [1, 1.2, 1, 1.1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-10 w-56 h-56 rounded-full bg-purple-900/15 blur-3xl"
        animate={{ y: [0, -30, 0], x: [0, -15, 10, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute inset-0 bg-white/10 pointer-events-none"
        animate={{ opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-white/5 via-transparent to-white/5 pointer-events-none blur-3xl"
        animate={{ y: [0, 10, -10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="relative z-10 bg-black/70 backdrop-blur-sm rounded-xl p-10 flex flex-col items-center w-full max-w-md shadow-lg border border-red-700/50"
      >
        <h1 className="text-4xl font-black text-red-500 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]">
          {isSignup ? "SIGN UP" : "LOGIN"}
        </h1>

        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit(onSubmit)}>
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="p-3 rounded bg-gray-800 text-white focus:outline-red-500 border border-red-600/50 placeholder-red-400"
          />
          {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}

          <input
            type="password"
            placeholder="Password"
            {...register("password")}
            className="p-3 rounded bg-gray-800 text-white focus:outline-red-500 border border-red-600/50 placeholder-red-400"
          />
          {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}

          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(239,68,68,0.8)" }}
            whileTap={{ scale: 0.95 }}
            className="mt-2 px-6 py-3 bg-red-700 hover:bg-red-600 rounded-4xl cursor-pointer
             font-bold text-white w-full flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <MdEmail className="text-2xl" />
            {isSubmitting ? (isSignup ? "Signing up..." : "Logging in...") : (isSignup ? "Sign up with Email" : "Login with Email")}
          </motion.button>
        </form>

        <motion.button
          onClick={handleGoogleLogin}
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59,130,246,0.8)" }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 px-6 py-3 bg-blue-700 hover:bg-blue-600 cursor-pointer
          rounded-4xl font-bold text-white w-full flex items-center justify-center gap-2 shadow-md transition-all"
        >
          <FcGoogle className="text-2xl" />
          {isSignup ? "Sign up with Google" : "Login with Google"}
        </motion.button>

        {error && <p className="text-red-400 mt-3 text-center text-sm">{error}</p>}

        <p className="mt-4 text-sm text-gray-300">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            className="text-red-500 underline cursor-pointer hover:text-red-400 transition-colors"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Login" : "Sign up"}
          </button>
        </p>
      </motion.div>

      {/* Spooky overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent
       to-black/80 pointer-events-none" />
    </div>
  );
};

export default Login;