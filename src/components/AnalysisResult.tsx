import { motion } from "motion/react";
import { CareerSuggestion } from "../types";
import { CheckCircle2, ExternalLink, GraduationCap, Briefcase, ChevronRight } from "lucide-react";

interface AnalysisResultProps {
  suggestions: CareerSuggestion[];
  onSelect: (suggestion: CareerSuggestion) => void;
}

export function AnalysisResult({ suggestions, onSelect }: AnalysisResultProps) {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold font-display text-white mb-4">Your AI Career Matches</h2>
        <p className="text-dark-muted max-w-2xl mx-auto">Based on your skills and interests, we've identified these high-potential career paths for you.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-dark-surface rounded-[2rem] border border-dark-border shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col"
          >
            <div className="p-8 flex-1">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-brand-500/10 rounded-2xl">
                  <Briefcase className="w-6 h-6 text-brand-500" />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-2xl font-bold text-brand-500">{suggestion.matchScore}%</span>
                  <span className="text-xs font-semibold text-dark-muted uppercase tracking-wider">Match Score</span>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-3">{suggestion.title}</h3>
              <p className="text-dark-muted text-sm leading-relaxed mb-6 line-clamp-3">
                {suggestion.description}
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-dark-muted italic">"{suggestion.why}"</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-dark-muted uppercase tracking-widest mb-3">Top Job Roles</h4>
                  <div className="flex flex-wrap gap-2">
                    {suggestion.jobRoles.slice(0, 3).map((role, i) => (
                      <div key={i} className="px-3 py-1 bg-dark-bg text-dark-muted rounded-full text-[10px] font-bold border border-dark-border flex items-center gap-2">
                        {role.title}
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          role.difficulty === "Easy" ? "bg-green-500" : 
                          role.difficulty === "Medium" ? "bg-yellow-500" : "bg-red-500"
                        }`} />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-dark-muted uppercase tracking-widest mb-3 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Recommended Courses
                  </h4>
                  <div className="space-y-2">
                    {suggestion.courses.slice(0, 2).map((course, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-dark-bg rounded-xl border border-dark-border group hover:border-brand-500/50 transition-colors">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-white truncate">{course.title}</p>
                            <span className="text-[8px] font-bold px-1.5 py-0.5 bg-brand-500/10 text-brand-500 rounded uppercase">
                              {course.type}
                            </span>
                          </div>
                          <p className="text-[10px] text-dark-muted">{course.provider}</p>
                        </div>
                        <ExternalLink className="w-3 h-3 text-dark-muted group-hover:text-brand-500" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelect(suggestion)}
              className="w-full p-5 bg-brand-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-brand-700 transition-colors"
            >
              View Full Roadmap
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
