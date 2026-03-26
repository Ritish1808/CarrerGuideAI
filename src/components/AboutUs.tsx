import { motion } from "motion/react";
import { Users, Target, Shield, Award } from "lucide-react";

export function AboutUs() {
  const stats = [
    { label: "Active Users", value: "50K+", icon: Users },
    { label: "Career Success", value: "92%", icon: Target },
    { label: "Expert Advisors", value: "100+", icon: Award },
    { label: "Data Security", value: "100%", icon: Shield },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-20"
      >
        <h1 className="text-5xl font-bold font-display text-white mb-6">Empowering Your Career Journey</h1>
        <p className="text-xl text-dark-muted max-w-3xl mx-auto leading-relaxed">
          CareerAI is more than just a tool; it's your personal career companion. We leverage cutting-edge AI to provide 
          personalized guidance, helping you navigate the complexities of the modern job market with confidence.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 bg-dark-surface rounded-3xl border border-dark-border shadow-sm text-center"
          >
            <div className="w-12 h-12 bg-brand-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <stat.icon className="w-6 h-6 text-brand-500" />
            </div>
            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-sm font-bold text-dark-muted uppercase tracking-widest">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
          <p className="text-dark-muted mb-6 leading-relaxed">
            Our mission is to democratize career guidance. We believe everyone deserves access to high-quality, 
            personalized career advice, regardless of their background or current situation.
          </p>
          <p className="text-dark-muted leading-relaxed">
            By combining AI technology with expert insights, we provide a roadmap for success that is both 
            ambitious and achievable.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative"
        >
          <div className="aspect-video bg-brand-600 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-brand-500/20">
            <img 
              src="https://images.unsplash.com/photo-1522071823991-b9671f9d7f1f?auto=format&fit=crop&q=80&w=800" 
              alt="Team working" 
              className="w-full h-full object-cover opacity-80"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
