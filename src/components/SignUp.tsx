import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, Mail, Phone, Lock, ArrowRight, Loader2, CheckCircle2, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { auth, createUserWithEmailAndPassword, updateProfile, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "../firebase";

interface SignUpProps {
  onSuccess: () => void;
  onSwitchToSignIn: () => void;
}

export function SignUp({ onSuccess, onSwitchToSignIn }: SignUpProps) {
  const [step, setStep] = useState<"form" | "otp">("form");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const [isDemoMode, setIsDemoMode] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      if (isDemoMode) {
        // Simulate sending OTP
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStep("otp");
        return;
      }

      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'invisible',
          'callback': () => {
            // reCAPTCHA solved
          }
        });
      }
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, formData.phone, appVerifier);
      setConfirmationResult(confirmation);
      setStep("otp");
    } catch (err: any) {
      console.error("Phone auth error:", err);
      if (err.code === 'auth/operation-not-allowed') {
        setError("Phone authentication is not enabled in Firebase Console. You can use 'Demo Mode' below to test the flow.");
      } else {
        setError(err.message || "Failed to send OTP. Please check your phone number format (e.g., +1234567890).");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isDemoMode) {
        if (otp !== "123456") {
          throw new Error("Invalid Demo OTP. Use 123456");
        }
      } else {
        if (!confirmationResult) throw new Error("No confirmation result");
        // 1. Verify OTP
        await confirmationResult.confirm(otp);
      }
      
      // 2. Create Email/Password account
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      // 3. Update Profile
      await updateProfile(userCredential.user, {
        displayName: formData.fullName,
      });

      onSuccess();
    } catch (err: any) {
      console.error("Verification error:", err);
      setError(err.message || "Invalid OTP or account creation failed.");
    } finally {
      setIsLoading(false);
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
            <User className="w-8 h-8 text-brand-400" />
          </div>
          <h2 className="text-3xl font-bold font-display text-white mb-2">Create Account</h2>
          <p className="text-dark-muted">Join CareerAI to start your journey</p>
        </div>

        <AnimatePresence mode="wait">
          {step === "form" ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleFormSubmit}
              className="space-y-5"
            >
              <div className="space-y-1">
                <label className="text-xs font-bold text-dark-muted uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-muted" />
                  <input
                    required
                    type="text"
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-4 bg-dark-bg border border-dark-border rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none transition-all text-white placeholder:text-dark-muted/50"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
              </div>

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
                <label className="text-xs font-bold text-dark-muted uppercase tracking-widest ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-muted" />
                  <input
                    required
                    type="tel"
                    placeholder="+1234567890"
                    className="w-full pl-12 pr-4 py-4 bg-dark-bg border border-dark-border rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none transition-all text-white placeholder:text-dark-muted/50"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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

              <div className="space-y-1">
                <label className="text-xs font-bold text-dark-muted uppercase tracking-widest ml-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-muted" />
                  <input
                    required
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-4 bg-dark-bg border border-dark-border rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none transition-all text-white placeholder:text-dark-muted/50"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-muted hover:text-brand-400 transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send OTP"}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div id="recaptcha-container"></div>

              <div className="pt-4 border-t border-dark-border mt-6">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={isDemoMode}
                      onChange={(e) => setIsDemoMode(e.target.checked)}
                    />
                    <div className="w-10 h-5 bg-dark-bg rounded-full peer peer-checked:bg-brand-600 transition-all border border-dark-border"></div>
                    <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full peer-checked:translate-x-5 transition-all"></div>
                  </div>
                  <span className="text-sm font-bold text-dark-muted group-hover:text-brand-400 transition-colors">
                    Enable Demo Mode (Skip SMS)
                  </span>
                </label>
                {isDemoMode && (
                  <p className="text-[10px] text-brand-400 mt-1 font-bold uppercase tracking-wider">
                    * Use OTP: 123456 to verify
                  </p>
                )}
              </div>

              <p className="text-center text-sm text-dark-muted mt-6">
                Already have an account?{" "}
                <button onClick={onSwitchToSignIn} className="text-brand-400 font-bold hover:underline">Sign In</button>
              </p>
            </motion.form>
          ) : (
            <motion.form
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleOtpSubmit}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                  <ShieldCheck className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Verify OTP</h3>
                <p className="text-sm text-dark-muted mt-2">We've sent a code to {formData.phone}</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-dark-muted uppercase tracking-widest ml-1">Verification Code</label>
                <input
                  required
                  type="text"
                  placeholder="123456"
                  className="w-full p-4 bg-dark-bg border border-dark-border rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none transition-all text-center text-2xl font-bold tracking-[1em] text-white"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                />
              </div>

              {error && (
                <p className="text-sm font-bold text-red-400 bg-red-500/10 p-4 rounded-xl border border-red-500/20">{error}</p>
              )}

              <button
                disabled={isLoading}
                type="submit"
                className="w-full py-4 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Create Account"}
                <CheckCircle2 className="w-4 h-4" />
              </button>

              <button 
                type="button"
                onClick={() => setStep("form")}
                className="w-full text-sm font-bold text-dark-muted hover:text-white transition-colors"
              >
                Back to Edit Info
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}
