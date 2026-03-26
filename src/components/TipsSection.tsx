import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { CareerTip } from "../types";
import { getCareerTips } from "../services/gemini";
import { Lightbulb, User, FileText, Target, Loader2 } from "lucide-react";

export function TipsSection() {
  const [tips, setTips] = useState<CareerTip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const data = await getCareerTips();
        setTips(data);
      } catch (error) {
        console.error("Failed to fetch tips:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTips();
  }, []);

  const getIcon = (category: string) => {
    switch (category) {
      case "Interview": return User;
      case "Resume": return FileText;
      case "Skill": return Target;
      default: return Lightbulb;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold font-display text-white mb-4">Daily Career Guidance</h2>
        <p className="text-dark-muted max-w-2xl mx-auto">Expert tips to help you become job-ready and excel in your chosen career path.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {tips.map((tip, i) => {
          const Icon = getIcon(tip.category);
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-dark-surface rounded-3xl border border-dark-border shadow-sm hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 bg-brand-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-600 transition-colors">
                <Icon className="w-6 h-6 text-brand-500 group-hover:text-white transition-colors" />
              </div>
              <span className="text-[10px] font-bold text-brand-500 uppercase tracking-widest mb-2 block">
                {tip.category}
              </span>
              <h3 className="text-xl font-bold text-white mb-4">{tip.title}</h3>
              <p className="text-dark-muted text-sm leading-relaxed">{tip.content}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
