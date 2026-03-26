import { motion } from "motion/react";
import { Sparkles, Target, Map } from "lucide-react";

interface HeroProps {
  onStart: () => void;
}

export function Hero({ onStart }: HeroProps) {
  return (
    <div className="relative pt-32 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-brand-500/10 text-brand-400 mb-6 border border-brand-500/20">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Career Guidance
            </span>
            <h1 className="text-5xl md:text-6xl font-bold font-display tracking-tight text-white mb-6 leading-tight">
              Design Your Future with <span className="text-brand-500">Precision</span>
            </h1>
            <p className="text-xl text-dark-muted mb-10 leading-relaxed">
              Stop guessing your career path. Our AI analyzes your unique skills, interests, and education to build a personalized roadmap to your dream job.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onStart}
                className="btn-primary w-full sm:w-auto"
              >
                Start Free Analysis
                <Target className="w-5 h-5" />
              </button>
              <button className="btn-secondary w-full sm:w-auto">
                View Sample Roadmap
                <Map className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            {
              title: "Skill Analysis",
              desc: "Deep dive into your technical and soft skills to find the perfect industry fit.",
              icon: Sparkles,
            },
            {
              title: "Course Guidance",
              desc: "Curated learning paths from top platforms to bridge your knowledge gaps.",
              icon: Target,
            },
            {
              title: "Step-by-Step Roadmap",
              desc: "Actionable milestones from your current state to your first day on the job.",
              icon: Map,
            },
          ].map((feature, i) => (
            <div key={i} className="p-8 bg-dark-surface rounded-3xl border border-dark-border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-brand-500/10 rounded-2xl flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-brand-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
              <p className="text-dark-muted leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-600/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
