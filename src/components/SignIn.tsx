import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, LogIn, Loader2, ArrowRight, Eye, EyeOff } from "lucide-react";
import { auth, signInWithEmailAndPassword, signInWithPopup, googleProvider } from "../firebase";

interface SignInProps {
  onSuccess: () => void;
  onSwitchToSignUp: () => void;
}

export function SignIn({ onSuccess, onSwitchToSignUp }: SignInProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      onSuccess();
    } catch (err: any) {
      console.error("Sign in error:", err);
      setError(err.message || "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      onSuccess();
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        return;
      }
      console.error("Google login failed:", err);
      setError("Google login failed. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-surface p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-dark-border"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-brand-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-brand-500/20">
            <LogIn className="w-8 h-8 text-brand-400" />
          </div>
          <h2 className="text-3xl font-bold font-display text-white mb-2">Welcome Back</h2>
          <p className="text-dark-muted">Sign in to continue your career journey</p>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-dark-muted uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-muted" />
              <input
                required
                type="email"
                placeholder="john@example.com"
                className="w-full pl-12 pr-4 py-4 bg-dark-bg border border-dark-border rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none transition-all text-white placeholder:text-dark-muted/50"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-dark-muted uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-muted" />
              <input
                required
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-4 bg-dark-bg border border-dark-border rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none transition-all text-white placeholder:text-dark-muted/50"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-muted hover:text-brand-400 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm font-bold text-red-400 bg-red-500/10 p-4 rounded-xl border border-red-500/20">{error}</p>
          )}

          <button
            disabled={isLoading}
            type="submit"
            className="w-full py-4 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dark-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-dark-surface px-4 text-dark-muted font-bold tracking-widest">Or continue with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full py-4 bg-dark-bg border border-dark-border text-white font-bold rounded-2xl hover:bg-dark-surface transition-all flex items-center justify-center gap-3"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          Google Account
        </button>

        <p className="text-center text-sm text-dark-muted mt-8">
          Don't have an account?{" "}
          <button onClick={onSwitchToSignUp} className="text-brand-400 font-bold hover:underline">Sign Up</button>
        </p>
      </motion.div>
    </div>
  );
}
