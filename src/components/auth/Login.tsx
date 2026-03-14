import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setError("");
    try {
      await signInWithEmailAndPassword(auth, data.email.trim(), data.password);
      navigate("/001"); // Redirect to main page
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
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4">
      <h1 className="text-4xl mb-6 font-bold">Login</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full max-w-xs gap-4"
      >
        <input
          type="email"
          placeholder="Email"
          {...register("email")}
          className="p-3 rounded bg-gray-800 text-white focus:outline-red-500"
        />
        {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}

        <input
          type="password"
          placeholder="Password"
          {...register("password")}
          className="p-3 rounded bg-gray-800 text-white focus:outline-red-500"
        />
        {errors.password && (
          <p className="text-red-400 text-sm">{errors.password.message}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-red-600 rounded hover:bg-red-500 text-white font-bold transition-all"
        >
          {isSubmitting ? "Logging in..." : "Login with Email"}
        </button>
      </form>

      <button
        onClick={handleGoogleLogin}
        className="mt-4 px-6 py-3 bg-blue-600 rounded hover:bg-blue-500 text-white font-bold w-full max-w-xs transition-all"
      >
        Login with Google
      </button>

      {error && <p className="text-red-400 mt-2 text-center">{error}</p>}
    </div>
  );
};

export default Login;