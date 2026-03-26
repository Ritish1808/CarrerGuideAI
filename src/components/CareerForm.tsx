import { useState } from "react";
import { motion } from "motion/react";
import { UserProfile } from "../types";
import { ArrowRight, Loader2, BookOpen, Heart, Code, Briefcase, Target } from "lucide-react";

interface CareerFormProps {
  onSubmit: (profile: UserProfile) => void;
  isLoading: boolean;
  initialProfile?: UserProfile | null;
}

export function CareerForm({ onSubmit, isLoading, initialProfile }: CareerFormProps) {
  const [profile, setProfile] = useState<UserProfile>({
    name: initialProfile?.name || "",
    email: initialProfile?.email || "",
    skills: initialProfile?.skills || "",
    interests: initialProfile?.interests || "",
    education: initialProfile?.education || "",
    experience: initialProfile?.experience || "",
    goal: initialProfile?.goal || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(profile);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto bg-dark-surface p-8 md:p-12 rounded-[2rem] shadow-xl border border-dark-border"
    >
      <div className="mb-10">
        <h2 className="text-3xl font-bold font-display text-white mb-2">Build Your Career Profile</h2>
        <p className="text-dark-muted">This information helps us provide the most accurate career suggestions.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-dark-muted mb-1">
              Name
            </label>
            <input
              required
              type="text"
              placeholder="Your full name"
              className="w-full p-4 bg-dark-bg border border-dark-border rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-white placeholder:text-dark-muted/50"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-dark-muted mb-1">
              Education
            </label>
            <input
              required
              type="text"
              placeholder="e.g., B.Tech, MBA..."
              className="w-full p-4 bg-dark-bg border border-dark-border rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-white placeholder:text-dark-muted/50"
              value={profile.education}
              onChange={(e) => setProfile({ ...profile, education: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-dark-muted mb-1">
            <Target className="w-4 h-4 text-brand-500" />
            Career Goal
          </label>
          <input
            required
            type="text"
            placeholder="What do you want to achieve? (e.g., Become a Senior Dev in 2 years)"
            className="w-full p-4 bg-dark-bg border border-dark-border rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-white placeholder:text-dark-muted/50"
            value={profile.goal}
            onChange={(e) => setProfile({ ...profile, goal: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-dark-muted mb-1">
            <Code className="w-4 h-4 text-brand-500" />
            Skills & Expertise
          </label>
          <textarea
            required
            placeholder="e.g., Python, UI Design, Public Speaking..."
            className="w-full p-4 bg-dark-bg border border-dark-border rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-white placeholder:text-dark-muted/50 min-h-[80px] resize-none"
            value={profile.skills}
            onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-dark-muted mb-1">
            <Heart className="w-4 h-4 text-brand-500" />
            Interests & Passions
          </label>
          <textarea
            required
            placeholder="e.g., Solving problems, Creative writing, Technology..."
            className="w-full p-4 bg-dark-bg border border-dark-border rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-white placeholder:text-dark-muted/50 min-h-[80px] resize-none"
            value={profile.interests}
            onChange={(e) => setProfile({ ...profile, interests: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-dark-muted mb-1">
            <Briefcase className="w-4 h-4 text-brand-500" />
            Experience (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g., 2 years in Marketing, Fresher..."
            className="w-full p-4 bg-dark-bg border border-dark-border rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-white placeholder:text-dark-muted/50"
            value={profile.experience}
            onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
          />
        </div>

        <button
          disabled={isLoading}
          type="submit"
          className="w-full py-4 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing your profile...
            </>
          ) : (
            <>
              Generate My Career Path
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
